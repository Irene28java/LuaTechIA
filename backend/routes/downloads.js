import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

router.get("/:file", (req, res) => {
  const fileName = req.params.file;
  const filePath = path.join(__dirname, "..", "templates", fileName);
  
  res.sendFile(filePath, (err) => {
    if (err) res.status(404).json({ error: "Archivo no encontrado" });
  });
});

export default router;
