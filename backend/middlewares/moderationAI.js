//BACKEND>MIDDLEWARES/MODERATIOAI.JS

export async function moderationAI(req, res, next) {
  const msg = req.body.message;

  // skip mensajes vacíos
  if (!msg) return next();

  try {
    // ⚠️ Usa un modelo pequeño en Ollama
    const mod = await ollama.chat({
      model: "llama3.1",
      messages: [
        { role: "system", content: "Evalúa si el siguiente texto es inapropiado, sexual, violento o peligroso. Responde SOLO con 'ok' o 'block'." },
        { role: "user", content: msg }
      ]
    });

    if (mod.message.content.trim() === "block") {
      return res.status(400).json({ error: "Mensaje no permitido para menores." });
    }

    next();
  } catch {
    next();
  }
}
 
