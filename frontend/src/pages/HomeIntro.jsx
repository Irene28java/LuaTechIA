import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function HomeIntro() {
  const navigate = useNavigate();

  const goToChat = () => {
    navigate("/chat");
  };

  return (
    <section className="relative w-full h-screen flex flex-col items-center justify-center text-center bg-[#030b17] overflow-hidden">
      {/* Fondos con blur */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/10 blur-[160px]" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-600/10 blur-[160px]" />

      {/* Título */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-[#19e0ff] via-[#1f7bff] to-[#2341ff] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(0,150,255,0.3)]"
      >
        LúaTechIA
      </motion.h1>

      {/* Subtítulo */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 1 }}
        className="text-gray-300 text-xl md:text-2xl mt-6 max-w-xl"
      >
        Un mundo de aprendizaje emocional, visual y personalizado.
      </motion.p>

      {/* Botón Continuar */}
      <motion.button
        onClick={goToChat}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="absolute bottom-24 px-8 py-3 rounded-full text-lg font-semibold bg-gradient-to-r from-[#1f7bff] to-[#19e0ff] text-white shadow-lg hover:shadow-[0_0_25px_rgba(30,150,255,0.6)] hover:scale-105 transition-all duration-300"
      >
        Continuar
      </motion.button>

      {/* Flecha animada */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 flex flex-col items-center select-none"
      >
        <motion.span
          animate={{ y: [0, 6, 0], opacity: [1, 0.4, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-2xl text-gray-300"
        >
          ↓
        </motion.span>
      </motion.div>
    </section>
  );
}
