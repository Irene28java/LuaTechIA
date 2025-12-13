import React, { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://luatechia.onrender.com";

  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [protectedData, setProtectedData] = useState(null);

  // Cargar los datos de usuario desde localStorage al cargar la aplicación
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
    const storedUser = localStorage.getItem("user");
    if (storedToken) setToken(storedToken);
    if (storedRole) setRole(storedRole);
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // Función para guardar el token y los datos del usuario
  const saveToken = (newToken, newRole, newUser) => {
    setToken(newToken);
    setRole(newRole);
    setUser(newUser || null);
    localStorage.setItem("token", newToken);
    localStorage.setItem("role", newRole);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  // Función para hacer logout
  const logout = () => {
    setToken(null);
    setRole(null);
    setUser(null);
    setProtectedData(null);  // Limpiar los datos protegidos
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
  };

  // Función para iniciar sesión con Google
  const loginWithGoogle = async (googleCredential) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: googleCredential }), // Enviamos el token de Google
      });

      const data = await response.json();
      
      if (data.token) {
        saveToken(data.token, data.user?.role || null, data.user);
      } else {
        setError("No se pudo autenticar con Google.");
      }

      return data;

    } catch (err) {
      console.error(err);
      setError("Error al conectarse al servidor.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Función para iniciar sesión con Email
  const loginWithEmail = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }), // Enviamos email y password
      });

      if (!response.ok) {
        throw new Error("Error de autenticación. Verifique sus credenciales.");
      }

      const data = await response.json();

      if (data.token) {
        saveToken(data.token, data.user?.role || null, data.user);
      } else {
        setError("No se pudo autenticar con email.");
      }

      return data;

    } catch (err) {
      console.error(err);
      setError(err.message || "Error al conectarse al servidor.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener datos protegidos del backend
  const fetchProtectedData = async () => {
    if (!token) {
      setError("No hay token disponible");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${BACKEND_URL}/api/protected`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,  // Pasamos el token en la cabecera
        },
      });

      if (!res.ok) {
        throw new Error("Error al obtener los datos protegidos");
      }

      const data = await res.json();
      setProtectedData(data);  // Guardamos los datos protegidos

    } catch (err) {
      console.error("Error obteniendo datos protegidos:", err);
      setError("Error al obtener datos protegidos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        role,
        user,
        saveToken,
        logout,
        loginWithGoogle,
        loginWithEmail,  // Ahora proporcionamos loginWithEmail
        loading,
        error,
        protectedData,
        fetchProtectedData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
