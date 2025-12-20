import express from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { chatPipelineSSE } from "../middlewares/chatPipelineSSE.js";
import { saveMessage } from "../utils/saveMessage.js";
import { runPromptEngine } from "../utils/promptEngine.js"; // Motor central de prompts
import { AIResponseSchema } from "../schemas/aiResponseSchema.js";

const router = express.Router();

router.post("/stream", authenticate, chatPipelineSSE, async (req, res) => {
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

    // Cabeceras SSE
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // Concatenar chunks parciales
    let accumulatedChunks = "";

    // Enviar chunk parcial
    const sendChunk = (chunk) => {
      accumulatedChunks += chunk;
      res.write(`data: ${chunk}\n\n`);
    };

    // Al finalizar stream
    const endStream = async () => {
      try {
        const parsed = AIResponseSchema.parse(JSON.parse(accumulatedChunks));

        // Enviar JSON final
        res.write(`data: ${JSON.stringify(parsed)}\n\n`);
        res.write("data: [DONE]\n\n");
        res.end();

        // Guardar mensaje final en Supabase
        await saveMessage(
          req.supabase,
          userId,
          folderName,
          `Mensaje ${new Date().toLocaleTimeString()}`,
          parsed.content.text || ""
        );

      } catch (err) {
        console.error("[STREAM PARSE ERROR]", err.message);
        res.write(`data: Error generando respuesta final.\n\n`);
        res.write("data: [DONE]\n\n");
        res.end();
      }
    };

    // Llamar al motor de prompts con streaming
    await runPromptEngine({
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
    res.write(`data: Ocurrió un error. 😅\n\n`);
    res.write("data: [DONE]\n\n");
    return res.end();
  }
  res.status(500).json({ error: "Error interno del servidor" });
}

});

export default router;
