// frontend/src/components/PaymentModal.jsx
import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function CheckoutForm({ planId, email, onClose }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState("");

  // Crear la suscripción y obtener clientSecret al abrir el modal
  useEffect(() => {
    fetch("/api/payments/create-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planId, email }),
    })
      .then(res => res.json())
      .then(data => setClientSecret(data.clientSecret))
      .catch(err => console.error(err));
  }, [planId, email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    setLoading(true);

    const { error } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: elements.getElement(PaymentElement) },
    });

    if (error) alert(error.message);
    else {
      alert("¡Pago completado! ✅");
      onClose();
    }

    setLoading(false);
  };

  if (!clientSecret) return <p className="text-white">Cargando formulario de pago...</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="p-5 rounded-2xl bg-blue-100/80 backdrop-blur-lg border border-blue-200 hover:shadow-xl transition-all duration-300">
        <PaymentElement />
      </div>

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-blue-300 text-blue-900 py-3 rounded-xl font-semibold shadow-lg hover:bg-blue-200 transition-all disabled:opacity-60"
      >
        {loading ? "Procesando..." : "Pagar"}
      </button>
    </form>
  );
}

export default function PaymentModal({ planId, onClose, email }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-blue-900/90 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md p-6 scale-90 animate-scaleIn border border-blue-700 hover:shadow-3xl transition-all duration-300">
        <h2 className="text-white text-2xl font-bold mb-6 text-center tracking-wide">
          Completa tu suscripción
        </h2>

        <Elements stripe={stripePromise}>
          <CheckoutForm planId={planId} email={email} onClose={onClose} />
        </Elements>

        <button
          onClick={onClose}
          className="mt-6 w-full py-2 rounded-xl border border-blue-200 text-white hover:bg-blue-800 transition-all duration-300"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
