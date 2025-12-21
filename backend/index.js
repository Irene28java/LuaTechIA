import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";
import cors from "cors";
import fetch from "node-fetch"; // Para Ollama

// Routers
import googleRouter from "./routes/googleAuth.js";
import chatRouter from "./routes/chat.js";
import aiRouter from "./routes/ai.js";
import activitiesRouter from "./routes/activities.js";
import downloadsRouter from "./routes/downloads.js";
import paymentsRouter from "./routes/payments.js";

// Proxy
import proxyClient from "./utils/proxyClient.js";

// Middlewares
import { authenticate } from "./middlewares/authenticate.js";
import { validateEnv } from "./lib/validateEnv.js";

dotenv.config();
validateEnv();

// --- Supabase client ---
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY,
  { auth: { persistSession: false } }
);

const app = express();
app.use(express.json());

// --- CORS ---
app.use(cors({
  origin: [
    "http://localhost:3000", 
    process.env.FRONTEND_URL || "https://luatechia.onrender.com"
  ],
  credentials: true
}));

// --- Proxy routes ---
app.use("/api/proxy", proxyClient);

// --- Health check ---
app.get("/health", (req, res) => res.send("LuaTechIA Backend OK"));

// --- Public routes ---
app.use("/auth/google", googleRouter);
app.use("/downloads", downloadsRouter);
app.use("/payments", paymentsRouter);

// --- Protected routes ---
app.use("/chat", authenticate, (req, res, next) => { req.supabase = supabase; next(); }, chatRouter);
app.use("/ai", (req, res, next) => { req.supabase = supabase; next(); }, aiRouter);
app.use("/activities", authenticate, activitiesRouter);

// --- Ollama streaming route ---
app.post("/ollama", async (req, res) => {
  const { message, model } = req.body;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.flushHeaders();

  try {
    const response = await fetch("http://127.0.0.1:11434/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: model || "llama2",
        messages: [{ role: "user", content: message }],
        stream: true
      }),
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value);
      res.write(`data: ${chunk}\n\n`);
    }

    res.end();
  } catch (err) {
    console.error("🔥 Ollama Error:", err);
    res.status(500).json({ error: "Error en Ollama" });
  }
});

// --- Serve frontend (Vite build) ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendPath));
app.get("*", (req, res) => res.sendFile(path.join(frontendPath, "index.html")));

// --- Error handler ---
app.use((err, req, res, next) => {
  console.error("🔥 Backend Error:", err);
  res.status(500).json({ error: "Error interno del servidor" });
});

// --- Start server ---
const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 LuaTechIA FULL APP corriendo en puerto ${PORT}`);
});

export default app;
