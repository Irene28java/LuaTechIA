// backend/utils/promptEngine.js
import { AIResponseSchema } from "../schemas/aiResponseSchema.js";
import { tryModelsSequentially } from "./chatAI.js";

/**
 * Motor central de prompts para generar contenido educativo
 * tipo GoogleKLM, adaptado a edad, materia y necesidades especiales.
 *
 * Opciones soportadas:
 * resumen | tarjeta | esquema | mapa_mental | cuestionario | examen | correccion | actividad
 */
export async function runPromptEngine({
  message,
  role = "child",
  age = 7,
  subject = "generales",
  specialNeeds = [],
  onChunk = () => {},
  onEnd = () => {}
}) {
  try {
    // Construir prompt para la IA
    const systemPrompt = `
Eres un asistente educativo experto.
Edad del estudiante: ${age}
Materia: ${subject}
Rol del usuario: ${role}
Necesidades especiales: ${specialNeeds.join(", ") || "ninguna"}

Recibe un mensaje del estudiante/profesor:
"${message}"

Genera una respuesta en JSON que cumpla exactamente con el esquema Zod/AIResponseSchema:

{
  "type": "resumen | tarjeta | esquema | mapa_mental | cuestionario | examen | correccion | actividad",
  "title": "string",
  "age": number,
  "subject": "string",
  "content": {
    "text": "string",
    "bullets": ["string"],
    "questions": [
      { "q": "string", "a": "string" }
    ],
    "nodes": [
      { "id": "string", "label": "string", "children": ["string"] }
    ]
  },
  "suggestions": ["string"],
  "canExport": true,
  "canSave": true,
  "recommendedNextAction": "cuestionario | actividad | tarjeta_didactica"
}

Instrucciones:
- Adapta la complejidad y ejemplos a la edad del niño.
- Devuelve solo JSON válido, sin texto adicional.
- Para mapas mentales, llena "nodes" y "children".
- Para cuestionarios/exámenes, llena "questions" con preguntas y respuestas.
- Para tarjetas, llena "text" y "bullets".
- Incluye siempre "canExport" y "canSave" como true.
- Sugiere la siguiente acción educativa en "recommendedNextAction".
`;

    // Acumulador de chunks
    let accumulatedChunks = "";

    // Ejecutar modelos secuencialmente (Ollama → Hugging Face → otros)
    await tryModelsSequentially({
      message: systemPrompt,
      role,
      age,
      subject,
      specialNeeds,
      onChunk: (chunk) => {
        accumulatedChunks += chunk;
        onChunk(chunk); // enviar al cliente parcial
      },
      onEnd: async () => {
        try {
          const parsed = AIResponseSchema.parse(JSON.parse(accumulatedChunks));
          onChunk(JSON.stringify(parsed)); // enviar JSON final
          await onEnd();
        } catch (err) {
          console.error("[PromptEngine] Error validando JSON:", err.message);
          onChunk(JSON.stringify({
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
          await onEnd();
        }
      }
    });

  } catch (err) {
    console.error("[PromptEngine] Error general:", err.message);
    onChunk(JSON.stringify({
      type: "actividad",
      title: "Error interno",
      age,
      subject,
      content: { text: "Ocurrió un error al generar contenido.", bullets: [], questions: [], nodes: [] },
      suggestions: [],
      canExport: true,
      canSave: true,
      recommendedNextAction: "actividad"
    }));
    await onEnd();
  }
}
