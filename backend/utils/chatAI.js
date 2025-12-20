// backend/utils/chatAI.js
import fetch from "node-fetch";

/**
 * tryModelsSequentially
 * Llama a los modelos secuencialmente hasta que uno responda correctamente.
 * Streaming real: envía chunks al frontend vía SSE.
 */
export async function tryModelsSequentially({ message, role, age, subject, specialNeeds, onChunk, onEnd }) {
  const models = ["ollama", "hf"]; // Orden de prioridad
  for (const model of models) {
    try {
      if (model === "ollama") {
        await callOllama({ message, role, age, subject, specialNeeds, onChunk, onEnd });
        return;
      }
      if (model === "hf") {
        await callHF({ message, role, age, subject, specialNeeds, onChunk, onEnd });
        return;
      }
    } catch (err) {
      console.error(`[tryModelsSequentially] ${model} falló:`, err.message);
      continue; // pasar al siguiente modelo
    }
  }
  // Si todos fallan
  onChunk("Lo siento, no pude generar respuesta 😅");
  await onEnd();
}

/**
 * callOllama
 * Llamada a Ollama local/remota con streaming real
 */
async function callOllama({ message, role, age, subject, specialNeeds, onChunk, onEnd }) {
  const res = await fetch(process.env.OLLAMA_URL || "http://localhost:11434/v1/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: process.env.OLLAMA_MODEL || "edu-assistant",
      prompt: message,
      stream: true
    })
  });

  if (!res.ok) throw new Error(`Ollama API error: ${res.status}`);

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let done = false;

  while (!done) {
    const { value, done: readerDone } = await reader.read();
    done = readerDone;
    if (value) {
      const chunk = decoder.decode(value);
      onChunk(chunk);
    }
  }

  await onEnd();
}

/**
 * callHF
 * Llamada a Hugging Face con streaming
 */
async function callHF({ message, role, age, subject, specialNeeds, onChunk, onEnd }) {
  const res = await fetch(`https://api-inference.huggingface.co/models/${process.env.HF_MODEL}`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.HF_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      inputs: message,
      parameters: { max_new_tokens: 500, return_full_text: false, stream: true }
    })
  });

  if (!res.ok) throw new Error(`HF API error: ${res.status}`);

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let done = false;

  while (!done) {
    const { value, done: readerDone } = await reader.read();
    done = readerDone;
    if (value) {
      const chunk = decoder.decode(value);
      onChunk(chunk);
    }
  }

  await onEnd();
}
