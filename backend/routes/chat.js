// backend/routes/chat.js
import express from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { chatPipelineSSE } from "../middlewares/chatPipelineSSE.js";
import { saveMessage } from "../utils/saveMessage.js";
import { runPromptEngine } from "../utils/promptEngine.js";
import { AIResponseSchema } from "../ai/aiResponseSchema.js";
import { buildConversationContext } from "../utils/conversation.js";
import { createEmbedding } from "../services/embeddings.js";
import { retrieveContext } from "../utils/embeddings.js";

const router = express.Router();

router.post("/stream", authenticate, chatPipelineSSE, async (req, res) => {
  try {
    const { message, role = "child", age = 7, subject = "generales", specialNeeds = [], folderName = "Chat AI" } = req.body;
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "No autorizado" });

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    // 🔹 Construir contexto conversacional
    const conversationContext = await buildConversationContext({
      supabase: req.supabase,
      userId,
      newMessage: message
    });

    // 🔹 Traer embeddings educativos
    const userEmbedding = await createEmbedding(message);
    const relevantContext = await retrieveContext(req.supabase, userId, userEmbedding);

    // 🔹 Construir prompt final
    const systemPrompt = `
${conversationContext}

CONTEXTOS EDUCATIVOS RELEVANTES:
${relevantContext.data?.map(r => r.content).join("\n") || "Ninguno"}

Mensaje del alumno:
"${message}"

Devuelve SOLO JSON válido siguiendo el esquema exacto:
${JSON.stringify(AIResponseSchema.shape, null, 2)}
`;

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

        // Guardar mensaje en DB
        await saveMessage(req.supabase, userId, folderName, `Mensaje ${new Date().toLocaleTimeString()}`, parsed.content.text || "");
      } catch (err) {
        console.error("[STREAM PARSE ERROR]", err.message);
        res.write(`data: {"error":"Error generando respuesta final"}\n\n`);
        res.write("data: [DONE]\n\n");
        res.end();
      }
    };

    await runPromptEngine({
      message: systemPrompt,
      role,
      age,
      subject,
      specialNeeds,
      onChunk: sendChunk,
      onEnd: endStream
    });

  } catch (err) {
    console.error("Error en /chat/stream:", err);
    res.write(`data: {"error":"Ocurrió un error"}\n\n`);
    res.write("data: [DONE]\n\n");
    res.end();
  }
});

export default router;
