import React, { useState, useEffect, useContext } from "react";
import client from "../api/client.js";
import { AuthContext } from "../context/AuthContext.jsx";


export default function Tasks() {
  const { role, token } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [content, setContent] = useState("");

  useEffect(() => { loadTasks(); }, []);

  async function loadTasks() {
    const res = await client.get("/tasks", { headers: { Authorization: `Bearer ${token}` } });
    setTasks(res.data.tasks);
  }

  async function submitTask(taskId) {
    await client.post(`/tasks/${taskId}/submit`, { content }, { headers: { Authorization: `Bearer ${token}` } });
    setContent("");
    loadTasks();
  }

  async function gradeTask(taskId, studentId, grade) {
    await client.post(`/tasks/${taskId}/grade`, { studentId, grade }, { headers: { Authorization: `Bearer ${token}` } });
    loadTasks();
  }

  return (
    <div>
      <h1>Tareas y Exámenes</h1>
      {tasks.map(task => (
        <div key={task.id} style={{ border:"1px solid #ccc", margin:"10px", padding:"10px" }}>
          <h3>{task.title} ({task.type})</h3>
          <p>{task.description}</p>

          {role === "student" && (
            <div>
              <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Tu respuesta" />
              <button onClick={() => submitTask(task.id)}>Enviar</button>
            </div>
          )}

          {role === "teacher" && task.submissions.length > 0 && (
            <div>
              <h4>Entregas:</h4>
              {task.submissions.map(s => (
                <div key={s.studentId}>
                  <p>{s.studentId}: {s.content}</p>
                  <input type="number" placeholder="Nota" onBlur={e => gradeTask(task.id, s.studentId, e.target.value)} />
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
