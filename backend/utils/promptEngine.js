// backend/utils/promptEngine.js
import { AIResponseSchema } from "../ai/aiResponseSchema.js";
import { streamChat } from "../services/index.js";
import { buildConversationContext } from "./conversation.js";
import { createEmbedding } from "../services/embeddings.js";
import { retrieveContext } from "./embeddings.js";

export async function runPromptEngine({
  supabase,         // opcional si quieres contexto histórico
  userId,           // opcional, para embeddings y memoria
  message,
  role = "child",
  age = 7,
  subject = "generales",
  specialNeeds = [],
  onChunk = () => {},
  onEnd = () => {}
}) {
  try {
    // 🔹 Construir contexto conversacional previo
    let conversationContext = "";
    if (supabase && userId) {
      conversationContext = await buildConversationContext({
        supabase,
        userId,
        newMessage: message
      });
    }

    // 🔹 Recuperar embeddings educativos
    let relevantContextText = "";
    if (supabase && userId) {
      const userEmbedding = await createEmbedding(message);
      const relevantContext = await retrieveContext(supabase, userId, userEmbedding);
      relevantContextText = relevantContext.data?.map(r => r.content).join("\n") || "Ninguno";
    }

    // 🔹 Prompt final para la IA
    const systemPrompt = `
${conversationContext}

CONTEXTOS EDUCATIVOS RELEVANTES:
${relevantContextText}

Mensaje del usuario:
"${message}"

Devuelve SOLO JSON válido que cumpla EXACTAMENTE este esquema (sin texto adicional):
${JSON.stringify(AIResponseSchema.shape, null, 2)}
`;

    let accumulated = "";

    // 🔹 Ejecutar el streaming
    await streamChat({
      prompt: systemPrompt,
      meta: { role, age, subject, specialNeeds },
      onChunk: (chunk) => {
        accumulated += chunk;
        onChunk(chunk);
      }
    });

    // 🔹 Parsear y validar JSON final
    try {
      const parsed = AIResponseSchema.parse(JSON.parse(accumulated));
      onChunk(JSON.stringify(parsed));
    } catch (err) {
      console.error("[PromptEngine] JSON inválido:", err.message);
      onChunk(JSON.stringify({
        type: "actividad",
        title: "Error de generación",
        age,
        subject,
        content: { text: "No se pudo generar contenido válido.", bullets: [], questions: [], nodes: [] },
        suggestions: [],
        canExport: true,
        canSave: true,
        recommendedNextAction: "actividad"
      }));
    }

    await onEnd();

  } catch (err) {
    console.error("[PromptEngine] Error general:", err.message);
    onChunk(JSON.stringify({ error: "Error interno 😅" }));
    await onEnd();
  }
}
