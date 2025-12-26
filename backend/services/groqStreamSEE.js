import { callGroq } from "./groq.js";

export async function streamGroq(prompt, meta, onChunk) {
  const res = await callGroq(prompt);

  if (!res?.choices?.[0]?.message?.content) {
    throw new Error("Groq respuesta inválida");
  }

  // Enviamos TODO de golpe como chunk final
  onChunk(res.choices[0].message.content);
}
