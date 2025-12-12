// frontend/src/components/LuaTechLogo.jsx
import React from "react";

export default function LuaTechLogo({ size = 140 }) {
  return (
    <div className="flex items-center justify-center">
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Padre/Madre */}
        <path
          d="M30,150 C50,80 70,80 90,150"
          stroke="#A3E635"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          style={{
            strokeDasharray: 100,
            strokeDashoffset: 100,
            animation: "draw 1.5s ease forwards"
          }}
        />
        {/* Profesor */}
        <path
          d="M110,150 C130,80 150,80 170,150"
          stroke="#FACC15"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          style={{
            strokeDasharray: 100,
            strokeDashoffset: 100,
            animation: "draw 1.5s ease forwards 0.2s"
          }}
        />
        {/* Niño */}
        <circle
          cx="100"
          cy="110"
          r="12"
          fill="#C084FC"
          style={{
            transform: "scale(0)",
            opacity: 0,
            animation: "pop 0.8s ease forwards 1.7s"
          }}
        />
      </svg>

      <style>{`
        @keyframes draw {
          0% { stroke-dashoffset: 100; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes pop {
          0% { transform: scale(0); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
