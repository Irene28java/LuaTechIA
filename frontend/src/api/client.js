import axios from "axios";
import { useAuth } from "../context/AuthContext.jsx";

export function useClient() {
  const { token } = useAuth();

  const instance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:5000",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json"
    }
  });

  return instance;
}
