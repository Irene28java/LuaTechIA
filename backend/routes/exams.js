//backend>routes>exams.js
import express from "express";
import { requirePremium } from "../middlewares/plan.js";
import { authenticate } from "../middlewares/authenticate.js"; 


const router = express.Router();

// Crear examen (solo premium)
router.post("/", requirePremium, async (req, res) => {
  const { title, data, project_id } = req.body;

  const { data: exam, error } = await req.supabase
    .from("exams")
    .insert({ user_id: req.user.id, title, data, project_id })
    .select();

  if (error) return res.status(400).json({ error });
  res.json(exam[0]);
});

// Listar exámenes del usuario
router.get("/", async (req, res) => {
  const { data, error } = await req.supabase
    .from("exams")
    .select("*")
    .eq("user_id", req.user.id);

  if (error) return res.status(400).json({ error });
  res.json(data);
});

export default router;
