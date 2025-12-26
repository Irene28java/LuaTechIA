import { streamOllama } from "./ollamaStreamSSE.js";
import { streamGroq } from "./groqStreamSSE.js";
import { streamHF } from "./hfStreamSSE.js";

export async function streamChat({
  prompt,
  meta,
  onChunk
}) {
  try {
    return await streamOllama(prompt, meta, onChunk);
  } catch (e1) {
    console.warn("⚠️ Ollama caído → Groq");
    try {
      return await streamGroq(prompt, meta, onChunk);
    } catch (e2) {
      console.warn("⚠️ Groq caído → HF");
      return await streamHF(prompt, meta, onChunk);
    }
  }
}
