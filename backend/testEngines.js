import { ollamaChat } from "./services/ollama.js";
import { hfGenerate } from "./services/huggingface.js";
import { mistralChat } from "./services/mistral.js";
import { callGroq } from "./services/groq.js";

const prompt = "Explica la fotosíntesis para un niño de 7 años con ejemplos simples y emojis 🌱🌞";

async function main() {
  // Test Ollama
  try {
    const resOllama = await ollamaChat(prompt);
    console.log("✅ Ollama:", resOllama);
  } catch (e) {
    console.log("❌ Ollama falló:", e.message);
  }

  // Test HuggingFace
  try {
    const resHF = await hfGenerate(prompt);
    console.log("✅ HuggingFace:", resHF);
  } catch (e) {
    console.log("❌ HuggingFace falló:", e.message);
  }

  // Test Mistral (Groq)
  try {
    const resMistral = await mistralChat(prompt);
    console.log("✅ Mistral/Groq:", resMistral);
  } catch (e) {
    console.log("❌ Mistral/Groq falló:", e.message);
  }

  // Test callGroq con proxy
  try {
    const resGroq = await callGroq(prompt);
    console.log("✅ Groq con proxy:", resGroq.choices[0].message.content);
  } catch (e) {
    console.log("❌ Groq con proxy falló:", e.message);
  }
}

main();
