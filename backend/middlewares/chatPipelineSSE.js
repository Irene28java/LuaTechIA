// backend/middlewares/chatPipelineSSE.js
import { injectStyle } from "./injectStyle.js";
import { jailbreakBlocker } from "./jailbreakBlocker.js";
import { safetyFilter } from "./safetyFilter.js";
import { ageLimiter } from "./ageLimiter.js";
import { moderationAI } from "./moderationAI.js";
import { safeMode } from "./safeMode.js";

export async function chatPipelineSSE(req, res, next) {
  try {
    // 1️⃣ Inject style
    injectStyle(req, res, () => {});

    // 2️⃣ Evitar jailbreak
    jailbreakBlocker(req, res, () => {});

    // 3️⃣ Filtrado de malas palabras y grooming
    safetyFilter(req, res, () => {});

    // 4️⃣ Limitar según edad
    ageLimiter(req, res, () => {});

    // 5️⃣ Moderación AI
    await moderationAI(req, res, () => {});

    // 6️⃣ Safe mode según rol
    safeMode(req, res, () => {});

    // Si todo pasa
    next();

  } catch (err) {
    console.error("Pipeline error:", err);

    // Para SSE, enviamos mensaje genérico y cerramos
    if (res.write) {
      res.write(`data: Lo siento, no puedo responder a ese mensaje. 😅\n\n`);
      res.write("data: [DONE]\n\n");
      return res.end();
    }

    // Para endpoints normales
    return res.status(400).json({ error: "Mensaje no permitido para menores." });
  }
}
