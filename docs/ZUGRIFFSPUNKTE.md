# Zugriffspunkte & Systeme - Rechnungsprüfer CHF

**Projekt**: Automatisierte Rechnungsprüfung mit Hybrid-KI  
**Version**: 1.4.0  
**Letzte Aktualisierung**: 27. Dezember 2025

---

## 🌐 Produktions-URLs (Render.com)

### Hauptanwendung
- **Frontend/Upload**: `https://[your-service-name].onrender.com/`
- **Status Dashboard**: `https://[your-service-name].onrender.com/status`
- **Health Check**: `https://[your-service-name].onrender.com/api/health`
- **Status API**: `https://[your-service-name].onrender.com/api/status`

### API Endpoints
- **PDF Upload**: `POST https://[your-service-name].onrender.com/api/upload`
- **Manuelle Validation**: `POST https://[your-service-name].onrender.com/api/validate`

> **Hinweis**: Nach Deployment auf Render wird die exakte URL bereitgestellt (Format: `rechnungspruefung-api.onrender.com`)

---

## 💻 Lokale Entwicklung

### Server
- **Frontend**: `http://localhost:3000/`
- **Status Dashboard**: `http://localhost:3000/status`
- **Health Check**: `http://localhost:3000/api/health`
- **Status API**: `http://localhost:3000/api/status`

### API Endpoints
- **PDF Upload**: `POST http://localhost:3000/api/upload`
- **Manuelle Validation**: `POST http://localhost:3000/api/validate`

### Ollama (Optional, nur lokal)
- **Server**: `http://localhost:11434`
- **Health Check**: `http://localhost:11434/api/tags`
- **Start Befehl**: `ollama serve`

---

## 🔑 API Keys & Credentials

### 1. OpenAI API Key

**Wichtig (Security):** API Keys niemals in Dokumentationen oder Git speichern.

**Platzhalter (Beispiel):**
```
sk-proj-REDACTED
```

**Dashboard**: https://platform.openai.com/api-keys  
**Verwendung prüfen**: https://platform.openai.com/usage  
**Modell**: GPT-4o  
**Kosten**: ~$0.01 - $0.05 pro Rechnung

---

### 2. Groq API Key (Optional - Cloud LLM Alternative)

**Dashboard**: https://console.groq.com/keys  
**Modell**: Mixtral 8x7B / Llama 3  
**Kostenlos**: 14.400 Requests/Tag  
**Geschwindigkeit**: Extrem schnell (500+ tokens/s)

**Integration**:
1. Registrieren: https://console.groq.com
2. API Key erstellen
3. In `.env` hinzufügen: `GROQ_API_KEY=gsk-...`

---

## 📦 GitHub Repository

**Repository**: https://github.com/mistergi-10/rechnungspruefung

### Zugriff
- **HTTPS**: `https://github.com/mistergi-10/rechnungspruefung.git`
- **SSH**: `git@github.com:mistergi-10/rechnungspruefung.git`

### Wichtige Branches
- `main` - Production Branch (Auto-Deploy zu Render)

### Wichtige Befehle
```bash
# Status prüfen
git status

# Änderungen committen
git add .
git commit -m "Beschreibung"

# Pushen (triggert Auto-Deploy)
git push origin main

# Remote prüfen
git remote -v
```

---

## ☁️ Render.com Dashboard

**Dashboard**: https://dashboard.render.com

### Deployment Setup

1. **Neuer Web Service**:
   - **Blueprint**: Automatisch via `render.yaml`
   - **Repository**: `mistergi-10/rechnungspruefung`
   - **Branch**: `main`

2. **Konfiguration**:
   - **Name**: `rechnungspruefung-api`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Plan**: `Free`

3. **Environment Variables** (im Dashboard setzen):
   ```
   NODE_ENV = production
   OPENAI_API_KEY = sk-proj-REDACTED
   PORT = 3000
   ```

4. **Optional - Groq Fallback**:
   ```
   GROQ_API_KEY = gsk-...
   ```

### Monitoring auf Render
- **Logs**: Dashboard → Service → Logs Tab
- **Metrics**: Dashboard → Service → Metrics Tab
- **Deploys**: Dashboard → Service → Deploys Tab

---

## 🛠️ Entwicklungstools

### VS Code (lokal)
- **Workspace**: `/Users/davidgianini/Library/Mobile Documents/com~apple~CloudDocs/Gianini IT Consulting/Unterricht WSF/WSF/650 IT-Servicebetrieb überwachen und verbessern/Rechnungspruefung_V2`

### Node.js
- **Version prüfen**: `node --version`
- **npm Version**: `npm --version`

### Ollama (nur lokal)
- **Installation**: https://ollama.ai/download
- **Starten**: `ollama serve`
- **Modell pullen**: `ollama pull mistral`
- **Modelle anzeigen**: `ollama list`

---

## 📋 Konfigurationsdateien

### `.env` (lokal, NICHT in Git)
```bash
PORT=3000
NODE_ENV=development
OPENAI_API_KEY=sk-proj-REDACTED
# GROQ_API_KEY=gsk-... (optional)
```

