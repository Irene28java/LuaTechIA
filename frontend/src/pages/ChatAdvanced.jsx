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
  console.log("[ChatAdvanced] componente cargado");

  const { user: authUser } = useAuth();

  const [user, setUser] = useState(authUser || null);
  const [role, setRole] = useState("niño");

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // ------------------ DEBUG ------------------
  const [debugLogs, setDebugLogs] = useState([]);

  const logDebug = (msg) => {
    console.log(msg);
    setDebugLogs((prev) => [...prev, msg]);
  };

  logDebug("[ChatAdvanced] render ejecutado");
  logDebug(`[ChatAdvanced] Sidebar import: ${typeof Sidebar}`);
  logDebug(`[ChatAdvanced] Topbar import: ${typeof Topbar}`);

  // ------------------ MENSAJES FREE ------------------
  const [messageCount, setMessageCount] = useState(() => {
    if (authUser) return 0;
    return parseInt(localStorage.getItem(LOCAL_STORAGE_KEY)) || 0;
  });

  // ------------------ CONFIG ESTUDIANTE ------------------
  const [age, setAge] = useState(8);
  const [subject, setSubject] = useState("naturales");
  const [specialNeeds, setSpecialNeeds] = useState([]);

  // ------------------ MODAL ------------------
  const [showSubscription, setShowSubscription] = useState(false);
  const handleUpgrade = () => setShowSubscription(true);

  const messagesEndRef = useRef(null);

  // ------------------ TIEMPO ------------------
  const getTime = () => {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  };

  // ------------------ ENVÍO ------------------
  const sendMessage = (text, roleMessage = "user") => {
    if (!text.trim()) return;
    logDebug(`[ChatAdvanced] sendMessage → ${roleMessage}: ${text}`);
    setMessages((prev) => [...prev, { role: roleMessage, text, time: getTime() }]);
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;

    if (!user && messageCount >= MAX_MESSAGES_FREE) {
      logDebug("[ChatAdvanced] límite FREE alcanzado → modal");
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
      logDebug("[ChatAdvanced] solicitud de examen detectada");
      autoGenerateExam(text);
    }

    setInput("");
  };

  // ------------------ EXÁMENES ------------------
  const detectExamRequest = (text) => {
    const triggers = ["examen", "prueba", "evaluación", "test"];
    return triggers.some((t) => text.toLowerCase().includes(t));
  };

  const autoGenerateExam = (userText) => {
    logDebug("[ChatAdvanced] autoGenerateExam ejecutado");

    const examMsg = {
      role: "assistant",
      type: "exam",
      title: `Examen de ${subject}`,
      subject,
      questions: Array.from({ length: 20 }).map((_, i) => ({
        q: `Pregunta ${i + 1}`,
        a: "Respuesta esperada",
      })),
    };

    setTimeout(() => {
      processAssistantMessage(examMsg);
    }, 800);
  };

  const processAssistantMessage = async (assistantMsg) => {
    logDebug("[ChatAdvanced] processAssistantMessage");

    if (assistantMsg.type === "exam") {
      await generateEvaluationPDF({
        title: assistantMsg.title,
        student: user?.name || "Alumno",
        age,
        subject,
        evaluationData: assistantMsg.questions,
      });
    }
  };

  // ------------------ SCROLL ------------------
  useEffect(() => {
    logDebug("[ChatAdvanced] scroll ejecutado");
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ------------------ RENDER ------------------
  return (
    <div className="w-full h-screen flex bg-gradient-to-br from-[#f4dbe7] to-[#e5d4f6] p-4">
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
        onSelectFolder={(f) => logDebug(`[Sidebar] carpeta: ${f}`)}
        onSelectTemplate={(t) => logDebug(`[Sidebar] template: ${t}`)}
      />

      <main className="flex-1 ml-4 rounded-3xl bg-white/30 p-6 flex flex-col">
        <Topbar
          user={authUser || user}
          role={role}
          onChangeRole={setRole}
          onLoginClick={() => setUser({ name: "Usuario", age })}
          onUpgradeClick={handleUpgrade}
        />

        <div className="flex-1 overflow-y-auto">
          {messages.map((m, i) => (
            <ChatBubble key={i} {...m} />
          ))}
          <div ref={messagesEndRef} />
        </div>

        <ChatInput input={input} setInput={setInput} onSend={handleSend} />

        {/* PANEL DEBUG */}
        {import.meta.env.DEV && (
          <div className="mt-2 p-2 text-xs bg-black text-green-400 rounded max-h-40 overflow-y-auto">
            <strong>DEBUG ChatAdvanced</strong>
            <ul>
              {debugLogs.map((l, i) => (
                <li key={i}>{l}</li>
              ))}
            </ul>
          </div>
        )}
      </main>

      {showSubscription && (
        <Modal onClose={() => setShowSubscription(false)}>
          <Subscription onClose={() => setShowSubscription(false)} />
        </Modal>
      )}
    </div>
  );
}
