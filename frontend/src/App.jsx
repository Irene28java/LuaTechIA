// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";

// Páginas
import LandingPrincipal from "./pages/LandingPrincipal.jsx";
import Login from "./pages/Login.jsx";
import HomeIntro from "./pages/HomeIntro.jsx";
import Subscription from "./pages/Subscription.jsx";
import ChatAdvance from "./pages/ChatAdvance.jsx";



// Componentes
import GoogleDriveKLM from "./components/google/GoogleDriveKLM.jsx"; // Asegúrate de que la ruta sea correcta

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* ---------------- RUTAS PÚBLICAS ---------------- */}
          <Route path="/" element={<LandingPrincipal />} />
          <Route path="/login" element={<Login />} />

          {/* ---------------- INICIO CONEXIÓN CON GOOGLE ---------------- */}
          <Route path="/google-drive" element={<GoogleDriveKLM />} />
          {/* Puedes agregar la ruta de GoogleDriveKLM donde quieras */}
          
          {/* ---------------- RUTAS PRIVADAS ---------------- */}
          <Route
            path="/home-intro"
            element={
              <PrivateRoute>
                <HomeIntro />
              </PrivateRoute>
            }
          />
          <Route
            path="/subscription"
            element={
              <PrivateRoute>
                <Subscription />
              </PrivateRoute>
            }
          />
          {/* ---------------- WORKSPACE PRINCIPAL ---------------- */}
          <Route
            path="/workspace"
            element={
              <PrivateRoute>
                <ChatAdvance />
              </PrivateRoute>
            }
          />

          {/* ---------------- REDIRECCIÓN POR DEFECTO ---------------- */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
