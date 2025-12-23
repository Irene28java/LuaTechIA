import { useState } from "react";
import { FiUser, FiMenu } from "react-icons/fi";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

export default function TopBar({
  variant = "app", // "landing" | "app"
  title = "Aula virtual",
  user,
  role,
  onChangeRole,
  onUpgradeClick,
  onLoginGoogle,
}) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  /* ---------------- LANDING ---------------- */
  if (variant === "landing") {
    return (
      <div className="w-full flex justify-between items-center py-6">
        <div className="flex items-center gap-2">
          <img src="/logo-lua.png" className="w-10 h-10" />
          <span className="text-2xl font-bold text-sky-700">Lúa</span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/chat")}
            className="btn-primary"
          >
            Empezar
          </button>

          <div className="bg-white rounded-xl p-1 shadow">
            <GoogleLogin
              onSuccess={onLoginGoogle}
              onError={() => {}}
            />
          </div>
        </div>
      </div>
    );
  }

  /* ---------------- APP / CHAT ---------------- */
  return (
    <header className="w-full flex items-center justify-between px-6 py-3 mb-4 rounded-2xl bg-white/20 backdrop-blur border border-white/30 shadow-xl">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-xl bg-white/40"
        >
          <FiMenu className="text-xl text-[#6c7a8c]" />
        </button>
        <h2 className="text-lg font-semibold text-[#2c6aa0]">{title}</h2>
      </div>

      <select
        value={role}
        onChange={(e) => onChangeRole(e.target.value)}
        className="bg-white/40 px-3 py-2 rounded-xl"
      >
        <option value="niño">Niño</option>
        <option value="padre">Padre</option>
        <option value="docente">Docente</option>
      </select>

      <div className="flex items-center gap-3">
        {user && (
          <>
            <div className="flex items-center gap-2 p-2 bg-white/40 rounded-xl">
              <FiUser />
              <span>{user.name}</span>
            </div>
            <button
              onClick={onUpgradeClick}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-400 to-purple-400 text-white text-sm"
            >
              Hazte Pro ✨
            </button>
          </>
        )}
      </div>
    </header>
  );
}
