import express from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { injectStyle } from "../middlewares/injectStyle.js";
import { buildSystemPrompt } from "../lib/buildSystemPrompt.js";
import { tryModelsSequentially } from "../utils/chatAI.js";

const router = express.Router();

router.post("/stream", authenticate, injectStyle, async (req, res) => {
  const { message, role = "child", age = 7, subject = "naturales", specialNeeds = [], style, safeMode = false } = req.body;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const systemPrompt = buildSystemPrompt({ userId: req.user?.id, role, age, subject, specialNeeds, style, safeMode, message });

  await tryModelsSequentially({
    message: systemPrompt,
    role,
    age,
    subject,
    specialNeeds,
    onChunk: (chunk) => res.write(`data: ${chunk}\n\n`),
    onEnd: () => { res.write("data: [DONE]\n\n"); res.end(); }
  });
});

export default router;
