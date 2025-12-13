import React, { useEffect, useState, useContext } from "react";
import client from "../api/client.js";
import { AuthContext } from "../context/AuthContext.jsx";

export default function ActivitiesPage() {
  const { role, user } = useContext(AuthContext); // Obtén el rol del usuario autenticado
  const [activities, setActivities] = useState([]);
  const [subject, setSubject] = useState("naturales");

  // Cargar actividades desde el backend
  useEffect(() => {
    async function load() {
      const res = await client.get(`/activities?subject=${subject}&role=${role}`);
      setActivities(res.data.activities || []);
    }
    load();
  }, [subject, role]);

  const subjects = ["naturales", "ingles", "lengua", "sociales", "lectura", "ortografía"];

  // Función para descargar el PDF
  const handleDownloadPDF = async () => {
    try {
      const res = await client.get(`/activitiesPDF/pdf?subject=${subject}&role=${role}&childName=${user.name}&childSurname={user.surname}&age={user.age}`, {
        responseType: "blob" // Necesitamos recibir el archivo como un Blob
      });
      const blob = new Blob([res.data], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `plantilla_${user.name}_${user.surname}.pdf`; // Nombre del archivo
      link.click();
    } catch (err) {
      console.error("Error descargando el PDF:", err);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Actividades y Plantillas</h2>
      
      <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
        <select value={subject} onChange={e => setSubject(e.target.value)}>
          {subjects.map(s => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: "grid", gap: 12 }}>
        {activities.map(a => (
          <div key={a.id} className="card" style={{ padding: 12, borderRadius: 12, background: "#f0f0f0" }}>
            <h3>{a.name}</h3>
            <p>{a.icon}</p>
            <a href={a.templateFile ? `/downloads/${a.templateFile}` : "#"} className="button">Descargar plantilla</a>
          </div>
        ))}
      </div>

      {/* Botón para generar y descargar el PDF */}
      <div style={{ marginTop: 20 }}>
        <button onClick={handleDownloadPDF} className="button">Descargar Plantillas en PDF</button>
      </div>
    </div>
  );
}
