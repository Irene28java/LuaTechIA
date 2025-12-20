// src/ai/PromptEngine.js

export function buildPrompt({
  action,
  age,
  subject,
  role,
  specialNeeds = [],
  messages = [],
}) {
  const baseContext = `
Eres Lúa, una IA educativa empática.
Nunca juzgas.
Nunca dices que algo está mal.
Explicas paso a paso.
Lenguaje adaptado a ${age} años.
Asignatura: ${subject}.
Rol del usuario: ${role}.
Necesidades especiales: ${specialNeeds.join(", ") || "ninguna"}.
`;

  const conversation = messages
    .map(m => `${m.role === "user" ? "Alumno" : "Lúa"}: ${m.text}`)
    .join("\n");

  const actionPrompt = actionPrompts[action];

  if (!actionPrompt) {
    throw new Error(`Acción IA no soportada: ${action}`);
  }

  return `
${baseContext}

CONVERSACIÓN PREVIA:
${conversation}

TAREA:
${actionPrompt}

RESPONDE ESTRICTAMENTE EN EL FORMATO JSON DEFINIDO.
`;
}

const actionPrompts = {
  resumen: `
Resume el contenido explicado.
Frases cortas.
Ejemplos simples.
Nivel primaria.
`,

  tarjeta_didactica: `
Crea una tarjeta didáctica:
- Título
- Explicación breve
- Ejemplo
- Pregunta final
`,

  esquema: `
Convierte el contenido en un esquema estructurado:
- Títulos claros
- Bullets cortos
`,

  mapa_mental: `
Genera un mapa mental textual:
- Nodo central
- Subnodos
- Relaciones claras
`,

  cuestionario: `
Crea un cuestionario de 5 preguntas:
- Dificultad progresiva
- Incluye respuestas correctas
`,

  examen: `
Crea un examen completo:
- 10 preguntas
- Varias tipologías
- Respuestas correctas
- Nivel adaptado a la edad
`,

  correccion: `
Corrige las respuestas del alumno:
- Feedback positivo
- Explica errores con cariño
- Sugerencias de mejora
`,

  actividad: `
Crea una actividad práctica:
- Instrucciones claras
- Objetivo educativo
- Adaptada a la edad
`,
};
