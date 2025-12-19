// backend/utils/proxyClient.js
import express from 'express';
import fetch from 'node-fetch'; // si Node < 18 usa node-fetch, si Node >= 18 fetch ya está
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Timeout helper
const timeout = (ms) => new Promise(res => setTimeout(res, ms));

// =======================
// Proxy a Ollama
// =======================
router.post('/ollama', async (req, res) => {
  try {
    const response = await fetch(`${process.env.OLLAMA_URL}/v1/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('❌ Ollama fallback:', err);
    // Fallback simple: devolver texto por defecto
    res.json({ output: 'Ollama no disponible temporalmente.' });
  }
});

// =======================
// Proxy a HuggingFace
// =======================
router.post('/huggingface', async (req, res) => {
  try {
    const response = await fetch(`https://api-inference.huggingface.co/models/${process.env.HUGGINGFACE_MODEL}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HF_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('❌ HuggingFace fallback:', err);
    res.json({ output: 'HuggingFace no disponible temporalmente.' });
  }
});

// =======================
// Proxy a GROQ
// =======================
router.post('/groq', async (req, res) => {
  try {
    const response = await fetch('https://api.groq.ai/v1/queries', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('❌ GROQ fallback:', err);
    res.json({ output: 'GROQ no disponible temporalmente.' });
  }
});

// =======================
// Proxy para streaming mínimo
// =======================
router.post('/stream', async (req, res) => {
  try {
    // Ejemplo básico de streaming: enviar chunks cada 500ms
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');

    const messages = ['Procesando tu solicitud...', 'Generando respuesta...', 'Casi listo...', 'Respuesta final.'];
    for (const msg of messages) {
      res.write(`data: ${msg}\n\n`);
      await timeout(500);
    }
    res.end();
  } catch (err) {
    console.error('❌ Streaming fallback:', err);
    res.json({ output: 'Streaming no disponible.' });
  }
});

export default router;
