# Modul 4 – ITIL: Kontinuierliche Verbesserung & Change Enablement
## Schulung am Praxisbeispiel „Rechnungsprüfer CHF“ (v1.4.0)

**Zielgruppe**: Erwachsenenbildung ICT  
**Dauer**: ca. 2 Lektionen à 45 Minuten  
**Voraussetzungen**: Grundkenntnisse Support/Release (Module 2–3 hilfreich)

---

## 1. Lernziele (Kompetenzen)

Teilnehmende…

- kennen relevante ITIL-Praktiken (Continual Improvement, Change Enablement, Financial Management, Supplier Management) und können deren Beitrag im IT-Service-Management erläutern.
- kennen unterschiedliche Dimensionen zur Verbesserung von IT-Services (Technologie, Sicherheit, Performance, Wirtschaftlichkeit) und können sie auf das Projekt anwenden.
- kennen typische Aktivitäten für kontinuierliche Verbesserung (Reviews, Kundenfeedback, Kostenvergleichsrechnung, Benchmarking) und können daraus Massnahmen ableiten.

---

## 2. Projektkontext: Warum „Verbesserung“ beim Rechnungsprüfer wichtig ist

Der Rechnungsprüfer ist ein praxisnahes Beispiel, weil er:
- externe Abhängigkeiten hat (OpenAI, Render)
- variable Eingaben verarbeitet (PDFs unterschiedlicher Lieferanten)
- ein hybrides, teils probabilistisches System ist (KI-Ausgaben schwanken)

Das führt zu typischen Verbesserungsthemen:
- Qualität/Genauigkeit der Extraktion
- Zuverlässigkeit bei Ausfällen (Fallback-Strategien)
- Kostensteuerung (Tokens, Provider)
- Stabilität im Deployment und Betrieb

---

## 3. Continual Improvement (4.1)

### 3.1 Zweck und Grundidee

**Continual Improvement** ist die ITIL-Praktik, die sicherstellt, dass Services fortlaufend an Kundenbedürfnisse, Risiken und Technologie angepasst werden.

Im Kern geht es um:
- systematisch verbessern (nicht nur „Feuerwehr“)
- messbar machen (Metriken/KPIs)
- Lernen aus Incidents/Feedback

### 3.2 Kontinuierlicher Verbesserungszyklus (praxisnah)

Ein praktikabler Zyklus (angelehnt an PDCA):

1. **Plan**: Verbesserung identifizieren und planen
2. **Do**: Umsetzen (Change/Release)
3. **Check**: Wirkung messen (KPIs, Feedback)
4. **Act**: Standardisieren oder nachjustieren

**Wichtig im KI-Kontext:** „Check“ braucht oft mehrere Messpunkte (mehrere PDFs, mehrere Tage), weil KI-Ergebnisse variieren.

### 3.3 Verbesserungskandidaten finden (Sources)

- Support-Tickets (Incidents/Requests)
- Monitoring (Errors, Response Times, Uptime)
- Nutzerfeedback (UAT, Unterrichtsteilnehmende)
- Code Reviews / Security Reviews
- Kostenberichte (OpenAI Usage)

---

## 4. Change Enablement (4.1)

### 4.1 Zweck

**Change Enablement** stellt sicher, dass Änderungen (Changes) kontrolliert, risikobewusst und nachvollziehbar umgesetzt werden.

Ziele:
- Risiken reduzieren
- Ausfälle vermeiden
- Transparenz und Verantwortlichkeiten klären

### 4.2 Change-Typen (vereinfachtes Modell)

- **Standard Change**: geringes Risiko, wiederholbar, vorab genehmigt
  - Beispiel: „Dokumentierte Anpassung einer Render ENV Variable“
- **Normal Change**: erfordert Bewertung/Freigabe
  - Beispiel: „Änderung am Upload-Parsing oder Validierungslogik“
- **Emergency Change**: Notfall, schnelle Wiederherstellung
  - Beispiel: „Hotfix nach Deploy, Service down (P1)“

