import express from "express";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post("/", async (req, res) => {
  const { token: idToken, role, age } = req.body;
  if (!idToken) return res.status(400).json({ error: "No se recibió token de Google" });

  try {
    // Verifica el ID Token con Google
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID, // Se asegura de que el token sea válido para tu app
    });

    // Extrae el payload del token
    const payload = ticket.getPayload();
    const email = payload.email;
    const name = payload.name;
    const picture = payload.picture;

    // Usamos Supabase para crear o actualizar el perfil
    const { data: userProfile, error } = await req.supabase
      .from("profiles")
      .upsert([{ email, name, picture, role, age }], { onConflict: ["email"], returning: "representation" });

    if (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }

    const userId = userProfile[0].id;

    // Crea un JWT para el usuario autenticado
    const appToken = jwt.sign({ email, role, userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

    // Devuelve el JWT y los datos del usuario
    res.json({ token: appToken, user: { email, name, picture, role, age } });

  } catch (err) {
    console.error("Error en Google OAuth:", err);
    res.status(401).json({ error: "Token Google inválido" });
  }
});

export default router;
