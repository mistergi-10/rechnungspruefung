# Abschluss – Transferaufgabe (30–45 Minuten)
## Schulung „IT‑Servicebetrieb überwachen und verbessern“ am Projekt „Rechnungsprüfer CHF“

**Ziel**: Du wendest die Inhalte aus allen 5 Modulen an (Testing/Qualität, Release/CI/CD, ITIL Support, Continual Improvement, Monitoring/Reporting).

**Abgabeformat**: 1–3 Seiten Markdown (oder PDF)  
**Arbeitsform**: Einzelarbeit oder 2er‑Team (dann Rollen benennen)  
**Hilfsmittel**: Projektquellcode, Render/GitHub (falls verfügbar), eigene Notizen

---

## Teil A – Qualitätskriterien (ISO/IEC 25010) (10 Min)

1. Formuliere **3 funktionale Anforderungen (FR)** für den Rechnungsprüfer.
2. Formuliere **4 nicht‑funktionale Anforderungen (NFR)**.
3. Ordne jede NFR einem passenden **ISO/IEC 25010 Merkmal** zu.

**Ergebnis**: Tabelle (FR/NFR + ISO‑Merkmal + kurzer Mess-/Prüfhinweis).

---

## Teil B – Teststufen & Testverfahren (10–12 Min)

Erstelle einen **Mini‑Testplan** für ein Release (z.B. „Verbesserung Upload/Status“):

1. Wähle **mindestens 4 Teststufen** (z.B. Komponententest, Komponentenintegrationstest, Systemtest, UAT/Systemintegrationstest).
2. Wähle **mindestens 5 Testverfahren** (z.B. Smoke, Regression, Funktions-/Releasetest, Performance, Security Audit).
3. Begründe kurz (1 Satz pro Punkt), **warum** du diese Tests wählst.

**Ergebnis**: Liste oder Tabelle mit „Teststufe → Testverfahren → Ziel → Evidenz“.

---

## Teil C – Release-Plan inkl. Rollback (8–10 Min)

Erstelle einen **Release‑Plan (One‑Pager)** mit:

- Scope / Out of Scope
- Risiko (mind. 3 Risiken) + Risikominderung
- Testumfang (Verweis auf Teil B)
- Rollout‑Schritte
- Rollback‑Plan (konkret: Git revert / Render redeploy)
- Post‑Deploy Checks (z.B. `/api/status`, `/api/health`, `/status`, optional Upload)

**Ergebnis**: 1 Seite.

---

## Teil D – ITIL Support: Incident & Problem (8–10 Min)

### Szenario
„Nach einem Deploy melden mehrere Nutzer: **Upload funktioniert nicht**. Im Browser erscheint eine Fehlermeldung, teilweise HTTP 400/500.“

1. Erstelle ein **Incident Ticket** (Kurzform) mit:
   - Impact, Urgency, Priorität (P1–P4)
   - Triage‑Fragen
   - Sofortmassnahme (Restore)
   - Kommunikations-Update (1–2 Sätze)

2. Erstelle einen **Problem Record** (Kurzform):
   - Hypothese(n)
   - RCA‑Methode (z.B. 5‑Why)
   - dauerhafte Massnahme
   - Verifizierung (Test/Monitoring)

---

## Teil E – Monitoring & Reporting (8–10 Min)

1. Definiere **5 KPIs** für den Betrieb (z.B. Uptime, p95 Upload‑Zeit, 5xx‑Rate, AI‑Fallback‑Anteil, Deploy‑Failure‑Rate).
2. Wähle für **3 KPIs** je einen passenden **Diagrammtyp** und begründe anhand des Skalentypen (nominal/ordinal/ratio).
3. Erstelle einen **Wochen‑Statusbericht** (Kurzform) mit:
   - Ampel (mind. 4 Kriterien)
   - Soll/Ist‑Tabelle (mind. 3 KPIs)
   - 2 Massnahmen (Owner + Termin)

---

## Bewertung (Rubrik, 0–2 Punkte je Kriterium, max. 20)

| Kriterium | 0 | 1 | 2 |
|---|---|---|---|
| Anforderungen & ISO/IEC 25010 | unklar | teils korrekt | klar + messbar |
| Teststufen/Testverfahren | zufällig | teilweise passend | passend + begründet |
| Releaseplan/Rollback | lückenhaft | brauchbar | konkret + überprüfbar |
| Incident/Problem (ITIL) | unstrukturiert | teilstrukturiert | sauber triagiert + RCA |
| KPIs/Reporting/Charts | keine Logik | teils passend | passend + verständlich |
| Praxisbezug zum Projekt | gering | mittel | hoch (Endpoints, Rollen, Risiken) |
| Klarheit/Struktur | unleserlich | ok | sehr gut |
| Sicherheit/Secrets | riskant | ok | sicherheitsbewusst |
| Realistische Annahmen | nein | teils | ja |
| Handlungsorientierung | fehlt | teils | klare Massnahmen |

---

## Musterlösung (Kurz-Hinweise)

- Gute NFRs haben **Messpunkte** (z.B. p95 Upload ≤ X Sekunden).
- Smoke‑Tests prüfen zuerst **Erreichbarkeit + Basisfunktionen**.
- Rollback sollte **vor Deploy** feststehen.
- Incident = Restore; Problem = Root Cause dauerhaft beheben.
- Diagrammwahl: Ratio → Linie/Histogramm/Boxplot; Nominal → Balken.

---

## Nächster optionaler Schritt

Wenn du willst, kann ich zusätzlich ein **1‑seitiges Cheat Sheet** erstellen (Templates: Testfall, Releaseplan, Incident Ticket, KPI‑Definition, Ampel/Soll‑Ist).