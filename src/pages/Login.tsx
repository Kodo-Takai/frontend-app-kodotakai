import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import FormLogin from "../components/form/loginForm";
import WelcomeScreens from "../components/layout/welcomeScreen";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcomeScreens, setShowWelcomeScreens] = useState(false);

  // Manejador personalizado para el submit
  const handleLogin = async (data: { email: string; password: string }) => {
    setIsLoading(true);

    try {
      console.log("Iniciando sesión...");
      console.log("Email:", data.email);
      console.log("Password:", data.password);
      // Simula una llamada a una API
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("Login exitoso");
    } catch (error) {
      console.error("Error en login:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleLoginSuccess = () => {
    setShowWelcomeScreens(true);
  };

  // Si debe mostrar las pantallas de bienvenida, renderiza ese componente
  if (showWelcomeScreens) {
    return <WelcomeScreens />;
  }
  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg justify-center">
      {/* Header con botón de regresar */}
      <div
        className="cursor-pointer text-gray-500 mb-6"
        onClick={() => window.history.back()}
        aria-label="Regresar"
      >
        <div className="w-10 h-10 flex items-center justify-center border border-gray-400 rounded-md hover:bg-gray-100 transition-colors">
          <FaArrowLeft />
        </div>
      </div>

      {/* Logo y título */}
      <div className="flex flex-col items-center mb-6">
        <img
          src="/icons/colombiaIcon.svg"
          alt="Logo"
          className="mb-6 w-32 h-32 object-contain"
        />
      </div>

      <h2 className="text-4xl font-extrabold text-[#1C222B] mb-4 font-sf-pro">
        Hey, Bienvenido <br /> otra vez!
      </h2>

      <p className="text-gray-500 text-sm mb-6">
        Estamos contentos que hayas regresado otra vez, es hora de comenzar una
        nueva aventura
      </p>

      {/* Formulario separado */}
      <FormLogin
        onSubmit={handleLogin}
        onLoginSuccess={handleLoginSuccess}
        loading={isLoading}
      />
    </div>
  );
}
