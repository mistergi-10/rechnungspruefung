# IT-Servicebetrieb überwachen und verbessern
## Schulungsdokumentation am Praxisbeispiel "Rechnungsprüfer CHF"

**Zielgruppe**: Erwachsenenbildung ICT  
**Kompetenzstufe**: ICT-Berufsbildung Schweiz - Handlungskompetenz 650  
**Projekt-Version**: 1.4.0  
**Stand**: Dezember 2025

---

## 📚 Über diese Schulung

Diese Schulungsdokumentation basiert auf einem **realen Softwareprojekt**: Einem automatisierten Rechnungsprüfungssystem mit Hybrid-KI-Technologie. Das System demonstriert moderne IT-Service-Management-Praktiken in einem produktionsnahen Kontext.

### Projekt-Kontext
- **System**: Node.js/Express REST API mit OpenAI GPT-4o Integration
- **Deployment**: Cloud-basiert auf Render.com mit CI/CD Pipeline
- **Versionsverwaltung**: Git/GitHub mit automatisiertem Deployment
- **Monitoring**: Health Checks, Status APIs, Logging
- **Testing**: Manuell und automatisiert mit verschiedenen Teststufen

---

## 🎯 Lernziele & Kompetenzen

Nach Abschluss dieser Schulung können Teilnehmende:

### Handlungskompetenz 1: Testing & Qualitätssicherung
✅ Funktionale und nicht-funktionale Anforderungen identifizieren  
✅ ISO/IEC 25010 Qualitätskriterien anwenden  
✅ Teststufen und Testmethoden situativ einsetzen  
✅ Automatisierte Tests konzipieren  
✅ Testdokumentationen erstellen

### Handlungskompetenz 2: Releasemanagement
✅ Klassisches und agiles Releasemanagement durchführen  
✅ CI/CD Pipelines implementieren  
✅ Versionsverwaltungssysteme nutzen  
✅ Release-Planung und -Dokumentation erstellen  
✅ Release-Kennzahlen messen

### Handlungskompetenz 3: ITIL Support-Praktiken
✅ ITIL Service Desk, Incident und Problem Management anwenden  
✅ Supportorganisationen strukturieren  
✅ Triage und Eskalation durchführen  
✅ Support-Kennzahlen erheben

### Handlungskompetenz 4: Kontinuierliche Verbesserung
✅ Continual Improvement Prozesse etablieren  
✅ Change Enablement durchführen  
✅ Verbesserungsdimensionen analysieren  
✅ Reviews und Feedback-Prozesse implementieren

### Handlungskompetenz 5: Monitoring & Reporting
✅ Monitoring-Systeme einrichten  
✅ Kennzahlen erheben und verdichten  
✅ Diagramme situativ einsetzen  
✅ Statusberichte erstellen

---

## 📖 Modulübersicht

### Modul 1: Testing & Qualitätssicherung
**Datei**: `SCHULUNG_1_Testing_Qualitaet.md`  
**Dauer**: 4 Lektionen  
**Inhalte**:
- 1.1 Anforderungsanalyse (funktional/nicht-funktional) am Rechnungsprüfer
- 1.2 ISO/IEC 25010 Qualitätsmodell
- 1.3 Teststufen: Komponenten-, Integrations-, System-, Akzeptanztests
- 1.4 Testmethoden: Funktions-, Regressions-, Last-, Sicherheitstests
- 1.5 Automatisierte Tests mit Jest/Mocha
- 1.6 Testdokumentation & Testprotokolle

**Praxisbeispiele**:
- Funktionale Anforderungen: PDF-Upload, KI-Parsing, Validierung
- Nicht-funktionale Anforderungen: Performance (5-15s), Skalierbarkeit
- Systemtests: API-Endpoint-Tests mit curl
- Integrationstests: OpenAI API, Ollama Integration

---

### Modul 2: Releasemanagement & CI/CD
**Datei**: `SCHULUNG_2_Releasemanagement.md`  
**Dauer**: 3 Lektionen  
**Inhalte**:
- 2.1 Klassisches Releasemanagement: Planung, Migration, Rollout, Rollback
- 2.2 Agile Konzepte: CI/CD, Continuous Integration, Deployment, Delivery
- 2.3 Versionsverwaltung mit Git/GitHub: Branches, Commits, Tags
- 2.4 Release-Planung: Feature-Planning, Testplanung, Dokumentation
- 2.5 Kennzahlen: Deployment-Frequenz, Lead Time, Change Failure Rate

