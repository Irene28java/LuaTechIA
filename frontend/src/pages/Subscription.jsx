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
        "Límite de mensajes diarios",
        "Acceso básico a PDFs y materiales",
        "Ideal para probar LúaTechIA",
      ],
      color: "border-[#19e0ff]/30",
    },
    {
      id: "monthly",
      title: "Plan Mensual",
      price: "15,99€ / mes",
      features: [
        "Mensajes ilimitados",
        "Acceso completo a PDFs, materiales y exámenes",
        "Actualizaciones constantes",
      ],
      color: "border-[#1f7bff]/40",
    },
    {
      id: "annual",
      title: "Plan Anual",
      price: "179,99€ / año",
      features: [
        "Todo del plan mensual",
        "Soporte prioritario",
        "Siempre actualizado",
      ],
      color: "border-[#2341ff]/40",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-[#344759ff] text-white px-6 py-12 flex flex-col items-center relative overflow-hidden">

      {/* Fondos con blur como HomeIntro */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/10 blur-[160px]" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-600/10 blur-[160px]" />

      {/* Título */}
      <h1 className="text-5xl font-extrabold mb-8 text-center bg-gradient-to-r 
        from-[#19e0ff] via-[#1f7bff] to-[#2341ff] bg-clip-text text-transparent
      ">
        Planes de LúaTechIA
      </h1>

      <p className="max-w-xl text-center mb-12 text-gray-200">
        Escoge tu plan y continúa explorando el universo de aprendizaje de LúaTechIA.
      </p>

      {/* TARJETAS VERTICALES MODERNAS */}
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
                <li
                  key={i}
                  className="flex items-center gap-2 text-gray-100"
                >
                  <span className="w-2 h-2 bg-[#19e0ff] rounded-full"></span>
                  {feature}
                </li>
              ))}
            </ul>

            {/* BOTÓN */}
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

      {/* MODAL */}
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
