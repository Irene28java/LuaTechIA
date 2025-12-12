import React from "react";

export default function EvaluationCard({ studentId, tasksAvg, quizzesAvg, finalScore }) {
  return (
    <div style={styles.card}>
      <h3 style={styles.title}>📊 Evaluación final</h3>
      <p><b>Alumno:</b> {studentId}</p>
      <p>📚 Media tareas: {tasksAvg}</p>
      <p>📝 Media quizzes: {quizzesAvg}</p>
      <h2 style={styles.score}>Nota final: {finalScore}</h2>
    </div>
  );
}

const styles = {
  card: {
    border: "2px solid #4f46e5",
    borderRadius: "12px",
    padding: "16px",
    marginTop: "20px",
    background: "#f9f9ff",
    textAlign: "center",
    width: "100%",
    maxWidth: "400px",
    boxSizing: "border-box",
  },
  title: { fontSize: "18px", marginBottom: "12px" },
  score: { color: "#4f46e5", fontSize: "28px", marginTop: "12px" },
};
