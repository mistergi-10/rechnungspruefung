# Modul 1 – Testing & Qualitätssicherung
## Schulung am Praxisbeispiel „Rechnungsprüfer CHF“ (v1.4.0)

**Zielgruppe**: Erwachsenenbildung ICT  
**Dauer**: ca. 4 Lektionen à 45 Minuten  
**Voraussetzungen**: Basiswissen REST, JSON, Git, Node.js

---

## 1. Lernziele (Kompetenzen)

Teilnehmende…

- kennen funktionale und nicht‑funktionale Anforderungen und können sie am Projekt „Rechnungsprüfer CHF“ formulieren.
- können die Bedeutung relevanter Standards (insb. ISO/IEC 25010) erläutern und Qualitätskriterien ableiten.
- kennen Teststufen (Komponenten-/Modultest, Komponentenintegrationstest, Systemtest, Abnahme-/Akzeptanztest, Systemintegrationstest) und ordnen sie in klassische und agile Vorhaben ein.
- kennen Testmethoden/-verfahren (Funktions-/Release-/Regression-/Smoke-/Last-/Performance-/UAT-/Content-/PenTest/Sicherheitsaudit) und wählen sie situationsgerecht.
- kennen Möglichkeiten teil- und vollautomatisierter Tests und können diese dem Projektkontext zuordnen.
- kennen Inhalte eines Testkonzepts und können zentrale Testdokumente erstellen (Testgegenstand, Methodik, Testfälle, Testanweisungen, Protokollierung, Massnahmen, Verantwortlichkeiten).

---

## 2. Projektkontext (Testgegenstand)

### 2.1 Was ist der „Rechnungsprüfer CHF“?

Das Projekt ist eine **Node.js/Express** Anwendung mit Frontend (HTML/JS) und Backend-API:

- Frontend: Upload einer PDF-Rechnung, Darstellung Ergebnis (Invoice-Daten + Validierung + PDF Preview).
- Backend: Endpoint `/api/upload` (PDF → Text → KI/Regex Parsing → Validierung → JSON), `/api/status` und `/status` (Monitoring), `/api/health`.
- KI: Hybrid-Ansatz (OpenAI primär, lokal optionaler Fallback, Regex immer verfügbar).
- Deployment: GitHub → Render.com.

### 2.2 Systemgrenzen (Scope)

**Im Scope** (wird getestet):
- Upload-Verarbeitung (Multer), PDF-Text-Extraktion (pdf-parse)
- Parsing (KI/Regex), Validierungslogik, API Responses
- Status-/Health-Endpunkte

**Out of Scope** (oder nur begrenzt):
- OCR (gescannte PDFs) – aktuell nicht implementiert
- Vollwertige Persistenz (keine DB)
- Mandanten-/User-Management (keine Auth)

---

## 3. Anforderungen: funktional vs. nicht‑funktional

### 3.1 Funktionale Anforderungen (Beispiele)

Funktionale Anforderungen beschreiben **was** das System tut.

**Beispielhafte Anforderungen am Projekt:**

- **FR-01 PDF Upload**: Das System akzeptiert PDF-Dateien über das Frontend und verarbeitet sie via `POST /api/upload`.
- **FR-02 PDF Parsing**: Das System extrahiert Text aus der PDF und gibt einen Textauszug im Response zurück.
- **FR-03 Rechnungsdaten erkennen**: Das System erkennt Rechnungsnummer, Datum und Summen (Netto/MwSt/Brutto) – durch KI oder Regex.
- **FR-04 Validierung**: Das System prüft Summenkonsistenz (Netto + MwSt = Brutto) und liefert Fehler/Warnungen.
- **FR-05 Monitoring**: Das System stellt Gesundheits-/Statusinformationen bereit (`/api/health`, `/api/status`, `/status`).

**Hinweis für Testplanung:** Funktionale Anforderungen lassen sich häufig direkt in **Testfälle** übersetzen.

### 3.2 Nicht‑funktionale Anforderungen (Beispiele)

Nicht‑funktionale Anforderungen beschreiben **wie gut** das System Eigenschaften erfüllt.

**Beispiele am Projekt:**

