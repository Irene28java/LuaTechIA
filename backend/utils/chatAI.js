// backend/utils/chatAI.js
import axios from "axios";

export async function tryModelsSequentially({ message, role, age, subject, specialNeeds, onChunk, onEnd }) {
  // Aquí defines el orden de prioridad de los modelos
  const models = [
    { name: "ollama", url: process.env.OLLAMA_URL },
    { name: "huggingface", url: "https://api-inference.huggingface.co/models/" + process.env.HUGGINGFACE_MODEL },
    { name: "groq", url: "https://api.groq.com/v1/models/" + process.env.GROQ_MODEL }
  ];

  for (let model of models) {
    try {
      if (model.name === "ollama") {
        const res = await axios.post(`${model.url}/generate`, { prompt: message, model: process.env.OLLAMA_MODEL, max_tokens: 500 }, {
          headers: { Authorization: `Bearer ${process.env.CLIENT_SECRET}` }
        });
        // Simular chunking
        for (let chunk of res.data.output.split(" ")) {
          onChunk(chunk + " ");
          await new Promise(r => setTimeout(r, 50));
        }
        onEnd();
        return;
      }

      if (model.name === "huggingface") {
        const res = await axios.post(model.url, { inputs: message }, {
          headers: { Authorization: `Bearer ${process.env.HF_API_KEY}` }
        });
        onChunk(res.data[0].generated_text || "");
        onEnd();
        return;
      }

      if (model.name === "groq") {
        const res = await axios.post(model.url, { prompt: message }, {
          headers: { "Authorization": `Bearer ${process.env.GROQ_API_KEY}` }
        });
        onChunk(res.data.response || "");
        onEnd();
        return;
      }

    } catch (err) {
      console.error(`Error con modelo ${model.name}:`, err);
      continue; // probar siguiente modelo
    }
  }

  // Si todos fallan
  onChunk("Lo siento, no pude generar respuesta 😅");
  onEnd();
}
