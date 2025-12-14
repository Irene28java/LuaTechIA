import express from "express";
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

dotenv.config();
validateEnv();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY,
  { auth: { persistSession: false } }
);

const app = express();
app.use(express.json());

// -------------------- Health backend --------------------
app.get("/", (req, res) => {
  res.send("LuaTechIA Backend OK");
});

// -------------------- Rutas públicas --------------------
app.use("/auth/google", googleRouter);
app.use("/downloads", downloadsRouter);
app.use("/payments", paymentsRouter);

// -------------------- Rutas protegidas --------------------
app.use("/chat", authenticate, (req, res, next) => {
  req.supabase = supabase;
  next();
}, chatRouter);

app.use("/ai", (req, res, next) => {
  req.supabase = supabase;
  next();
}, aiRouter);

app.use("/activities", authenticate, activitiesRouter);

// -------------------- Error handler --------------------
app.use((err, req, res, next) => {
  console.error("🔥 Backend Error:", err);
  res.status(500).json({ error: "Error interno del servidor" });
});

export default app;
