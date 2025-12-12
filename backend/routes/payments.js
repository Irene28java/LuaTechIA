// backend/routes/payments.js
import express from "express";
import Stripe from "stripe";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Endpoint para crear PaymentIntent según el plan
router.post("/create-intent", async (req, res) => {
  try {
    const { planId } = req.body;
    if (!planId) return res.status(400).json({ error: "Falta planId" });

    let amount; // monto en céntimos de euro
    let description;

    switch (planId) {
      case "freemium":
        amount = 0; // gratis
        description = "Plan Freemium";
        break;
      case "monthly":
        amount = 1599; // 15,99€
        description = "Plan Mensual";
        break;
      case "annual":
        amount = 17999; // 179,99€
        description = "Plan Anual";
        break;
      default:
        return res.status(400).json({ error: "Plan no válido" });
    }

    // Crear PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "eur",
      description,
      payment_method_types: ["card"],
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error("Stripe PaymentIntent Error:", err);
    res.status(500).json({ error: "Error creando PaymentIntent" });
  }
});

export default router;
