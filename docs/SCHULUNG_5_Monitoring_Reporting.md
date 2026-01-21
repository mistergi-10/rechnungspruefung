# Modul 5 – Monitoring, Measurement & Reporting
## Schulung am Praxisbeispiel „Rechnungsprüfer CHF“ (v1.4.0)

**Zielgruppe**: Erwachsenenbildung ICT  
**Dauer**: ca. 2 Lektionen à 45 Minuten  
**Voraussetzungen**: Basisverständnis Betrieb/Support (Module 3–4 hilfreich)

---

## 1. Lernziele (Kompetenzen)

Teilnehmende…

- kennen relevante ITIL-Praktiken (Monitoring and Event Management, Measurement and Reporting, Supplier Management) und können deren Beitrag im IT-Service-Management erläutern.
- kennen Methoden und Techniken zur Verdichtung und Darstellung von Informationen (Datenreduktion, Kennzahlenbildung, Häufigkeitstabellen, Histogramme, Aggregation).
- kennen unterschiedliche Diagrammtypen und können deren Eignung zur Darstellung verschiedener Skalentypen erläutern.
- kennen geeignete Instrumente zur Berichterstattung (Statusberichte, Ampel-Methode, Soll-/Ist-Vergleiche).

---

## 2. Projektkontext: Was wird beim Rechnungsprüfer überwacht?

Der Rechnungsprüfer ist eine Web-App mit:
- **Frontend** (Browser) und **Backend** (Express API)
- externen Abhängigkeiten (**OpenAI API**, **Render.com**)
- variabler Bearbeitungszeit (PDF-Parse + KI)

Typische Fragen im Betrieb:
- Ist der Service online?
- Wie lange dauert `/api/upload`?
- Wie oft kommt es zu Fehlern (4xx/5xx)?
- Welche KI-Quelle ist aktiv (OpenAI/Fallback)?
- Wie zuverlässig ist Parsing/Validierung?

**Im Projekt bereits vorhanden:**
- `/api/health` (HTML)
- `/api/status` (JSON)
- `/status` (HTML Dashboard mit Auto-Refresh)
- Logs im Server und im Render Dashboard

---

## 3. ITIL-Praktiken: Monitoring & Measurement (5.1)

### 3.1 Monitoring and Event Management

**Zweck:**
- Ereignisse erkennen (Events)
- in Alarme/Incidents überführen, wenn Schwellen überschritten sind
- Ursachen schneller eingrenzen

**Beispiele für Events im Projekt:**
- „Service nicht erreichbar“ (HTTP-Fehler)
- „Viele 5xx bei /api/upload“
- „Responsezeiten steigen“
- „OpenAI nicht verfügbar / Timeouts“

### 3.2 Measurement and Reporting

**Zweck:**
- Messungen definieren (was wird gemessen?)
- Kennzahlen bilden (KPIs)
- Trends erkennen und an Stakeholder berichten

**Unterschied Messwert vs. Kennzahl:**
- Messwert: „Upload dauerte 12.4s“
- Kennzahl: „p95 Upload Response Time = 14.8s“

### 3.3 Supplier Management (Bezug)

**Zweck:** Provider-Leistung überwachen und steuern.

**Im Projekt:**
- OpenAI: Verfügbarkeit/Rate Limits/Kosten
- Render: Uptime/Deploy-Fehler/Performance

---

## 4. Von Daten zu Information: Verdichtungstechniken (5.2)

### 4.1 Datenreduktion

Ziel: Viele Rohdaten → wenige aussagekräftige Informationen.

Typische Techniken:
- Filtern (nur Upload-Requests)
- Sampling (z.B. jede 10. Anfrage)
- Aggregation (pro Stunde/Tag)
- Gruppierung nach Kategorien (HTTP-Code, KI-Modus)

### 4.2 Kennzahlenbildung (KPIs)

**KPI-Design Prinzipien:**
- relevant (entscheidungsunterstützend)
- messbar (klarer Messpunkt)
- stabil (vergleichbar über Zeit)
- verständlich (für Zielgruppe)

