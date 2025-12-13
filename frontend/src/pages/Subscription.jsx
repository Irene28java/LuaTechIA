// frontend/src/pages/Subscription.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import PaymentModal from "../components/PaymentModal.jsx";

export default function Subscription({ onClose }) {
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
        "Ideal para probar LúaTechIA"
      ],
      color: "bg-blue-100/60 border-blue-200",
    },
    {
      id: "monthly",
      title: "Plan Mensual",
      price: "15,99€ / mes",
      features: [
        "Mensajes ilimitados",
        "Acceso completo a PDFs, materiales y exámenes",
        "Actualizaciones constantes"
      ],
      color: "bg-blue-200/60 border-blue-300",
    },
    {
      id: "annual",
      title: "Plan Anual",
      price: "179,99€ / año",
      features: [
        "Todo del plan mensual",
        "Soporte prioritario",
        "Siempre actualizado con novedades educativas"
      ],
      color: "bg-blue-300/60 border-blue-400",
    },
  ];

  return (
    <div className="min-h-screen bg-blue-900/95 text-slate-200 px-6 py-12 flex flex-col items-center">
      <h1 className="text-5xl font-extrabold text-cyan-400 mb-8 text-center">Planes de LúaTechIA</h1>
      <p className="max-w-xl text-center mb-12 text-slate-300">
        Escoge tu plan y empieza a disfrutar de LúaTechIA sin salir de esta pantalla.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative border-2 ${plan.color} rounded-3xl p-8 flex flex-col items-center justify-between shadow-lg
                        hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer`}
          >
            <h2 className="text-2xl font-bold text-blue-900 mb-4">{plan.title}</h2>
            <p className="text-3xl font-extrabold text-blue-700 mb-6">{plan.price}</p>

            <ul className="mb-6 space-y-2 text-center">
              {plan.features.map((feature, i) => (
                <li key={i} className="text-blue-800 text-sm">{feature}</li>
              ))}
            </ul>

            {/* BOTÓN FLOTANTE */}
            <button
              onClick={() => user?.email ? setSelectedPlan(plan.id) : alert("Debes iniciar sesión para suscribirte")}
              className="absolute bottom-6 opacity-0 group-hover:opacity-100 transition-opacity bg-cyan-500 text-white font-semibold py-2 px-6 rounded-full shadow-lg hover:bg-cyan-600"
            >
              Suscribirse
            </button>
          </div>
        ))}
      </div>

      {/* MODAL DE PAGO */}
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