- **NFR-01 Performance**: Ein Upload-Request soll unter normalen Bedingungen innerhalb von z.B. 15 Sekunden beantwortet werden (OpenAI kann variieren).
- **NFR-02 Zuverlässigkeit/Robustheit**: Bei Ausfall der KI soll der Service nicht „hart“ crashen, sondern auf Regex-Fallback wechseln.
- **NFR-03 Sicherheit**: API Keys dürfen nicht in GitHub landen (z.B. `.env` in `.gitignore`, Secrets als ENV in Render).
- **NFR-04 Nutzbarkeit**: Frontend zeigt verständliche Fehlermeldungen, Status, Fortschritt.
- **NFR-05 Wartbarkeit**: Strukturierter Code, klare Module (`server.js`, `ai-module.js`), nachvollziehbare Logs.

**Merksatz:** NFRs sind oft die Grundlage für Qualitätskriterien, SLAs und Messgrössen.

---

## 4. ISO/IEC 25010 – Qualitätsmodell anwenden

### 4.1 Warum ISO/IEC 25010?

ISO/IEC 25010 liefert ein **systematisches Qualitätsmodell**, um Anforderungen nicht „gefühlt“, sondern **standardisiert** zu formulieren und zu bewerten.

### 4.2 Relevante Qualitätsmerkmale am Projekt (Mapping)

| ISO/IEC 25010 Merkmal | Bedeutung | Projektbezug (Beispiele) | Mögliche Messung/Tests |
|---|---|---|---|
| Functional suitability | Funktionen passend und korrekt | Parsing + Validierung liefern korrekte Ergebnisse | Funktions-/Systemtests, Testdaten |
| Performance efficiency | Antwortzeit, Ressourcen | Upload-Response-Zeit, pdf-parse Laufzeit | Performance-/Lasttests |
| Compatibility | Koexistenz, Interoperabilität | Browser ↔ API, Render ↔ OpenAI | Integrations-/Systemintegrationstests |
| Usability | Verständlichkeit, Bedienbarkeit | Upload-UI, Fehlertexte, Statusseite | UAT, Content-Tests |
| Reliability | Stabilität, Recoverability | Fallback bei KI-Ausfall, saubere Fehlercodes | Chaos-/Fehlertests, Regression |
| Security | Vertraulichkeit, Integrität | `.env` nicht im Repo, keine Leaks, CORS bewusst | Security-Audit, Review |
| Maintainability | Änderbarkeit, Analysierbarkeit | Module getrennt, Logs, klare Endpoints | Code Review, Testabdeckung |
| Portability | Übertragbarkeit | Localhost ↔ Render | Deployment-Tests |

### 4.3 Ableitung von Qualitätskriterien

Aus dem Mapping entstehen konkrete Kriterien, z.B.:

- „API antwortet bei 95% der Uploads unter 15s“
- „Kein Secret in Git“
- „Bei KI-Timeout wird Regex-Fallback genutzt und System bleibt online“

---

## 5. Teststufen (Test Levels) – Einordnung und Praxis

### 5.1 Überblick der Teststufen

- **Komponenten-/Modultest**: Einzelne Funktionen/Module isoliert
- **Komponentenintegrationstest**: Mehrere Module zusammen (z.B. Server + ai-module)
- **Systemtest**: Gesamtsystem gegen Anforderungen (End-to-End)
- **Systemintegrationstest**: Integration mit externen Systemen (OpenAI, Render)
- **Abnahme-/Akzeptanztest (UAT)**: Fachliche Abnahme durch Auftraggeber/Nutzer

### 5.2 Einordnung in klassische vs. agile Vorhaben

**Klassisch (z.B. Wasserfall/V-Modell):**
- Teststufen oft sequenziell: Unit → Integration → System → Abnahme.
- Testdokumentation häufig stark formalisiert.

**Agil (Scrum/Kanban):**
- Teststufen wiederholen sich **pro Sprint/Inkrement**.
- Automatisierung, „Definition of Done“, CI/CD werden zentral.
- Abnahme kann sprintweise erfolgen (Sprint Review, UAT light).

### 5.3 Beispiele am Rechnungsprüfer (konkret)

**Komponententest:**
- `validateInvoice(invoice)` korrekt? (z.B. Summenprüfung)

**Komponentenintegrationstest:**
- `POST /api/upload` → `pdf-parse` → `parseInvoiceWithAI` → `validateInvoice` → Response

**Systemtest (E2E):**
- Browser lädt `/`, Upload PDF, Ergebnis wird angezeigt

