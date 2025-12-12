import React from "react";
import DownloadTemplate from "../components/DownloadTemplate";

export default function Templates() {
  const templates = [
    "plantilla_examen.doc",
    "examen.pdf",
    "ficha_mates_3.pdf"
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">📄 Plantillas descargables</h1>

      <div className="space-y-3">
        {templates.map((t) => (
          <DownloadTemplate key={t} name={t} />
        ))}
      </div>
    </div>
  );
}
