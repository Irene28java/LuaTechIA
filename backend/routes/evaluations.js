//backend/routes/evaluations.js
import express from "express";
const router = express.Router();

let evaluations = [];  // 🔥 DB temporal (luego pasamos a Mongo o MySQL)

router.post("/", (req, res) => {
  const { student, subject, score, feedback } = req.body;

  const newEval = {
    id: Date.now(),
    student,
    subject,
    score,
    feedback,
    date: new Date().toISOString()
  };

  evaluations.push(newEval);
  res.json({ ok: true, newEval });
});

router.get("/", (req, res) => {
  res.json(evaluations);
});

export default router;