**Praxisbeispiele**:
- Git Workflow: main Branch, Commit Messages, Push-Trigger
- CI/CD Pipeline: GitHub → Render.com Auto-Deploy
- Release v1.4.0: Hybrid-KI, Status-Pages, Deployment
- Rollback-Strategie: Git Revert, Render Re-Deploy

---

### Modul 3: ITIL Support-Praktiken
**Datei**: `SCHULUNG_3_ITIL_Support.md`  
**Dauer**: 3 Lektionen  
**Inhalte**:
- 3.1 ITIL-Praktiken: Service Desk, Incident Management, Problem Management
- 3.2 Supportorganisation: 1st/2nd/3rd Level Support, Triage
- 3.3 Incident-Klassifikation: Priorität, Schweregrad, Eskalation
- 3.4 Problem Management: Root Cause Analysis, Known Errors
- 3.5 Kennzahlen: MTTR, MTBF, First Call Resolution Rate

**Praxisbeispiele**:
- Incident: "PDF Upload funktioniert nicht" → Triage → L2 Support
- Problem: "OpenAI Timeout nach 25s" → RCA → Known Error
- Service Request: "Neuen API Key in Render setzen"
- Eskalation: "Deployment fehlgeschlagen" → L3 DevOps

---

### Modul 4: Kontinuierliche Verbesserung
**Datei**: `SCHULUNG_4_ITIL_Verbesserung.md`  
**Dauer**: 2 Lektionen  
**Inhalte**:
- 4.1 ITIL Continual Improvement: PDCA-Zyklus, Kaizen
- 4.2 Change Enablement: Change Requests, Change Advisory Board
- 4.3 Verbesserungsdimensionen: Technologie, Sicherheit, Performance, Kosten
- 4.4 Aktivitäten: Reviews, Kundenfeedback, Benchmarking, Kostenvergleich
- 4.5 Financial Management: TCO, ROI für KI-Integration

**Praxisbeispiele**:
- Verbesserung: Hybrid-KI statt nur OpenAI → Kostensenkung
- Change: Ollama → Groq Cloud-Alternative (Production)
- Review: Performance-Analyse (OpenAI 3-10s, Regex <100ms)
- Benchmarking: OpenAI vs. Groq vs. Ollama Vergleich

---

### Modul 5: Monitoring & Reporting
**Datei**: `SCHULUNG_5_Monitoring_Reporting.md`  
**Dauer**: 2 Lektionen  
**Inhalte**:
- 5.1 ITIL Monitoring and Event Management: Logs, Alerts, Dashboards
- 5.2 Measurement and Reporting: KPIs, Metriken, SLAs
- 5.3 Datenvisualisierung: Diagrammtypen (Zeit-, Balken-, Kreis-, Box-Plot)
- 5.4 Berichterstattung: Statusberichte, Ampel-Methode, Soll-/Ist-Vergleich
- 5.5 Tools: Render Logs, Health Check APIs, Status Dashboards

**Praxisbeispiele**:
- Health Check: `/api/health` HTML-Seite mit Uptime
- Status API: `/api/status` JSON mit AI-Modul-Status
- Dashboard: `/status` mit Auto-Refresh (30s)
- Logs: Render.com Console Logs, Emoji-Logging (🚀✅⚠️❌)
- Metriken: Uptime, Request-Dauer, AI-Erfolgsrate

---

## 🛠️ Systemumgebung

### Produktionsumgebung
- **Cloud Platform**: Render.com (Free Tier)
- **Runtime**: Node.js (Latest)
- **Datenbank**: Keine (Memory-basiert)
- **External APIs**: OpenAI GPT-4o, Ollama (lokal)

### Entwicklungsumgebung
- **OS**: macOS (Apple Silicon)
- **Editor**: VS Code
- **Terminal**: zsh
- **Version Control**: Git 2.x
- **Package Manager**: npm

### Technologie-Stack
- **Backend**: Express.js 4.21.2
- **AI**: OpenAI API, Ollama Mistral 7B
- **PDF Processing**: pdf-parse 1.1.1
- **File Upload**: Multer 1.4.5
- **Frontend**: Vanilla JavaScript, HTML5, CSS3

---

## 📋 Voraussetzungen für Teilnehmende

### Technische Kenntnisse
- ✅ Grundkenntnisse in Node.js/JavaScript
- ✅ Verständnis von REST APIs
- ✅ Basiswissen Git/Versionsverwaltung
- ✅ Kommandozeilen-Grundlagen (Terminal)

### Optional (von Vorteil)
- ⭐ Erfahrung mit Cloud-Deployments
- ⭐ ITIL Foundation Zertifizierung
- ⭐ Kenntnisse in Testautomatisierung
- ⭐ Erfahrung mit CI/CD Pipelines

