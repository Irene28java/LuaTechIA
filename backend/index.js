import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
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
app.get("/health", (req, res) => {
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

// -------------------- Servir frontend --------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, '../frontend/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// -------------------- Error handler --------------------
app.use((err, req, res, next) => {
  console.error("🔥 Backend Error:", err);
  res.status(500).json({ error: "Error interno del servidor" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
