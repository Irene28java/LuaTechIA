// frontend/src/hooks/useTasks.js
import { useEffect, useState } from "react";
import client from "../api/client.js";

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTasks() {
      try {
        const res = await client.get("/tasks"); // ruta protegida con JWT
        setTasks(res.data);
      } catch (err) {
        console.error("Error cargando tareas:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTasks();
  }, []);

  return { tasks, loading };
}
