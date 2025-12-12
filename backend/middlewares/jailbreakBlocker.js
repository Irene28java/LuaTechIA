//BACKEND/MIDDLEWARES/JAILBREAKSBLOCKER.JS

const jailbreakPatterns = [
  "ignore previous instructions",
  "forget you are lua",
  "bypass",
  "system prompt"
];

export function jailbreakBlocker(req, res, next) {
  const msg = req.body.message?.toLowerCase() || "";

  if (jailbreakPatterns.some(p => msg.includes(p))) {
    return res.status(400).json({
      error: "No puedo cambiar mi personalidad. Estoy aquí para ayudarte de forma segura 😊"
    });
  }

  next();
}
