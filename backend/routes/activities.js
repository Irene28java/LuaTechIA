//Backend/routes/activities.js 
import express from 'express';
const router = express.Router();

// Lista base de actividades
const activities = [
  { id: "resumen", name: "Resumen", icon: "📘", levels: ["parvulos","primaria"], subjects: ["naturales","ingles","lengua","sociales","matematicas"] },
  { id: "mapa-mental", name: "Mapa Mental", icon: "🧠", levels: ["parvulos","primaria"], subjects: ["naturales","ingles","lengua","sociales","matematicas"] },
  { id: "tarjetas", name: "Tarjetas Didácticas", icon: "🗂️", levels: ["parvulos","primaria"], subjects: ["naturales","ingles","lengua","sociales","matematicas"] },
  { id: "examen", name: "Examen / Tarea", icon: "✅", levels: ["primaria"], subjects: ["naturales","ingles","lengua","sociales","matematicas"] },
  { id: "pizarra", name: "Pizarra", icon: "🖍️", levels: ["parvulos","primaria"], subjects: ["naturales","ingles","lengua","sociales","matematicas"] },
  { id: "ayuda-tdah", name: "Ayuda TDAH", icon: "⚡", levels: ["parvulos","primaria"], subjects: ["naturales","ingles","lengua","sociales","matematicas"] },
  { id: "dislexia", name: "Dislexia", icon: "👁️", levels: ["parvulos","primaria"], subjects: ["naturales","ingles","lengua","sociales","matematicas"] },
];

router.get("/", (req,res) => {
  const role = req.query.role || "alumno"; // rol del usuario
  const subject = req.query.subject?.toLowerCase(); // materia
  const childName = req.query.childName || "Nombre del niño";
  const childSurname = req.query.childSurname || "Apellido";

  // ✅ Solo padres o profesores pueden ver las plantillas
  if (!["padre","profesor"].includes(role)) {
    return res.status(403).json({ error: "No autorizado para ver plantillas" });
  }

  // Nivel por edad opcional
  const age = parseInt(req.query.age) || 7;
  const level = age < 6 ? "parvulos" : "primaria";

  let filtered = activities;

  // Filtrar por materia
  if(subject) filtered = filtered.filter(a => a.subjects.includes(subject));

  // Filtrar por nivel
  filtered = filtered.filter(a => a.levels.includes(level));

  // Adjuntar nombre y apellido para mostrar en plantilla
  filtered = filtered.map(a => ({ ...a, childName, childSurname }));

  res.json({ activities: filtered });
});

export default router;
