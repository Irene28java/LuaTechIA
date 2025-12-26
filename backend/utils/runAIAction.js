// backend/utils/runAIAction.js
import { runPromptEngine } from "../promptEngine";

/**
 * Wrapper de runPromptEngine para mantener compatibilidad con código antiguo
 * como src/routes/ai.js que llama a runAIAction.
 *
 * Asegura que los chunks parciales y la respuesta final funcionen con SSE.
 */
export async function runAIAction({ message, role, age, subject, specialNeeds = [], onChunk, onEnd }) {
  // Inicializamos callbacks vacíos si no vienen
  const chunkCallback = onChunk || (() => {});
  const endCallback = onEnd || (() => {});

  let accumulatedChunks = "";

  await runPromptEngine({
    message,
    role,
    age,
    subject,
    specialNeeds,
    onChunk: (chunk) => {
      accumulatedChunks += chunk;   // acumulamos los chunks
      chunkCallback(chunk);         // enviamos al frontend si hay SSE
    },
    onEnd: async () => {
      try {
        // Intentamos parsear la respuesta final JSON
        const finalJSON = JSON.parse(accumulatedChunks);
        chunkCallback(JSON.stringify(finalJSON)); // último chunk
      } catch (err) {
        // Si falla, enviamos un fallback
        chunkCallback(JSON.stringify({
          type: "actividad",
          title: "Error al generar contenido",
          age,
          subject,
          content: { text: "No se pudo generar contenido válido.", bullets: [], questions: [], nodes: [] },
          suggestions: [],
          canExport: true,
          canSave: true,
          recommendedNextAction: "actividad"
        }));
      }
      await endCallback();
    }
  });

  // Retornamos los chunks acumulados para quien lo quiera
  return accumulatedChunks;
}
