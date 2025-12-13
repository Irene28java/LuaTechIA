// src/routes/ai.js
import express from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { tryModelsSequentially } from "../utils/chatAI.js";
import { createClient } from "@supabase/supabase-js";
import 'dotenv/config';

const router = express.Router();

// ----------------- VALIDAR VARIABLES DE ENTORNO -----------------
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Debes definir SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en tu .env");
}

// ----------------- INIT SUPABASE -----------------
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ----------------- MATERIAS PERMITIDAS -----------------
const allowedSubjects = [
  "naturales","matematicas","lengua","sociales","ingles",
  "educacion artistica","musica","educacion fisica","valores"
];

// ----------------- RESPUESTA EMOCIONAL -----------------
function emotionalResponse(message, role="child", age=6, subject="general") {
  const text = message.toLowerCase();
  const out = [];

  if (text.includes("cansado") || text.includes("agotado")) {
    out.push(
      `Veo que estás cansad@. Podemos hacer algo más suave.`,
      `Parece que fue un día largo. ¿Quieres algo corto de ${subject}?`,
      `Si quieres, hacemos un ejercicio muy rapidito para no agotarte.`
    );
  }
  if (text.includes("triste") || text.includes("aburrido") || text.includes("deprimido")) {
    out.push(
      `Siento que te sientas así. ¿Quieres una actividad creativa de ${subject}?`,
      `Vamos a subir un poco la energía. ¿Probamos algo divertido de ${subject}?`,
      `A veces nos sentimos así. Hagamos algo ligero para animarnos.`
    );
  }
  if (text.includes("estresado") || text.includes("enojado") || text.includes("frustrado")) {
    out.push(
      `Parece que te sientes frustrad@. Respira hondo. Podemos hacerlo despacio.`,
      `Está bien sentirse así. Hagamos un ejercicio suave de ${subject}.`,
      `Vamos paso a paso. Te acompaño mientras hacemos algo fácil.`
    );
  }

  if (out.length > 0) return out[Math.floor(Math.random() * out.length)];
  if (role === "padre") return "Estoy aquí para ayudarte a acompañar a tu hijo/a y proponer actividades.";
  if (role === "profesor") return "Puedo ayudarte a crear actividades rápidas y efectivas.";
  return null;
}

// ----------------- RUTA SSE /stream -----------------
router.post("/stream", authenticate, async (req, res) => {
  try {
    const {
      message,
      role = "child",
      age = 7,
      subject = "naturales",
      specialNeeds = [],
      style,
      safeMode = false,
      conversationId
    } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "El campo 'message' es obligatorio y debe ser string" });
    }

    const mat = allowedSubjects.includes(subject.toLowerCase()) ? subject.toLowerCase() : "naturales";

    // Cabeceras SSE
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // Guardar mensaje del usuario en Supabase
    if (conversationId) {
      await supabase.from("messages").insert([
        { conversation_id: conversationId, role: "user", content: message }
      ]);
    }

    // ----------------- RESPUESTA EMOCIONAL -----------------
    const emo = emotionalResponse(message, role, age, mat);
    if (emo) {
      res.write(`data: ${emo}\n\n`);
    }

    // ----------------- STREAMING AI -----------------
    await tryModelsSequentially({
      message,
      role,
      age,
      subject: mat,
      specialNeeds,
      onChunk: (chunk) => res.write(`data: ${chunk}\n\n`),
      onEnd: async () => {
        res.write("data: [DONE]\n\n");
        res.end();
      }
    });

  } catch (err) {
    console.error("CHAT STREAM ERROR:", err);
    res.write("data: Ocurrió un error interno\n\n");
    res.write("data: [DONE]\n\n");
    res.end();
  }
});

export default router;
