// src/pages/ChatWorkspace.jsx
import React, { useState, useEffect } from "react";
import { Rnd } from "react-rnd";

import ChatAdvanced from "./ChatAdvanced.jsx";
import Activities from "../components/Activities.jsx";
import Tasks from "../components/Tasks.jsx";
import Quizzes from "../components/Quizzes.jsx";
import Whiteboard from "../components/Whiteboard.jsx";
import PDFGenerator from "../components/PDFGenerator.jsx";
import Templates from "../components/Templates.jsx";

export default function ChatWorkspace({ sidebarProps }) {
  const [openModule, setOpenModule] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const modules = {
    activities: { component: Activities, width: 600, height: 400 },
    tasks: { component: Tasks, width: 600, height: 400 },
    quizzes: { component: Quizzes, width: 600, height: 400 },
    whiteboard: { component: Whiteboard, width: 700, height: 500 },
    pdf: { component: PDFGenerator, width: 600, height: 500 },
    templates: { component: Templates, width: 500, height: 300 },
  };

  useEffect(() => {
    const resize = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 bg-white/30 backdrop-blur-2xl
        border-r border-white/20 shadow-2xl transform transition-transform
        duration-300 md:static md:translate-x-0 w-72 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <sidebarProps.component {...sidebarProps.props} />
      </div>

      {/* Mobile toggle */}
      <button
        className="fixed top-4 left-4 z-60 md:hidden p-2 bg-blue-600
        text-white rounded-xl shadow-lg"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        ☰
      </button>

      {/* MAIN */}
      <div className="flex-1 relative bg-gradient-to-b from-[#0b1124] to-[#1a1f38] text-white">

        {/* CHAT PRINCIPAL */}
        <ChatAdvanced />

        {/* TOOLBAR */}
        <div className="absolute top-4 right-4 flex gap-2 z-40">
          {Object.keys(modules).map(key => (
            <button
              key={key}
              onClick={() => setOpenModule(key)}
              className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500"
            >
              {key}
            </button>
          ))}
        </div>

        {/* MODULOS FLOTANTES — NO SE TOCA */}
        {openModule && (
          <Rnd
            default={{
              x: 80,
              y: 80,
              width: Math.min(modules[openModule].width, windowSize.width * 0.9),
              height: Math.min(modules[openModule].height, windowSize.height * 0.7),
            }}
            bounds="parent"
            className="bg-white/10 backdrop-blur-xl rounded-xl shadow-2xl z-50"
          >
            <div className="h-full flex flex-col">
              <div className="flex justify-end p-2">
                <button onClick={() => setOpenModule(null)}>✕</button>
              </div>
              <div className="flex-1 p-4 overflow-auto">
                {React.createElement(modules[openModule].component)}
              </div>
            </div>
          </Rnd>
        )}
      </div>
    </div>
  );
}
