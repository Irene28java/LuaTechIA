import React from "react";

export default function TaskCard({ task, role, onSubmit, onGrade, user }) {
  return (
    <div style={styles.card}>
      <h3 style={styles.title}>{task.title}</h3>
      <p style={styles.description}>{task.description}</p>

      {/* ================= ALUMNO ================= */}
      {role === "student" && !task.submissions?.find(s => s.studentId === user.id) && (
        <button onClick={() => onSubmit(task.id)} style={styles.button}>
          📤 Entregar tarea
        </button>
      )}

      {role === "student" && task.submissions?.find(s => s.studentId === user.id) && (
        <p style={styles.success}>
          ✅ Entregada — Nota: {task.submissions.find(s => s.studentId === user.id).grade || "Pendiente"}
        </p>
      )}

      {/* ================= PROFESOR ================= */}
      {role === "teacher" && (
        <>
          <h4>Entregas:</h4>
          {task.submissions?.length > 0 ? (
            task.submissions.map(sub => (
              <div key={sub.studentId} style={styles.submission}>
                <p>👤 {sub.studentId}</p>
                <input
                  type="number"
                  placeholder="Nota"
                  defaultValue={sub.grade || ""}
                  onBlur={e => onGrade(task.id, sub.studentId, e.target.value)}
                  style={styles.input}
                />
              </div>
            ))
          ) : (
            <p>No hay entregas todavía</p>
          )}
        </>
      )}

      {/* ================= PADRE ================= */}
      {role === "parent" && (
        <>
          <h4>Resultados:</h4>
          {task.submissions?.length > 0 ? (
            task.submissions.map(s => (
              <p key={s.studentId}>
                📌 {s.studentId}: {s.grade || "Pendiente"}
              </p>
            ))
          ) : (
            <p>No hay tareas corregidas aún</p>
          )}
        </>
      )}
    </div>
  );
}

const styles = {
  card: {
    border: "1px solid #ddd",
    borderRadius: "12px",
    padding: "16px",
    marginBottom: "20px",
    background: "#fff",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
    width: "100%",
    maxWidth: "400px",
    boxSizing: "border-box",
  },
  title: { fontSize: "18px", marginBottom: "8px" },
  description: { fontSize: "14px", marginBottom: "12px" },
  submission: { borderTop: "1px solid #eee", marginTop: "10px", paddingTop: "10px" },
  button: {
    width: "100%",
    maxWidth: "200px",
    padding: "8px 16px",
    borderRadius: "8px",
    border: "none",
    background: "#4f46e5",
    color: "white",
    cursor: "pointer",
    marginTop: "10px",
  },
  input: { width: "80px", padding: "4px", borderRadius: "4px", border: "1px solid #ccc" },
  success: { color: "green", fontWeight: "bold", marginTop: "8px" },
};
