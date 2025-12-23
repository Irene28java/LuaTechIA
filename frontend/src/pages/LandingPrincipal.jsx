import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import SkyLayout from "../layout/SkyLayout";
import TopBar from "../components/TopBar";

export default function LandingPrincipal() {
  const navigate = useNavigate();

  return (
    <SkyLayout sidebar={null}>

      <TopBar />

      {/* HERO */}
      <section className="grid lg:grid-cols-2 gap-20 items-center min-h-[70vh]">

        {/* TEXTO */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <h1 className="text-6xl font-extrabold text-sky-700 leading-tight">
            Lúa
          </h1>

          <p className="text-2xl text-slate-600 max-w-xl">
            Refuerzo escolar seguro y adaptado para niños,
            familias y profesores.
          </p>

          <p className="text-lg text-slate-500 max-w-xl">
            Explica, acompaña y motiva sin juzgar.
          </p>

          <button
            onClick={() => navigate("/checkout")}
            className="btn-primary text-lg px-10 py-4"
          >
            Empezar ahora
          </button>
        </motion.div>

        {/* IMAGEN EDUCACIÓN */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex justify-center"
        >
          <img
            src="/images/hero-education.png"
            alt="Refuerzo escolar con Lúa"
            className="rounded-3xl shadow-2xl max-w-md"
          />
        </motion.div>

      </section>

      {/* AUDIENCIAS + MOCKUP */}
      <section className="grid lg:grid-cols-2 gap-20 items-center my-32">

        {/* BLOQUES */}
        <div className="space-y-8">

          {[
            {
              title: "Para familias",
              text: "Apoya a tu hijo/a con los deberes sin discusiones. Lúa acompaña con calma y refuerza su confianza.",
            },
            {
              title: "Para profesores",
              text: "Crea actividades y refuerzos adaptados. Mejora la comprensión y ahorra tiempo.",
            },
            {
              title: "Para niños y niñas",
              text: "Aprende paso a paso. Lúa se adapta a tu ritmo y te explica sin presión.",
            },
          ].map((b, i) => (
            <div key={i} className="glass-soft p-6 space-y-2">
              <h3 className="text-xl font-semibold text-sky-700">
                {b.title}
              </h3>
              <p className="text-slate-600">{b.text}</p>
            </div>
          ))}

        </div>

        {/* MOCKUP CHAT */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center"
        >
          <img
            src="/images/mockup-chat.png"
            alt="Chat de Lúa"
            className="w-[320px] rounded-3xl shadow-2xl"
          />
        </motion.div>

      </section>

    </SkyLayout>
  );
}
