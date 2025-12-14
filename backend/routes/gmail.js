import express from "express";
import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import path from "path";
import fs from "fs";

const router = express.Router();

// Carga tu JSON de cuenta de servicio (si la usas para otros servicios, por ejemplo Gmail API)
const keyFile = path.join(process.cwd(), "backend/keys/luatechia-service.json");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post("/google-login", async (req, res) => {
  const { token: idToken } = req.body; // Obtenemos el idToken

  try {
    // Verifica el idToken recibido
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID, // Este es el CLIENT_ID de tu app
    });

    const payload = ticket.getPayload();
    const email = payload.email;

    // Ahora, vamos a intercambiar el idToken por un access_token
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    // Aquí intercambiamos el idToken por el access_token
    const { tokens } = await oauth2Client.getToken(idToken);
    oauth2Client.setCredentials(tokens); // Configuramos el token

    // Usamos el access_token para acceder a los correos de Gmail
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    // Obtener los últimos 5 correos
    const result = await gmail.users.messages.list({ userId: "me", maxResults: 5 });

    // Responder con los correos
    res.json({ messages: result.data.messages });

  } catch (err) {
    console.error("Error al autenticar con Google:", err);
    res.status(500).json({ error: "Error en la autenticación de Google" });
  }
});

export default router;
