// src/components/SomeComponent.js
import React, { useEffect, useState } from 'react';
import api from '../api/api';  // Importamos el cliente api

const SomeComponent = () => {
  const [data, setData] = useState(null);

  // Llamada GET al backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await api.get('/api/stream');  // Usa el endpoint que necesites
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Datos de la API</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default SomeComponent;
