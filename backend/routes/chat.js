import express from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { chatPipelineSSE } from "../middlewares/chatPipelineSSE.js";
import { saveMessage } from "../utils/saveMessage.js";
import { runPromptEngine } from "../utils/promptEngine.js";
import { AIResponseSchema } from "../ai/aiResponseSchema.js";

const router = express.Router();

router.post("/stream", authenticate, chatPipelineSSE, async (req, res) => {
  try {
    const { message, role="child", age=7, subject="generales", specialNeeds=[], folderName="Chat AI" } = req.body;
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "No autorizado" });

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    let accumulatedChunks = "";
    const sendChunk = chunk => {
      accumulatedChunks += chunk;
      res.write(`data: ${chunk}\n\n`);
    };

    const endStream = async () => {
      try {
        const parsed = AIResponseSchema.parse(JSON.parse(accumulatedChunks));
        res.write(`data: ${JSON.stringify(parsed)}\n\n`);
        res.write("data: [DONE]\n\n");
        res.end();

        await saveMessage(req.supabase, userId, folderName, `Mensaje ${new Date().toLocaleTimeString()}`, parsed.content.text || "");
      } catch (err) {
        console.error("[STREAM PARSE ERROR]", err.message);
        res.write(`data: Error generando respuesta final.\n\n`);
        res.write("data: [DONE]\n\n");
        res.end();
      }
    };

    await runPromptEngine({ message, role, age, subject, specialNeeds, onChunk: sendChunk, onEnd: endStream });

  } catch (err) {
    console.error("Error en /chat/stream:", err);
    res.write(`data: Ocurrió un error. 😅\n\n`);
    res.write("data: [DONE]\n\n");
    res.end();
  }
});

// Fallback endpoint
router.post("/fallback", async (req, res) => {
  res.json({ response: "Lo siento, hubo un error procesando tu mensaje. Intenta de nuevo." });
});

export default router;