**Systemintegrationstest:**
- Render Deployment + OpenAI ENV korrekt, `/api/status` zeigt Modus

**UAT:**
- Fachperson prüft: „Erkennt das System typische Rechnungsfelder ausreichend zuverlässig?“

---

## 6. Testmethoden und Testverfahren (situativ einsetzen)

### 6.1 Funktions- und Releasetest

- **Funktions-Test**: Prüft einzelne Features (Upload, Parsing, Status).
- **Release-Test**: Prüft, ob Release-Kandidat „bereit für Produktion“ ist.

**Praxis:** Vor Render-Deployment mindestens Smoke + Funktionsset.

### 6.2 Regressionstest

- Wiederholung kritischer Tests nach Änderungen.
- Wichtig nach Anpassungen an Parsing/Validation.

**Praxis:** Automatisierte Regression: `/api/status` + `/api/health` + `/api/upload` mit Sample.

### 6.3 Smoketest

- „Läuft das System grundsätzlich?“
- Schnell, klein, hochpriorisiert.

**Beispiele:**
- `GET /api/status` gibt JSON mit `status: online`
- `GET /api/health` gibt HTML

### 6.4 Last- und Performancetest

Ziele:
- Verhalten unter Last (mehrere Uploads)
- Antwortzeiten, Timeouts, Ressourcenverbrauch

**Praxis-Besonderheit:** OpenAI-Zeiten variieren. Sinnvoll: getrennte Messung
- PDF-Parse Zeit
- Validierung Zeit
- KI Zeit

### 6.5 User Acceptance Test (UAT)

- Fokus: „Erfüllt es den Geschäftszweck?“
- Kriterien: Verständliche Ergebnisse, sinnvolle Fehlermeldungen, Bedienbarkeit.

### 6.6 Content-Test

- Fokus: Inhalte/UI-Texte, Verständlichkeit (besonders in Erwachsenenbildung relevant).

### 6.7 Penetrationstest / Sicherheitsaudit

- Für dieses Projekt: eher als **Audit/Review** realistisch (kein komplexes Auth-System).

Checkpunkte:
- Secrets nicht im Repo
- Upload nur PDF, Limits gesetzt
- Keine unnötigen Informationen in Fehlermeldungen
- CORS bewusst konfiguriert

---

## 7. Teil- und vollautomatisierte Tests

### 7.1 Automatisierungsgrade

- **Teilautomatisiert**: Manuelle Tests mit unterstützenden Tools (curl, Postman, Checklisten).
- **Vollautomatisiert**: Unit/Integration in CI (z.B. Jest + Supertest), automatische Reports.

### 7.2 Was ist im Projekt sinnvoll zu automatisieren?

**Sehr gut automatisierbar:**
- Validierungsregeln (reine Logik)
- Status-Endpunkte
- Upload-Endpoint mit „Test-PDF“ (ohne echten OpenAI Call; Mocking)

**Schwer vollautomatisch:**
- „KI versteht echte Rechnungen“ (stochastisch, API abhängig) → eher mit Testdaten + Toleranzen + Monitoring.

### 7.3 Tooling (Vorschlag)

- **Jest**: Test Runner
- **Supertest**: HTTP Tests gegen Express-App
- **nock** (oder eigene Mock-Schicht): OpenAI API mocken

> Ziel in CI: deterministische Tests ohne externe Abhängigkeiten.

---

## 8. Testkonzept & Testdokumentation (Inhalte)

### 8.1 Mindestinhalt eines Testkonzepts

Ein schlankes Testkonzept (für kleine Projekte) enthält:

1. **Testgegenstand**: Was wird getestet (Scope) und was nicht.
2. **Qualitätsziele**: ISO/IEC 25010 abgeleitete Kriterien.
3. **Teststrategie**: Teststufen, Testarten, Priorisierung.
4. **Testumgebungen**: Lokal vs. Render (inkl. Variablen/Secrets).
5. **Testdaten**: Beispiel-PDFs, Edge Cases.
6. **Ein-/Austrittskriterien**: Wann ist Testphase/Releasetest bestanden?
7. **Rollen & Verantwortlichkeiten**: Wer testet, wer entscheidet, wer behebt.
8. **Risiken**: KI-Abhängigkeit, PDF-Variabilität, Security.

