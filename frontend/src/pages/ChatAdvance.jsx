// ------------------ IMPORTS ------------------
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import axios from "axios";

import Topbar from "../components/Topbar";
import ChatBubble from "../components/ChatBubble";
import ChatInput from "../components/ChatInput";
import Sidebar from "../components/sidebar";

import { generateEvaluationPDF } from "../api/pdf.js";

// ------------------ CONSTANTES ------------------
const MAX_MESSAGES_FREE = 15;

// ------------------ COMPONENTE ------------------
export default function ChatAdvanced() {
  const { user } = useAuth(); // <<--- usuario real del sistema

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const [messageCount, setMessageCount] = useState(0);
  const [role, setRole] = useState("niño");

  // Config estudiante
  const [age, setAge] = useState(8);
  const [subject, setSubject] = useState("naturales");
  const [specialNeeds, setSpecialNeeds] = useState([]);

  const messagesEndRef = useRef(null);

  // ------------------ TIEMPO ------------------
  const getTime = () => {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  };

  // ------------------ ENVIAR MENSAJES ------------------
  const sendMessage = (text, roleMessage = "user") => {
    if (!text.trim()) return;

    setMessages((prev) => [...prev, { role: roleMessage, text, time: getTime() }]);
  };

  // ------------------ HANDLE SEND ------------------
  const handleSend = () => {
    if (!input.trim()) return;

    if (!user) {
      alert("⚠️ Estás usando la versión gratuita. Crea una cuenta para guardar tu progreso.");
    }

    if (!user && messageCount >= MAX_MESSAGES_FREE) {
      alert("🚀 Has alcanzado el límite de mensajes. Suscríbete para continuar.");
      return;
    }

    sendMessage(input);
    if (!user) setMessageCount((prev) => prev + 1);

    autoGenerateExam(input); // <<-- se generan exámenes automáticamente
    setInput("");
  };

  // ------------------ GENERACIÓN AUTOMÁTICA DE EXÁMENES ------------------
  const autoGenerateExam = (userText) => {
    const numQuestions = 20;
    const questions = Array.from({ length: numQuestions }).map((_, i) =>
      generateQuestion(subject, age, i)
    );

    const examMsg = {
      role: "assistant",
      type: "exam",
      title: `Examen de ${subject}`,
      subject: subject,
      notes: `Examen adaptado para ${age} años. Incluye respuestas correctas.`,
      questions,
    };

    sendMessage(`Generando examen de ${subject} con ${numQuestions} preguntas...`, "system");

    setTimeout(() => {
      sendMessage("Tu examen está listo. Creando PDF...", "assistant");
      processAssistantMessage(examMsg);
    }, 1000);
  };

  const generateQuestion = (subject, age, index) => {
    const difficulty =
      age <= 7 ? "fácil" : age <= 10 ? "media" : "avanzada";

    return {
      q: `(${difficulty}) Pregunta ${index + 1} sobre ${subject}`,
      options: ["Opción A", "Opción B", "Opción C", "Opción D"],
      correct: Math.floor(Math.random() * 4),
    };
  };

  const processAssistantMessage = async (assistantMessage) => {
    if (assistantMessage.type === "exam") {
      await generateEvaluationPDF({
        title: assistantMessage.title,
        student: user?.name || "Alumno",
        age,
        subject: assistantMessage.subject,
        notes: assistantMessage.notes || "",
        evaluationData: {
          questions: assistantMessage.questions.map((q) => ({
            question: q.q,
            options: q.options,
            correct: q.correct,
          })),
        },
      });
    }
  };

  // ------------------ FOLDERS Y TEMPLATES ------------------
  const handleTemplate = async (template) => {
    sendMessage(`Generando ${template}...`, "system");

    try {
      const res = await axios.get("http://localhost:5000/templates", {
        params: { template, subject },
      });

      setTimeout(() => sendMessage(res.data.content, "assistant"), 1000);
    } catch {
      sendMessage("Error generando plantilla.", "system");
    }
  };

  const handleFolder = async (folder) => {
    sendMessage(`Abriste carpeta: ${folder}`, "system");

    try {
      const res = await axios.get(`http://localhost:5000/folders/${folder}`, {
        params: { subject },
      });

      setTimeout(() => sendMessage(res.data.content, "assistant"), 1200);
    } catch {
      sendMessage(`Error abriendo carpeta ${folder}.`, "system");
    }
  };

  // ------------------ SCROLL AUTOMÁTICO ------------------
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ------------------ RENDER ------------------
  return (
    <div className="w-full h-screen flex bg-gradient-to-br from-[#f4dbe7] to-[#e5d4f6] p-4">
      {/* Sidebar */}
      <Sidebar
        age={age}
        subject={subject}
        specialNeeds={specialNeeds}
        onChangeAge={setAge}
        onChangeSubject={setSubject}
        onToggleNeed={(n) =>
          setSpecialNeeds((prev) =>
            prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n]
          )
        }
        onSelectFolder={handleFolder}
        onSelectTemplate={handleTemplate}
      />

      {/* Chat */}
      <main className="flex-1 h-full ml-4 rounded-3xl bg-white/30 backdrop-blur-2xl border border-white/40 shadow-2xl p-6 flex flex-col">

        {/* Topbar */}
        <Topbar user={user} role={role} onChangeRole={setRole} />

        {/* Contador Freemium */}
        {!user && (
          <div className="text-xs text-right text-[#7b879c] mb-1">
            Mensajes restantes: {MAX_MESSAGES_FREE - messageCount}
          </div>
        )}

        {/* Mensajes */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scroll">
          {messages.map((m, i) => (
            <ChatBubble key={i} {...m} />
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="mt-4">
          <ChatInput input={input} setInput={setInput} onSend={handleSend} />
        </div>
      </main>
    </div>
  );
}
