// frontend/src/pages/ChatAdvanced.jsx
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext.jsx";

import Topbar from "../components/Topbar.jsx";
import ChatBubble from "../components/ChatBubble.jsx";
import ChatInput from "../components/ChatInput.jsx";
import Sidebar from "../components/Sidebar.jsx";
import Modal from "../components/Modal.jsx";

import Subscription from "./Subscription.jsx";
import { generateEvaluationPDF } from "../api/pdf.js";

// ------------------ CONSTANTES ------------------
const MAX_MESSAGES_FREE = 15;
const LOCAL_STORAGE_KEY = "chat_free_message_count";

// ------------------ COMPONENTE ------------------
export default function ChatAdvanced() {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState(authUser || null);
  const [role, setRole] = useState("niño");

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // Mensajes freemium persistentes
  const [messageCount, setMessageCount] = useState(() => {
    if (authUser) return 0;
    return parseInt(localStorage.getItem(LOCAL_STORAGE_KEY)) || 0;
  });

  // Config estudiante
  const [age, setAge] = useState(8);
  const [subject, setSubject] = useState("naturales");
  const [specialNeeds, setSpecialNeeds] = useState([]);

  // Modal de suscripción
  const [showSubscription, setShowSubscription] = useState(false);
  const handleUpgrade = () => setShowSubscription(true);

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

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;

    // Control para usuarios no autenticados
    if (!user && messageCount >= MAX_MESSAGES_FREE) {
      setShowSubscription(true);
      return;
    }

    sendMessage(text, "user");

    if (!user) {
      const newCount = messageCount + 1;
      setMessageCount(newCount);
      localStorage.setItem(LOCAL_STORAGE_KEY, newCount.toString());
    }

    if (detectExamRequest(text)) {
      autoGenerateExam(text);
    }

    setInput("");
  };

  // ------------------ DETECCIÓN DE EXÁMENES ------------------
  const detectExamRequest = (text) => {
    const lower = text.toLowerCase();
    const triggers = [
      "examen",
      "prueba",
      "evaluación",
      "test",
      "hazme un examen",
      "crea un examen",
      "generar examen",
    ];
    return triggers.some((t) => lower.includes(t));
  };

  // ------------------ GENERACIÓN AUTOMÁTICA DE EXÁMENES ------------------
  const autoGenerateExam = (userText) => {
    let numQuestions = 20;
    const match = userText.match(/(\d+)\s*(preguntas|items|cuestiones)/i);
    if (match) numQuestions = Math.max(20, parseInt(match[1]));

    const examMsg = {
      role: "assistant",
      type: "exam",
      title: `Examen de ${subject}`,
      subject: subject,
      notes: "Examen generado automáticamente.",
      questions: Array.from({ length: numQuestions }).map((_, i) => ({
        q: `Pregunta ${i + 1}: Explica lo relacionado con ${subject}.`,
        a: "Respuesta esperada...",
      })),
    };

    sendMessage(`Generando examen de ${subject} con ${numQuestions} preguntas...`, "system");
    setTimeout(() => {
      sendMessage("Tu examen está listo. Generando PDF...", "assistant");
      processAssistantMessage(examMsg);
    }, 900);
  };

  const processAssistantMessage = async (assistantMsg) => {
    if (assistantMsg.type === "exam") {
      await generateEvaluationPDF({
        title: assistantMsg.title || "Evaluación",
        student: user?.name || "Alumno",
        age: age,
        subject: assistantMsg.subject || subject,
        evaluationData: assistantMsg.questions,
        notes: assistantMsg.notes || "",
      });
    }
  };

  // ------------------ FOLDERS Y TEMPLATES ------------------
  const handleTemplate = (template) => {
    sendMessage(`Generando ${template} para ${subject}...`, "system");
    setTimeout(() => {
      sendMessage(`Aquí tienes tu ${template} de ${subject}: [Contenido generado automáticamente]`, "assistant");
    }, 1000);
  };

  const handleFolder = (folder) => {
    sendMessage(`Abriste la carpeta: ${folder}`, "system");

    // Exámenes
    if (folder === "Exámenes") {
      sendMessage(`Generando examen de ${subject} con 20 preguntas...`, "system");
      setTimeout(() => {
        const examMsg = {
          role: "assistant",
          type: "exam",
          title: `Examen de ${subject}`,
          subject: subject,
          notes: "Examen generado automáticamente.",
          questions: Array.from({ length: 20 }).map((_, i) => ({
            q: `Pregunta ${i + 1}: Explica lo relacionado con ${subject}.`,
            a: "Respuesta esperada...",
          })),
        };
        sendMessage("Tu examen está listo. Generando PDF...", "assistant");
        processAssistantMessage(examMsg);
      }, 1200);
    }

    // Deberes
    if (folder === "Deberes") {
      setTimeout(() => sendMessage(`Actividades de ${subject} listas para Deberes: [Lista generada]`, "assistant"), 1200);
    }

    // Clases
    if (folder === "Clases") {
      setTimeout(() => sendMessage(`Pizarra lista: [Ideas y actividades]`, "assistant"), 1200);
    }

    // Proyecto escolar
    if (folder === "Proyecto escolar") {
      setTimeout(() => sendMessage(`[Proyecto generado con tareas de ${subject}]`, "assistant"), 1200);
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
        <Topbar
          user={authUser || user}
          role={role}
          onChangeRole={setRole}
          onLoginClick={() => setUser({ name: "Usuario", age })}
          onUpgradeClick={handleUpgrade}
        />

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

      {/* Modal de suscripción */}
      {showSubscription && (
        <Modal onClose={() => setShowSubscription(false)}>
          <Subscription onClose={() => setShowSubscription(false)} />
        </Modal>
      )}
    </div>
  );
}
