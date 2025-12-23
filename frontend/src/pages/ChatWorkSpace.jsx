// src/pages/ChatWorkspace.jsx
import React, { useState, useEffect } from "react";
import { Rnd } from "react-rnd";
import Activities from "../components/Activities.jsx";
import Tasks from "../components/Tasks.jsx";
import Quizzes from "../components/Quizzes.jsx";
import Whiteboard from "../components/Whiteboard.jsx";
import PDFGenerator from "../components/PDFGenerator.jsx";
import Templates from "../components/Templates.jsx";

export default function ChatWorkspace({ sidebarProps }) {
  const [openModule, setOpenModule] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false); // Para móviles
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  const modules = {
    activities: { component: Activities, width: 600, height: 400 },
    tasks: { component: Tasks, width: 600, height: 400 },
    quizzes: { component: Quizzes, width: 600, height: 400 },
    whiteboard: { component: Whiteboard, width: 700, height: 500 },
    pdf: { component: PDFGenerator, width: 600, height: 500 },
    templates: { component: Templates, width: 500, height: 300 },
  };

  // Actualizar tamaño de ventana para mobile responsiveness
  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 bg-white/30 backdrop-blur-2xl border-r border-white/20 shadow-2xl transform transition-transform duration-300 md:static md:translate-x-0 w-72 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <sidebarProps.component {...sidebarProps.props} />
      </div>

      {/* Botón para abrir/cerrar sidebar en móviles */}
      <button
        className="fixed top-4 left-4 z-60 md:hidden p-2 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-500 transition"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? "Cerrar ☰" : "Abrir ☰"}
      </button>

      {/* Área principal */}
      <div className="flex-1 relative p-6 bg-gradient-to-b from-[#0b1124] to-[#1a1f38] text-white overflow-auto custom-scroll">
        <h1 className="text-2xl mb-4 font-semibold">Chat Principal</h1>

        {/* Botones de módulos */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {Object.keys(modules).map((key) => (
            <button
              key={key}
              onClick={() => setOpenModule(key)}
              className={`px-3 py-1 rounded-lg shadow-md text-white font-medium hover:scale-105 transition ${
                key === "activities"
                  ? "bg-cyan-500 hover:bg-cyan-400"
                  : key === "tasks"
                  ? "bg-green-500 hover:bg-green-400"
                  : key === "quizzes"
                  ? "bg-yellow-500 hover:bg-yellow-400"
                  : key === "whiteboard"
                  ? "bg-red-500 hover:bg-red-400"
                  : key === "pdf"
                  ? "bg-blue-600 hover:bg-blue-500"
                  : "bg-purple-500 hover:bg-purple-400"
              }`}
            >
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </button>
          ))}
        </div>

        {/* Módulo flotante */}
        {openModule && (
          <Rnd
            default={{
              x: 50,
              y: 50,
              width: Math.min(modules[openModule].width, windowSize.width * 0.9),
              height: Math.min(modules[openModule].height, windowSize.height * 0.6),
            }}
            minWidth={300}
            minHeight={200}
            bounds="parent"
            className="bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl overflow-auto z-50 border border-white/20"
            enableResizing={{
              top: true,
              right: true,
              bottom: true,
              left: true,
              topRight: true,
              bottomRight: true,
              bottomLeft: true,
              topLeft: true,
            }}
          >
            <div className="relative w-full h-full flex flex-col">
              {/* Barra de cierre */}
              <div className="flex justify-end p-1 bg-white/20 backdrop-blur-sm rounded-t-xl">
                <button
                  onClick={() => setOpenModule(null)}
                  className="text-white font-bold px-3 py-1 rounded hover:bg-red-400 transition"
                >
                  X
                </button>
              </div>

              {/* Contenido del módulo */}
              <div className="flex-1 p-4 overflow-auto text-black bg-white/20 rounded-b-xl custom-scroll">
                {React.createElement(modules[openModule].component)}
              </div>
            </div>
          </Rnd>
        )}
      </div>
    </div>
  );
}
