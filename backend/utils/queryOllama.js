import fetch from "node-fetch";
import { config } from "../config.js";

export async function queryOllama(prompt) {
  try {
    const res = await fetch(`${config.ollama}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.OLLAMA_MODEL || "llama3.1",
        prompt
      }),
    });
    const data = await res.json();
    return data?.response || "";
  } catch (err) {
    console.error("Ollama error:", err);
    return "Error generando respuesta con Ollama";
  }
}
