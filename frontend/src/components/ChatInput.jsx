import { FiSend, FiPaperclip } from "react-icons/fi";
import { useRef } from "react";

export default function ChatInput({ input, setInput, onSend }) {
  const fileRef = useRef(null);

  return (
    <div
      className="
        bg-white/40 border border-white/40 backdrop-blur-xl
        rounded-2xl px-4 py-3 flex items-center gap-3 shadow-xl
        custom-scroll
      "
      style={{ maxHeight: "90px" }} // Para permitir scroll si hay contenido
    >
      {/* 📎 Adjuntar archivo */}
      <button
        onClick={() => fileRef.current.click()}
        className="p-2 rounded-lg hover:bg-white/50 transition"
      >
        <FiPaperclip className="text-[#6c7a8c] text-xl" />
      </button>

      <input
        type="file"
        ref={fileRef}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) console.log("Archivo adjuntado:", file);
        }}
      />

      {/* ✏️ Input texto */}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Escribe un mensaje..."
        className="
          flex-1 bg-transparent outline-none 
          placeholder-gray-500 text-[#5b6475]
          custom-scroll
        "
      />

      {/* ➤ Enviar */}
      <button
        onClick={onSend}
        className="
          p-3 rounded-xl 
          bg-[#b4c8ff] hover:bg-[#a4b8ff] 
          transition shadow-md
        "
      >
        <FiSend className="text-white text-xl" />
      </button>
    </div>
  );
}
