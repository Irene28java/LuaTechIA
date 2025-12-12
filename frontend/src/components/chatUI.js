import React, { useState, useRef, useEffect } from "react";
import { useChat } from "../hooks/useChat";

export default function ChatUI() {
  const { messages, sendMessage, loading } = useChat({
    onError: (err) => alert("Error en chat: " + err.message)
  });

  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage({ message: input });
    setInput("");
  };

  // Scroll automático al último mensaje
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", display: "flex", flexDirection: "column", height: "500px", fontFamily: "Arial, sans-serif" }}>
      
      {/* Mensajes */}
      <div style={{ flex: 1, overflowY: "auto", padding: "1rem", border: "1px solid #ccc", borderRadius: "12px", background: "#fefefe" }}>
        {messages.map((m, i) => (
          <div 
            key={i} 
            style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", marginBottom: "0.5rem" }}
          >
            <div style={{
              display: "flex",
              alignItems: "flex-end",
              maxWidth: "75%",
              wordBreak: "break-word"
            }}>
              {/* Avatar */}
              {m.role === "assistant" && (
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#e0e0e0", display: "flex", alignItems: "center", justifyContent: "center", marginRight: "8px" }}>
                  🤖
                </div>
              )}
              {m.role === "user" && (
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#4f93ff", display: "flex", alignItems: "center", justifyContent: "center", marginRight: "8px", color: "#fff" }}>
                  👤
                </div>
              )}

              {/* Burbujas de mensaje */}
              <div style={{
                background: m.role === "user" ? "#4f93ff" : "#e0e0e0",
                color: m.role === "user" ? "#fff" : "#000",
                padding: "0.5rem 1rem",
                borderRadius: "16px",
                borderTopLeftRadius: m.role === "user" ? "16px" : "0px",
                borderTopRightRadius: m.role === "user" ? "0px" : "16px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
              }}>
                {m.text || m.content}
              </div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
        {loading && (
          <div style={{ color: "#888", marginTop: "0.5rem", display: "flex", alignItems: "center" }}>
            <span>Lúa está escribiendo...</span>
            <span style={{ marginLeft: "0.5rem", animation: "blink 1s infinite" }}>💬</span>
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{ display: "flex", marginTop: "0.5rem" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Escribe tu mensaje..."
          style={{
            flex: 1,
            padding: "0.5rem 1rem",
            borderRadius: "20px",
            border: "1px solid #ccc",
            outline: "none"
          }}
        />
        <button
          onClick={handleSend}
          disabled={loading}
          style={{
            marginLeft: "0.5rem",
            padding: "0.5rem 1rem",
            borderRadius: "20px",
            background: "#4f93ff",
            color: "#fff",
            border: "none",
            cursor: "pointer"
          }}
        >
          Enviar
        </button>
      </div>

      {/* Animación de escritura */}
      <style>
        {`
          @keyframes blink {
            0%, 50%, 100% { opacity: 1; }
            25%, 75% { opacity: 0; }
          }
        `}
      </style>
    </div>
  );
}
