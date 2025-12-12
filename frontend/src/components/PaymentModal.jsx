// frontend/src/components/PaymentModal.jsx
import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// -------------------- CHECKOUT FORM --------------------
function CheckoutForm({ planId, onClose }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    try {
      const res = await fetch("/api/payments/create-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      const { clientSecret } = await res.json();

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: elements.getElement(CardElement) },
      });

      if (error) {
        alert(error.message);
      } else if (paymentIntent.status === "succeeded") {
        alert("¡Pago completado! ✅");
        onClose();
      }
    } catch (err) {
      console.error(err);
      alert("Error procesando el pago");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 hover:shadow-xl transition-all">
        <CardElement
          options={{
            style: {
              base: {
                color: "#fff",
                fontSize: "16px",
                fontWeight: "500",
                "::placeholder": { color: "rgba(255,255,255,0.5)" },
              },
              invalid: { color: "#ff4d4f" },
            },
          }}
        />
      </div>

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-cyan-500/90 text-white py-3 rounded-xl font-semibold shadow-lg hover:bg-cyan-600/95 transition-all disabled:opacity-60"
      >
        {loading ? "Procesando..." : "Pagar"}
      </button>
    </form>
  );
}

// -------------------- PAYMENT MODAL --------------------
export default function PaymentModal({ planId, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-[#0b1124]/70 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md p-6 scale-90 animate-scaleIn border border-white/20 hover:shadow-3xl transition-all">
        <h2 className="text-white text-2xl font-bold mb-6 text-center tracking-wide">
          Completa tu suscripción
        </h2>

        <Elements stripe={stripePromise}>
          <CheckoutForm planId={planId} onClose={onClose} />
        </Elements>

        <button
          onClick={onClose}
          className="mt-6 w-full py-2 rounded-xl border border-white/30 text-white hover:bg-white/10 transition-all"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
