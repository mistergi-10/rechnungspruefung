require('dotenv').config();
console.log('📌 .env konfiguriert');

const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const aiModule = require('./ai-module');

// AI-Hybrid-System initialisieren
console.log('📌 AI-Hybrid-System wird initialisiert...');
aiModule.initOpenAI();
aiModule.checkOllamaAvailability().then(() => {
  console.log('📌 KI-Verfügbarkeit geprüft:', aiModule.getAIStatus());
});

const app = express();
const PORT = process.env.PORT || 3000;
console.log('📌 Express App erstellt');

// Middleware
console.log('📌 CORS wird hinzugefügt...');
app.use(cors());
console.log('📌 Bodyparser wird hinzugefügt...');
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
console.log('📌 Static files werden hinzugefügt...');
app.use(express.static('public'));
console.log('📌 Middleware konfiguriert');

// Multer Konfiguration für PDF-Upload
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Nur PDF-Dateien sind erlaubt'), false);
    }
  }
});

console.log('📌 Multer konfiguriert');

// Hilfsfunktion zum Extrahieren von Zahlen aus Text
function extractNumbers(text) {
  const matches = text.match(/\d+[.,]\d{2}/g) || [];
  return matches.map(m => parseFloat(m.replace(',', '.')));
}

// Invoice Parsing mit Hybrid-System
async function parseInvoiceWithAI(pdfText) {
  try {
    return await aiModule.parseInvoiceHybrid(pdfText);
  } catch (error) {
    console.error('⚠️ Invoice Hybrid Parsing Fehler:', error.message);
    return null;
  }
}

// QR-Code Parsing mit Hybrid-System
async function parseQRCodeWithAI(qrCodeText) {
  try {
    return await aiModule.parseQRCodeHybrid(qrCodeText);
  } catch (error) {
    console.error('⚠️ QR-Code Hybrid Parsing Fehler:', error.message);
    return null;
  }
}

// QR-Code Daten aus Text extrahieren
function extractQRCodeFromText(text) {
  const qrPatterns = [
    /SPC\/[\dA-Za-z\s\/\.\-,\n]*/g,
    /CH\d{2}\s?[\dA-Z]{1,30}/g,
    /(?:https?:\/\/[^\s]+)/gi
  ];
  
  for (const pattern of qrPatterns) {
    const match = text.match(pattern);
    if (match && match[0]) {
      console.log('🔍 QR-Code Daten gefunden (Regex)');
      return match[0].trim();
    }
  }
  return null;
}

// Fallback Parsing mit Regex
function parseInvoiceText(text) {
  const lines = text.split('\n');
  
  const invoice = {
    rechnungsnummer: null,
    datum: null,
    lieferant: null,
    empfaenger: null,
    positionen: [],
    summeNetto: null,
    summeMwSt: null,
    summeBrutto: null,
    mwstSatz: 19
  };

  const rnMatch = text.match(/(?:Rechnungs?nr\.?|Rechnungs?nummer|Invoice\s?No\.?|RN)[:\s]+([A-Z0-9-\/]+)/i);
  if (rnMatch) invoice.rechnungsnummer = rnMatch[1].trim();

  const dateMatch = text.match(/(?:Datum|Date|Rechnungs?datum)[:\s]+(\d{1,2}[./-]\d{1,2}[./-]\d{4})/i) || 
                    text.match(/(\d{1,2}[./-]\d{1,2}[./-]\d{4})/);
  if (dateMatch) invoice.datum = dateMatch[1];

  const nettoMatch = text.match(/(?:Netto|Subtotal|Summe\s+Netto|Net)[:\s]+([0-9]+[.,][0-9]{2})/i);
  if (nettoMatch) invoice.summeNetto = parseFloat(nettoMatch[1].replace(',', '.'));

  const mwstMatch = text.match(/(?:MwSt|VAT|Mehrwertsteuer|Steuerbetrag|Tax)[:\s]+([0-9]+[.,][0-9]{2})/i);
  if (mwstMatch) invoice.summeMwSt = parseFloat(mwstMatch[1].replace(',', '.'));

  const bruttoMatch = text.match(/(?:Brutto|Total|Gesamtbetrag|Grand\s+Total|Amount\s+Due)[:\s]+([0-9]+[.,][0-9]{2})/i);
  if (bruttoMatch) invoice.summeBrutto = parseFloat(bruttoMatch[1].replace(',', '.'));

  if (!invoice.summeNetto || !invoice.summeMwSt || !invoice.summeBrutto) {
    const allNumbers = extractNumbers(text);
    if (allNumbers.length >= 3) {
      if (!invoice.summeNetto) invoice.summeNetto = allNumbers[allNumbers.length - 3];
      if (!invoice.summeMwSt) invoice.summeMwSt = allNumbers[allNumbers.length - 2];
      if (!invoice.summeBrutto) invoice.summeBrutto = allNumbers[allNumbers.length - 1];
    }
  }

  const mwstRateMatch = text.match(/(?:MwSt-?Satz|VAT\s+Rate|Steuersatz)[:\s]+(\d{1,2})\s*%/i);
  if (mwstRateMatch) invoice.mwstSatz = parseInt(mwstRateMatch[1]);

  return invoice;
}