**KPI-Beispiele am Rechnungsprüfer:**
- Availability (Uptime %)
- Error Rate (5xx Anteil)
- Upload Response Time (p50/p95)
- AI Success Rate (KI vs. Fallback Anteil)
- Deployment Success Rate

### 4.3 Häufigkeitstabellen

Beispiel: Häufigkeit nach HTTP Status Codes (7 Tage)

| Statusklasse | Anzahl | Anteil |
|---|---:|---:|
| 2xx | 980 | 98.0% |
| 4xx | 15 | 1.5% |
| 5xx | 5 | 0.5% |

Nutzen:
- schnelle Übersicht
- Grundlage für Pareto-Analyse

### 4.4 Histogramme

Nutzen:
- Verteilung sichtbar machen (z.B. Responsezeiten)

Beispiel: Upload-Dauer (Sekunden)
- 0–2s: (Regex-Fallback-Fälle)
- 2–8s: (typische OpenAI)
- 8–20s: (Ausreisser)

### 4.5 Aggregation (Zeitbezug)

- pro Minute (Ops)
- pro Stunde (Tagesbetrieb)
- pro Tag/Woche (Management-Reporting)

**Merksatz:** Je „höher“ die Zielgruppe, desto stärker aggregiert.

---

## 5. Diagrammtypen & Skalentypen (5.3)

### 5.1 Skalentypen (kurz)

- **Nominalskala**: Kategorien ohne Reihenfolge (z.B. KI-Modus: OpenAI/Regex)
- **Ordinalskala**: Rangfolge ohne Abstände (z.B. Priorität P1–P4)
- **Intervallskala**: Abstände sinnvoll, kein echter Nullpunkt (z.B. Temperatur °C)
- **Verhältnisskala (Ratio)**: echter Nullpunkt (z.B. Sekunden, Anzahl Requests)

### 5.2 Welche Diagramme wofür?

| Skalentyp | Beispiele im Projekt | Geeignete Diagramme | Warum |
|---|---|---|---|
| Nominal | KI-Modus, HTTP-Klasse | Balken, Kreis (sparsam), Treemap | Kategorien vergleichen |
| Ordinal | Priorität, Risikostufe | Balken, gestapelte Balken | Rangfolge sichtbar |
| Intervall | selten im Projekt | Linie, Balken | Zeitverläufe |
| Ratio | Responsezeit, Requests, Kosten | Linie, Histogramm, Boxplot, Balken | Verteilungen/Trends |

### 5.3 Best Practices (Unterrichtstauglich)

- Linienchart: Trends über Zeit (Uptime, Responsezeiten)
- Balken: Vergleiche (Errors pro Tag, Incidents pro Kategorie)
- Histogramm: Verteilung (Responsezeiten)
- Boxplot: Ausreisser/Quartile (p95 sichtbar machen)
- Kreisdiagramm: nur bei wenigen Kategorien und wenn „Anteile“ wichtig sind

---

## 6. Reporting-Instrumente (5.4)

### 6.1 Statusbericht (Template)

**Zeitraum:** (z.B. Woche 52)  
**Service:** Rechnungsprüfer CHF  

1) **Executive Summary (3 Sätze)**
- Was lief gut?
- Was war kritisch?
- Was ist die nächste Massnahme?

2) **Service-Status (Ampel)**
- Availability
- Performance
- Security
- Supplier/Provider

3) **Top KPIs**
- Uptime
- p95 Upload Response Time
- Error Rate

4) **Incidents & Problems**
- Anzahl P1/P2
- wichtigste Root Causes

5) **Changes/Deployments**
- Deployments, Failures, Rollbacks

6) **Risiken & Massnahmen**

### 6.2 Ampel-Methode (RAG)

**R (Rot):** kritisch, sofortige Massnahme  
**A (Amber/Gelb):** Risiko/Trend, zeitnahe Massnahme  
**G (Grün):** ok, weiter beobachten

Beispiel-Regeln (anpassbar):
- Availability < 99% → Rot
- p95 Upload > 20s → Gelb
- 5xx Rate > 1% → Rot

### 6.3 Soll-/Ist-Vergleich

Beispiel:

