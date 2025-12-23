export default function SkyLayout({ sidebar, children }) {
  return (
    <div className="min-h-screen w-full bg-sky-clouds flex">

      {/* SIDEBAR */}
      <aside className="hidden md:flex w-[280px] p-4">
        <div className="glass-soft w-full h-full flex flex-col custom-scroll overflow-y-auto">
          {sidebar}
        </div>
      </aside>

      {/* CONTENIDO */}
      <main className="flex-1 p-4 md:p-6 flex justify-center">
        <div className="w-full max-w-5xl glass-soft p-4 md:p-6 custom-scroll overflow-y-auto">
          {children}
        </div>
      </main>

    </div>
  );
}
