import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function PremiumSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-sky-clouds flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-soft max-w-xl w-full p-10 text-center space-y-6"
      >
        <h1 className="text-4xl font-bold text-sky-700">
          ¡Felicidades! 🎉
        </h1>

        <p className="text-lg text-slate-600">
          Ya formas parte de <strong>Lúa Premium</strong>.
          A partir de ahora, el aprendizaje será más profundo,
          personalizado y tranquilo.
        </p>

        <p className="text-slate-500">
          Más acompañamiento, más calma, más confianza.
        </p>

        <button
          onClick={() => navigate("/chat")}
          className="btn-primary text-lg"
        >
          Ir a mi aula
        </button>
      </motion.div>
    </div>
  );
}
