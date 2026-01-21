function extractNumbers(text) {
  const matches = text.match(/\d+[.,]\d{2}/g) || [];
  return matches.map(m => parseFloat(m.replace(',', '.')));
}

function extractQRCodeFromText(text) {
  const qrPatterns = [
    /SPC\/[\dA-Za-z\s\/\.\-,\n]*/g,
    /CH\d{2}\s?[\dA-Z]{1,30}/g,
    /(?:https?:\/\/[^\s]+)/gi
  ];

  for (const pattern of qrPatterns) {
    const match = text.match(pattern);
    if (match && match[0]) {
      console.log('🔍 QR-Code Daten gefunden (Regex)');
      return match[0].trim();
    }
  }
  return null;
}

function parseInvoiceText(text) {
  const lines = text.split('\n');

  const invoice = {
    rechnungsnummer: null,
    datum: null,
    lieferant: null,
    empfaenger: null,
    positionen: [],
    summeNetto: null,
    summeMwSt: null,
    summeBrutto: null,
    mwstSatz: 19
  };

  const rnMatch = text.match(/(?:Rechnungs?nr\.?|Rechnungs?nummer|Invoice\s?No\.?|RN)[:\s]+([A-Z0-9-\/]+)/i);
  if (rnMatch) invoice.rechnungsnummer = rnMatch[1].trim();

  const dateMatch = text.match(/(?:Datum|Date|Rechnungs?datum)[:\s]+(\d{1,2}[./-]\d{1,2}[./-]\d{4})/i) ||
    text.match(/(\d{1,2}[./-]\d{1,2}[./-]\d{4})/);
  if (dateMatch) invoice.datum = dateMatch[1];

  const nettoMatch = text.match(/(?:Netto|Subtotal|Summe\s+Netto|Net)[:\s]+([0-9]+[.,][0-9]{2})/i);
  if (nettoMatch) invoice.summeNetto = parseFloat(nettoMatch[1].replace(',', '.'));

  const mwstMatch = text.match(/(?:MwSt|VAT|Mehrwertsteuer|Steuerbetrag|Tax)[:\s]+([0-9]+[.,][0-9]{2})/i);
  if (mwstMatch) invoice.summeMwSt = parseFloat(mwstMatch[1].replace(',', '.'));

  const bruttoMatch = text.match(/(?:Brutto|Total|Gesamtbetrag|Grand\s+Total|Amount\s+Due)[:\s]+([0-9]+[.,][0-9]{2})/i);
  if (bruttoMatch) invoice.summeBrutto = parseFloat(bruttoMatch[1].replace(',', '.'));

  if (!invoice.summeNetto || !invoice.summeMwSt || !invoice.summeBrutto) {
    const allNumbers = extractNumbers(text);
    if (allNumbers.length >= 3) {
      if (!invoice.summeNetto) invoice.summeNetto = allNumbers[allNumbers.length - 3];
      if (!invoice.summeMwSt) invoice.summeMwSt = allNumbers[allNumbers.length - 2];
      if (!invoice.summeBrutto) invoice.summeBrutto = allNumbers[allNumbers.length - 1];
    }
  }

  const mwstRateMatch = text.match(/(?:MwSt-?Satz|VAT\s+Rate|Steuersatz)[:\s]+(\d{1,2})\s*%/i);
  if (mwstRateMatch) invoice.mwstSatz = parseInt(mwstRateMatch[1]);

  return invoice;
}

function validateInvoice(invoice) {
  const errors = [];
  const warnings = [];
  const checks = [];

  if (!invoice.rechnungsnummer) {
    errors.push('Rechnungsnummer nicht gefunden');
  } else {
    checks.push({ check: 'Rechnungsnummer', status: 'OK', value: invoice.rechnungsnummer });
  }

  if (!invoice.datum) {
    errors.push('Rechnungsdatum nicht gefunden');
  } else {
    checks.push({ check: 'Rechnungsdatum', status: 'OK', value: invoice.datum });
  }

  if (invoice.summeNetto && invoice.summeMwSt && invoice.summeBrutto) {
    checks.push({ check: 'Summe Netto erkannt', status: 'OK', value: `CHF ${invoice.summeNetto.toFixed(2).replace('.', ',')}` });
    checks.push({ check: 'Summe MwSt erkannt', status: 'OK', value: `CHF ${invoice.summeMwSt.toFixed(2).replace('.', ',')}` });
    checks.push({ check: 'Summe Brutto erkannt', status: 'OK', value: `CHF ${invoice.summeBrutto.toFixed(2).replace('.', ',')}` });

    const calculatedMwStRate = (invoice.summeMwSt / invoice.summeNetto) * 100;
    checks.push({
      check: 'MwSt-Satz',
      status: 'OK',
      value: `${calculatedMwStRate.toFixed(2)}%`
    });

    const calculatedBrutto = invoice.summeNetto + invoice.summeMwSt;
    const difference = Math.abs(calculatedBrutto - invoice.summeBrutto);

    if (difference > 0.01) {
      errors.push(`Summenprüfung fehlgeschlagen: Netto (CHF ${invoice.summeNetto.toFixed(2).replace('.', ',')}) + MwSt (CHF ${invoice.summeMwSt.toFixed(2).replace('.', ',')}) = CHF ${calculatedBrutto.toFixed(2).replace('.', ',')}, aber Brutto = CHF ${invoice.summeBrutto.toFixed(2).replace('.', ',')} (Differenz: CHF ${difference.toFixed(2).replace('.', ',')})`);
    } else {
      checks.push({ check: 'Summenprüfung (Netto+MwSt=Brutto)', status: 'OK', value: '✓ Korrekt' });
    }
  } else {
    warnings.push('Nicht alle Summenfelder konnten erkannt werden');
  }

  if (!invoice.rechnungsnummer || invoice.rechnungsnummer.length < 2) {
    errors.push('Rechnungsnummer ungültig oder zu kurz');
  }

  if (invoice.summeNetto && invoice.summeBrutto && invoice.summeNetto > invoice.summeBrutto) {
    errors.push('Logik-Fehler: Nettosumme darf nicht größer als Bruttosumme sein');
  }

  return {
    errors,
    warnings,
    checks,
    isValid: errors.length === 0
  };
}

module.exports = {
  extractNumbers,
  extractQRCodeFromText,
  parseInvoiceText,
  validateInvoice
};
