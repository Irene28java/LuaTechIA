import { useState } from "react";
import { FiUser, FiMenu } from "react-icons/fi";

export default function Topbar({ user, onLoginClick, role, onChangeRole }) {
  const [open, setOpen] = useState(false);

  return (
    <header
      className="
        w-full flex items-center justify-between
        px-6 py-3 mb-4
        rounded-2xl bg-white/20 backdrop-blur-[25px]
        border border-white/30 shadow-xl
      "
    >
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden p-2 rounded-xl bg-white/40"
      >
        <FiMenu className="text-[#6c7a8c] text-xl" />
      </button>

      {/* Rol */}
      <select
        value={role}
        onChange={(e) => onChangeRole(e.target.value)}
        className="
          bg-white/40 px-3 py-2 rounded-xl
          text-[#6c7a8c] shadow outline-none
        "
      >
        <option value="niño">Niño</option>
        <option value="padre">Padre</option>
        <option value="docente">Docente</option>
      </select>

      {/* Usuario */}
      {user ? (
        <div className="flex items-center gap-2 p-2 bg-white/40 rounded-xl">
          <FiUser className="text-[#6c7a8c] text-xl" />
          <span className="text-[#6c7a8c]">{user.name}</span>
        </div>
      ) : (
        <button
          onClick={onLoginClick}
          className="
            bg-white/50 px-4 py-2 rounded-xl
            text-[#6c7a8c] shadow
            hover:bg-white/70 transition
          "
        >
          Iniciar Sesión
        </button>
      )}
    </header>
  );
}
