import fetch from "node-fetch";

export async function createEmbedding(text) {
  const res = await fetch(`${process.env.OLLAMA_BASE}/api/embeddings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "nomic-embed-text",
      prompt: text
    })
  });

  return (await res.json()).embedding;
}
