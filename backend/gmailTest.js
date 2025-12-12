const { google } = require('googleapis');
const key = require('./backend/keys/luatechia-service.json');

const auth = new google.auth.GoogleAuth({
  credentials: key,
  scopes: ['https://www.googleapis.com/auth/gmail.readonly'],
});

const service = google.gmail({ version: 'v1', auth });

async function listarMensajes() {
  const res = await service.users.messages.list({ userId: 'me' });
  console.log(res.data.messages);
}

listarMensajes();
