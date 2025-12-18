// backend/middlewares/chatPipelineSSE.js
import { injectStyle } from "./injectStyle.js";
import { jailbreakBlocker } from "./jailbreakBlocker.js";
import { safetyFilter } from "./safetyFilter.js";
import { ageLimiter } from "./ageLimiter.js";
import { moderationAI } from "./moderationAI.js";
import { safeMode } from "./safeMode.js";

export async function chatPipelineSSE(req, res, next) {
  try {
    // Encadenar todos los middlewares
    await injectStyle(req, res);
    await jailbreakBlocker(req, res);
    await safetyFilter(req, res);
    await ageLimiter(req, res);
    await moderationAI(req, res);
    await safeMode(req, res);

    // Si todo pasa, continuar al siguiente middleware o endpoint
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
    res.status(400).json({ error: "Mensaje no permitido para menores." });
  }
}
