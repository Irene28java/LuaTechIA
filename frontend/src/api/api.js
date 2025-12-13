// src/api/api.js
import axios from 'axios';

// Usa la variable de entorno configurada en el archivo .env de Vite
const apiUrl = import.meta.env.VITE_API_URL || 'http://luatechia.onrender.com'; // o la URL de tu backend en Render

const client = {
  get: async (endpoint) => {
    try {
      const res = await axios.get(`${apiUrl}${endpoint}`);
      return res.data;
    } catch (error) {
      console.error('Error in GET request:', error);
      throw error; // Vuelve a lanzar el error para manejarlo en otro lugar si es necesario
    }
  },
  post: async (endpoint, body) => {
    try {
      const res = await axios.post(`${apiUrl}${endpoint}`, body, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return res.data;
    } catch (error) {
      console.error('Error in POST request:', error);
      throw error; // Vuelve a lanzar el error para manejarlo en otro lugar si es necesario
    }
  },
};

export default client;
