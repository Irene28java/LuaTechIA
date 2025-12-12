import dotenv from "dotenv";
dotenv.config();

export const config = {
  jwt: process.env.JWT_SECRET,
  frontendUrl: process.env.FRONTEND_URL,
  ollama: process.env.OLLAMA_URL || "http://localhost:11434",
  hf: process.env.HUGGINGFACE_TOKEN || "",
  groq: process.env.GROQ_API_KEY || "",
  stripe: process.env.STRIPE_SECRET || ""
};
