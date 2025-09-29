// pages/Login.tsx
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import FormLogin from "../components/form/loginForm";
import WelcomeScreens from "../components/layout/welcomeScreen";
import { useAuth } from "../hooks/auth/useAuth";

export default function Login() {
  const navigate = useNavigate();
  const { showWelcomeScreens, completeWelcomeScreens, username, password, isValid, isLoading, errorMessage ,handleFormSubmit } = useAuth();

  if (showWelcomeScreens) {
    return <WelcomeScreens onComplete={completeWelcomeScreens} />;
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg justify-center">
      <div
        className="cursor-pointer text-gray-500 mb-6"
        onClick={() => navigate(-1)}
        aria-label="Regresar"
      >
        <div className="w-10 h-10 flex items-center justify-center border border-gray-400 rounded-md hover:bg-gray-100 transition-colors">
          <FaArrowLeft />
        </div>
      </div>

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

      <FormLogin
        username={username}
        password={password}
        isValid={isValid}
        isLoading={isLoading}
        errorMessage={errorMessage}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
}
