// pages/Login.tsx
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import FormLogin from "../components/form/loginForm";
import WelcomeScreens from "../components/layout/welcomeScreen";
import { useAuth } from "../hooks/auth/useAuth";

export default function Login() {
  const navigate = useNavigate();
  const {
    showWelcomeScreens,
    completeWelcomeScreens,
    username,
    password,
    isValid,
    isLoading,
    errorMessage,
    handleFormSubmit,
  } = useAuth();

  if (showWelcomeScreens) {
    return <WelcomeScreens onComplete={completeWelcomeScreens} />;
  }

  return (
    <div
      className="max-w-md mx-auto p-6 rounded-lg justify-center"
      style={{ backgroundColor: "var(--color-bone)" }}
    >
      <div
        className="cursor-pointer"
        onClick={() => navigate(-1)}
        aria-label="Regresar"
      >
        <div
          className="w-10 h-10 flex items-center justify-center rounded-xl transition-colors"
          style={{
            backgroundColor: "var(--color-blue)",
            color: "var(--color-bone)",
          }}
        >
          <FaArrowLeft className="w-4 h-4" />
        </div>
      </div>

      <div className="flex flex-col items-center">
        <img
          src="/icons/colombiaIcon.svg"
          alt="Logo"
          className="w-23 h-23 object-contain"
        />
      </div>

      <h2
        className="text-[40px] font-extrabold mb-4 font-sf-pro tracking-tight leading-10"
        style={{ color: "var(--color-blue)" }}
      >
        Hey, Bienvenido <br /> otra vez!
      </h2>

      <p
        className="text-sm mb-6 font-medium"
        style={{ color: "var(--color-blue)" }}
      >
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
