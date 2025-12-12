// backend/service/stripePlans.js
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (plan, email) => {
  let priceId;

  // Mapear plan a priceId
  switch(plan){
    case "freemium":
      priceId = "price_1SUrbqLtdPm4TmKby9HCGcRK"; // 0€ cada 3 meses
      break;
    case "monthly":
      priceId = "price_1SUrVlLtdPm4TmKbstO3QNYn";
      break;
    case "annual":
      priceId = "price_1SUrXuLtdPm4TmKba3kzwv0A";
      break;
    default:
      throw new Error("Plan no válido");
  }

  // Crear sesión de checkout
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer_email: email,
    line_items: [{ price: priceId, quantity: 1 }],
    allow_promotion_codes: true,
    success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/cancel`
  });

  return session.url; // URL para redirigir al usuario
};
