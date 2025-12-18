import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

// Helper de proxy
async function proxyRequest(url, req) {
  try {
    const response = await fetch(url, {
      method: req.method,
      headers: { ...req.headers },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined
    });
    return await response.json();
  } catch (err) {
    console.error(`Proxy error for ${url}:`, err);
    throw err;
  }
}

// Proxy Ollama
router.all('/ollama/*', async (req, res) => {
  const localUrl = `http://localhost:11434${req.originalUrl.replace('/api/proxy/ollama', '')}`;
  try {
    const data = await proxyRequest(localUrl, req);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Ollama service not available' });
  }
});

// Proxy HuggingFace
router.all('/huggingface/*', async (req, res) => {
  const localUrl = `http://localhost:5000${req.originalUrl.replace('/api/proxy/huggingface', '')}`;
  try {
    const data = await proxyRequest(localUrl, req);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'HuggingFace service not available' });
  }
});

// Proxy GROQ
router.all('/groq/*', async (req, res) => {
  const localUrl = `http://localhost:6000${req.originalUrl.replace('/api/proxy/groq', '')}`;
  try {
    const data = await proxyRequest(localUrl, req);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'GROQ service not available' });
  }
});

// Proxy streaming si hace falta
router.all('/streaming/*', async (req, res) => {
  const localUrl = `http://localhost:7000${req.originalUrl.replace('/api/proxy/streaming', '')}`;
  try {
    const data = await proxyRequest(localUrl, req);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Streaming service not available' });
  }
});

export default router;
