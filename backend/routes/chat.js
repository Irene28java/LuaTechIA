// backend/routes/chat.js
import express from "express";
import { chatPipelineSSE } from "../middlewares/chatPipelineSSE.js";
import { saveMessage } from "../utils/saveMessage.js";
import { tryModelsSequentially } from "../utils/chatAI.js"; // tu función que llama a Ollama/HF/Groq

const router = express.Router();

router.post("/stream", chatPipelineSSE, async (req, res) => {
  try {
    const {
      message,
      role = "child",
      age = 7,
      subject = "generales",
      specialNeeds = [],
      folderName = "Chat AI"
    } = req.body;

    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "No autorizado" });

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    let assistantMessage = { role: "assistant", text: "", time: new Date().toISOString() };

    // Función para enviar chunks SSE
    const sendChunk = (chunk) => {
      assistantMessage.text += chunk;
      res.write(`data: ${chunk}\n\n`);
    };

    // Función al finalizar streaming
    const endStream = async () => {
      res.write("data: [DONE]\n\n");
      res.end();

      // Guardar mensaje en Supabase
      await saveMessage(req.supabase, userId, folderName, `Mensaje ${new Date().toLocaleTimeString()}`, assistantMessage.text);
    };

    // Llamamos a la IA con tryModelsSequentially
    await tryModelsSequentially({
      message,
      role,
      age,
      subject,
      specialNeeds,
      onChunk: sendChunk,
      onEnd: endStream
    });

  } catch (err) {
    console.error("Error en /chat/stream:", err);
    if (res.write) {
      res.write(`data: Lo siento, ha ocurrido un error. 😅\n\n`);
      res.write("data: [DONE]\n\n");
      return res.end();
    }
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;
