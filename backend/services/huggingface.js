//backend/services/huggingface.js

import axios from "axios";

export async function hfGenerate(prompt, role = "child", age = 6, subject = "general") {
  // Formato de prompt adaptado a la IA educativa
  const fullPrompt = `
    Eres un asistente educativo llamado LúaCoachIA. Estás ayudando a un/a ${role} de ${age} años.
    El tema es sobre ${subject}. 
    El mensaje del usuario es: "${prompt}"
    Responde de manera empática, cálida y humana, y asegúrate de adaptar la respuesta según el rol, la edad y la materia.
    Si el usuario se siente cansado, estresado o triste, ofrece actividades que lo ayuden de forma suave.
    Responde en español.
  `;

  try {
    const res = await axios.post(
      "https://api-inference.huggingface.co/models/google/flan-t5-xl",
      { inputs: fullPrompt },
      {
        headers: { Authorization: `Bearer ${process.env.HF_API_KEY}` },
        timeout: 60000
      }
    );

    if (res.data.error) throw new Error(res.data.error);

    if (Array.isArray(res.data) && res.data[0].generated_text) {
      return res.data[0].generated_text;
    } else {
      return "No se generó texto";
    }
  } catch (err) {
    console.error("Error HuggingFace:", err.message);
    return "Error en la generación de texto";
  }
}
