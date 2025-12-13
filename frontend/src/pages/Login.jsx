// src/pages/Login.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

export default function Login() {
  const { loginWithGoogle, loginWithEmail, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");  // Necesitarás un campo para la contraseña

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const handleEmailLogin = () => {
    // Llamamos a la función loginWithEmail con email y password
    loginWithEmail(email, password);
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-200 dark:from-black dark:to-neutral-900 p-4">
        <div className="w-full max-w-sm bg-white dark:bg-neutral-900 rounded-2xl shadow-xl shadow-black/10 p-6 space-y-6">
          <h1 className="text-2xl font-semibold text-center text-gray-900 dark:text-gray-100">
            Bienvenida de nuevo
          </h1>

          {/* Google Login */}
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={(credentialResponse) => loginWithGoogle(credentialResponse.credential)}
              onError={() => console.log("Google Login fallido")}
            />
          </div>

          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            o inicia sesión con email
          </div>

          {/* Email Login Form */}
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
            />
            <button
              onClick={handleEmailLogin}
              disabled={loading}
              className="w-full bg-black text-white dark:bg-white dark:text-black py-2 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-60"
            >
              {loading ? "Cargando..." : "Acceder"}
            </button>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}