### 4.3 Change-Kriterien am Projekt (Risikofaktoren)

Hoheres Risiko, wenn:
- Deployment nach Render betroffen ist (Produktionsausfall möglich)
- externe API (OpenAI) stark involviert ist
- Upload-/Parsing-Pipeline geändert wird (Kernfunktion)
- Sicherheits-/Secret-Handling betroffen ist

### 4.4 Minimales Change-Record Template (für kleine Teams)

- Change-ID:
- Beschreibung:
- Typ: Standard / Normal / Emergency
- Motivation/Ziel:
- Risiko (hoch/mittel/niedrig) + Begründung:
- Impact (wer/was betroffen):
- Rollout-Plan:
- Rollback-Plan:
- Testplan (Smoke/Regression/System/UAT):
- Freigabe (wer/Datum):
- Implementationszeitpunkt:
- Post-Implementation Review (PIR) Ergebnis:

---

## 5. Financial Management (4.1)

### 5.1 Warum Financial Management?

Bei Cloud-Services und KI entstehen laufende Kosten (Tokens, Requests, Hosting). Financial Management hilft:
- Kosten transparent zu machen
- Budgetierung und Steuerung zu ermöglichen
- Wirtschaftlichkeit (TCO/ROI) zu beurteilen

### 5.2 Kosten-Treiber im Projekt

- **OpenAI API Nutzung** (Tokens pro Rechnung)
- **Hosting** (Render: Free Tier vs. Paid)
- **Arbeitszeit** für Support/Fehlerbehebung

### 5.3 TCO/ROI – einfache Schulungsrechnung

Beispielhafte Struktur (ohne exakte Zahlen):

- **Kosten pro Monat**:
  - OpenAI: (Durchschnittskosten pro Rechnung) × (Anzahl Rechnungen)
  - Hosting: Render Plan
  - Support/Engineering: Stunden × Ansatz

- **Nutzen**:
  - eingesparte Prüfzeit pro Rechnung
  - reduzierte Fehlerquote
  - schnellere Durchlaufzeit

> In der Erwachsenenbildung reicht oft eine grobe, transparente Rechnung mit Annahmen.

---

## 6. Supplier Management (4.1)

### 6.1 Zweck

Supplier Management steuert Beziehungen zu externen Lieferanten/Providern.

Im Projekt sind Lieferanten u.a.:
- OpenAI (KI API)
- Render.com (Hosting/Deployment)
- ggf. weiterer LLM Provider als Alternative

### 6.2 Praktische Supplier-Fragen

- Verfügbarkeit/Statusseiten: Gibt es Incidents beim Provider?
- Limits/Policies: Rate Limits, Quotas, Preismodell
- Sicherheit/Compliance: Secret Handling, Datenübertragung
- Exit-Strategie: Wie wechsle ich Provider (Fallback/Abstraktion)?

**Best Practice im Projekt:** Hybrid-Architektur reduziert Vendor Lock-in.

---

## 7. Verbesserungsdimensionen (4.2) – Anwendung auf das Projekt

### 7.1 Technologie

- Modularisierung (Server vs. KI-Modul)
- bessere Fehlerbehandlung
- Testautomatisierung

**Beispiel:** KI-Abstraktionsschicht so gestalten, dass Provider austauschbar sind.

### 7.2 Sicherheit

- Secrets schützen (nie in Git)
- Upload-Härtung (MIME-Check, Limits)
- Logging ohne Sensitive Data

**Beispiel:** `.gitignore` schützt `.env`; Render ENV Variables statt Hardcoding.

### 7.3 Performance

- Upload-/Parsing-Zeit messen
- Timeouts sinnvoll wählen
- Fallbacks für schnelle Antworten

**Beispiel:** Regex-Fallback liefert unter Umständen schneller eine Minimalantwort.

### 7.4 Wirtschaftlichkeit

- Kosten pro Rechnung
- Trade-off: Genauigkeit vs. Kosten
- Wahl des passenden KI-Modells je nach Use Case

