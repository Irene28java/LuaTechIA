import { useState, useRef, useEffect } from "react";
import { EventSourcePolyfill } from "event-source-polyfill";

// Lista de materias permitidas
const allowedSubjects = [
  "naturales","matematicas","lengua","sociales","ingles",
  "educacion artistica","musica","educacion fisica","valores"
];

// -------------------- RESPUESTAS EMOCIONALES --------------------
function emotionalResponse(userMessage, role="child", age=6, subject="general") {
  const text = userMessage.toLowerCase();
  const respuestas = [];

  if (text.includes("cansado") || text.includes("agotado")) {
    respuestas.push(
      `Veo que estás cansad@ 😴. Podemos hacer algo ligero.`,
      `¿Quieres un ejercicio corto y divertido de ${subject}?`
    );
  }

  if (text.includes("triste") || text.includes("aburrido")) {
    respuestas.push(
      `Siento que te sientas así 💛. Estoy contigo.`,
      `¿Hacemos algo creativo de ${subject}?`
    );
  }

  if (text.includes("estresado") || text.includes("frustrado")) {
    respuestas.push(
      `Respiramos juntos 💨. Hagamos algo fácil de ${subject}.`
    );
  }

  if (respuestas.length > 0)
    return respuestas[Math.floor(Math.random() * respuestas.length)];

  if (role === "padre")
    return "Estoy aquí para ayudarte a acompañar el aprendizaje 💙";

  if (role === "profesor")
    return "Te ayudo a crear actividades educativas claras 🤍";

  return null;
}

// -------------------- HOOK useChat --------------------
export function useChat({ onError } = {}) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const eventSourceRef = useRef(null);

  const authToken = localStorage.getItem("authToken");

  const addOrUpdateAssistantMessage = (text) => {
    setMessages(prev => {
      const copy = [...prev];
      const last = copy[copy.length - 1];
      if (last?.role === "assistant") last.text = text;
      else copy.push({ role: "assistant", text, time: new Date().toLocaleTimeString() });
      return copy;
    });
  };

  const addMessage = (msg) => setMessages(prev => [...prev, msg]);

  const saveMessage = async (msg) => {
    try {
      await fetch("/api/supabase/saveMessage", { // Endpoint seguro en backend
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({
          role: msg.role,
          content: msg.text || msg.content,
          timestamp: new Date().toISOString()
        })
      });
    } catch (err) {
      console.error("Error guardando mensaje en Supabase:", err);
    }
  };

  const abort = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
      setLoading(false);
    }
  };

  const sendMessage = async ({ message, role="child", age=7, subject="naturales", specialNeeds=[] }) => {
    if (!message.trim()) return;

    const mat = allowedSubjects.includes(subject.toLowerCase())
      ? subject.toLowerCase()
      : "naturales";

    // 1️⃣ Respuesta emocional inmediata
    const emo = emotionalResponse(message, role, age, mat);
    if (emo) {
      const emoMsg = { role: "assistant", text: emo, time: new Date().toLocaleTimeString() };
      addMessage({ role: "user", text: message, time: new Date().toLocaleTimeString() });
      addMessage(emoMsg);
      saveMessage(emoMsg);
      return;
    }

    // 2️⃣ Mensaje usuario
    addMessage({ role: "user", text: message, time: new Date().toLocaleTimeString() });
    setLoading(true);

    // 3️⃣ SSE
    abort();
    let assistantText = "";

    try {
      const evtSource = new EventSourcePolyfill(
        `${import.meta.env.VITE_API_URL}/chat/stream`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`
          },
          withCredentials: false,
          body: JSON.stringify({
            message,
            role,
            age,
            subject: mat,
            specialNeeds,
            messages
          })
        }
      );

      eventSourceRef.current = evtSource;

      evtSource.onmessage = (e) => {
        if (e.data === "[DONE]") {
          saveMessage({ role: "assistant", text: assistantText });
          setLoading(false);
          evtSource.close();
          return;
        }
        assistantText += e.data;
        addOrUpdateAssistantMessage(assistantText);
      };

      evtSource.onerror = async (err) => {
        console.error("SSE error:", err);
        evtSource.close();
        setLoading(false);
        if (onError) onError(err);

        // 4️⃣ Fallback seguro
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/chat/fallback`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`
            },
            body: JSON.stringify({ message, role, age, subject: mat, specialNeeds })
          });
          const data = await res.json();
          addOrUpdateAssistantMessage(data.response);
          saveMessage({ role: "assistant", text: data.response });
        } catch (err2) {
          console.error("Fallback failed:", err2);
          if (onError) onError(err2);
        }
      };
    } catch (err) {
      console.error("Error iniciando SSE:", err);
      setLoading(false);
      if (onError) onError(err);
    }
  };

  useEffect(() => {
    return () => abort();
  }, []);

  return { messages, sendMessage, loading, abort };
}
