import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import RegisterForm from "../components/form/registerForm";
import { useRegister } from "../hooks/auth/useRegister";

export default function Register() {
  const navigate = useNavigate();
  const { 
    username,
    email,
    password,
    confirmPassword,
    name,
    lastName,
    isValid,
    isLoading,
    errorMessage,
    handleFormSubmit
  } = useRegister();

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg justify-center">
      <div 
        className="cursor-pointer text-gray-500"
        onClick={() => navigate(-1)}
        aria-label="Regresar"
      >
        <div className="w-10 h-10 flex items-center justify-center border border-gray-400 rounded-md hover:bg-gray-100 transition-colors">
          <FaArrowLeft />
        </div>
      </div>

      <h2 className="text-4xl font-extrabold text-[#1C222B] mb-4 mt-4 font-sf-pro">
        Crea tu <span className="text-[#DC1217]">nueva</span> <br /> cuenta
      </h2>

      <p className="text-gray-500 text-sm mb-6">
        Crea una cuenta para que puedas comenzar una nueva 
        aventura y disfrutar la experiencia al máximo
      </p>

      <RegisterForm
        username={username}
        email={email}
        password={password}
        confirmPassword={confirmPassword}
        name={name}
        lastName={lastName}
        isValid={isValid}
        isLoading={isLoading}
        backendError={errorMessage}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
}