// Rechnungsprüfung durchführen
function validateInvoice(invoice) {
  const errors = [];
  const warnings = [];
  const checks = [];

  if (!invoice.rechnungsnummer) {
    errors.push('Rechnungsnummer nicht gefunden');
  } else {
    checks.push({ check: 'Rechnungsnummer', status: 'OK', value: invoice.rechnungsnummer });
  }

  if (!invoice.datum) {
    errors.push('Rechnungsdatum nicht gefunden');
  } else {
    checks.push({ check: 'Rechnungsdatum', status: 'OK', value: invoice.datum });
  }

  if (invoice.summeNetto && invoice.summeMwSt && invoice.summeBrutto) {
    checks.push({ check: 'Summe Netto erkannt', status: 'OK', value: `CHF ${invoice.summeNetto.toFixed(2).replace('.', ',')}` });
    checks.push({ check: 'Summe MwSt erkannt', status: 'OK', value: `CHF ${invoice.summeMwSt.toFixed(2).replace('.', ',')}` });
    checks.push({ check: 'Summe Brutto erkannt', status: 'OK', value: `CHF ${invoice.summeBrutto.toFixed(2).replace('.', ',')}` });

    const calculatedMwStRate = (invoice.summeMwSt / invoice.summeNetto) * 100;
    checks.push({ 
      check: 'MwSt-Satz', 
      status: 'OK', 
      value: `${calculatedMwStRate.toFixed(2)}%` 
    });

    const calculatedBrutto = invoice.summeNetto + invoice.summeMwSt;
    const difference = Math.abs(calculatedBrutto - invoice.summeBrutto);
    
    if (difference > 0.01) {
      errors.push(`Summenprüfung fehlgeschlagen: Netto (CHF ${invoice.summeNetto.toFixed(2).replace('.', ',')}) + MwSt (CHF ${invoice.summeMwSt.toFixed(2).replace('.', ',')}) = CHF ${calculatedBrutto.toFixed(2).replace('.', ',')}, aber Brutto = CHF ${invoice.summeBrutto.toFixed(2).replace('.', ',')} (Differenz: CHF ${difference.toFixed(2).replace('.', ',')})`);
    } else {
      checks.push({ check: 'Summenprüfung (Netto+MwSt=Brutto)', status: 'OK', value: '✓ Korrekt' });
    }
  } else {
    warnings.push('Nicht alle Summenfelder konnten erkannt werden');
  }

  if (!invoice.rechnungsnummer || invoice.rechnungsnummer.length < 2) {
    errors.push('Rechnungsnummer ungültig oder zu kurz');
  }

  if (invoice.summeNetto && invoice.summeBrutto && invoice.summeNetto > invoice.summeBrutto) {
    errors.push('Logik-Fehler: Nettosumme darf nicht größer als Bruttosumme sein');
  }

  return {
    errors,
    warnings,
    checks,
    isValid: errors.length === 0
  };
}

// API Endpoints

