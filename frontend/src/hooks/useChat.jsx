// hooks/useChat.js
import { useState, useRef, useEffect } from "react";
import { EventSourcePolyfill } from "event-source-polyfill";

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
      `Veo que estás cansad@ 😴. Podemos hacer una actividad más ligera o un mini descanso.`,
      `Parece que hoy has trabajado mucho. ¿Quieres un ejercicio divertido y corto sobre ${subject}?`,
      `Si quieres, podemos repasar algo de ${subject} con juegos rápidos para que no te agotes.`
    );
  }
  if (text.includes("triste") || text.includes("aburrido") || text.includes("deprimido")) {
    respuestas.push(
      `Siento que te sientas así 💛. ¿Quieres hablar un poco o prefieres hacer algo creativo de ${subject}?`,
      `Vamos a cambiar un poco la energía 😃. ¿Qué tal una actividad divertida de ${subject}?`,
      `Está bien sentirse triste a veces. Podemos hacer un mini juego o ejercicio de ${subject} para animarte.`
    );
  }
  if (text.includes("estresado") || text.includes("enojado") || text.includes("frustrado")) {
    respuestas.push(
      `Parece que estás frustrad@ 😟. Respira hondo. Podemos hacer un repaso suave de ${subject}.`,
      `Está bien sentirse así. Hagamos algo fácil y divertido de ${subject} para relajarnos.`,
      `Vamos a convertir el estrés en aprendizaje con una actividad corta de ${subject}.`
    );
  }

  if (respuestas.length > 0) return respuestas[Math.floor(Math.random() * respuestas.length)];
  if (role === "padre") return "Estoy aquí para ayudarte a acompañar a tu hijo/a y ofrecer actividades adaptadas. 💙";
  if (role === "profesor") return "Estoy aquí para ayudarte a preparar actividades educativas variadas y ahorrar tiempo. 🤍";
  return null;
}

// -------------------- HOOK USECHAT --------------------
export function useChat({ onError }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const eventSourceRef = useRef(null);

  // Agregar o actualizar último mensaje de assistant en tiempo real
  const addOrUpdateAssistantMessage = (text) => {
    setMessages(prev => {
      const newMessages = [...prev];
      const lastMsg = newMessages[newMessages.length - 1];
      if (lastMsg?.role === "assistant") {
        lastMsg.text = text;
      } else {
        newMessages.push({ role: "assistant", text, time: new Date().toLocaleTimeString() });
      }
      return newMessages;
    });
  };

  const addMessage = (msg) => setMessages(prev => [...prev, msg]);

  const saveMessage = async (msg) => {
    try {
      await fetch("/api/projects/auto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          folderName: "Chat AI",
          title: `Mensaje ${new Date().toLocaleTimeString()}`,
          type: "chat",
          content: msg.text || msg.content
        })
      });
    } catch (err) {
      console.error("Error guardando mensaje:", err);
    }
  };

  const sendMessage = async ({ message, role = "child", age = 7, subject = "naturales", specialNeeds = [] }) => {
    if (!message.trim()) return;

    const mat = allowedSubjects.includes(subject.toLowerCase()) ? subject.toLowerCase() : "naturales";

    // 1️⃣ Respuesta emocional rápida
    const emo = emotionalResponse(message, role, age, mat);
    if (emo) {
      const emoMsg = { role: "assistant", text: emo, time: new Date().toLocaleTimeString() };
      addMessage({ role: "user", text: message, time: new Date().toLocaleTimeString() });
      addMessage(emoMsg);
      saveMessage(emoMsg);
      return;
    }

    // 2️⃣ Mensaje de usuario
    addMessage({ role: "user", text: message, time: new Date().toLocaleTimeString() });
    setLoading(true);

    // 3️⃣ SSE a backend
    if (eventSourceRef.current) eventSourceRef.current.close();
    const evtSource = new EventSourcePolyfill(`${import.meta.env.VITE_API_URL}/chat/stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, role, age, subject: mat, specialNeeds })
    });
    eventSourceRef.current = evtSource;

    let assistantText = "";

    evtSource.onmessage = async (e) => {
      if (e.data === "[DONE]") {
        addOrUpdateAssistantMessage(assistantText);
        saveMessage({ role: "assistant", text: assistantText });
        setLoading(false);
        evtSource.close();
        return;
      }

      if (e.data.startsWith("Lo siento")) {
        assistantText = e.data;
        addOrUpdateAssistantMessage(assistantText);
        setLoading(false);
        evtSource.close();
        if (onError) onError(new Error(e.data));

        // Fallback
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/chat/fallback`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message, role, age, subject: mat, specialNeeds })
          });
          const data = await res.json();
          assistantText = data.response;
          addOrUpdateAssistantMessage(assistantText);
          saveMessage({ role: "assistant", text: assistantText });
        } catch (err2) {
          console.error("Fallback failed:", err2);
          if (onError) onError(err2);
        }
        return;
      }

      // 4️⃣ Acumula chunks en tiempo real
      assistantText += e.data;
      addOrUpdateAssistantMessage(assistantText);
    };

    evtSource.onerror = async (err) => {
      console.error("SSE error:", err);
      evtSource.close();
      setLoading(false);
      if (onError) onError(err);

      // Fallback
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/chat/fallback`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message, role, age, subject: mat, specialNeeds })
        });
        const data = await res.json();
        assistantText = data.response;
        addOrUpdateAssistantMessage(assistantText);
        saveMessage({ role: "assistant", text: assistantText });
      } catch (err2) {
        console.error("Fallback failed:", err2);
        if (onError) onError(err2);
      }
    };
  };

  useEffect(() => {
    return () => { if (eventSourceRef.current) eventSourceRef.current.close(); };
  }, []);

  return { messages, sendMessage, loading };
}
