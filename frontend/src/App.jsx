import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";

// Páginas
import LandingPrincipal from "./pages/LandingPrincipal.jsx";
import Login from "./pages/Login.jsx";
import HomeIntro from "./pages/HomeIntro.jsx";
import Subscription from "./pages/Subscription.jsx";
import ChatAdvance from "./pages/ChatAdvanced.jsx";

// Componentes
import GoogleDriveKLM from "./components/google/GoogleDriveKLM.jsx";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<LandingPrincipal />} />
          <Route path="/login" element={<Login />} />
          <Route path="/workspace" element={<ChatAdvance />} />
          <Route path="/google-drive" element={<GoogleDriveKLM />} />

          {/* Rutas privadas → solo usuarios autenticados */}
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

          {/* Redirección por defecto */}
          <Route path="*" element={<LandingPrincipal />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