### `.env.example` (in Git, Template)
```bash
PORT=3000
NODE_ENV=development
OPENAI_API_KEY=sk-your-key-here
# GROQ_API_KEY=gsk-your-key-here
```

---

## 🔐 Sicherheit & Best Practices

### API Keys schützen
✅ **RICHTIG**:
- `.env` Datei lokal (in `.gitignore`)
- Environment Variables auf Render.com
- Keine Keys in Code hardcoden

❌ **FALSCH**:
- Keys in Git committen
- Keys in öffentlichen Repos
- Keys in Logs ausgeben

### .gitignore Einträge
```
.env
node_modules/
*.log
.DS_Store
```

---

## 📊 Monitoring & Status

### Render.com Logs live ansehen
```bash
# Render CLI installieren (optional)
npm install -g render-cli

# Login
render login

# Logs streamen
render logs -s rechnungspruefung-api
```

### Status Endpoints
| Endpoint | Typ | Verwendung |
|----------|-----|------------|
| `/api/health` | HTML | Visueller Health Check |
| `/api/status` | JSON | Programmatischer Status |
| `/status` | HTML | Dashboard mit Metriken |

---

## 🧪 Testing

### Lokaler Test
```bash
# Server starten
npm start

# In neuem Terminal
curl http://localhost:3000/api/status

# PDF Upload testen
curl -X POST http://localhost:3000/api/upload \
  -F "pdf=@test-rechnung.pdf"
```

### Production Test (nach Deployment)
```bash
# Health Check
curl https://[your-service].onrender.com/api/health

# Status API
curl https://[your-service].onrender.com/api/status
```

---

## 🚀 Deployment Workflow

### 1. Lokale Entwicklung
```bash
cd "/Users/davidgianini/Library/Mobile Documents/com~apple~CloudDocs/Gianini IT Consulting/Unterricht WSF/WSF/650 IT-Servicebetrieb überwachen und verbessern/Rechnungspruefung_V2"

# Server starten
npm start

# Testen auf http://localhost:3000
```

### 2. Git Commit & Push
```bash
# Status prüfen
git status

# Änderungen stagen
git add .

# Committen
git commit -m "Feature: Beschreibung"

# Pushen (triggert Auto-Deploy)
git push origin main
```

### 3. Render Auto-Deploy
- Render erkennt Push automatisch
- Build startet: `npm install`
- Deployment: `node server.js`
- Live in ~2-3 Minuten

---

## 🆘 Troubleshooting

### Server startet nicht lokal
```bash
# Port bereits belegt?
lsof -i :3000
kill -9 [PID]

# Dependencies installieren
npm install

# .env vorhanden?
cat .env | grep OPENAI_API_KEY
```

### Git Push funktioniert nicht
```bash
# SSH Key prüfen
ssh -T git@github.com

# Remote prüfen
git remote -v

# Sollte sein: git@github.com:mistergi-10/rechnungspruefung.git
```

### Render Deployment schlägt fehl
1. **Logs prüfen**: Dashboard → Service → Logs
2. **Environment Variables prüfen**: `OPENAI_API_KEY` gesetzt?
3. **Build Command**: `npm install` korrekt?
4. **Start Command**: `node server.js` korrekt?

---

## 📞 Support & Dokumentation

### Externe Dienste

**OpenAI**:
- Dokumentation: https://platform.openai.com/docs
- Status: https://status.openai.com
- Support: https://help.openai.com

**Groq** (optional):
- Dokumentation: https://console.groq.com/docs
- Playground: https://console.groq.com/playground

**Render.com**:
- Dokumentation: https://render.com/docs
- Status: https://status.render.com
- Community: https://community.render.com

**GitHub**:
- Docs: https://docs.github.com
- Status: https://www.githubstatus.com

---

## 📝 Checkliste: Erstes Deployment

- [ ] Git Repository auf GitHub erstellt
- [ ] Lokaler Server läuft (`npm start`)
- [ ] `.gitignore` enthält `.env` und `node_modules/`
- [ ] Code zu GitHub gepusht
- [ ] Render.com Account erstellt
- [ ] Web Service auf Render angelegt
- [ ] Repository mit Render verbunden
- [ ] Environment Variables gesetzt (OPENAI_API_KEY)
- [ ] Deployment erfolgreich
- [ ] Production URL funktioniert
- [ ] Status Dashboard erreichbar
- [ ] PDF Upload getestet

---

## 🔄 Regelmäßige Wartung

### Wöchentlich
- [ ] OpenAI Usage prüfen (Kosten)
- [ ] Render Logs prüfen (Fehler)
- [ ] Health Check Status prüfen

### Monatlich
- [ ] npm Dependencies updaten (`npm outdated`)
- [ ] API Keys rotieren (Sicherheit)
- [ ] Performance-Metriken prüfen

### Bei Bedarf
- [ ] Neue Features deployen
- [ ] Bug Fixes implementieren
- [ ] Dokumentation aktualisieren

---

**Maintainer**: David Gianini  
**Repository**: https://github.com/mistergi-10/rechnungspruefung  
**Version**: 1.4.0
