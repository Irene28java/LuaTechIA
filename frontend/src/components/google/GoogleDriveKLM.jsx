import React, { useEffect } from "react";
import { useAuth } from "../../context/AuthContext.jsx";

export default function GoogleDriveKLM() {
  const { loginWithGoogle } = useAuth();

  // Asegúrate de que la API de Google esté cargada
  useEffect(() => {
    gapi.load('auth2', () => {
      gapi.auth2.init({
        client_id: 'TU_GOOGLE_CLIENT_ID.apps.googleusercontent.com',  // Coloca tu ID de cliente de Google
      });
    });
  }, []);

  // Función que se ejecuta cuando el usuario hace clic en el botón de "Conectar con Google"
  const handleGoogleLogin = async () => {
    const auth2 = gapi.auth2.getAuthInstance();

    try {
      // Inicia sesión con Google
      const googleUser = await auth2.signIn();

      // Obtiene el idToken generado por Google
      const idToken = googleUser.getAuthResponse().id_token;

      // Llama al backend para obtener el JWT
      const result = await loginWithGoogle(idToken);

      // Si el resultado es exitoso, el token JWT ya estará almacenado en el contexto
      if (result && result.token) {
        console.log("Usuario autenticado y token JWT recibido:", result.token);
      }
    } catch (error) {
      console.error('Error al iniciar sesión con Google:', error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Google Drive / Classroom</h1>
      <button
        onClick={handleGoogleLogin}
        className="px-4 py-3 bg-blue-500 text-white rounded-xl shadow"
      >
        Conectar con Google
      </button>
    </div>
  );
}