**Beispiel:** OpenAI nur, wenn Regex nicht ausreichend – oder umgekehrt.

---

## 8. Aktivitäten für kontinuierliche Verbesserung (4.3)

### 8.1 Reviews

- **Service Review**: Service-Level, Incidents, Verbesserungsitems
- **Post-Incident Review**: Was lernen wir aus P1/P2?
- **Post-Implementation Review (PIR)**: Hat Change das Ziel erreicht?

### 8.2 Kundenfeedback / Nutzerfeedback

- UAT-Feedback (z.B. Verständlichkeit der Ergebnisse)
- Feedback der Lehrgangsteilnehmenden

### 8.3 Kostenvergleichsrechnung

- Vergleiche Szenarien:
  - „OpenAI-only“ vs. „Hybrid (Fallback)“
  - Free Tier vs. Paid Hosting

### 8.4 Benchmarking

- Vergleich zwischen:
  - Provider A vs. Provider B
  - Modell-Varianten
  - Prompt-Versionen

**Achtung:** Benchmarking braucht definierte Testdaten und Bewertungsmethode (z.B. Feldgenauigkeit, Zeit, Kosten).

---

## 9. Praxis: Verbesserungsbacklog für den Rechnungsprüfer

### 9.1 Beispiel-Backlog (Priorisierungsidee)

- BI-01: Testdaten-Set mit 10 repräsentativen PDFs definieren
- BI-02: Smoke-/Regression-Tests automatisieren
- BI-03: Monitoring erweitern (z.B. Responsezeiten pro Endpoint)
- BI-04: Prompt-Versionierung (Prompt-Änderungen nachvollziehbar machen)
- BI-05: Provider-Alternative als Fallback (Cloud) evaluieren

### 9.2 Priorisierungskriterien

- Risiko (Ausfall/Fehlerkosten)
- Nutzerimpact
- Kosten/Benefit
- Aufwand

---

## 10. Übungen (Hands-on)

### Übung 1: Improvement Item definieren

Wähle ein Improvement Item (z.B. „Upload stabilisieren“) und definiere:
- Problem/Opportunity
- Ziel (messbar)
- Metrik/KPI
- geplante Massnahmen
- Risiko/Abhängigkeiten

### Übung 2: Change Record erstellen

Erstelle einen Change Record für:
- „Einführung eines Cloud-Fallbacks für lokale KI“

Muss enthalten:
- Risiko/Impact
- Testplan
- Rollback

### Übung 3: Benchmarking-Plan

Entwirf einen Benchmark:
- Testdaten (mind. 5 PDFs)
- Metriken: Genauigkeit (Felder), Zeit, Kosten
- Entscheidungskriterium (wann ist Alternative „besser“?)

---

## 11. Checklisten

### 11.1 Checkliste: Continual Improvement Meeting (30 Minuten)

- [ ] Top Incidents seit letztem Meeting
- [ ] Status der Improvement Items
- [ ] Neue Feedbacks (UAT/Support)
- [ ] Kosten/Usage (falls relevant)
- [ ] Entscheidungen + Verantwortlichkeiten
- [ ] Nächster Review-Termin

### 11.2 Checkliste: Change Enablement (Normal Change)

- [ ] Change beschrieben und begründet
- [ ] Risiko bewertet
- [ ] Testplan vorhanden
- [ ] Rollback definiert
- [ ] Kommunikationsplan geklärt
- [ ] Post-Deploy Checks definiert

---

## 12. Kurz-Zusammenfassung

- Continual Improvement sorgt für nachhaltige Servicequalität.
- Change Enablement kontrolliert Änderungen und reduziert Risiko.
- Financial Management macht Kosten/Nutzen transparent.
- Supplier Management reduziert Abhängigkeiten und stärkt Resilienz.
- Verbesserungsdimensionen (Technologie, Sicherheit, Performance, Wirtschaftlichkeit) helfen beim strukturierten Vorgehen.

---

## ▶️ Nächstes Modul

Weiter mit: `SCHULUNG_5_Monitoring_Reporting.md`
