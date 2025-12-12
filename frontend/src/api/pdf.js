import jsPDF from "jspdf";
import "jspdf-autotable";

// Función para generar PDF de evaluación
export async function generateEvaluationPDF({ title, student, age, subject, evaluationData, notes }) {
  const doc = new jsPDF();

  // ------------------ PORTADA ------------------
  doc.setFontSize(22);
  doc.setTextColor("#4b0082");
  doc.text(title, 105, 40, { align: "center" });
  doc.setFontSize(16);
  doc.setTextColor("#333");
  doc.text(`Alumno: ${student}`, 105, 60, { align: "center" });
  doc.text(`Edad: ${age} años`, 105, 70, { align: "center" });
  doc.text(`Asignatura: ${subject}`, 105, 80, { align: "center" });
  doc.setFontSize(12);
  doc.setTextColor("#666");
  doc.text(notes, 105, 100, { align: "center" });

  doc.addPage();

  // ------------------ PREGUNTAS ------------------
  evaluationData.questions.forEach((q, i) => {
    const startY = 20 + i * 25;
    doc.setFontSize(12);
    doc.setTextColor("#000");
    doc.text(`${i + 1}. ${q.question}`, 15, startY);

    q.options.forEach((opt, j) => {
      const boxEmoji = j === q.correct ? "☑️" : "⬜";
      doc.text(`${boxEmoji} ${opt}`, 20, startY + (j + 1) * 7);
    });
  });

  // ------------------ RÚBRICA DE EVALUACIÓN ------------------
  doc.addPage();
  doc.setFontSize(16);
  doc.setTextColor("#4b0082");
  doc.text("Rúbrica de Evaluación 📋", 105, 20, { align: "center" });

  doc.setFontSize(12);
  doc.setTextColor("#333");
  doc.text("✅ 90-100%: Excelente 👍", 20, 40);
  doc.text("✅ 75-89%: Bien 😊", 20, 50);
  doc.text("✅ 50-74%: Suficiente 😐", 20, 60);
  doc.text("❌ <50%: Necesita mejorar 😟", 20, 70);

  // ------------------ DESCARGAR PDF ------------------
  const blob = doc.output("blob");
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${title.replace(/\s+/g, "_")}_${student}.pdf`;
  a.click();
  window.URL.revokeObjectURL(url);
}
