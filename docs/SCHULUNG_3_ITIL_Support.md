# Modul 3 – ITIL Support: Service Desk, Incident & Problem Management
## Schulung am Praxisbeispiel „Rechnungsprüfer CHF“ (v1.4.0)

**Zielgruppe**: Erwachsenenbildung ICT  
**Dauer**: ca. 3 Lektionen à 45 Minuten  
**Voraussetzungen**: Grundverständnis Betrieb/Support, REST/HTTP-Basics

---

## 1. Lernziele (Kompetenzen)

Teilnehmende…

- kennen relevante ITIL-Praktiken (Service Desk, Incident Management, Problem Management, Service Request Management) und können deren Beitrag im IT-Service-Management erläutern.
- kennen den typischen Aufbau von Supportorganisationen (1st/2nd/3rd Level) und die Grundkonzepte von Triage, Priorisierung und Eskalation.
- kennen typische Kennzahlen zur Messung von Leistung und Qualität im Incident- und Problem-Management und können diese am Projektkontext anwenden.

---

## 2. Projektkontext: Was ist „Support“ beim Rechnungsprüfer?

Der Rechnungsprüfer besteht aus:
- Frontend (Browser) mit Upload
- API (Express) mit Endpoints (`/api/upload`, `/api/status`, `/api/health`, `/status`)
- Externe Abhängigkeiten: OpenAI API (Cloud), Render Deployment

**Typische Support-Situationen:**
- Upload funktioniert nicht (Client- oder Serverfehler)
- KI liefert keine Daten / Timeout
- Deployment schlägt fehl
- Statusseite zeigt „offline“ oder falsche Werte

---

## 3. ITIL-Praktiken im Überblick (3.1)

### 3.1 Service Desk

**Zweck:** Single Point of Contact (SPOC) für Nutzer.

**Beitrag:**
- Entgegennahme von Incidents/Requests
- Kommunikation/Statusupdates
- Erste Diagnose (Triage)
- Eskalation an 2nd/3rd Level

**Praxis im Projekt:**
- Nutzer meldet: „Upload geht nicht“ → Service Desk sammelt Informationen (Browser, Datei, Uhrzeit, Fehlermeldung).

### 3.2 Incident Management

**Zweck:** Störung schnellstmöglich beheben und Service wiederherstellen.

**Wichtig:** Fokus auf Wiederherstellung – nicht auf Root Cause (das ist Problem Management).

**Praxis im Projekt:**
- Render Service down → sofortige Wiederherstellung (Rollback/Redeploy).

### 3.3 Problem Management

**Zweck:** Ursachen (Root Causes) von wiederkehrenden oder schweren Incidents identifizieren und dauerhaft beheben.

**Praxis im Projekt:**
- Wiederkehrende OpenAI Timeouts → Analyse, Anpassung (Timeout/Retry/Fallback), Monitoring.

### 3.4 Service Request Management

**Zweck:** Standardisierte Service-Anfragen (keine Störung), z.B. Zugang, Konfiguration.

**Praxis im Projekt:**
- „Bitte OpenAI Key auf Render setzen“ ist eher ein Service Request (oder Change), nicht Incident.

---

## 4. Supportorganisation: Rollen, Levels, Schnittstellen (3.2)

### 4.1 Typischer Aufbau

- **1st Level (L1)**: Service Desk
  - nimmt an, kategorisiert, priorisiert
  - nutzt Knowledge Base / Standard-Workflows
- **2nd Level (L2)**: Application Support
  - tieferes Verständnis der App/Logs
  - reproduziert Fehler, nimmt Konfig-Checks vor
- **3rd Level (L3)**: Engineering/DevOps
  - Code-Fixes, Architektur, Deployments, API-Provider-Themen

### 4.2 RACI-Beispiel (vereinfachte Verantwortlichkeiten)

| Aktivität | L1 | L2 | L3 |
|---|---|---|---|
| Incident aufnehmen & priorisieren | R | C | I |
| Status kommunizieren | R | C | I |
| Logs auswerten (Render/Server) | C | R | C |
| Quick-Fix Konfiguration (ENV) | I | R | C |
| Codefix + Release | I | C | R |
| Root Cause Analyse | I | C | R |

R = Responsible, C = Consulted, I = Informed