// PDF hochladen und parsen
app.post('/api/upload', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Keine PDF-Datei hochgeladen' });
    }

    const data = await pdfParse(req.file.buffer);
    const text = data.text;
    
    const pdfBase64 = req.file.buffer.toString('base64');
    const qrCodeData = extractQRCodeFromText(text);
    
    let qrCodeParsed = null;
    if (qrCodeData) {
      qrCodeParsed = await parseQRCodeWithAI(qrCodeData);
    }

    let invoice = await parseInvoiceWithAI(text);
    
    if (!invoice) {
      console.log('⚠️ AI-Parsing fehlgeschlagen, verwende Regex-Fallback...');
      invoice = parseInvoiceText(text);
    } else {
      console.log('🤖 Erfolgreich mit KI-System geparst!');
    }
    
    if (qrCodeData) {
      invoice.qrCode = qrCodeData;
    }
    if (qrCodeParsed) {
      invoice.qrCodeParsed = qrCodeParsed;
    }

    const validation = validateInvoice(invoice);

    res.json({
      success: true,
      filename: req.file.originalname,
      pdfBase64: pdfBase64,
      pdfText: text.substring(0, 1000),
      invoice,
      validation
    });
  } catch (error) {
    console.error('Fehler beim PDF-Parsing:', error);
    res.status(500).json({ 
      error: 'Fehler beim Verarbeiten der PDF-Datei',
      details: error.message 
    });
  }
});

// Manuelle Rechnungsprüfung
app.post('/api/validate', (req, res) => {
  try {
    const invoice = req.body;

    if (!invoice.rechnungsnummer || !invoice.summeNetto || !invoice.summeBrutto) {
      return res.status(400).json({ 
        error: 'Erforderliche Felder fehlen: rechnungsnummer, summeNetto, summeBrutto' 
      });
    }

    invoice.summeNetto = parseFloat(invoice.summeNetto);
    invoice.summeMwSt = parseFloat(invoice.summeMwSt || 0);
    invoice.summeBrutto = parseFloat(invoice.summeBrutto);

    const validation = validateInvoice(invoice);

    res.json({
      success: true,
      invoice,
      validation
    });
  } catch (error) {
    console.error('Fehler bei der Validierung:', error);
    res.status(500).json({ 
      error: 'Fehler bei der Validierung',
      details: error.message 
    });
  }
});