| KPI | Soll | Ist | Abweichung | Status | Massnahme |
|---|---:|---:|---:|---|---|
| p95 Upload | ≤ 15s | 18s | +3s | Gelb | Fallback/Timeout prüfen |
| 5xx Rate | ≤ 0.5% | 0.2% | -0.3% | Grün | – |
| Uptime | ≥ 99.5% | 99.9% | +0.4% | Grün | – |

---

## 7. Messpunkte im Projekt: Woher kommen die Daten?

### 7.1 API Status / Health

- `GET /api/status`: Uptime, Environment, Port, AI-Status
- `GET /api/health`: HTML Health
- `GET /status`: Dashboard (intern)

### 7.2 Logs

- Lokale Konsole: Request-Fehler, Parsing-Infos
- Render Logs: Start/Crash/Requests/Fehler nach Deploy

### 7.3 Deployment-Daten

- Render Deploys: Build/Start Erfolg, Dauer

### 7.4 Supplier-Infos

- OpenAI Status/Usage (kosten-/limitbezogene Informationen)
- Render Status (Plattform)

---

## 8. Praxis: Minimal-Monitoring-Set für kleine Services

### 8.1 „Minimum Viable Monitoring“ (MVM)

1. **Liveness**: Service erreichbar? (`/api/health`)
2. **Basic Metrics**: Uptime, Environment (`/api/status`)
3. **Errors**: 5xx sichtbar (Logs)
4. **Deployments**: Erfolg/Fehler sichtbar (Render)

### 8.2 Erweiterung (wenn Zeit)

- Request-Dauer pro Endpoint (p95)
- Anzahl Uploads pro Tag
- Anteil Fallback vs. OpenAI
- Kosten pro Woche (OpenAI Usage)

---

## 9. Übungen (Hands-on)

### Übung 1: KPI-Katalog erstellen

Erstelle 8 KPIs für den Rechnungsprüfer.

Für jeden KPI:
- Definition
- Messquelle
- Frequenz (min/h/tag/woche)
- Zielwert (Soll)

### Übung 2: Diagrammwahl

Wähle passende Diagramme für:
1. Verteilung der Upload-Zeit
2. Anteil der KI-Modi (OpenAI vs. Regex)
3. Fehler pro Tag (5xx)
4. Uptime über 30 Tage

Begründe je 1 Satz.

### Übung 3: Statusbericht (1 Seite)

Erstelle einen Wochenbericht mit:
- Ampel (mind. 4 Kriterien)
- Soll/Ist Tabelle (mind. 3 KPIs)
- 2 Massnahmen

---

## 10. Checklisten

### 10.1 Checkliste: Gute KPIs

- [ ] KPI unterstützt eine Entscheidung
- [ ] Datenquelle ist verfügbar und zuverlässig
- [ ] Definition ist eindeutig
- [ ] Zielwert (Soll) ist sinnvoll
- [ ] KPI ist über Zeit vergleichbar

### 10.2 Checkliste: Gute Visualisierung

- [ ] Diagramm passt zum Skalentyp
- [ ] Achsen/Einheiten sind klar
- [ ] Keine überladenen Charts
- [ ] Ausreisser sichtbar (wenn relevant)
- [ ] Aussage in 10 Sekunden erfassbar

### 10.3 Checkliste: Reporting

- [ ] Zielgruppe klar (Ops vs. Management)
- [ ] Ampel-Regeln transparent
- [ ] Soll/Ist nachvollziehbar
- [ ] Massnahmen mit Owner + Termin
- [ ] Trend/Verlauf enthalten

---

## 11. Kurz-Zusammenfassung

- Monitoring erkennt Events und unterstützt schnelle Reaktion.
- Measurement & Reporting verdichtet Rohdaten zu Kennzahlen.
- Diagrammwahl hängt vom Skalentyp ab (nominal/ordinal/ratio).
- Ampel und Soll/Ist sind pragmatische, verständliche Reporting-Instrumente.

---

## ▶️ Abschluss

Damit sind die 5 Module vollständig. Als nächster Schritt bietet sich an:
- eine kurze „Prüfungs-/Transferaufgabe“ über alle Module
- oder ein kompaktes „Cheat Sheet“ (1 Seite) mit allen Templates/Checklisten.
