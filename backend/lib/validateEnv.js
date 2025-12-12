// Validar que todas las variables de entorno críticas estén definidas
const REQUIRED_ENV = [
  "SUPABASE_URL",
  "SUPABASE_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "JWT_SECRET",
  "FRONTEND_URL",
  "GOOGLE_CLIENT_ID",
  "STRIPE_SECRET_KEY",
  "HF_API_KEY",
  "GROQ_API_KEY",
  "OLLAMA_URL",
  "OLLAMA_MODEL"
];

export function validateEnv() {
  let missing = [];
  for (const key of REQUIRED_ENV) {
    if (!process.env[key]) missing.push(key);
  }

  if (missing.length > 0) {
    console.error(`❌ Faltan las siguientes variables de entorno: ${missing.join(", ")}`);
    process.exit(1); // Detener el servidor
  }
}
