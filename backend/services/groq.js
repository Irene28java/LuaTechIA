//backend>services>grok.js

import fetch from "node-fetch";
import pkg from "https-proxy-agent";
const { HttpsProxyAgent } = pkg;
import { config } from "../config.js";

// Proxy opcional
const proxyAgent = new HttpsProxyAgent(process.env.HTTPS_PROXY || "http://proxy.fly.dev:8080");

/**
 * Llama a Groq API con proxy si es necesario
 * @param {string} prompt
 */
export async function callGroq(prompt) {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    body: JSON.stringify({
      model: process.env.GROQ_MODEL,
      messages: [{ role: "user", content: prompt }],
    }),
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${config.groq}`,
    },
    agent: proxyAgent
  });

  return await response.json();
}
