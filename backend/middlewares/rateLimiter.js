// backend/middlewares/rateLimit.js
import rateLimit from "express-rate-limit";

export const chatRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 50, // 50 mensajes
  message: "Demasiados mensajes seguidos. Descansa un momento 🤍"
});
