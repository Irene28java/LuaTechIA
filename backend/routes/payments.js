import express from "express";
import Stripe from "stripe";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Endpoint para crear suscripción según el plan
router.post("/create-intent", async (req, res) => {
  try {
    const { planId, email } = req.body;
    if (!planId || !email)
      return res.status(400).json({ error: "Faltan datos" });

    // Mapear plan a Price ID
    const priceMap = {
      freemium: "price_1SUrbqLtdPm4TmKby9HCGcRK",
      monthly: "price_1SUrVlLtdPm4TmKbstO3QNYn",
      annual: "price_1SUrXuLtdPm4TmKba3kzwv0A",
    };

    const priceId = priceMap[planId];
    if (!priceId) return res.status(400).json({ error: "Plan no válido" });

    // Crear cliente en Stripe
    const customer = await stripe.customers.create({ email });

    // Crear suscripción
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      payment_behavior: "default_incomplete",
      expand: ["latest_invoice.payment_intent"],
    });

    // Devolver client_secret para PaymentElement
    res.json({ clientSecret: subscription.latest_invoice.payment_intent.client_secret });
  } catch (err) {
    console.error("Stripe Subscription Error:", err);
    res.status(500).json({ error: "Error creando suscripción" });
  }
});

export default router;
