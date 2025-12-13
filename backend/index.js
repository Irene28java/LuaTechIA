import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

// Routers
import googleRouter from "./routes/googleAuth.js";
import chatRouter from "./routes/chat.js";
import aiRouter from "./routes/ai.js";
import activitiesRouter from "./routes/activities.js";
import downloadsRouter from "./routes/downloads.js";
import paymentsRouter from "./routes/payments.js";

// Middlewares
import { authenticate } from "./middlewares/authenticate.js";
import { validateEnv } from "./lib/validateEnv.js";

// -------------------- Cargar variables de entorno --------------------
dotenv.config();

// -------------------- Validar variables de entorno --------------------
validateEnv();

// -------------------- Cliente Supabase --------------------
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY, {
  auth: { persistSession: false },
});

// -------------------- Crear app Express --------------------
const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());

// -------------------- Health check principal --------------------
app.get("/", (req, res) => res.send("LuaCoachIA Backend OK ✔️"));

// -------------------- Health check para Render --------------------
app.get("/saludz", (req, res) => res.status(200).json({ status: "ok" }));

// -------------------- Rutas públicas --------------------
app.use("/api/auth/google", googleRouter);
app.use("/downloads", downloadsRouter);
app.use("/api/payments", paymentsRouter);

// -------------------- Rutas protegidas --------------------
app.use("/api/chat", authenticate, (req, res, next) => { req.supabase = supabase; next(); }, chatRouter);
app.use("/api/ai", (req, res, next) => { req.supabase = supabase; next(); }, aiRouter);
app.use("/api/activities", authenticate, activitiesRouter);

// -------------------- Error handler --------------------
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err);
  res.status(500).json({ error: "Error interno del servidor" });
});

// Exportar el backend para ser usado en el servidor principal
export default app;
