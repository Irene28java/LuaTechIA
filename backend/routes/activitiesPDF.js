// backend/routes/activitiesPDF.js
import express from 'express';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

const router = express.Router();

// Lista base de actividades
const activities = [
  { id: "resumen", name: "Resumen", icon: "📘", levels: ["parvulos","primaria"], subjects: ["naturales","ingles","lengua","sociales","matematicas"] },
  { id: "mapa-mental", name: "Mapa Mental", icon: "🧠", levels: ["parvulos","primaria"], subjects: ["naturales","ingles","lengua","sociales","matematicas"] },
  { id: "tarjetas", name: "Tarjetas Didácticas", icon: "🗂️", levels: ["parvulos","primaria"], subjects: ["naturales","ingles","lengua","sociales","matematicas"] },
  { id: "examen", name: "Examen / Tarea", icon: "✅", levels: ["primaria"], subjects: ["naturales","ingles","lengua","sociales","matematicas"] },
  { id: "pizarra", name: "Pizarra", icon: "🖍️", levels: ["parvulos","primaria"], subjects: ["naturales","ingles","lengua","sociales","matematicas"] },
  { id: "ayuda-tdah", name: "Ayuda TDAH", icon: "⚡", levels: ["parvulos","primaria"], subjects: ["naturales","ingles","lengua","sociales","matematicas"], special: true },
  { id: "dislexia", name: "Dislexia", icon: "👁️", levels: ["parvulos","primaria"], subjects: ["naturales","ingles","lengua","sociales","matematicas"], special: true },
];

router.get("/pdf", async (req, res) => {
  try {
    const role = req.query.role || "alumno";
    const subject = req.query.subject?.toLowerCase();
    const childName = req.query.childName || "Nombre";
    const childSurname = req.query.childSurname || "Apellido";
    const age = parseInt(req.query.age) || 7;
    const level = age < 6 ? "parvulos" : "primaria";

    if (!["padre","profesor"].includes(role)) {
      return res.status(403).json({ error: "No autorizado" });
    }

    let filtered = activities.filter(a => a.levels.includes(level));
    if (subject) filtered = filtered.filter(a => a.subjects.includes(subject));

    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage([595, 842]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    let y = 800;

    // Cabecera
    page.drawText("Plantilla de Actividades", { x: 50, y, size: 22, font, color: rgb(0,0,0.6) });
    y -= 30;
    page.drawText(`Alumno: ${childName} ${childSurname}`, { x: 50, y, size: 16, font });
    y -= 20;
    page.drawText(`Materia: ${subject ? subject.charAt(0).toUpperCase() + subject.slice(1) : "General"}`, { x: 50, y, size: 14, font });
    y -= 30;

    // Encabezado de tabla
    page.drawText("Icono", { x: 50, y, size: 12, font, color: rgb(0.1,0.1,0.1) });
    page.drawText("Nombre", { x: 100, y, size: 12, font });
    page.drawText("Nivel", { x: 300, y, size: 12, font });
    page.drawText("Materia", { x: 400, y, size: 12, font });
    y -= 20;

    // Dibujar actividades
    for (const act of filtered) {
      if (y < 50) {
        page = pdfDoc.addPage([595, 842]);
        y = 800;
      }

      const color = act.special ? rgb(1,0,0) : rgb(0,0,0); // actividades especiales en rojo
      page.drawText(act.icon, { x: 50, y, size: 14, font, color });
      page.drawText(act.name + (act.special ? " *" : ""), { x: 100, y, size: 14, font, color });
      page.drawText(level.charAt(0).toUpperCase() + level.slice(1), { x: 300, y, size: 14, font, color });
      page.drawText(subject ? subject.charAt(0).toUpperCase() + subject.slice(1) : "General", { x: 400, y, size: 14, font, color });
      y -= 25;
    }

    const pdfBytes = await pdfDoc.save();
    res.setHeader("Content-Disposition", `attachment; filename="plantilla_${childName}.pdf"`);
    res.setHeader("Content-Type", "application/pdf");
    res.send(Buffer.from(pdfBytes));

  } catch (err) {
    console.error("Error generando PDF avanzado:", err);
    res.status(500).json({ error: "No se pudo generar PDF" });
  }
});

export default router;
