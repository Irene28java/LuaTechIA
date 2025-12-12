//backend>services>huggingface.js

import axios from "axios";

export async function hfGenerate(prompt) {
  try {
    const res = await axios.post(
      "https://api-inference.huggingface.co/models/google/flan-t5-xl",
      { inputs: prompt },
      {
        headers: { Authorization: `Bearer ${process.env.HF_API_KEY}` },
        timeout: 60000
      }
    );

    if (res.data.error) throw new Error(res.data.error);

    if (Array.isArray(res.data) && res.data[0].generated_text) {
      return res.data[0].generated_text;
    } else {
      return "No se generó texto";
    }
  } catch (err) {
    console.error("Error HuggingFace:", err.message);
    return "Error en la generación de texto";
  }
}
