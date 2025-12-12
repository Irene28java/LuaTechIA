// src/layouts/MainLayout.jsx
import { useState, useRef, useEffect, useCallback } from "react";
import Sidebar from "../components/sidebar";
import Topbar from "../components/Topbar";
import ChatBubble from "../components/ChatBubble";
import ChatInput from "../components/ChatInput";
import useChat from "../hooks/useChat";

export default function MainLayout() {
  const { messages, addMessage, sendMessage } = useChat();
  const [input, setInput] = useState("");
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("niño");
  const [age, setAge] = useState(7);
  const [subject, setSubject] = useState("matematicas");
  const [specialNeeds, setSpecialNeeds] = useState([]);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = useCallback(() => {
    sendMessage({ text: input, role, age, subject, specialNeeds });
    setInput("");
  }, [input, role, age, subject, specialNeeds, sendMessage]);

  const generatePDF = async () => {
    try {
      const res = await fetch("/api/pdf/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Evaluación LúaTechIA",
          student: user?.name || "Alumno",
          age,
          subject,
          evaluationData: {
            summary: "Resumen automático del chat",
            questions: messages.map((m, i) => ({ q: `Pregunta ${i+1}`, a: m.text }))
          },
          notes: "Notas generadas automáticamente"
        })
      });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "evaluacion.pdf";
      a.click();
    } catch (err) {
      console.error("Error generando PDF", err);
    }
  };

  const downloadTemplate = async (fileName) => {
    try {
      const res = await fetch(`/api/downloads/${fileName}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
    } catch (err) {
      console.error("Error descargando plantilla", err);
    }
  };

  const fetchActivities = async () => {
    try {
      const res = await fetch(`/api/activities?role=${role}&subject=${subject}&age=${age}`);
      const data = await res.json();
      console.log("Actividades:", data.activities);
    } catch (err) {
      console.error("Error cargando actividades", err);
    }
  };

  const createExam = async (title, data) => {
    try {
      const res = await fetch("/api/exams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, data })
      });
      const exam = await res.json();
      console.log("Examen creado:", exam);
    } catch (err) {
      console.error("Error creando examen", err);
    }
  };

  const saveProjectItem = async (folderName, title, type, content) => {
    try {
      const res = await fetch("/api/projects/auto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folderName, title, type, content })
      });
      const item = await res.json();
      console.log("Proyecto guardado:", item);
    } catch (err) {
      console.error("Error guardando proyecto", err);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#f4dbe7] to-[#e5d4f6] p-4">
      <Sidebar
        age={age}
        subject={subject}
        specialNeeds={specialNeeds}
        onChangeAge={setAge}
        onChangeSubject={setSubject}
        onToggleNeed={(need) =>
          setSpecialNeeds(prev =>
            prev.includes(need) ? prev.filter(n => n !== need) : [...prev, need]
          )
        }
        onSelectFolder={() => {}}
      />

      <main className="flex-1 flex flex-col rounded-3xl bg-white/30 backdrop-blur-2xl border border-white/40 shadow-2xl p-6">
        <Topbar
          user={user}
          role={role}
          onChangeRole={setRole}
          onLoginClick={() => setUser({ name: "Usuario" })}
          onGeneratePDF={generatePDF}
          onFetchActivities={fetchActivities}
          onDownloadTemplate={downloadTemplate}
          onCreateExam={createExam}
          onSaveProject={saveProjectItem}
        />

        <div className="flex-1 overflow-y-auto pr-2 custom-scroll space-y-4">
          {messages.map((m, i) => (
            <ChatBubble key={i} role={m.role} text={m.text} time={m.time} />
          ))}
          <div ref={bottomRef} />
        </div>

        <div className="mt-4">
          <ChatInput input={input} setInput={setInput} onSend={handleSend} />
        </div>
      </main>
    </div>
  );
}
