//Backend/services/ollamaStreamSSE.js 

import fetch from "node-fetch";
import { adaptByAge } from "./ageAdapter.js";

export async function streamOllama(prompt, meta, onChunk) {
  const adaptedPrompt = adaptByAge(meta.age, prompt);

  const response = await fetch(`${process.env.OLLAMA_BASE}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama2",
      messages: [{ role: "user", content: adaptedPrompt }],
      stream: true
    })
  });

  if (!response.ok) {
    throw new Error("Ollama no responde");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const lines = decoder.decode(value).split("\n").filter(Boolean);
    for (const line of lines) {
      try {
        const json = JSON.parse(line);
        if (json.message?.content) {
          onChunk(json.message.content);
        }
      } catch (_) {}
    }
  }
}
