import React, { useRef, useEffect, useState } from "react";

export default function Whiteboard({ width = "100%", height = 400, onExport }) {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const historyRef = useRef([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [ctxState, setCtxState] = useState({ color: "#ff7f7f", size: 4 });

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = canvas.clientWidth;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctxRef.current = ctx;
    saveHistory();
  }, [height]);

  function pointerPos(e) {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    return { x, y };
  }

  const startDrawing = e => {
    e.preventDefault();
    const { x, y } = pointerPos(e);
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = e => {
    if (!isDrawing) return;
    e.preventDefault();
    const { x, y } = pointerPos(e);
    const ctx = ctxRef.current;
    ctx.strokeStyle = ctxState.color;
    ctx.lineWidth = ctxState.size;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = e => {
    if (!isDrawing) return;
    e.preventDefault();
    ctxRef.current.closePath();
    setIsDrawing(false);
    saveHistory();
  };

  function saveHistory() {
    const canvas = canvasRef.current;
    historyRef.current.push(canvas.toDataURL("image/png"));
    if (historyRef.current.length > 25) historyRef.current.shift();
  }

  function undo() {
    if (historyRef.current.length <= 1) return clearAll();
    historyRef.current.pop();
    const img = new Image();
    img.src = historyRef.current[historyRef.current.length - 1];
    img.onload = () => ctxRef.current.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
  }

  function clearAll() {
    const ctx = ctxRef.current;
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    saveHistory();
  }

  const exportImage = () => {
    const dataUrl = canvasRef.current.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `pizarra_${Date.now()}.png`;
    a.click();
    if (onExport) onExport(dataUrl);
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg overflow-hidden max-w-full mx-auto">
      <div className="flex gap-4 p-3 bg-white/20">
        <input type="color" value={ctxState.color} onChange={e => setCtxState(s => ({ ...s, color: e.target.value }))} className="w-10 h-10 rounded-full p-1" />
        <input type="range" min="1" max="30" value={ctxState.size} onChange={e => setCtxState(s => ({ ...s, size: Number(e.target.value) }))} className="flex-1" />
        <button onClick={undo} className="px-3 py-1 rounded-xl bg-cyan-500 hover:bg-cyan-600">Deshacer</button>
        <button onClick={clearAll} className="px-3 py-1 rounded-xl bg-red-400 hover:bg-red-500">Limpiar</button>
        <button onClick={exportImage} className="px-3 py-1 rounded-xl bg-green-400 hover:bg-green-500">Descargar</button>
      </div>
      <canvas
        ref={canvasRef}
        style={{ width, height: `${height}px`, touchAction: "none", background: "#fff", display: "block" }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />
    </div>
  );
}
