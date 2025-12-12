import { useState } from "react";

export default function AiTest() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");

  async function callAPI(route) {
    setResponse("Generando...");

    const res = await fetch(`${import.meta.env.VITE_API_URL}/${route}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();
    setResponse(data.output);
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>TEST IA</h1>

      <textarea
        value={prompt}
        placeholder="Escribe algo..."
        onChange={(e) => setPrompt(e.target.value)}
        rows="5"
        cols="50"
      />

      <br />

      <button onClick={() => callAPI("ollama")}>Usar OLLAMA</button>
      <button onClick={() => callAPI("hf")}>HuggingFace</button>
      <button onClick={() => callAPI("groq")}>Groq</button>

      <pre>{response}</pre>
    </div>
  );
}
