import express from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { ageLimiter } from "../middlewares/ageLimiter.js";
import { chatPipelineSSE } from "../middlewares/chatPipelineSSE.js"; // ← CORRECTO
import { createItem, submitItem, gradeItem } from "../utils/items.js";

const router = express.Router();

// GET /items?type=task|quiz|exam
router.get("/", authenticate, async (req, res) => {
  const { type } = req.query;
  const userId = req.user.id;
  const role = req.user.role;

  try {
    let { data: items, error } = await req.supabase
      .from("projects_items")
      .select("*")
      .eq("user_id", userId);

    if (error) throw error;

    if (type) items = items.filter(i => i.type === type || i.type === type + "_entregado");
    if (role !== "teacher") items = items.filter(i => i.assignedTo?.includes(userId));

    res.json({ items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error obteniendo items" });
  }
});

// POST /items
router.post("/", authenticate, async (req, res) => {
  if (!["teacher"].includes(req.user.role)) return res.status(403).json({ error: "Solo profesores" });

  const { type, title, content, assignedTo, subject, templateFile } = req.body;
  try {
    const item = await createItem(req.supabase, req.user.id, { type, title, content, assignedTo, subject, templateFile });
    res.json({ item });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error creando item" });
  }
});

// POST /items/:id/submit
router.post("/:id/submit", authenticate, ageLimiter, async (req, res) => {
  const userId = req.user.id;
  const { content } = req.body;

  try {
    const { data: item } = await req.supabase
      .from("projects_items")
      .select("*")
      .eq("id", req.params.id)
      .single();

    if (!item) return res.status(404).json({ error: "Item no encontrado" });

    const submission = await submitItem(req.supabase, userId, item, content);
    res.json({ message: "Enviado correctamente", submission });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error enviando item" });
  }
});

// POST /items/:id/grade
router.post("/:id/grade", authenticate, async (req, res) => {
  if (req.user.role !== "teacher") return res.status(403).json({ error: "Solo profesores" });

  const { studentId, grade } = req.body;

  try {
    const { data: item } = await req.supabase
      .from("projects_items")
      .select("*")
      .eq("id", req.params.id)
      .single();

    if (!item) return res.status(404).json({ error: "Item no encontrado" });

    const result = await gradeItem(req.supabase, req.user.id, studentId, item, grade);
    res.json({ message: "Calificación guardada", result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error calificando item" });
  }
});

export default router;
