const test = require('node:test');
const assert = require('node:assert/strict');

const {
  extractNumbers,
  extractQRCodeFromText,
  parseInvoiceText,
  validateInvoice
} = require('../invoice-utils');

test('extractNumbers parses CHF values with comma', () => {
  const text = 'Netto 100,00 MwSt 7,70 Brutto 107,70';
  const numbers = extractNumbers(text);
  assert.deepEqual(numbers, [100.00, 7.70, 107.70]);
});

test('parseInvoiceText extracts key fields', () => {
  const text = [
    'Rechnungsnummer: INV-2024-01',
    'Datum: 21.01.2026',
    'Summe Netto: 100,00',
    'MwSt: 7,70',
    'Brutto: 107,70'
  ].join('\n');

  const invoice = parseInvoiceText(text);

  assert.equal(invoice.rechnungsnummer, 'INV-2024-01');
  assert.equal(invoice.datum, '21.01.2026');
  assert.equal(invoice.summeNetto, 100.00);
  assert.equal(invoice.summeMwSt, 7.70);
  assert.equal(invoice.summeBrutto, 107.70);
});

test('validateInvoice succeeds for consistent totals', () => {
  const invoice = {
    rechnungsnummer: 'INV-123',
    datum: '21.01.2026',
    summeNetto: 100.00,
    summeMwSt: 7.70,
    summeBrutto: 107.70
  };

  const result = validateInvoice(invoice);

  assert.equal(result.isValid, true);
  assert.equal(result.errors.length, 0);
});

test('validateInvoice reports sum mismatch', () => {
  const invoice = {
    rechnungsnummer: 'INV-123',
    datum: '21.01.2026',
    summeNetto: 100.00,
    summeMwSt: 7.70,
    summeBrutto: 110.00
  };

  const result = validateInvoice(invoice);

  assert.equal(result.isValid, false);
  assert.ok(result.errors.some(err => err.includes('Summenprüfung fehlgeschlagen')));
});

test('extractQRCodeFromText finds QR code payload', () => {
  const text = `SPC/0200/1
CH9300762011623852957
S
Max Mustermann
Musterstrasse 1
8000 Zurich
CHF
107.70`;

  const qr = extractQRCodeFromText(text);

  assert.ok(qr.startsWith('SPC/'));
});
