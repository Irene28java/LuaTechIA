//backend>route>uploadTemplates.js

import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Guardado en /backend/templates
const storage = multer.diskStorage({
  destination: path.join(__dirname, "..", "templates"),
  filename(req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

router.post("/", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No se subió archivo" });

  res.json({ message: "Plantilla subida correctamente", file: req.file.filename });
});

export default router;
