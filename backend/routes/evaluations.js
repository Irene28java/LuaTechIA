// backend/routes/evaluations.js
import express from "express";
import { buildEvaluationPrompt } from "../services/evaluation.js";
import { streamChat } from "../services/index.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { age, question, answer, subject } = req.body;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  const evalPrompt = buildEvaluationPrompt({ age, question, answer });

  let accumulated = "";
  await streamChat({
    messages: [{ role: "user", content: evalPrompt }],
    meta: { role: "teacher", age, subject },
    onChunk: (chunk) => {
      accumulated += chunk;
      res.write(`data: ${chunk}\n\n`);
    }
  });

  try {
    const parsed = JSON.parse(accumulated);
    res.write(`data: ${JSON.stringify(parsed)}\n\n`);
  } catch {
    res.write(`data: {"error":"No se pudo generar evaluación"}\n\n`);
  }

  res.write("data: [DONE]\n\n");
  res.end();
});

export default router;
