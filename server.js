import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import dotenv from "dotenv";

// Importar backend
import backendApp from "./backend/index.js";  // Asegúrate de que este sea el path correcto a tu archivo index.js del backend

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Configuración de CORS y seguridad
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());

// -------------------- Rutas de backend --------------------
// Montar backend en /api
app.use("/api", backendApp);  // Aquí se monta todo el backend que está en backend/index.js

// -------------------- Servir el frontend compilado --------------------
// Carpeta dist generada por Vite
const frontendPath = path.join(__dirname, "frontend", "dist");
app.use(express.static(frontendPath));

// Si no es una ruta de la API, se sirve el frontend
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// -------------------- Puerto dinámico (Render o local) --------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Full App corriendo en http://localhost:${PORT}`);
});
