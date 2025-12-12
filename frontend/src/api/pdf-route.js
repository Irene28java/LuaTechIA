// frontend/src/api/pdf-route.js función para solicitar PDF
async function downloadEvaluationPDF(payload) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API}/generate-pdf`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error("Error generando PDF");
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${payload.title || "evaluacion"}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
}

