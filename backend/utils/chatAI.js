import { hfGenerate } from "../services/huggingface.js";
import { callGroq } from "../services/groq.js";
import { Ollama } from "ollama";

const ollamaClient = new Ollama({ apiKey: process.env.OLLAMA_API_KEY });

export async function tryModelsSequentially({ message, role, age, subject, specialNeeds = [], onChunk, onEnd }) {
  const prompt = `
Eres LúaCoachIA, asistente educativa para niños.
Edad: ${age}, Rol: ${role}, Materia: ${subject}, Necesidades especiales: ${specialNeeds.join(", ")}
Mensaje del usuario: "${message}"
Sé empática, cálida y humana, responde en español.
`;

  const models = [
    {
      name: "Ollama Local",
      fn: async () => {
        const stream = await ollamaClient.stream({ model: "llama3.1", prompt });
        for await (const event of stream) {
          if (event.type === "response") onChunk(event.text);
        }
      }
    },
    { name: "HuggingFace", fn: async () => onChunk(await hfGenerate(prompt)) },
    { name: "Groq", fn: async () => onChunk(await callGroq(prompt)) }
  ];

  for (const model of models) {
    try {
      await Promise.race([model.fn(), new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 25000))]);
      onEnd();
      return;
    } catch (err) {
      console.warn(`❌ ${model.name} falló:`, err.message);
    }
  }

  onChunk("Lo siento, no pude generar una respuesta en este momento. 😔");
  onEnd();
}
