import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import dotenv from "dotenv";

// Importa el backend (solo rutas)
import backendApp from "./backend/index.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// -------------------- Middlewares globales --------------------
app.use(express.json());

// CORS correcto para monorepo (frontend + backend mismo dominio)
app.use(cors({
  origin: true,
  credentials: true
}));

// -------------------- Backend montado en /api --------------------
app.use("/api", backendApp);

// -------------------- Health check Render --------------------
app.get("/saludz", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// -------------------- Servir frontend (Vite build) --------------------
const frontendPath = path.join(__dirname, "frontend", "dist");
app.use(express.static(frontendPath));

// SPA fallback
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// -------------------- LISTEN (AQUÍ VA EL MENSAJE 🚀) --------------------
const PORT = process.env.PORT || 10000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 LuaTechIA FULL APP corriendo en puerto ${PORT}`);
});
