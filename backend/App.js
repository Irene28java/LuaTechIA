import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

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

const app = express();

// -------------------- Seguridad --------------------
app.use(helmet()); // Protege con encabezados HTTP seguros
app.use(rateLimit({ windowMs: 60*1000, max: 100 })); // Limita 100 peticiones/min por IP

// -------------------- Middlewares --------------------
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());

// -------------------- Health check --------------------
app.get("/", (req, res) => res.send("LuaCoachIA Backend OK ✔️"));

// -------------------- Rutas --------------------
app.use("/api/auth/google", googleRouter);
app.use("/downloads", downloadsRouter);
app.use("/api/payments", paymentsRouter);
app.use("/api/chat", authenticate, chatRouter);
app.use("/api/ai", authenticate, aiRouter);
app.use("/api/activities", authenticate, activitiesRouter);

// -------------------- Error handler --------------------
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err);
  res.status(500).json({ error: "Error interno del servidor" });
});

// -------------------- Servidor --------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Backend corriendo en http://localhost:${PORT}`);
});

export default app;
