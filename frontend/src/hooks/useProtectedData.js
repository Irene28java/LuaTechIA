// src/hooks/useProtectedData.js
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const useProtectedData = () => {
  const { token } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProtectedData = async () => {
    if (!token) return;

    try {
      const res = await fetch(`${process.env.VITE_BACKEND_URL}/api/protected`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('Error al obtener los datos protegidos');
      }

      const data = await res.json();
      setData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchProtectedData();
    }
  }, [token]);

  return { data, loading, error };
};

export default useProtectedData;