---

## 5. Triage, Priorisierung, Eskalation

### 5.1 Triage: Welche Fragen zuerst?

Bei jeder Meldung (Incident/Request) mindestens:

- **Was ist betroffen?** (Upload? Statuspage? Deployment?)
- **Wer ist betroffen?** (1 Nutzer, alle Nutzer?)
- **Seit wann?** (Zeitpunkt, nach Release?)
- **Wie häufig?** (immer, sporadisch)
- **Welche Evidenz?** (Screenshot, Response, Logs, Request-ID)
- **Reproduzierbar?** (Schritte, Test-PDF)

### 5.2 Priorisierung: Impact × Urgency

Ein gängiges Schema:

- **Impact (Auswirkung)**
  - Hoch: Service für alle down
  - Mittel: Kernfunktion eingeschränkt
  - Niedrig: Einzelne Nutzer/Workaround vorhanden

- **Urgency (Dringlichkeit)**
  - Hoch: sofort erforderlich (Betrieb/Abnahme/Unterricht)
  - Mittel: innerhalb Arbeitstag
  - Niedrig: geplant

**Priorität** ergibt sich aus Impact × Urgency.

Beispiel:
- Upload für alle kaputt + Unterricht läuft → Impact hoch, Urgency hoch → P1

### 5.3 Eskalation

- **Funktionale Eskalation**: an L2/L3 (mehr Skills)
- **Hierarchische Eskalation**: Management/Stakeholder (wenn SLA gefährdet)
- **Lieferanten-Eskalation**: Render/OpenAI Status/Support (wenn Providerproblem)

---

## 6. Praxis-Fälle (Fallstudien) am Rechnungsprüfer

### Fall A: „Upload funktioniert nicht“

**Symptom**: Frontend zeigt Fehler, oder Response 400/500.

**Triage (L1):**
- Welche Datei? PDF wirklich PDF?
- Fehlermeldung im Browser?
- Zeitpunkt? (nach Deploy?)

**Schnellchecks (L2):**
- `GET /api/status` erreichbar?
- Render Logs: Fehler bei `/api/upload`?
- Server: Multer-Fehler? PDF-Parse Fehler?

**Typische Ursachen:**
- falsches Feldname im Frontend (nicht `pdf`)
- Upload-Limit überschritten
- PDF-Parse wirft Exception

**Sofortmassnahme (Incident):**
- Service wiederherstellen (z.B. Fix/Hotfix, Rollback)

**Nacharbeit (Problem):**
- Root Cause analysieren, Testfall hinzufügen, Regression automatisieren

### Fall B: „KI liefert keine Rechnungsdaten“

**Symptom**: invoice ist leer oder wichtige Felder fehlen.

**Triage:**
- `aiStatus` zeigt OpenAI verfügbar?
- Ist das PDF gescannt (OCR fehlt)?
- Gibt es Logs zu Timeout?

**Sofortmassnahme:**
- Fallback aktiv (Regex), User informieren

**Problem Management:**
- Ursachen: API Rate Limits? Prompt? Timeout? Testdaten erweitern

### Fall C: „Render Deployment schlägt fehl“

**Symptom**: Build/Start Error, Service offline.

**Triage:**
- Render Logs prüfen
- ENV Vars gesetzt? (z.B. `OPENAI_API_KEY`)
- Start Command korrekt?

**Sofortmassnahme:**
- letzten funktionierenden Deploy re-deployen / Rollback

**Problem Management:**
- Reproduzierbarkeit verbessern (pin dependencies, tests, smoke)

---

## 7. Kennzahlen für Incident & Problem Management (3.3)

### 7.1 Incident-KPIs

- **MTTR (Mean Time To Restore)**: Zeit bis Service wieder läuft
- **First Contact Resolution (FCR)**: Anteil gelöster Tickets im L1
- **Incident Rate**: Incidents pro Zeitraum (z.B. pro Woche)
- **SLA Compliance**: Anteil innerhalb SLA gelöst
- **Reopen Rate**: Wie oft Tickets wieder geöffnet werden

### 7.2 Problem-KPIs

- **Repeat Incident Rate**: Wiederholungsrate gleicher Störung
- **Time to Diagnose**: Zeit bis Root Cause identifiziert
- **Backlog**: offene Problems / Known Errors
- **Reduction Trend**: Trend, ob Anzahl Incidents sinkt

