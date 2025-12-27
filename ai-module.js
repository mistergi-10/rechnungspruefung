/**
 * AI Module - Hybrid System
 * Fallback-Hierarchie: OpenAI → Ollama (lokal) → Regex
 */

const http = require('http');

// Globale KI-Verfügbarkeit
let openaiAvailable = false;
let ollamaAvailable = false;
let openai = null;

// OpenAI Initialisierung
function initOpenAI() {
  try {
    if (process.env.OPENAI_API_KEY) {
      const OpenAI = require('openai');
      openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        timeout: 30000
      });
      openaiAvailable = true;
      console.log('✅ OpenAI Client initialisiert');
      return true;
    }
  } catch (e) {
    console.warn('⚠️ OpenAI nicht verfügbar:', e.message);
  }
  return false;
}

// Ollama Verfügbarkeit prüfen
async function checkOllamaAvailability() {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 11434,
      path: '/api/tags',
      method: 'GET',
      timeout: 2000
    };

    const req = http.request(options, (res) => {
      if (res.statusCode === 200) {
        console.log('✅ Ollama (lokal) verfügbar - Apple Silicon GPU wird genutzt');
        ollamaAvailable = true;
        resolve(true);
      } else {
        resolve(false);
      }
    });

    req.on('error', () => {
      resolve(false);
    });

    req.end();
  });
}

// Ollama API aufrufen
async function callOllama(prompt, model = 'mistral') {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      model: model,
      prompt: prompt,
      stream: false
    });

    const options = {
      hostname: 'localhost',
      port: 11434,
      path: '/api/generate',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      },
      timeout: 60000
    };

    const req = http.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve(parsed.response || '');
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Ollama Timeout'));
    });

    req.write(data);
    req.end();
  });
}

// Hybrid Invoice Parsing
async function parseInvoiceHybrid(pdfText) {
  console.log('🤖 Starte Invoice-Parsing (Hybrid-Modus)...');

  const prompt = `Du bist ein präziser Rechnungs-Parser. Extrahiere aus diesem Rechnungstext EXAKT folgende Daten als JSON:

RECHNUNGSTEXT:
${pdfText}

Antworte NUR mit gültigem JSON (keine weiteren Erklärungen):
{
  "rechnungsnummer": "Rechnungsnummer oder null",
  "datum": "Datum in Format dd.mm.yyyy oder null",
  "lieferant": "Name des Lieferanten oder null",
  "empfaenger": "Name des Empfängers oder null",
  "summeNetto": 0.00,
  "summeMwSt": 0.00,
  "summeBrutto": 0.00,
  "mwstSatz": 19
}`;

  // 1. Versuche OpenAI
  if (openaiAvailable && openai) {
    try {
      console.log('🔄 Versuche OpenAI API...');
      const message = await Promise.race([
        openai.chat.completions.create({
          model: 'gpt-4o',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 500
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 25000))
      ]);

      const responseText = message.choices[0].message.content;
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);

      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        console.log('✅ OpenAI erfolgreich - gpt-4o');
        return {
          ...parsed,
          aiEngine: 'OpenAI GPT-4o',
          summeNetto: parseFloat(parsed.summeNetto) || null,
          summeMwSt: parseFloat(parsed.summeMwSt) || null,
          summeBrutto: parseFloat(parsed.summeBrutto) || null,
          mwstSatz: parseInt(parsed.mwstSatz) || 19
        };
      }
    } catch (error) {
      console.warn('⚠️ OpenAI fehlgeschlagen:', error.message);
    }
  }

  // 2. Fallback auf Ollama (lokal)
  if (ollamaAvailable) {
    try {
      console.log('🔄 Versuche Ollama (lokal, Apple Silicon)...');
      const response = await callOllama(prompt, 'mistral');

      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        console.log('✅ Ollama erfolgreich - Mistral (lokal)');
        return {
          ...parsed,
          aiEngine: 'Ollama Mistral (Apple Silicon)',
          summeNetto: parseFloat(parsed.summeNetto) || null,
          summeMwSt: parseFloat(parsed.summeMwSt) || null,
          summeBrutto: parseFloat(parsed.summeBrutto) || null,
          mwstSatz: parseInt(parsed.mwstSatz) || 19
        };
      }
    } catch (error) {
      console.warn('⚠️ Ollama fehlgeschlagen:', error.message);
    }
  }

  // 3. Regex Fallback
  console.log('⚠️ KI-Systeme nicht verfügbar, Regex-Fallback wird verwendet');
  return null;
}

// Hybrid QR-Code Parsing
async function parseQRCodeHybrid(qrCodeText) {
  console.log('🤖 Starte QR-Code-Parsing (Hybrid-Modus)...');

  const prompt = `Du bist ein Experte für Schweizer QR-Codes und IBANs. Parsiere diesen QR-Code/IBAN Text:

TEXT:
${qrCodeText.substring(0, 1000)}

Antworte als JSON:
{
  "iban": "IBAN oder null",
  "betrag": 0.00,
  "glaeubiger": "Name oder null",
  "referenz": "Referenz oder null",
  "beschreibung": "Text oder null"
}`;

  // 1. Versuche OpenAI
  if (openaiAvailable && openai) {
    try {
      console.log('🔄 Versuche OpenAI API (QR-Code)...');
      const message = await Promise.race([
        openai.chat.completions.create({
          model: 'gpt-4o',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 300
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 15000))
      ]);

      const responseText = message.choices[0].message.content;
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);

      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        console.log('✅ OpenAI QR-Code erfolgreich');
        return { ...parsed, aiEngine: 'OpenAI GPT-4o' };
      }
    } catch (error) {
      console.warn('⚠️ OpenAI QR-Code fehlgeschlagen:', error.message);
    }
  }

  // 2. Fallback auf Ollama (lokal)
  if (ollamaAvailable) {
    try {
      console.log('🔄 Versuche Ollama QR-Code-Parsing...');
      const response = await callOllama(prompt, 'mistral');

      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        console.log('✅ Ollama QR-Code erfolgreich');
        return { ...parsed, aiEngine: 'Ollama Mistral' };
      }
    } catch (error) {
      console.warn('⚠️ Ollama QR-Code fehlgeschlagen:', error.message);
    }
  }

  console.log('⚠️ QR-Code Parsing nicht möglich');
  return null;
}

// Status anzeigen
function getAIStatus() {
  return {
    openai: openaiAvailable ? 'Verfügbar (Cloud)' : 'Nicht verfügbar',
    ollama: ollamaAvailable ? 'Verfügbar (Apple Silicon lokal)' : 'Nicht verfügbar',
    fallback: 'Regex (immer verfügbar)',
    activeMode: openaiAvailable ? 'OpenAI (primär)' : ollamaAvailable ? 'Ollama (lokal)' : 'Regex (Fallback)'
  };
}

module.exports = {
  initOpenAI,
  checkOllamaAvailability,
  parseInvoiceHybrid,
  parseQRCodeHybrid,
  getAIStatus
};