### Infrastruktur-Zugriff
- GitHub Account (kostenlos)
- Render.com Account (Free Tier)
- OpenAI API Key (optional für Übungen)
- Node.js installiert (v18+)

---

## 🎓 Didaktisches Konzept

### Lernmethodik
Jedes Modul folgt der **4-Stufen-Methode**:

1. **Theorie** (25%): Fachliche Grundlagen & Standards
2. **Praxisbeispiel** (35%): Anwendung am Rechnungsprüfer-Projekt
3. **Übung** (30%): Hands-on Aufgaben mit Musterlösungen
4. **Reflexion** (10%): Transfer auf eigene Projekte

### Lernformate
- 📖 **Selbststudium**: Markdown-Dokumente mit Codebeispielen
- 💻 **Praktische Übungen**: Terminal-Befehle, API-Tests
- 🧪 **Labor**: Lokales Setup & Cloud-Deployment
- 📊 **Fallstudien**: Reale Incident- und Problem-Szenarien

### Assessment
- ✅ Selbsttests nach jedem Kapitel
- ✅ Praktische Aufgaben mit Musterlösungen
- ✅ Abschlussprojekt: Eigene Testdokumentation erstellen

---

## 📂 Projektstruktur (Referenz)

```
Rechnungspruefung_V2/
├── server.js                 # Express Server (500+ Zeilen)
├── ai-module.js             # Hybrid-KI System (280 Zeilen)
├── public/
│   └── index.html           # Frontend (600+ Zeilen)
├── package.json             # Dependencies & Scripts
├── render.yaml              # Deployment-Konfiguration
├── .env.example             # Environment Template
├── .gitignore               # Git Exclusions
├── README.md                # Projekt-Readme
├── SYSTEMARCHITEKTUR.md     # Technische Doku (nicht in Git)
├── ZUGRIFFSPUNKTE.md        # Zugangsdaten (nicht in Git)
└── SCHULUNG_*.md            # Schulungsmodule (nicht in Git)
```

---

## 🔗 Navigation

| Modul | Thema | Datei | Dauer |
|-------|-------|-------|-------|
| **1** | Testing & Qualität | [SCHULUNG_1_Testing_Qualitaet.md](SCHULUNG_1_Testing_Qualitaet.md) | 4h |
| **2** | Releasemanagement | [SCHULUNG_2_Releasemanagement.md](SCHULUNG_2_Releasemanagement.md) | 3h |
| **3** | ITIL Support | [SCHULUNG_3_ITIL_Support.md](SCHULUNG_3_ITIL_Support.md) | 3h |
| **4** | Verbesserung | [SCHULUNG_4_ITIL_Verbesserung.md](SCHULUNG_4_ITIL_Verbesserung.md) | 2h |
| **5** | Monitoring & Reporting | [SCHULUNG_5_Monitoring_Reporting.md](SCHULUNG_5_Monitoring_Reporting.md) | 2h |

**Gesamtdauer**: 14 Lektionen (à 45 Minuten)

---

## 📞 Support & Ressourcen

### Technische Dokumentation
- [SYSTEMARCHITEKTUR.md](SYSTEMARCHITEKTUR.md) - Technische Details
- [ZUGRIFFSPUNKTE.md](ZUGRIFFSPUNKTE.md) - URLs & API Keys
- [README.md](README.md) - Projekt-Readme

### Externe Ressourcen
- **ITIL 4**: https://www.axelos.com/certifications/itil-service-management
- **ISO/IEC 25010**: https://iso25000.com/index.php/en/iso-25000-standards/iso-25010
- **OpenAI Docs**: https://platform.openai.com/docs
- **Render Docs**: https://render.com/docs
- **Git Docs**: https://git-scm.com/doc

### Repository
- **GitHub**: https://github.com/mistergi-10/rechnungspruefung
- **Issues**: Für Fragen und Feedback

---

## 📜 Lizenz & Nutzung

**Copyright**: David Gianini, 2025  
**Verwendungszweck**: Schulung in der Erwachsenenbildung (ICT)  
**Lizenz**: Nur für Bildungszwecke, nicht kommerziell

**Hinweis**: API Keys und Zugangsdaten sind vertraulich und dürfen nicht weitergegeben werden.

---

**Stand**: 27. Dezember 2025  
**Version**: 1.0  
**Nächste Aktualisierung**: Nach Feedback aus erstem Durchlauf

---

## ▶️ Jetzt starten!

➡️ **Beginne mit Modul 1**: [Testing & Qualitätssicherung](SCHULUNG_1_Testing_Qualitaet.md)

Viel Erfolg bei der Schulung! 🎓
