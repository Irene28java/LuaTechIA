import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import SkyLayout from "../layout/SkyLayout";

export default function HomeIntro() {
  const navigate = useNavigate();

  return (
    <SkyLayout sidebar={null}>
      <section className="relative w-full min-h-[70vh] flex flex-col items-center justify-center text-center overflow-hidden px-4">

        {/* TÍTULO */}
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="
            text-6xl md:text-7xl font-extrabold
            bg-gradient-to-r from-sky-400 to-blue-600
            bg-clip-text text-transparent
          "
        >
          Bienvenido a Lúa
        </motion.h1>

        {/* SUBTÍTULO */}
        <motion.p
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-slate-600 text-xl md:text-2xl mt-6 max-w-xl"
        >
          Aquí aprender es tranquilo.
          <br />
          Aquí equivocarse está bien.
        </motion.p>

        {/* FRASE EMOCIONAL */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-slate-500 text-lg mt-4 max-w-md"
        >
          Lúa te acompaña paso a paso,
          adaptándose a tu ritmo y a tus necesidades.
        </motion.p>

        {/* CTA */}
        <motion.button
          onClick={() => navigate("/chat")}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="
            mt-12 px-10 py-4 rounded-2xl
            bg-gradient-to-r from-cyan-500 to-blue-600
            text-white text-lg font-semibold
            shadow-xl hover:scale-105 transition
          "
        >
          Entrar al aula
        </motion.button>

      </section>
    </SkyLayout>
  );
}
