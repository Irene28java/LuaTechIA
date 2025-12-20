import { z } from "zod";

export const AIResponseSchema = z.object({
  type: z.enum([
    "resumen",
    "tarjeta",
    "esquema",
    "mapa_mental",
    "cuestionario",
    "examen",
    "correccion",
    "actividad",
  ]),
  title: z.string(),
  age: z.number(),
  subject: z.string(),

  content: z.object({
    text: z.string().optional(),
    bullets: z.array(z.string()).optional(),
    questions: z
      .array(
        z.object({
          q: z.string(),
          a: z.string(),
        })
      )
      .optional(),
    nodes: z
      .array(
        z.object({
          id: z.string(),
          label: z.string(),
          children: z.array(z.string()),
        })
      )
      .optional(),
  }),

  suggestions: z.array(z.string()),
  canExport: z.boolean(),
  canSave: z.boolean(),
  recommendedNextAction: z.string(),
});