### 7.3 Praktische Messpunkte im Projekt

- Render Deploy Logs (Zeitpunkte)
- API Status/Uptime (`/api/status`)
- Support-Tickets/Issues (Kategorien, Prioritäten)

---

## 8. Dokumentationsartefakte (Tickets, Protokolle, Knowledge)

### 8.1 Incident Ticket – Minimaltemplate

- **Ticket-ID**:
- **Meldung** (User Statement):
- **Service/Komponente**: (Frontend/API/Provider)
- **Zeitpunkt**:
- **Impact**:
- **Urgency**:
- **Priorität (P1–P4)**:
- **Reproduktionsschritte**:
- **Erwartet** vs. **Ist**:
- **Evidenz** (Logs/Screenshots/Response):
- **Workaround** (falls vorhanden):
- **Massnahme** (Restore):
- **Statusupdates** (zeitlich):
- **Resolution**:
- **Lessons Learned**:

### 8.2 Problem Record – Minimaltemplate

- **Problem-ID**:
- **Verknüpfte Incidents**:
- **Symptombeschreibung**:
- **Root Cause Hypothesen**:
- **RCA-Methode**: (5-Why, Ishikawa)
- **Root Cause**:
- **Fix/Change**:
- **Known Error / Workaround**:
- **Verifizierung (Test/Monitoring)**:
- **Preventive Action**:

### 8.3 Knowledge Base Artikel (KB)

Guter KB-Artikel enthält:
- Problem/Fehlerbild
- Schnellchecks
- Lösung/Workaround
- Prävention (z.B. Testfall)

---

## 9. Übungen (Hands-on)

### Übung 1: Priorisierung mit Impact × Urgency

Ordne folgende Fälle ein (P1–P4) und begründe:
1. `/api/status` liefert 500 nach Deploy (alle betroffen)
2. Upload klappt nur bei grossen PDFs nicht (Workaround: kleinere PDF)
3. Statuspage `/status` zeigt falsche Uptime, aber API funktioniert
4. OpenAI zeitweise langsam, Regex-Fallback liefert wenigstens Summen

### Übung 2: Incident Ticket schreiben

Schreibe ein Incident Ticket zu:
- „Upload funktioniert nicht, Fehler 400: Keine PDF-Datei hochgeladen“

### Übung 3: Problem Record (RCA)

Wähle einen wiederkehrenden Fehler (z.B. OpenAI Timeout) und erstelle:
- 5-Why Analyse
- Preventive Action (z.B. Monitoring/Tests/Fallback-Kommunikation)

---

## 10. Checklisten

### 10.1 L1 – Triage-Checkliste

- [ ] Service identifiziert (Frontend/API/Provider)
- [ ] Impact/Urgency bewertet
- [ ] Evidenz gesammelt (Fehlertext, Zeitpunkt, Steps)
- [ ] Standardchecks durchgeführt (`/api/status`, `/api/health`)
- [ ] Ticket korrekt kategorisiert
- [ ] Eskalation an L2/L3 bei Bedarf

### 10.2 L2 – Diagnose-Checkliste

- [ ] Logs geprüft (Render/Server)
- [ ] Reproduzierbarkeit lokal geprüft
- [ ] Konfiguration geprüft (ENV, Start Command)
- [ ] Workaround kommuniziert
- [ ] Fix/Change-Vorschlag dokumentiert

### 10.3 L3 – Stabilisierung/Problem-Checkliste

- [ ] Root Cause Analyse durchgeführt
- [ ] Fix implementiert
- [ ] Regressionstest ergänzt (mind. Smoke)
- [ ] Monitoring angepasst
- [ ] KB-Artikel erstellt

---

## 11. Kurz-Zusammenfassung

- Service Desk ist die Kommunikationsdrehscheibe.
- Incident Management stellt den Service schnell wieder her.
- Problem Management verhindert Wiederholungen.
- Triage/Priorisierung/Eskalation strukturieren Support effizient.
- KPIs (z.B. MTTR, FCR) machen Supportleistung messbar.

---

## ▶️ Nächstes Modul

Weiter mit: `SCHULUNG_4_ITIL_Verbesserung.md`