// Health Check
app.get('/api/health', (req, res) => {
  const html = `<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rechnungsprüfer CHF - Health Check</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #28a745 0%, #1e7e34 100%);
            min-height: 100vh;
            padding: 40px 20px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .container {
            background: white;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            max-width: 600px;
            width: 100%;
            padding: 40px;
        }
        header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 3px solid #28a745;
            padding-bottom: 20px;
        }
        h1 { color: #333; font-size: 2em; margin-bottom: 10px; }
        .status-badge {
            display: inline-block;
            background: #28a745;
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: 600;
            font-size: 0.9em;
        }
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 30px;
        }
        .info-card {
            background: #f8f9fa;
            border-left: 4px solid #28a745;
            padding: 15px;
            border-radius: 6px;
        }
        .info-label {
            color: #666;
            font-size: 0.85em;
            font-weight: 600;
            text-transform: uppercase;
            margin-bottom: 5px;
        }
        .info-value {
            color: #333;
            font-size: 1.1em;
            font-weight: 700;
            word-break: break-all;
        }
        .features {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 20px;
        }
        .features h3 { color: #333; margin-bottom: 15px; font-size: 1.1em; }
        .feature-list {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
        }
        .feature-item {
            background: white;
            padding: 12px;
            border-radius: 6px;
            border-left: 4px solid #28a745;
            font-size: 0.9em;
            color: #333;
            text-align: center;
        }
        .feature-item::before {
            content: '✓ ';
            color: #28a745;
            font-weight: 700;
        }
        .indicator {
            display: inline-block;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: #28a745;
            margin-right: 6px;
            animation: pulse 2s infinite;
        }
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
        @media (max-width: 600px) {
            .container { padding: 20px; }
            h1 { font-size: 1.5em; }
            .info-grid { grid-template-columns: 1fr; }
            .feature-list { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>🏥 Health Check</h1>
            <div class="status-badge">
                <span class="indicator"></span>System Online
            </div>
        </header>
        
        <div class="info-grid">
            <div class="info-card">
                <div class="info-label">Service</div>
                <div class="info-value">Rechnungsprüfer CHF</div>
            </div>
            
            <div class="info-card">
                <div class="info-label">Version</div>
                <div class="info-value">1.1.0</div>
            </div>
            
            <div class="info-card">
                <div class="info-label">Status</div>
                <div class="info-value">✓ OK</div>
            </div>
            
            <div class="info-card">
                <div class="info-label">Zeitstempel</div>
                <div class="info-value" id="timestamp">${new Date().toLocaleString('de-CH')}</div>
            </div>
        </div>
        
        <div class="features">
            <h3>🚀 Module & Features</h3>
            <div class="feature-list">
                <div class="feature-item">PDF-Upload & Parsing</div>
                <div class="feature-item">OpenAI GPT-4o</div>
                <div class="feature-item">Ollama (Apple Silicon)</div>
                <div class="feature-item">QR-Code Extraction</div>
                <div class="feature-item">Invoice Validation</div>
                <div class="feature-item">Regex Fallback</div>
                <div class="feature-item">Hybrid-KI-System</div>
                <div class="feature-item">JSON-REST-API</div>
            </div>
        </div>
    </div>
    
    <script>
        setInterval(() => {
            const now = new Date();
            document.getElementById('timestamp').textContent = now.toLocaleString('de-CH');
        }, 1000);
    </script>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(html);
});

// Status-Website mit HTML
app.get('/status', (req, res) => {
  const uptime = process.uptime();
  const hours = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);
  
  const aiStatus = aiModule.getAIStatus();
  
  const html = `<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rechnungsprüfer CHF - Status</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 40px 20px;
        }
        .container {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            overflow: hidden;
        }
        header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px 20px;
            text-align: center;
        }
        header h1 { font-size: 2em; margin-bottom: 10px; }
        header p { font-size: 1.1em; opacity: 0.9; }
        main { padding: 40px; }
        .status-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .status-card {
            background: #f8f9fa;
            border: 2px solid #e9ecef;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
        }
        .status-card.online { border-color: #28a745; background: #f0f8f0; }
        .status-label {
            color: #666;
            font-size: 0.9em;
            font-weight: 600;
            text-transform: uppercase;
            margin-bottom: 8px;
        }
        .status-value {
            color: #333;
            font-size: 1.5em;
            font-weight: 700;
        }
        .status-indicator {
            display: inline-block;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: #28a745;
            margin-right: 8px;
            animation: pulse 2s infinite;
        }
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
        .modules { background: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 20px; }
        .modules h3 { color: #333; margin-bottom: 15px; font-size: 1.1em; }
        .module-list {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
        }
        .module-item {
            background: white;
            padding: 15px;
            border-radius: 6px;
            border-left: 4px solid #667eea;
        }
        .module-item h4 { color: #333; margin-bottom: 5px; font-size: 0.95em; }
        .module-item p { color: #666; font-size: 0.85em; }
        .ai-status {
            background: white;
            padding: 15px;
            border-radius: 6px;
            border-left: 4px solid #764ba2;
        }
        .ai-status h4 { color: #333; margin-bottom: 10px; }
        .status-item {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #e9ecef;
        }
        .status-item:last-child { border-bottom: none; }
        .status-key { color: #666; font-weight: 600; }
        .status-badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.85em;
            font-weight: 600;
        }
        .status-badge.available { background: #d4edda; color: #155724; }
        .status-badge.unavailable { background: #f8d7da; color: #721c24; }
        .refresh-info {
            text-align: center;
            color: #999;
            font-size: 0.85em;
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #eee;
        }
        @media (max-width: 600px) {
            main { padding: 20px; }
            .status-grid { grid-template-columns: 1fr; }
            .module-list { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>🚀 Rechnungsprüfer CHF - Status</h1>
            <p>Echtzeit Überwachung</p>
        </header>
        
        <main>
            <div class="status-grid">
                <div class="status-card online">
                    <div class="status-label">
                        <span class="status-indicator"></span>Status
                    </div>
                    <div class="status-value">Online</div>
                </div>
                
                <div class="status-card">
                    <div class="status-label">Version</div>
                    <div class="status-value">1.1.0</div>
                </div>
                
                <div class="status-card">
                    <div class="status-label">Uptime</div>
                    <div class="status-value" id="uptime">${hours}h ${minutes}m ${seconds}s</div>
                </div>
                
                <div class="status-card">
                    <div class="status-label">Letzter Check</div>
                    <div class="status-value" id="lastCheck">Jetzt</div>
                </div>
            </div>
            
            <div class="modules">
                <h3>🔧 Module</h3>
                <div class="module-list">
                    <div class="module-item">
                        <h4>📄 PDF-Processing</h4>
                        <p>PDF-Extraktion und Analyse</p>
                    </div>
                    <div class="module-item">
                        <h4>🤖 Hybrid-KI</h4>
                        <p>OpenAI + Ollama + Regex</p>
                    </div>
                    <div class="module-item">
                        <h4>🔲 QR-Code</h4>
                        <p>Erkennung und Parsing</p>
                    </div>
                    <div class="module-item">
                        <h4>✓ Validation</h4>
                        <p>Automatische Prüfung</p>
                    </div>
                </div>
            </div>

            <div class="modules">
                <h3>⚙️ KI-System Status</h3>
                <div class="ai-status">
                    <div class="status-item">
                        <span class="status-key">OpenAI API:</span>
                        <span class="status-badge ${aiStatus.openai.includes('Verfügbar') ? 'available' : 'unavailable'}">${aiStatus.openai}</span>
                    </div>
                    <div class="status-item">
                        <span class="status-key">Ollama (lokal):</span>
                        <span class="status-badge ${aiStatus.ollama.includes('Verfügbar') ? 'available' : 'unavailable'}">${aiStatus.ollama}</span>
                    </div>
                    <div class="status-item">
                        <span class="status-key">Regex Fallback:</span>
                        <span class="status-badge available">${aiStatus.fallback}</span>
                    </div>
                    <div class="status-item">
                        <span class="status-key">Aktiver Modus:</span>
                        <span style="color: #333; font-weight: 600;">${aiStatus.activeMode}</span>
                    </div>
                </div>
            </div>

            <div class="refresh-info">
                <p>Diese Seite wird alle 30 Sekunden aktualisiert</p>
                <p><a href="/status" style="color: #667eea; text-decoration: none;">🔄 Jetzt aktualisieren</a></p>
            </div>
        </main>
    </div>
    
    <script>
        setInterval(() => {
            fetch('/api/status')
                .then(res => res.json())
                .then(data => {
                    const uptime = data.uptimeSeconds;
                    const hours = Math.floor(uptime / 3600);
                    const minutes = Math.floor((uptime % 3600) / 60);
                    const seconds = Math.floor(uptime % 60);
                    
                    document.getElementById('uptime').textContent = 
                        hours + 'h ' + minutes + 'm ' + seconds + 's';
                    
                    const now = new Date();
                    document.getElementById('lastCheck').textContent = 
                        now.toLocaleTimeString('de-CH');
                })
                .catch(err => console.error('Status Update Fehler:', err));
        }, 30000);
    </script>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(html);
});

// API Status
app.get('/api/status', (req, res) => {
  const uptime = process.uptime();
  const hours = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);
  
  const aiStatus = aiModule.getAIStatus();
  
  res.json({ 
    application: 'Rechnungsprüfer CHF',
    version: '1.1.0',
    status: 'online',
    uptime: `${hours}h ${minutes}m ${seconds}s`,
    uptimeSeconds: uptime,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    port: PORT,
    modules: {
      aiHybrid: {
        enabled: true,
        description: 'OpenAI + Ollama Fallback + Regex',
        openai: aiStatus.openai,
        ollama: aiStatus.ollama,
        fallback: aiStatus.fallback,
        activeMode: aiStatus.activeMode
      },
      pdfProcessing: {
        enabled: true,
        description: 'PDF-Extraktion und -Analyse'
      },
      qrCodeExtraction: {
        enabled: true,
        description: 'QR-Code Erkennung und Parsing'
      },
      invoiceValidation: {
        enabled: true,
        description: 'Automatische Rechnungsprüfung'
      }
    },
    endpoints: {
      upload: 'POST /api/upload',
      validate: 'POST /api/validate',
      health: 'GET /api/health',
      status: 'GET /api/status'
    }
  });
});

// Server starten
console.log('📌 Server wird gestartet...');
app.listen(PORT, () => {
  console.log(`🚀 Rechnungsprüfer läuft auf http://localhost:${PORT}`);
  console.log(`📄 PDF-Upload: POST /api/upload`);
  console.log(`✓ Manuelle Validierung: POST /api/validate`);
  console.log(`🔍 Status: GET /api/status`);
});

module.exports = app;
