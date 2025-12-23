import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useChat } from "../hooks/useChat.js";

import Topbar from "../components/Topbar.jsx";
import ChatBubble from "../components/ChatBubble.jsx";
import ChatInput from "../components/ChatInput.jsx";
import Sidebar from "../components/Sidebar.jsx";
import Modal from "../components/Modal.jsx";
import Subscription from "./Subscription.jsx";
import SkyLayout from "../layout/SkyLayout";

const MAX_MESSAGES_FREE = 15;
const MAX_VISIBLE_MESSAGES_FREE = 10;
const LOCAL_STORAGE_KEY = "chat_free_message_count";

export default function ChatAdvanced() {
  const { user: authUser } = useAuth();
  const { messages, sendMessage, loading, abort } = useChat();

  const [role, setRole] = useState("niño");
  const [age, setAge] = useState(8);
  const [subject, setSubject] = useState("naturales");
  const [specialNeeds, setSpecialNeeds] = useState([]);
  const [input, setInput] = useState("");
  const [showSubscription, setShowSubscription] = useState(false);

  const [messageCount, setMessageCount] = useState(() => {
    if (authUser) return 0;
    return Number(localStorage.getItem(LOCAL_STORAGE_KEY)) || 0;
  });

  const messagesEndRef = useRef(null);

  const getTime = () => {
    const d = new Date();
    return `${d.getHours().toString().padStart(2,"0")}:${d.getMinutes().toString().padStart(2,"0")}`;
  };

  const getWelcomeMessage = () => {
    if (role === "niño") return "¡Hola! 🤍 Soy Lúa.\nEstoy aquí para ayudarte paso a paso, a tu ritmo.";
    if (role === "profe") return "Hola, soy Lúa.\nTe ayudo a crear actividades educativas claras y adaptadas.";
    return "Hola, soy Lúa.\nAcompaño a familias con explicaciones tranquilas.";
  };

  const getRemainingNotice = (remaining) => {
    if (remaining === 3) return "🤍 Te quedan 3 mensajes gratuitos.";
    if (remaining === 2) return "🤍 Te quedan 2 mensajes.";
    if (remaining === 1) return "🤍 Este es el último mensaje gratuito.";
    return null;
  };

  useEffect(() => {
    if (messages.length === 0) {
      sendMessage({ message: getWelcomeMessage(), role: "system", time: getTime() });
    }
    // eslint-disable-next-line
  }, [role]);

  const handleSend = () => {
    if (!input.trim()) return;

    if (!authUser && messageCount >= MAX_MESSAGES_FREE) {
      setShowSubscription(true);
      return;
    }

    const newCount = messageCount + 1;
    if (!authUser) {
      setMessageCount(newCount);
      localStorage.setItem(LOCAL_STORAGE_KEY, newCount);
    }

    sendMessage({ message: input, role, age, subject, specialNeeds, time: getTime() });

    const notice = getRemainingNotice(MAX_MESSAGES_FREE - newCount);
    if (notice) {
      setTimeout(() => {
        sendMessage({ message: notice, role: "system", time: getTime() });
      }, 400);
    }

    setInput("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const visibleMessages =
    !authUser && messages.length > MAX_VISIBLE_MESSAGES_FREE
      ? messages.slice(-MAX_VISIBLE_MESSAGES_FREE)
      : messages;

  return (
    <SkyLayout
      sidebar={
        <Sidebar
          age={age}
          subject={subject}
          specialNeeds={specialNeeds}
          onChangeAge={setAge}
          onChangeSubject={setSubject}
          onToggleNeed={(n) =>
            setSpecialNeeds((p) =>
              p.includes(n) ? p.filter(x => x !== n) : [...p, n]
            )
          }
          onSelectFolder={() => {}}
          onSelectTemplate={() => {}}
        />
      }
    >
      <Topbar
        title="Aula virtual"
        user={authUser}
        role={role}
        onChangeRole={setRole}
        onUpgradeClick={() => setShowSubscription(true)}
        onAbort={abort}
      />

      <div className="flex-1 overflow-y-auto">
        {visibleMessages.map((m, i) => (
          <ChatBubble key={i} {...m} />
        ))}
        {loading && (
          <ChatBubble
            role="assistant"
            text="Lúa está pensando con calma"
            time={getTime()}
          />
        )}
        <div ref={messagesEndRef} />
      </div>

      <ChatInput input={input} setInput={setInput} onSend={handleSend} />

      {showSubscription && (
        <Modal onClose={() => setShowSubscription(false)}>
          <Subscription />
        </Modal>
      )}
    </SkyLayout>
  );
}
