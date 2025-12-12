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
import ChatWorkspace from "./pages/ChatWorkspace.jsx";

// Sidebar de ejemplo para el workspace
function Sidebar() {
  return (
    <div className="w-64 bg-gray-800 text-white p-4 flex flex-col">
      <h2 className="text-xl font-bold mb-4">Sidebar</h2>
      <p>Opciones del menú</p>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* ---------------- RUTAS PÚBLICAS ---------------- */}
          <Route path="/" element={<LandingPrincipal />} />
          <Route path="/login" element={<Login />} />

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

          {/* ---------------- WORKSPACE TIPO CHATGPT ---------------- */}
          <Route
            path="/workspace"
            element={
              <PrivateRoute>
                <ChatWorkspace sidebarProps={{ component: Sidebar, props: {} }} />
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
