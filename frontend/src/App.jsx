import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute.jsx";

import PublicLayout from "./layouts/PublicLayout.jsx";
import MainLayout from "./layouts/MainLayout.jsx";

// 🌍 Páginas públicas
import LandingPrincipal from "./pages/LandingPrincipal.jsx";
import Login from "./pages/Login.jsx";
import Privacy from "./pages/Privacy.jsx";
import Terms from "./pages/Terms.jsx";
import Cookies from "./pages/Cookies.jsx";

// 🔐 Páginas privadas adicionales (si las usas fuera del layout)
import HomeIntro from "./pages/HomeIntro.jsx";
import Subscription from "./pages/Subscription.jsx";

export default function App() {
  return (
    <Router>
      <Routes>

        {/* 🌍 PÚBLICO */}
        <Route
          path="/"
          element={
            <PublicLayout>
              <LandingPrincipal />
            </PublicLayout>
          }
        />

        <Route
          path="/login"
          element={
            <PublicLayout>
              <Login />
            </PublicLayout>
          }
        />

        <Route
          path="/privacy"
          element={
            <PublicLayout>
              <Privacy />
            </PublicLayout>
          }
        />

        <Route
          path="/terms"
          element={
            <PublicLayout>
              <Terms />
            </PublicLayout>
          }
        />

        <Route
          path="/cookies"
          element={
            <PublicLayout>
              <Cookies />
            </PublicLayout>
          }
        />

        {/* 🔐 APP PRIVADA (ESTILO CHATGPT) */}
        <Route
          path="/workspace"
          element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }
        />

        {/* 🔐 PRIVADAS SUELTAS (OPCIONAL) */}
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

        {/* 🔁 FALLBACK */}
        <Route
          path="*"
          element={
            <PublicLayout>
              <LandingPrincipal />
            </PublicLayout>
          }
        />

      </Routes>
    </Router>
  );
}
