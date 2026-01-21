const ai = require('../ai-module.js');

(async () => {
  const sample = `Rechnung Nr.: INV-2026/01
Datum: 15.01.2026
Lieferant: ACME GmbH
Empfänger: Beispiel AG
Netto: 1000.00
MwSt: 190.00
Brutto: 1190.00`;

  try {
    console.log('Running invoice parse test...');
    const res = await ai.parseInvoiceHybrid(sample);
    console.log('RESULT:');
    console.log(JSON.stringify(res, null, 2));
  } catch (e) {
    console.error('ERROR:', e);
    process.exit(1);
  }
})();
