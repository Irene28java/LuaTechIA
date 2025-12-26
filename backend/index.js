//backend/index.js

import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";
import cors from "cors";

// Routers
import googleRouter from "./routes/googleAuth.js";
import chatRouter from "./routes/chat.js";
import aiRouter from "./routes/ai.js";
import activitiesRouter from "./routes/activities.js";
import downloadsRouter from "./routes/downloads.js";
import paymentsRouter from "./routes/payments.js";

// Utils
import proxyClient from "./utils/proxyClient.js";
import { authenticate } from "./middlewares/authenticate.js";
import { validateEnv } from "./lib/validateEnv.js";

dotenv.config();
validateEnv();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY,
  { auth: { persistSession: false } }
);

const app = express();
app.use(express.json());

app.use(cors({
  origin: [
    "http://localhost:3000",
    process.env.FRONTEND_URL || "https://luatechia.onrender.com"
  ],
  credentials: true
}));

app.use("/api/proxy", proxyClient);

app.get("/health", (_, res) => res.send("LuaTechIA Backend OK"));

app.use("/auth/google", googleRouter);
app.use("/downloads", downloadsRouter);
app.use("/payments", paymentsRouter);

app.use("/chat", authenticate, chatRouter);
app.use("/ai", (req, _, next) => { req.supabase = supabase; next(); }, aiRouter);
app.use("/activities", authenticate, activitiesRouter);

// Frontend build
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendPath = path.join(__dirname, "../frontend/dist");

app.use(express.static(frontendPath));
app.get("*", (_, res) => res.sendFile(path.join(frontendPath, "index.html")));

app.use((err, _, res, __) => {
  console.error("🔥 Backend Error:", err);
  res.status(500).json({ error: "Error interno del servidor" });
});

export default app;
