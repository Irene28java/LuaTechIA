// Backend - services/ollama.js
import { queryOllama } from "./queryOllama";

// Prueba de funcionamiento
const testOllama = async () => {
  const prompt = "¿Cómo estás?";
  try {
    const response = await queryOllama(prompt);
    console.log("Ollama Response:", response); // Verifica la respuesta
  } catch (err) {
    console.error("Error con Ollama:", err.message);
  }
};

testOllama();
