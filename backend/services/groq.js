/**
 * Llama a Groq API con proxy si es necesario
 * @param {string} prompt
 */
export async function callGroq(prompt) {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    body: JSON.stringify({
      model: process.env.GROQ_MODEL,
      messages: [{ role: "user", content: prompt }], // Aquí se forma el JSON con el `prompt`
    }),
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${config.groq}`,
    },
    agent: proxyAgent // Si es necesario un proxy
  });

  return await response.json(); // El JSON que devuelve la API de Groq
}
