export function buildEvaluationPrompt({ age, question, answer }) {
  return `
Evalúa la siguiente respuesta de un alumno de ${age} años:

Pregunta:
"${question}"

Respuesta del alumno:
"${answer}"

Devuelve JSON con:
{
  "score": 0-100,
  "feedback": "string",
  "conceptsToReview": ["string"],
  "nextActivity": "string"
}
`;
}
 