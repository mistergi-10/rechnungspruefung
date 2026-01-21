# Modul 2 – Releasemanagement & CI/CD
## Schulung am Praxisbeispiel „Rechnungsprüfer CHF“ (v1.4.0)

**Zielgruppe**: Erwachsenenbildung ICT  
**Dauer**: ca. 3 Lektionen à 45 Minuten  
**Voraussetzungen**: Basiswissen Git/CLI, Verständnis von Deployments und Umgebungen

---

## 1. Lernziele (Kompetenzen)

Teilnehmende…

- kennen Aufgaben im klassischen Releasemanagement (Feature-/Migrations-/Rollout-/Rollback-Planung, Testplanung, Training Ops & Support).
- kennen agile Konzepte Continuous Integration, Continuous Deployment, Continuous Delivery und können deren Einfluss auf Releases erklären.
- kennen zentrale, dezentrale und verteilte VCS und können deren Bedeutung für Versionierung/Daten erläutern.
- kennen Anforderungen an Planung, Tests und Dokumentation im Releasemanagement (Reproduzierbarkeit, Kompatibilität, Zyklen/Freeze, Notfall-Release) und Abhängigkeiten zu ITSM-Prozessen.
- kennen typische Kennzahlen zur Messung von Leistung und Qualität im Releasemanagement.

---

## 2. Projektkontext: Release-Objekt „Rechnungsprüfer CHF“

### 2.1 Was ist hier ein „Release“?

In diesem Projekt ist ein Release typischerweise:
- ein **Commit** (oder eine Gruppe von Commits) auf `main`
- der zu einem **automatischen Deployment** auf Render.com führt
- plus die Konfiguration der **Environment Variables** auf Render (z.B. `OPENAI_API_KEY`).

### 2.2 Release-Artefakte im Projekt

- **Source Code**: `server.js`, `ai-module.js`, `public/index.html`
- **Build-/Start-Konfiguration**: `package.json` (Scripts), `render.yaml`
- **Secrets/Config**:
  - lokal: `.env` (nicht in Git)
  - Produktion: Render Environment Variables
- **Monitoring**: `/api/health`, `/api/status`, `/status`

---

## 3. Klassisches Releasemanagement (2.1)

### 3.1 Typische Aufgaben (klassisch)

1. **Feature-Planung**
   - Welche Features sind im Release enthalten?
   - Was ist explizit nicht enthalten (Scope)?

2. **Migrationsplanung**
   - Datenmigrationen, Konfigurationsänderungen, API-Änderungen
   - Im Projekt aktuell klein, da keine Datenbank.

3. **Rollout-Planung**
   - Zeitpunkt, Verantwortliche, Kommunikationsplan
   - Monitoring während Rollout

4. **Testplanung und Tests**
   - Smoke, Regression, Systemtest, UAT (je nach Risiko)

5. **Training Operations & Support**
   - Was muss Support wissen?
   - Welche Known Errors gibt es?

6. **Rollout und Rollback**
   - Rollout durchführen (Deployment)
   - Rollback-Plan, falls Fehler

### 3.2 Klassischer Release-Plan (Template)

**Release Name/Version**: z.B. `v1.4.0`  
**Inhalt**: (Features)  
**Risiken**: (Top 3)  
**Tests**: (Smoke/Regression/System/UAT)  
**Rollout**: (Zeitfenster, Schritte)  
**Rollback**: (Konkrete Schritte)  
**Kommunikation**: (Wer wird informiert?)  

---

## 4. Agile Konzepte: CI/CD (2.2)

### 4.1 Continuous Integration (CI)

**Definition**: Häufiges Integrieren von Codeänderungen in einen gemeinsamen Branch, idealerweise mit automatisierten Checks.

**Im Projekt sichtbar durch:**
- häufige Commits
- reproduzierbarer Build über `npm install`

**Ideal-Ausbau (optional):**
- GitHub Actions: Lint + Tests bei Pull Request

### 4.2 Continuous Delivery vs. Continuous Deployment

- **Continuous Delivery**: Jede Änderung ist *potenziell* deploybar; Deployment kann manuell ausgelöst werden.
- **Continuous Deployment**: Jede Änderung wird automatisch deployt (wenn Checks ok).

**Im Projekt aktuell:**
- Wenn Render Auto-Deploy aktiv ist: eher Richtung **Continuous Deployment** (Push → Deploy).

### 4.3 Praktische Konsequenzen für Release-Management

- Releases werden „kleiner“ und häufiger
- Testautomatisierung gewinnt an Bedeutung
- Rollback muss schnell und standardisiert sein
- Monitoring muss in den Prozess integriert werden

---

## 5. Versionsverwaltungssysteme (VCS) – zentral, dezentral, verteilt (2.3)

### 5.1 Begriffe

- **Zentral (CVCS)**: z.B. SVN – ein zentraler Server ist „Single Source of Truth“.
- **Dezentral/Verteilt (DVCS)**: z.B. Git – jeder hat ein vollständiges Repository.

### 5.2 Bedeutung für Verwaltung und Versionierung

- Historie und Nachvollziehbarkeit (Wer hat was wann geändert?)
- Zusammenarbeit (Branches, Merge, Pull Requests)
- Reproduzierbarkeit (ein bestimmter Commit entspricht einem Zustand)

### 5.3 GitHub + Render als Release-Kette

- GitHub `main` ist der **Release-Trigger**
- Render nimmt den Code von GitHub und baut/deployed

---

## 6. Anforderungen an Planung, Tests und Dokumentation (2.4)

### 6.1 Reproduzierbarkeit

**Ziel:** Gleicher Code + gleiche Konfiguration → gleiches Verhalten.

