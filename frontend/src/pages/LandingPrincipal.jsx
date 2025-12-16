import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

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

      // Aquí puedes redirigir cuando tú quieras:
      // window.location.href = "/home-intro";

    } catch (err) {
      console.error("Error:", err);
      setErrorMessage("Hubo un problema con la autenticación de Google.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#050b1d] via-[#08122e] to-[#040814] text-white flex flex-col items-center px-6 py-12 overflow-y-auto">
      
      {/* CONTENEDOR PRINCIPAL */}
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mt-10">

        {/* IZQUIERDA */}
        <div className="space-y-8">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
              LúaTechIA
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-300 max-w-xl">
            Aprendizaje emocional, visual y personalizado para niños, padres y profesores.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            {/* Botón normal */}
            <button className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold shadow-xl hover:scale-105 transition">
              Empezar ahora
            </button>

            {/* Google real */}
            <div className="bg-white rounded-2xl px-4 py-2 shadow-xl">
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => setErrorMessage("Error al iniciar sesión con Google")}
                size="large"
                width="260"
              />
            </div>
          </div>

          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        </div>

        {/* DERECHA - IMAGEN */}
        <div className="relative flex justify-center">
          <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/10 max-w-md">
            <img
              src="/images/landing-classroom.png"
              alt="Educación visual"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* TARJETAS DE FEATURE */}
      <div className="w-full px-6 py-14 mt-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-lg hover:scale-105 transition">
            <h3 className="text-xl font-bold mb-2">Aprendizaje Visual</h3>
            <p className="text-slate-300 text-sm">
              Educación emocional, visual y personalizada.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-lg hover:scale-105 transition">
            <h3 className="text-xl font-bold mb-2">Participación Activa</h3>
            <p className="text-slate-300 text-sm">
              Interacción constante con IA educativa.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-lg hover:scale-105 transition">
            <h3 className="text-xl font-bold mb-2">Personalización</h3>
            <p className="text-slate-300 text-sm">
              Adaptado a cada niño, familia y profesor.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
