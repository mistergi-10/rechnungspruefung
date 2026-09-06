# rechnungspruefung
Rechnungspruefung - Beispieltool

## Version 3.0.0
Die Batch-Prüfung (`POST /api/batch-validate`) verarbeitet mehrere bereits extrahierte Rechnungen in einem Durchlauf. Sie liefert Einzelprüfungen, erkennt doppelte Rechnungsnummern und berechnet Netto-, MwSt- und Bruttosummen für den gesamten Stapel.

Beispiel:

```json
{
	"invoices": [
		{
			"rechnungsnummer": "INV-2026-001",
			"datum": "21.01.2026",
			"summeNetto": 100,
			"summeMwSt": 7.7,
			"summeBrutto": 107.7
		}
	]
}
```

## Dokumentation
- Schulungsindex: [docs/SCHULUNG_INDEX.md](docs/SCHULUNG_INDEX.md)
- Systemarchitektur: [docs/SYSTEMARCHITEKTUR.md](docs/SYSTEMARCHITEKTUR.md)
- Zugriffspunkte: [docs/ZUGRIFFSPUNKTE.md](docs/ZUGRIFFSPUNKTE.md)
