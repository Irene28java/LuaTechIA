import React from "react";

export default function QuizCard({ quiz, role, answers, setAnswers, onSubmit, onGrade, user }) {
  return (
    <div style={styles.card}>
      <h3 style={styles.title}>{quiz.title}</h3>

      {/* ALUMNO */}
      {role === "student" && (
        <>
          {quiz.questions.map((q, index) => (
            <div key={index}>
              <p style={styles.question}><b>{q.q}</b></p>
              {q.options.map((opt, j) => (
                <label key={j} style={styles.option}>
                  <input
                    type="radio"
                    name={`${quiz.id}-${index}`}
                    value={opt}
                    onChange={() => setAnswers({ ...answers, [index]: opt })}
                  />
                  {opt}
                </label>
              ))}
            </div>
          ))}
          <button onClick={() => onSubmit(quiz.id)} style={styles.button}>✅ Enviar cuestionario</button>
          {quiz.submissions?.find(s => s.studentId === user.id)?.grade && (
            <p style={styles.success}>🎯 Tu nota: {quiz.submissions.find(s => s.studentId === user.id).grade}</p>
          )}
        </>
      )}

      {/* PROFESOR */}
      {role === "teacher" && (
        <>
          <h4>Entregas:</h4>
          {quiz.submissions?.length ? quiz.submissions.map(sub => (
            <div key={sub.studentId} style={styles.submission}>
              <p><b>Alumno:</b> {sub.studentId}</p>
              <p>{JSON.stringify(sub.answers)}</p>
              <input
                type="number"
                placeholder="Nota"
                defaultValue={sub.grade || ""}
                onBlur={e => onGrade(quiz.id, sub.studentId, e.target.value)}
                style={styles.input}
              />
            </div>
          )) : <p>No hay respuestas todavía</p>}
        </>
      )}

      {/* PADRE */}
      {role === "parent" && (
        <>
          <h4>Resultados:</h4>
          {quiz.submissions?.map(s => (
            <p key={s.studentId}>👤 {s.studentId} — Nota: {s.grade || "Pendiente"}</p>
          ))}
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
    boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
    width: "100%",
    maxWidth: "400px",
    boxSizing: "border-box",
  },
  title: { fontSize: "18px", marginBottom: "8px" },
  question: { marginBottom: "4px" },
  option: { display: "block", marginLeft: "20px", marginBottom: "5px" },
  submission: { borderTop: "1px solid #eee", marginTop: "10px", paddingTop: "10px" },
  input: { width: "80px", padding: "4px", borderRadius: "4px", border: "1px solid #ccc" },
  button: { width: "100%", maxWidth: "200px", padding: "8px 16px", borderRadius: "8px", border: "none", background: "#4f46e5", color: "#fff", cursor: "pointer", marginTop: "10px" },
  success: { marginTop: "10px", color: "green", fontWeight: "bold" },
};