**Im Projekt:**
- `package-lock.json` fixiert Dependency-Versionen
- `render.yaml` fixiert Build/Start-Kommandos
- Secrets über ENV Vars (nicht im Code)

### 6.2 Kompatibilität

**Beispiele:**
- Node-Version/Runtime in Render
- API-Verhalten bleibt stabil (`/api/upload`, `/api/status`)

### 6.3 Releasezyklen & Freeze

- **Releasezyklus**: z.B. wöchentlich oder nach Feature-Fertigstellung
- **Freeze**: Zeitraum ohne Änderungen kurz vor Rollout (reduziert Risiko)

**Praxis-Tipp:** Freeze besonders wichtig, wenn externe Abhängigkeiten beteiligt sind (OpenAI API, Render Deploy).

### 6.4 Notfall-Release (Emergency Release)

Wenn ein Incident „Produktion down“ auftritt:
- Minimaler Fix
- Minimaler Testumfang (Smoke + gezielter Regressionsteil)
- Schnelle Kommunikation
- Nachträgliche Dokumentation und Problem-Management

### 6.5 Abhängigkeiten zu ITSM-Prozessen

- **Change Enablement**: Releases sind Changes (Risikoabwägung, Freigaben)
- **Incident Management**: Fehlgeschlagene Deploys/Errors sind Incidents
- **Problem Management**: Wiederkehrende Fehler → Root Cause
- **Service Desk**: Kommunikation und Triage für Nutzer

---

## 7. Kennzahlen im Releasemanagement (2.5)

### 7.1 DORA-Kennzahlen (praxisnah)

1. **Deployment Frequency**: Wie oft wird deployed?
2. **Lead Time for Changes**: Zeit von Commit bis Produktion
3. **Change Failure Rate**: Anteil Deployments, die zu Störung/Rollback führen
4. **Time to Restore Service (MTTR)**: Wie schnell ist Service wieder ok?

### 7.2 Weitere sinnvolle KPIs

- **Build/Deploy Dauer** (Render Logs)
- **Fehlerrate nach Release** (API 5xx, Upload Errors)
- **Nutzerfeedback** (UAT/Support Tickets)

### 7.3 Messung im Projekt (praktisch)

- Render Deploy Logs: Dauer und Erfolg
- `/api/status`: Uptime, Environment, aktive KI-Quelle
- Tickets/Issues: Fehler nach Deploy

---

## 8. Praxis: Release-Workflow im Projekt

### 8.1 Standard-Flow (empfohlen)

1. Lokal entwickeln und testen
2. Änderungen committen
3. Push nach GitHub `main`
4. Render Auto-Deploy läuft
5. Post-Deploy Check: `/api/health`, `/api/status`, `/status`

### 8.2 Rollback-Strategien

**Variante A (Git revert, sauber):**
- `git revert <bad_commit>`
- push → Deploy

**Variante B (Re-deploy älterer Commit in Render):**
- Render: Deploys → „Rollback“/„Redeploy“ (je nach UI)

**Wichtig:** Rollback muss Teil des Plans sein, bevor man deployt.

### 8.3 Release-Check nach Deploy (Smoke)

- `GET /api/health` → HTML
- `GET /api/status` → JSON mit `status: online`
- `GET /status` → Dashboard
- Optional: `POST /api/upload` mit Test-PDF

---

## 9. Übungen (Hands-on)

### Übung 1: Mini-Releaseplan schreiben

Erstelle einen 1-seitigen Releaseplan für ein Feature:
- „Status-Dashboard `/status` hinzufügen“

Muss enthalten:
- Scope (was/was nicht)
- Tests
- Rollout
- Rollback
- Verantwortliche

### Übung 2: Git-Workflow (Commitqualität)

Aufgabe:
- Formuliere 3 gute Commit Messages für Änderungen an:
  - Upload-Endpoint
  - `.gitignore` (Secrets-Schutz)
  - Status Dashboard

Regeln (Beispiel):
- kurz, präzise, im Imperativ: „Add …“, „Fix …“, „Refactor …“

### Übung 3: DORA-Kennzahlen interpretieren

Szenario:
- Deployment Frequency hoch
- Change Failure Rate steigt

Frage:
- Welche Massnahmen im Releaseprozess würdest du vorschlagen?

---

## 10. Checklisten

### 10.1 Checkliste: „Release Ready“ (agil/CI)

- [ ] Code Review (mind. 1 Person) oder Self-Review dokumentiert
- [ ] Smoke lokal ok
- [ ] Regression: Kern-Endpunkte ok
- [ ] Secrets ok (kein Key im Repo)
- [ ] Render ENV Vars gesetzt/aktuell
- [ ] Monitoring-Check vorbereitet
- [ ] Rollback-Option klar

### 10.2 Checkliste: Post-Deploy

- [ ] Render Deploy erfolgreich
- [ ] `/api/status` online
- [ ] `/api/health` ok
- [ ] `/status` ok
- [ ] Upload-Test (optional)
- [ ] Incident-Kanal bereit (wenn Fehler)

---

## 11. Transferfragen (Reflexion)

- Wo braucht ihr bei euch einen „Freeze“ – und wo nicht?
- Welche Änderungen sind „Standard Change“ vs. „Normal/Emergency Change“?
- Welche 2 KPIs würdest du als Minimum tracken – und warum?

---

## 12. Kurz-Zusammenfassung

- Releasemanagement umfasst Planung, Test, Rollout, Kommunikation und Rollback.
- CI/CD verändert Releases: kleiner, häufiger, automatisierter.
- Git (DVCS) ist Basis für Nachvollziehbarkeit und reproduzierbare Releases.
- DORA-Metriken helfen, Releasequalität und Lieferfähigkeit messbar zu machen.

---

## ▶️ Nächstes Modul

Weiter mit: `SCHULUNG_3_ITIL_Support.md`
