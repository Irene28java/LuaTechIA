// src/ai/aiSchema.js

export const AI_RESPONSE_TYPES = [
  "resumen",
  "tarjeta",
  "esquema",
  "mapa_mental",
  "cuestionario",
  "examen",
  "correccion",
  "actividad",
];

export const AIResponseSchema = {
  type: "string",
  title: "string",
  age: "number",
  subject: "string",
  content: {
    text: "string",
    bullets: "string[]",
    questions: "Array<{ q: string, a: string }>",
    nodes: "Array<{ id: string, label: string, children: string[] }>",
  },
  suggestions: "string[]",
  canExport: "boolean",
  canSave: "boolean",
  recommendedNextAction: "string",
};
