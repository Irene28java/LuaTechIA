//backend/route/pdf.js
import express from "express";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const router = express.Router();

router.post("/generate", async (req, res) => {
  try {
    const { 
      title = "Evaluación LúaTechIA",
      student = "",
      age = "",
      subject = "",
      evaluationData = {},
      notes = "",
      boardImageDataUrl
    } = req.body;

    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage([595, 842]); // A4
    const { height } = page.getSize();

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    let y = height - 40;

    // ---------- TÍTULO ----------
    page.drawText(title, { x: 40, y, font: bold, size: 20, color: rgb(0.15, 0.25, 0.45) });
    y -= 30;

    page.drawText(`Alumno: ${student}`, { x: 40, y, font });
    page.drawText(`Edad: ${age}`, { x: 300, y, font });
    y -= 25;

    page.drawText(`Asignatura: ${subject}`, { x: 40, y, font });
    y -= 35;

    // ---------- RESUMEN ----------
    page.drawText("Resumen:", { x: 40, y, font: bold, size: 14 });
    y -= 20;

    const summaryLines = wrapText(evaluationData.summary || "Sin resumen.", 80);
    for (const line of summaryLines) {
      page.drawText(line, { x: 40, y, font, size: 11 });
      y -= 13;
    }
    y -= 10;

    // ---------- PREGUNTAS ----------
    if (Array.isArray(evaluationData.questions)) {
      page.drawText("Preguntas:", { x: 40, y, font: bold, size: 14 });
      y -= 18;

      for (const q of evaluationData.questions) {
        const qLines = wrapText("Q: " + q.q, 85);
        for (const l of qLines) {
          if (y < 60) { page = pdfDoc.addPage(); y = height - 40; }
          page.drawText(l, { x: 40, y, font, size: 11 });
          y -= 13;
        }
        const aLines = wrapText("A: " + q.a, 85);
        for (const l of aLines) {
          if (y < 60) { page = pdfDoc.addPage(); y = height - 40; }
          page.drawText(l, { x: 60, y, font, size: 11 });
          y -= 13;
        }
        y -= 8;
      }
    }

    // ---------- NOTAS ----------
    if (notes) {
      if (y < 80) { page = pdfDoc.addPage(); y = height - 40; }
      page.drawText("Notas:", { x: 40, y, font: bold, size: 14 });
      y -= 18;

      for (const line of wrapText(notes, 85)) {
        page.drawText(line, { x: 40, y, font, size: 11 });
        y -= 13;
      }
    }

    // ---------- IMAGEN (opcional) ----------
    if (boardImageDataUrl) {
      const matches = boardImageDataUrl.match(/^data:(image\/\w+);base64,(.+)$/);
      if (matches) {
        const type = matches[1];
        const imgBytes = Buffer.from(matches[2], "base64");

        let img = type.includes("png")
          ? await pdfDoc.embedPng(imgBytes)
          : await pdfDoc.embedJpg(imgBytes);

        const imgPage = pdfDoc.addPage([595, 842]);
        const imgDims = img.scaleToFit(540, 700);
        imgPage.drawImage(img, { x: 30, y: 842 - imgDims.height - 30 });
      }
    }

    const pdfBytes = await pdfDoc.save();
    res.setHeader("Content-Type", "application/pdf");
    res.send(Buffer.from(pdfBytes));

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error generando PDF" });
  }
});

function wrapText(text, maxChars = 80) {
  const words = text.split(" ");
  const lines = [];
  let current = "";
  for (const w of words) {
    if ((current + " " + w).trim().length > maxChars) {
      lines.push(current.trim());
      current = w;
    } else current += " " + w;
  }
  if (current.trim()) lines.push(current.trim());
  return lines;
}

export default router;
