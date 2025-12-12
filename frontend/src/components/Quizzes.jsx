// components/PrivateRoute.jsx
import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import client from "../api/client.js";


export default function Quizzes() {
  const { role, userId } = useContext(AuthContext);
  const [quizzes, setQuizzes] = useState([]);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    async function fetchQuizzes() {
      const res = await client.get("/quizzes");
      setQuizzes(res.data.quizzes);
    }
    fetchQuizzes();
  }, []);

  const submitQuiz = async (quizId) => {
    if(!answers[quizId]) return alert("Responde al menos una pregunta");
    try {
      await client.post(`/quizzes/${quizId}/submit`, { answers: answers[quizId] });
      alert("Cuestionario enviado");
    } catch(err) {
      console.error(err);
    }
  };

  const gradeQuiz = async (quizId, studentId, grade) => {
    try {
      await client.post(`/quizzes/${quizId}/grade`, { studentId, grade });
      alert("Calificación guardada");
    } catch(err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Cuestionarios</h2>
      {quizzes.map(quiz => (
        <div key={quiz.id} style={{ border: "1px solid #ccc", padding: 12, marginBottom: 12 }}>
          <h3>{quiz.title}</h3>

          {role === "teacher" && quiz.submissions.length > 0 && (
            <div>
              <h4>Entregas:</h4>
              {quiz.submissions.map(s => (
                <div key={s.studentId} style={{ marginBottom: 6 }}>
                  <b>{s.studentId}</b> {JSON.stringify(s.answers)} | Nota: {s.grade ?? "Sin calificar"}
                  <input type="number" placeholder="Nota" onChange={e => gradeQuiz(quiz.id, s.studentId, e.target.value)} />
                </div>
              ))}
            </div>
          )}

          {role !== "teacher" && (
            <div>
              {quiz.questions.map((q, idx) => (
                <div key={idx}>
                  <p>Q{idx+1}: {q.q}</p>
                  <input type="text" value={answers[quiz.id]?.[idx] || ""} onChange={e => {
                    setAnswers({...answers, [quiz.id]: {...answers[quiz.id], [idx]: e.target.value}})
                  }} />
                </div>
              ))}
              <button onClick={() => submitQuiz(quiz.id)}>Enviar cuestionario</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
