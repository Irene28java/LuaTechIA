// src/ai/ActionRouter.js
import { buildPrompt } from "./PromptEngine";
import api from "../api/client";

export async function runAIAction({
  action,
  age,
  subject,
  role,
  specialNeeds,
  messages,
}) {
  const prompt = buildPrompt({
    action,
    age,
    subject,
    role,
    specialNeeds,
    messages,
  });

  const res = await api.post("/ai/run", {
    action,
    prompt,
  });

  return res.data; // ← ya viene con schema validado
}
