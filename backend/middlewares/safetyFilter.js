//BACKEND>MIDDLEWARES/SAFETY.JS

const badWords = ["puta", "sex", "pedo", "follar", "nude", "porn"];
const groomingPatterns = ["soy mayor", "enviame foto", "donde vives"];

export function safetyFilter(req, res, next) {
  const msg = (req.body.message || "").toLowerCase();

  // Malas palabras
  if (badWords.some(bw => msg.includes(bw))) {
    return res.status(400).json({
      error: "Mensaje inapropiado detectado."
    });
  }

  // Intentos de grooming / riesgos
  if (groomingPatterns.some(p => msg.includes(p))) {
    return res.status(400).json({
      error: "Lúa no puede responder a ese tipo de mensajes."
    });
  }

  next();
}
 
