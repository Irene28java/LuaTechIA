import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Importar backend
import backendApp from "./backend/index.js";

const app = express();
app.use(cors());
app.use(express.json());

// Montar backend en /api
app.use("/api", backendApp);

// Servir frontend compilado
const frontendPath = path.join(__dirname, "frontend", "dist");
app.use(express.static(frontendPath));

// SPA: cualquier ruta que no sea /api
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// Puerto dinámico (Railway u otro hosting)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🔥 Full App funcionando en http://localhost:${PORT}`)
);
