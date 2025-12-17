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
const WARNING_THRESHOLDS = [3, 2, 1];
const MAX_VISIBLE_MESSAGES_FREE = 10;
const LOCAL_STORAGE_KEY = "chat_free_message_count";

// ------------------ COMPONENTE ------------------
export default function ChatAdvanced() {
  const { user: authUser } = useAuth();

  const [user, setUser] = useState(authUser || null);
  const [role, setRole] = useState("niño");

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isPreparing, setIsPreparing] = useState(false);

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

  const messagesEndRef = useRef(null);

  // ------------------ TIEMPO ------------------
  const getTime = () => {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, "0")}:${String(
      d.getMinutes()
    ).padStart(2, "0")}`;
  };

  // ------------------ MENSAJES HUMANOS ------------------
  const getWelcomeMessage = () => {
    if (role === "niño") {
      return "¡Hola! 🤍 Soy Lúa.\nPuedes preguntarme sin miedo. Estoy aquí para ayudarte paso a paso, a tu ritmo.";
    }

    if (role === "profe") {
      return "Hola, soy Lúa.\nPuedo ayudarte a crear actividades, exámenes y explicaciones adaptadas al nivel de tus alumnos, ahorrándote tiempo sin perder calidad educativa.";
    }

    return "Hola, soy Lúa.\nUn apoyo educativo tranquilo para familias. Ayudo a explicar, reforzar y acompañar sin presión ni discusiones.";
  };

  const getPreparingMessage = () => {
    if (role === "niño") {
      return "Lúa se está preparando para ayudarte 🤍\nEn unos segundos continuamos, tómate tu tiempo.";
    }

    if (role === "profe") {
      return "Preparando una explicación clara y una propuesta educativa adaptable…";
    }

    return "Preparando una explicación clara y tranquila…";
  };

  const getRemainingMessageNotice = (remaining) => {
    if (remaining === 3)
      return "🤍 Seguimos un poquito más.\nTe quedan 3 mensajes para hablar con Lúa.";
    if (remaining === 2)
      return "🤍 Nos queda un momento más juntos.\nTe quedan 2 mensajes.";
    if (remaining === 1)
      return "🤍 Este es el último mensaje de la versión gratuita.\nSi quieres, luego podemos seguir sin límites.";
    return null;
  };

  // ------------------ BIENVENIDA AUTOMÁTICA ------------------
  useEffect(() => {
    if (messages.length === 0) {
      setTimeout(() => {
        setMessages([
          {
            role: "assistant",
            text: getWelcomeMessage(),
            time: getTime(),
          },
        ]);
      }, 600);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  // ------------------ ENVÍO ------------------
  const sendMessage = (text, roleMessage = "user") => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { role: roleMessage, text, time: getTime() }]);
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;

    // BLOQUEO FINAL
    if (!user && messageCount >= MAX_MESSAGES_FREE) {
      setShowSubscription(true);
      return;
    }

    sendMessage(text, "user");

    if (!user) {
      const newCount = messageCount + 1;
      setMessageCount(newCount);
      localStorage.setItem(LOCAL_STORAGE_KEY, newCount.toString());

      const remaining = MAX_MESSAGES_FREE - newCount;
      const notice = getRemainingMessageNotice(remaining);

      if (notice) {
        setTimeout(() => {
          sendMessage(notice, "assistant");
        }, 600);
      }
    }

    setInput("");
    setIsPreparing(true);

    // RESPUESTA DE LÚA (simulada / backend real aquí)
    setTimeout(() => {
      setIsPreparing(false);
      sendMessage(
        "Vamos a verlo juntos 😊\nExplícamelo un poco más o dime dónde te has quedado.",
        "assistant"
      );
    }, 1200);
  };

  // ------------------ EXÁMENES (SE MANTIENE) ------------------
  const detectExamRequest = (text) => {
    const triggers = ["examen", "prueba", "evaluación", "test"];
    return triggers.some((t) => text.toLowerCase().includes(t));
  };

  const autoGenerateExam = async () => {
    await generateEvaluationPDF({
      title: `Examen de ${subject}`,
      student: user?.name || "Alumno",
      age,
      subject,
      evaluationData: Array.from({ length: 20 }).map((_, i) => ({
        q: `Pregunta ${i + 1}`,
        a: "Respuesta esperada",
      })),
    });
  };

  // ------------------ SCROLL ------------------
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isPreparing]);

  // ------------------ HISTORIAL LIMITADO FREE ------------------
  const visibleMessages =
    !user && messages.length > MAX_VISIBLE_MESSAGES_FREE
      ? messages.slice(-MAX_VISIBLE_MESSAGES_FREE)
      : messages;

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
        onSelectFolder={() => {}}
        onSelectTemplate={() => {}}
      />

      <main className="flex-1 ml-4 rounded-3xl bg-white/30 p-6 flex flex-col">
        <Topbar
          user={authUser || user}
          role={role}
          onChangeRole={setRole}
          onLoginClick={() => setUser({ name: "Usuario", age })}
          onUpgradeClick={() => setShowSubscription(true)}
        />

        <div className="flex-1 overflow-y-auto">
          {visibleMessages.map((m, i) => (
            <ChatBubble key={i} {...m} />
          ))}

          {!user && messages.length > MAX_VISIBLE_MESSAGES_FREE && (
            <div className="text-center text-sm text-gray-500 my-3">
              El historial completo está disponible con un plan de acompañamiento 🤍
            </div>
          )}

          {isPreparing && (
            <ChatBubble
              role="assistant"
              text={getPreparingMessage()}
              time={getTime()}
            />
          )}

          <div ref={messagesEndRef} />
        </div>

        <ChatInput input={input} setInput={setInput} onSend={handleSend} />
      </main>

      {showSubscription && (
        <Modal onClose={() => setShowSubscription(false)}>
          <Subscription onClose={() => setShowSubscription(false)} />
        </Modal>
      )}
    </div>
  );
}
