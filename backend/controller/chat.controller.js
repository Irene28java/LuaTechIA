// backend/controller/chat.controller.js
import { buildSystemPrompt } from "../lib/buildSystemPrompt.js";
import { generateAIResponse } from "../utils/chatAI.js";

export async function chatStream(req, res) {
  const {
    message,
    role = "child",
    age = 7,
    subject = "naturales",
    specialNeeds = [],
    style,
    safeMode = false
  } = req.body;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    const systemPrompt = buildSystemPrompt({
      userId: req.user?.id || "anon",
      role,
      age,
      subject,
      specialNeeds,
      style,
      safeMode,
      message
    });

    await generateAIResponse({
      systemPrompt,
      userMessage: message,
      onChunk: (chunk) => {
        res.write(`data: ${chunk}\n\n`);
      },
      onEnd: () => {
        res.write("data: [DONE]\n\n");
        res.end();
      }
    });
  } catch (error) {
    console.error("AI Stream Error:", error);
    res.write(`data: Error interno\n\n`);
    res.write("data: [DONE]\n\n");
    res.end();
  }
}
