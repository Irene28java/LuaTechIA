//frontend>src>api.js
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const client = {
  get: async (endpoint) => {
    const res = await fetch(`${API_URL}${endpoint}`);
    if (!res.ok) throw new Error("Error en GET " + endpoint);
    return res.json();
  },
  post: async (endpoint, body) => {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error("Error en POST " + endpoint);
    return res.json();
  },
};

export default client;
