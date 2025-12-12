// backend/routes/gmail.js
import express from "express";
import { google } from "googleapis";
import fs from "fs";
import path from "path";

const router = express.Router();

// Carga tu JSON de cuenta de servicio
const keyFile = path.join(process.cwd(), "backend/keys/luatechia-service.json");

const auth = new google.auth.GoogleAuth({
  keyFile,
  scopes: ["https://www.googleapis.com/auth/gmail.readonly"]
});

const service = google.gmail({ version: "v1", auth });

// Obtener últimos mensajes
router.get("/messages", async (req, res) => {
  try {
    const result = await service.users.messages.list({ userId: "me", maxResults: 5 });
    const messages = result.data.messages || [];

    const fullMessages = await Promise.all(
      messages.map(async (msg) => {
        const detail = await service.users.messages.get({ userId: "me", id: msg.id });
        const snippet = detail.data.snippet;
        return { id: msg.id, snippet };
      })
    );

    res.json({ messages: fullMessages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error obteniendo correos" });
  }
});

export default router;
