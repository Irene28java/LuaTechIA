import express from "express";
import { callGroq } from "../services/groq.js"; // Asegúrate de usar la ruta correcta

const router = express.Router();

router.get("/test-groq", async (req, res) => {
  const prompt = "¿Cómo se genera energía en las plantas?";
  try {
    const response = await callGroq(prompt);
    console.log("Groq Response:", response);
    res.json(response); // Devuelve la respuesta de Groq al cliente
  } catch (err) {
    console.error("Error con Groq:", err.message);
    res.status(500).json({ error: "Error con la integración de Groq" });
  }
});

export default router;
