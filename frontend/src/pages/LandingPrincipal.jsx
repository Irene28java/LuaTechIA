import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { GoogleLogin } from "@react-oauth/google"; // Importa la librería de Google
import axios from "axios"; // Para hacer peticiones HTTP
import { FaPlay } from "react-icons/fa"; // Para el ícono del botón "play"

export default function LandingPrincipal() {
  const [errorMessage, setErrorMessage] = useState(""); // Para manejar errores

  // Función que se ejecuta después de un login exitoso con Google
  const handleGoogleLogin = async (response) => {
    const { credential } = response; // El 'credential' contiene el idToken

    try {
      const result = await axios.post("/api/auth/google-login", {
        token: credential, // Asegúrate de enviar el idToken aquí
      });

      // Guarda el token y el usuario que el backend devuelve
      const { token, user } = result.data;
      console.log("Usuario autenticado", user);

      // Almacena el JWT recibido (podrías usarlo para autorización en futuras peticiones)
      localStorage.setItem("authToken", token);

      // Redirigir al usuario a otro lugar si lo deseas
      // window.location.href = "/dashboard"; // O cualquier ruta donde quieras enviar al usuario

    } catch (err) {
      console.error("Error al autenticar con Google:", err);
      setErrorMessage("Hubo un problema con la autenticación de Google.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#050b1d] via-[#08122e] to-[#040814] text-white flex items-center justify-center px-6">
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* LEFT SECTION */}
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
            <button className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold shadow-xl hover:scale-105 transition">
              Empezar ahora
            </button>

            {/* Custom Google Login Button */}
            <button
              onClick={() => handleGoogleLogin()}
              className="flex items-center gap-4 px-8 py-4 rounded-2xl bg-white text-slate-900 font-semibold shadow-xl hover:bg-slate-100 transition"
            >
              <FcGoogle size={22} />
              <span>Welcome back FRIEND. Enjoy learning with LúaTechIA</span>
            </button>

            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          </div>
        </div>

        {/* RIGHT SECTION */}
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

      {/* Círculo con el gráfico y el botón Play */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 via-purple-600 to-yellow-400 flex justify-center items-center shadow-lg">
        <button className="w-12 h-12 rounded-full bg-white text-black flex justify-center items-center shadow-lg">
          <FaPlay size={24} />
        </button>
      </div>

      {/* FEATURES */}
      <div className="w-full px-6 py-10 mt-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-lg hover:scale-105 transition">
            <div className="flex justify-center mb-4">
              {/* Add an icon to the card */}
              <img src="/path/to/icon1.png" alt="Visual Learning Icon" className="w-12 h-12" />
            </div>
            <h3 className="text-xl font-bold mb-2">Aprendizaje Visual</h3>
            <p className="text-slate-300 text-sm">Educación emocional, visual y personalizada.</p>
          </div>
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-lg hover:scale-105 transition">
            <div className="flex justify-center mb-4">
              {/* Add an icon to the card */}
              <img src="public/icons/icon2.png" alt="Active Participation Icon" className="w-12 h-12" />
            </div>
            <h3 className="text-xl font-bold mb-2">Participación Activa</h3>
            <p className="text-slate-300 text-sm">Interacción constante con IA educativa.</p>
          </div>
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-lg hover:scale-105 transition">
            <div className="flex justify-center mb-4">
              {/* Add an icon to the card */}
              <img src="/public/icons/icon3.png" alt="Personalization Icon" className="w-12 h-12" />
            </div>
            <h3 className="text-xl font-bold mb-2">Personalización</h3>
            <p className="text-slate-300 text-sm">Adaptado a cada niño y familia.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
