import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import PaymentModal from "../components/PaymentModal.jsx";

export default function Subscription() {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plans = [
    {
      id: "freemium",
      title: "Plan Gratuito",
      price: "0€",
      features: [
        "Hasta 15 mensajes diarios",
        "Respuestas más pausadas",
        "Historial de conversación limitado",
        "Ideal para conocer cómo Lúa acompaña y explica",
      ],
      color: "border-[#19e0ff]/30",
    },
    {
      id: "monthly",
      title: "Plan Familiar y Educativo",
      price: "16,99€ / mes",
      features: [
        "Mensajes ilimitados",
        "Acompañamiento educativo diario en casa o en clase",
        "Explicaciones adaptadas a la edad y nivel",
        "Creación de actividades, ejercicios y exámenes",
        "Menos discusiones con los deberes, más autonomía",
      ],
      color: "border-[#1f7bff]/40",
    },
    {
      id: "annual",
      title: "Plan Familiar y Educativo Anual",
      price: "179,99€ / año",
      features: [
        "Todo lo incluido en el plan mensual",
        "Uso continuo para familias y profesores",
        "Ahorro de tiempo en casa y en el aula",
        "Soporte prioritario",
        "Un acompañamiento estable durante todo el curso",
      ],
      color: "border-[#2341ff]/40",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-[#344759ff] text-white px-6 py-12 flex flex-col items-center relative overflow-hidden">

      <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/10 blur-[160px]" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-600/10 blur-[160px]" />

      <h1 className="text-5xl font-extrabold mb-6 text-center bg-gradient-to-r 
        from-[#19e0ff] via-[#1f7bff] to-[#2341ff] bg-clip-text text-transparent">
        Planes de LúaTechIA
      </h1>

      <p className="max-w-xl text-center mb-4 text-gray-200">
        Elige el tipo de acompañamiento educativo que mejor encaje con tu familia o tu aula.
      </p>

      {/* FRASE CLAVE ANTES DE PAGAR */}
      <p className="max-w-xl text-center mb-12 text-gray-300 italic">
        Estás a punto de ofrecer a tu hijo o a tus alumnos un apoyo educativo constante,
        sin presión, sin juicios y a su ritmo.
      </p>

      <div className="flex flex-col gap-10 w-full max-w-xl">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`group relative border ${plan.color} rounded-2xl p-8 shadow-xl 
            bg-white/10 backdrop-blur-xl 
            hover:bg-white/20 hover:shadow-2xl transition-all duration-300`}
          >
            <h2 className="text-3xl font-bold text-[#19e0ff] mb-2">
              {plan.title}
            </h2>

            <p className="text-4xl font-extrabold text-white mb-4">
              {plan.price}
            </p>

            <ul className="mb-6 space-y-2 text-gray-200">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-gray-100">
                  <span className="w-2 h-2 bg-[#19e0ff] rounded-full"></span>
                  {feature}
                </li>
              ))}
            </ul>

            <button
              onClick={() =>
                user?.email
                  ? setSelectedPlan(plan.id)
                  : alert("Debes iniciar sesión para suscribirte")
              }
              className="w-full py-3 rounded-xl bg-gradient-to-r 
                from-[#1f7bff] to-[#19e0ff] text-white font-medium
                hover:scale-[1.03] shadow-lg hover:shadow-[0_0_25px_rgba(30,150,255,0.5)]
                transition-all"
            >
              Suscribirse
            </button>
          </div>
        ))}
      </div>

      {selectedPlan && user?.email && (
        <PaymentModal
          planId={selectedPlan}
          email={user.email}
          onClose={() => setSelectedPlan(null)}
        />
      )}
    </div>
  );
}
