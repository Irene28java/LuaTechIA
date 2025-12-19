// src/components/Sidebar.jsx
import React from "react";

export default function Sidebar({
  age,
  subject,
  specialNeeds,
  onChangeAge,
  onChangeSubject,
  onToggleNeed,
  onSelectFolder,
  onSelectTemplate,
}) {
  const needs = ["TDAH", "Dislexia", "Epilepsia", "Sordera"];
  const subjects = ["naturales","matematicas","sociales","lengua","ingles","lectura","ortografia"];
  const templates = ["Mapa Mental", "Esquema", "Resumen", "Tarjeta Didáctica"];

  return (
    <aside className="w-[280px] h-full rounded-3xl bg-white/30 backdrop-blur-2xl border border-white/40 shadow-2xl p-6 flex flex-col gap-6 overflow-y-auto custom-scroll">
      
      {/* LOGO */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-7 h-7 bg-[#bbc4d6] rounded-full shadow-inner" />
        <h1 className="text-xl font-semibold text-[#7b879c]">LúaTechIA</h1>
      </div>

      {/* PERFIL DEL ALUMNO */}
      <div>
        <h2 className="text-[#7b879c] font-semibold mb-3">Perfil del Alumno</h2>
        <div className="mb-4">
          <label className="text-[#6c7a8c] text-sm">Edad</label>
          <select
            value={age}
            onChange={(e) => onChangeAge(Number(e.target.value))}
            className="w-full bg-white/40 text-[#6c7a8c] p-2 mt-1 rounded-xl shadow outline-none"
          >
            {Array.from({ length: 11 }).map((_, i) => (
              <option key={i+3} value={i+3}>{i+3} años</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="text-[#6c7a8c] text-sm">Necesidades</label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {needs.map(n => (
              <button
                key={n}
                onClick={() => onToggleNeed(n)}
                className={`p-2 rounded-xl text-sm shadow transition ${
                  specialNeeds.includes(n)
                    ? "bg-[#b0c4ff] text-white"
                    : "bg-white/40 text-[#6c7a8c]"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="text-[#6c7a8c] text-sm">Asignatura</label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {subjects.map(a => (
              <button
                key={a}
                onClick={() => onChangeSubject(a)}
                className={`p-2 rounded-xl text-sm shadow transition capitalize ${
                  subject === a ? "bg-[#b0c4ff] text-white" : "bg-white/40 text-[#6c7a8c]"
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CARPETAS */}
      <div>
        <h2 className="text-[#7b879c] font-semibold mb-2">Carpetas</h2>
        <div className="flex flex-col gap-2">
          {["Proyecto escolar", "Deberes", "Clases", "Exámenes"].map(f => (
            <button
              key={f}
              onClick={() => onSelectFolder(f)}
              className="bg-white/50 text-[#6c7a8c] px-3 py-2 rounded-xl text-sm shadow hover:scale-[1.03] transition"
            >
              {f}
            </button>
          ))}
          <button className="bg-white/40 px-3 py-2 rounded-xl text-[#6c7a8c] text-sm shadow">
            + Añadir carpeta
          </button>
        </div>
      </div>

      {/* PLANTILLAS */}
      <div>
        <h2 className="text-[#7b879c] font-semibold mb-2">Plantillas</h2>
        <div className="flex gap-2 flex-wrap">
          {templates.map(t => (
            <button
              key={t}
              onClick={() => onSelectTemplate(t)}
              className="bg-white/50 px-4 py-2 rounded-xl text-[#6c7a8c] text-sm shadow hover:scale-[1.03] transition"
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
