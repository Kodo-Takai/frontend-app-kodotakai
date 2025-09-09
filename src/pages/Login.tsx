import React from "react";
import { FaFacebookF, FaGoogle, FaApple, FaArrowLeft } from "react-icons/fa"; // Usar iconos de React Icons
import { RiLock2Line } from "react-icons/ri"; // Ícono de puerta // Hook para manejar el estado del formulario
import Input from "../components/input";
import { useInput } from "../hooks/useInput";

export default function Login() {
  const { email, password, isValid } = useInput();

  // Manejador de submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      console.log("Iniciar sesión");
      console.log("Email:", email.value);
      console.log("Password:", password.value);
    } else {
      console.log("Formulario inválido");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg justify-center">
      <div
        className="mb-6 cursor-pointer text-gray-500"
        onClick={() => window.history.back()}
        aria-label="Regresar"
      >
        <div className="w-10 h-10 flex items-center justify-center border border-gray-400 rounded-md hover:bg-gray-100 transition-colors">
          <FaArrowLeft />
        </div>
      </div>
      <div className="flex flex-col items-center mb-6">
        <img
          src="/icons/SplashMobil.png"
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

      <form onSubmit={handleSubmit}>
        <Input
          label="Ingresa tu correo"
          name="email"
          type="email"
          value={email.value}
          onChange={email.onChange}
          onBlur={email.onBlur}
          error={email.error}
          placeholder="Correo electrónico"
        />

        <Input
          label="Ingresa tu contraseña"
          name="password"
          type="password"
          value={password.value}
          onChange={password.onChange}
          onBlur={password.onBlur}
          error={password.error}
          placeholder="Contraseña"
        />

        <button
          type="submit"
          disabled={!isValid}
          className={`w-full py-3 text-white font-semibold rounded-lg transition-all duration-300 ${
            !isValid
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700"
          } flex items-center justify-center cursor-pointer`}
        >
          Iniciar Sesión <RiLock2Line className="ml-2 text-white" />
        </button>

        <div className="mt-4 text-center">
          <a
            href="#"
            className="text-sm text-[#6D7178] hover:underline text-right"
          >
            Olvidaste tu contraseña?
          </a>
          <div className="my-4 text-sm text-gray-500">O ingresa con</div>

          <div className="flex justify-center space-x-4">
            {/* Iconos sociales */}
            <button className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center">
              <FaFacebookF className="h-5 w-5" />
            </button>
            <button className="w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center">
              <FaGoogle className="h-5 w-5" />
            </button>
            <button className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center">
              <FaApple className="h-5 w-5" />
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-sm">
          ¿No tienes una cuenta?{" "}
          <a href="#" className="text-blue-500 hover:underline">
            Regístrate ahora
          </a>
        </p>
      </form>
    </div>
  );
}