### 8.2 Testfälle und Testanweisungen

Ein **Testfall** beschreibt Ziel + Eingaben + erwartetes Ergebnis.
Eine **Testanweisung** beschreibt konkrete Schritte (für manuelle Durchführung).

**Beispiel Testfall (API):**

- ID: TC-UPLOAD-01
- Ziel: PDF Upload liefert success + invoice + validation
- Vorbedingung: Server läuft, Test-PDF vorhanden
- Schritte: `POST /api/upload` mit `multipart/form-data` Feld `pdf`
- Erwartung:
  - HTTP 200
  - JSON `success: true`
  - `invoice` Objekt vorhanden
  - `validation` enthält `isValid` boolean

### 8.3 Testprotokollierung

Protokoll sollte erfassen:
- Testfall-ID
- Datum/Tester
- Ergebnis (Pass/Fail)
- Evidenz (Response, Screenshot, Log-Auszug)
- Ticket/Issue-Link

### 8.4 Massnahmen & Verantwortlichkeiten

- „Fail“ → Issue erstellen, Priorität setzen, Zuweisung
- Regression nach Fix
- Freigabe/Abnahme durch definierte Rolle

---

## 9. Praktische Übungen (Hands-on)

### Übung 1: Anforderungen aus Code ableiten

Aufgabe:
1. Identifiziere 5 funktionale Anforderungen aus den API Endpoints.
2. Identifiziere 5 nicht-funktionale Anforderungen (Performance, Reliability, Security …).
3. Ordne jede NFR einem ISO/IEC 25010 Merkmal zu.

Ergebnis: Kurze Liste (1 Seite).

### Übung 2: Smoke-Test mit curl

Ziel: Minimales „läuft“-Set.

Beispiele:

```bash
curl -i http://localhost:3000/api/status
curl -i http://localhost:3000/api/health
curl -i http://localhost:3000/status
```

Erwartung:
- `/api/status` liefert JSON
- `/api/health` liefert HTML
- `/status` liefert HTML Dashboard

### Übung 3: Testfall-Design für Upload

Erstelle 6 Testfälle:
- 2 „Happy Path“ (verschiedene PDFs)
- 2 „Negative“ (keine Datei, falsches MIME)
- 2 „Edge“ (sehr grosse PDF, leere/kurze PDF)

Form: Tabelle mit ID, Input, Erwartung.

---

## 10. Checklisten

### 10.1 Checkliste: Release-Ready (Testing)

- [ ] Smoke-Test bestanden
- [ ] Kernfunktionen getestet: Upload + Validierung
- [ ] Status/Health-Endpunkte ok
- [ ] Secrets nicht im Repo (`.env` ignoriert)
- [ ] Fehlerfälle liefern sinnvolle Codes/Fehlermeldungen
- [ ] Regression auf kritische Bugs durchgeführt

### 10.2 Checkliste: Testdaten

- [ ] Mindestens 3 PDFs unterschiedlicher Lieferanten
- [ ] Mindestens 1 PDF ohne klare Summen (Fallback prüfen)
- [ ] Mindestens 1 PDF mit ungewöhnlichem Datumsformat
- [ ] Mindestens 1 PDF mit „falschem“ MwSt-Satz

---

## 11. Transferfragen (Reflexion)

- Welche Anforderungen sind in deinem Arbeitskontext eher NFR als FR?
- Wo ist Automatisierung sinnvoll – und wo bringt sie wenig Nutzen?
- Welche ISO/IEC 25010 Merkmale sind für euer Produkt „Top 3“?
- Wie würdest du UAT-Kriterien formulieren, wenn KI beteiligt ist?

---

## 12. Kurz-Zusammenfassung

- FRs beschreiben **Funktionen**, NFRs beschreiben **Qualität**.
- ISO/IEC 25010 hilft, Qualität **systematisch** zu definieren.
- Teststufen strukturieren die Prüfung von „klein“ (Unit) bis „gesamt“ (UAT/Systemintegration).
- Testverfahren sind Werkzeuge – sie werden **situativ** ausgewählt.
- Automatisierung ist zentral für Regression/CI, aber KI-Qualität braucht zusätzlich Monitoring und Praxisdaten.

---

## ▶️ Nächstes Modul

Weiter mit: `SCHULUNG_2_Releasemanagement.md`
