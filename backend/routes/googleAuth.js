//BACKEND/ROUTE/GOOGLEAUTH.JS 
import express from "express";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post("/", async (req, res) => {
  const { token: idToken, role, age } = req.body;
  if (!idToken) return res.status(400).json({ error: "No se recibió token de Google" });

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const email = payload.email;
    const name = payload.name;
    const picture = payload.picture;

    // Usamos req.supabase para crear o actualizar el perfil
    const { data: userProfile, error } = await req.supabase
      .from("profiles")
      .upsert([{ email, name, picture, role, age }], { onConflict: ["email"], returning: "representation" });

    if (error) return res.status(500).json({ error: error.message });

    const userId = userProfile[0].id;

    const appToken = jwt.sign({ email, role, userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token: appToken, user: { email, name, picture, role, age } });

  } catch (err) {
    console.error("Error Google OAuth:", err);
    res.status(401).json({ error: "Token Google inválido" });
  }
});

export default router;
