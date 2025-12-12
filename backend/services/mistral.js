//backend>services>mistral.js

import axios from "axios";


export async function mistralChat(prompt) {
  const res = await axios.post("https://api.groq.com/openai/v1/chat/completions", {
    model: "mixtral-8x7b-32768",
    messages: [{ role: "user", content: prompt }]
  }, {
    headers: { "Authorization": `Bearer ${process.env.GROQ_API_KEY}` }
  });

  return res.data.choices[0].message.content;
}
