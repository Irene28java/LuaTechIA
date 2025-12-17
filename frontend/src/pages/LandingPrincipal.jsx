import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { motion } from "framer-motion";

export default function LandingPrincipal() {
  const [errorMessage, setErrorMessage] = useState("");

  const handleGoogleLogin = async (response) => {
    const { credential } = response;

    try {
      const result = await axios.post("/api/auth/google-login", {
        token: credential,
      });

      const { token, user } = result.data;
      localStorage.setItem("authToken", token);

      console.log("Usuario autenticado:", user);
      // window.location.href = "/home-intro";
    } catch (err) {
      console.error("Error:", err);
      setErrorMessage("Hubo un problema con la autenticación de Google.");
    }
  };

  // Animación fade + slide
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#050b1d] via-[#08122e] to-[#040814] text-white flex flex-col items-center px-6 py-12 overflow-y-auto">

      {/* CONTENEDOR PRINCIPAL */}
      <motion.div 
        className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mt-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >

        {/* IZQUIERDA */}
        <div className="space-y-8 text-center lg:text-left">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
              Lúa
            </span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Refuerzo escolar seguro y adaptado para niños, familias y profesores.  
            <br />
            Explica, acompaña y motiva sin juzgar.
          </p>

          <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
            <button className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold shadow-xl hover:scale-105 transition">
              Empezar con Lúa
            </button>

            <div className="bg-white rounded-2xl px-4 py-2 shadow-xl">
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() =>
                  setErrorMessage("Error al iniciar sesión con Google")
                }
                size="large"
                width="260"
              />
            </div>
          </div>

          {errorMessage && (
            <p className="text-red-400 text-sm mt-2">{errorMessage}</p>
          )}
        </div>

        {/* DERECHA - IMAGEN */}
        <motion.div 
          className="relative flex justify-center mt-8 lg:mt-0"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ hidden: { opacity: 0, x: 50 }, visible: { opacity: 1, x: 0, transition: { duration: 0.6 } } }}
        >
          <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/10 max-w-md w-full">
            <img
              src="/images/landing-classroom.png"
              alt="Acompañamiento educativo con Lúa"
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>
      </motion.div>

      {/* BLOQUE: PARA QUIÉN ES */}
      <motion.div 
        className="w-full px-6 py-14 mt-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">

          <motion.div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-lg hover:scale-105 transition" variants={fadeInUp}>
            <h3 className="text-xl font-bold mb-3">👨‍👩‍👧 Familias</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Ayuda a tu hijo con los deberes sin discusiones ni estrés.  
              Lúa explica con calma, se adapta a su edad y refuerza su confianza.
            </p>
          </motion.div>

          <motion.div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-lg hover:scale-105 transition" variants={fadeInUp}>
            <h3 className="text-xl font-bold mb-3">🧑‍🏫 Profesores</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Crea actividades, exámenes y refuerzos adaptados al nivel de tus alumnos.  
              Ahorra tiempo y mejora la comprensión en clase sin perder tu esencia docente.
            </p>
          </motion.div>

          <motion.div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-lg hover:scale-105 transition" variants={fadeInUp}>
            <h3 className="text-xl font-bold mb-3">🧒 Niños</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Pregunta sin miedo. Aprende paso a paso, a tu ritmo.  
              Lúa está para ayudarte, no para examinarte.
            </p>
          </motion.div>

        </div>
      </motion.div>

      {/* MINI CASO REAL */}
      <motion.div className="max-w-3xl text-center mt-10 px-6" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
        <p className="text-lg text-slate-300 italic leading-relaxed">
          “Tengo 7 años y no entiendo las divisiones.”  
          <br /><br />
          Lúa responde paso a paso, con ejemplos sencillos y sin decir que está mal:  
          <span className="block mt-3 text-white font-medium">
            “Vamos a hacerlo juntos, como un juego, y lo repetimos las veces que quieras.”
          </span>
        </p>
      </motion.div>

      {/* FRASE FINAL */}
      <motion.div className="mt-14 text-center px-6" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
        <p className="text-xl text-slate-200 font-medium">
          Un tutor educativo con IA que acompaña, explica y refuerza.
        </p>
        <p className="text-slate-400 mt-2">
          Sin prisas. Sin juicios. Sin sustituir a las personas.
        </p>
      </motion.div>
    </div>
  );
}
