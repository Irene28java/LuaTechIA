// components/PrivateRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";


export default function PrivateRoute({ children }) {
  const { token, loading } = useAuth();
  if (loading) return <p>Cargando...</p>;
  return token ? children : <Navigate to="/" />;
}