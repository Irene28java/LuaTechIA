export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#050b1d] via-[#08122e] to-[#040814] text-white">
      <div className="flex-1">
        {children}
      </div>

      <footer className="text-center py-6 text-sm text-slate-400">
        <a href="/privacy" className="hover:text-white">Privacidad</a>{" "}
        ·{" "}
        <a href="/terms" className="hover:text-white">Términos</a>{" "}
        ·{" "}
        <a href="/cookies" className="hover:text-white">Cookies</a>
      </footer>
    </div>
  );
}
