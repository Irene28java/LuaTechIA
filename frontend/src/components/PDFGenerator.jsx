import React, { useState } from "react";
import axios from "axios";

export default function PDFGenerator() {
  const [form, setForm] = useState({
    title: "Examen personalizado",
    student: "",
    age: "",
    subject: "",
    notes: "",
  });

  const [questions, setQuestions] = useState([{ q: "", a: "" }]);
  const [boardImage, setBoardImage] = useState(null);

  const changeForm = (k, v) => setForm({ ...form, [k]: v });

  const addQuestion = () =>
    setQuestions([...questions, { q: "", a: "" }]);

  const changeQuestion = (i, field, value) => {
    const clone = [...questions];
    clone[i][field] = value;
    setQuestions(clone);
  };

  const uploadImage = (e) => {
    const reader = new FileReader();
    reader.onload = () => setBoardImage(reader.result);
    reader.readAsDataURL(e.target.files[0]);
  };

  const generatePDF = async () => {
    try {
      const { data } = await axios.post(
        "/api/pdf/generate",
        {
          ...form,
          evaluationData: { summary: "Auto-generado", questions },
          boardImageDataUrl: boardImage,
        },
        { responseType: "blob" }
      );

      const url = URL.createObjectURL(new Blob([data], { type: "application/pdf" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = `${form.title}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-6 space-y-4 bg-white shadow rounded">
      <h2 className="text-xl font-bold">Generar PDF</h2>

      <input
        className="input"
        placeholder="Título"
        value={form.title}
        onChange={(e) => changeForm("title", e.target.value)}
      />

      <input className="input" placeholder="Alumno" value={form.student} onChange={(e) => changeForm("student", e.target.value)} />

      <input className="input" placeholder="Edad" value={form.age} onChange={(e) => changeForm("age", e.target.value)} />

      <input className="input" placeholder="Asignatura" value={form.subject} onChange={(e) => changeForm("subject", e.target.value)} />

      <textarea className="input" placeholder="Notas" value={form.notes} onChange={(e) => changeForm("notes", e.target.value)} />

      <h3 className="font-bold">Preguntas</h3>

      {questions.map((q, i) => (
        <div key={i} className="space-y-2">
          <input className="input" placeholder="Pregunta" value={q.q} onChange={(e) => changeQuestion(i, "q", e.target.value)} />
          <input className="input" placeholder="Respuesta" value={q.a} onChange={(e) => changeQuestion(i, "a", e.target.value)} />
        </div>
      ))}

      <button className="btn bg-gray-500 text-white" onClick={addQuestion}>
        Añadir pregunta
      </button>

      <div>
        <label>Imagen (opcional):</label>
        <input type="file" accept="image/*" onChange={uploadImage} />
      </div>

      <button className="btn bg-blue-600 text-white" onClick={generatePDF}>
        Generar PDF
      </button>
    </div>
  );
}
