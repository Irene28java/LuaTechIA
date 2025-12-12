export default function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      
      {/* Fondo difuminado */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Contenido del modal */}
      <div className="
        relative z-10
        w-[90%] max-w-3xl 
        max-h-[90vh] overflow-y-auto custom-scroll
        bg-[#0d0f1a] text-white
        rounded-2xl shadow-2xl border border-white/10
        p-8 animate-fadeIn
      ">
        
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-2xl opacity-70 hover:opacity-100"
        >
          ✕
        </button>

        {children}
      </div>

      {/* Animación */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(.97); }
            to { opacity: 1; transform: scale(1); }
          }
          .animate-fadeIn {
            animation: fadeIn .25s ease-out;
          }
        `}
      </style>
    </div>
  );
}
