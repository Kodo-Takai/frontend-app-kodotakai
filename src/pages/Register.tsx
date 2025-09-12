import { Link, useNavigate } from "react-router-dom";
import Input from "../components/input";
import Button from '../components/Button';
import { useAuthForm } from "../hooks/useAuthForm";
import { FaFacebookF, FaApple, FaArrowLeft } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { LuBookCheck } from "react-icons/lu";

export default function Register() {
    const navigate = useNavigate();
    const {
        firstName,
        email,
        password,
        confirmPassword,
        validateConfirmPassword,
        isValid,
        isSubmitting,
        handleSubmit,
    } = useAuthForm();
    
    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await handleSubmit(() => navigate("/login"));
    };
    
    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg justify-center">
            <div 
            className="cursor-pointer text-gray-500"
            onClick={() => window.history.back()}
            aria-label="Regresar"
            >
                <div className="w-10 h-10 flex items-center justify-center border border-gray-400 rounded-md hover:bg-gray-100 transition-colors">
                    <FaArrowLeft />
                </div>
            </div>
            <h2 className="text-4xl font-extrabold text-[#1C222B] mb-4 mt-4 font-sf-pro">
            Crea tu <a className="text-[#DC1217]">nueva</a> <br /> cuenta
            </h2>
            <p className="text-gray-500 text-sm mb-6">
                Crea una cuenta para que puedas comenzar una nueva 
                aventura y disfrutar la experiencia al máximo
            </p>

            <form onSubmit={onSubmit}>
                <Input
                label="Nombre"
                value={firstName.value}
                onChange={firstName.onChange}
                onBlur={firstName.onBlur}
                error={firstName.error}
                placeholder="Nombre de usuario"
                name="firstName"
                />

                <Input
                label="Email"
                value={email.value}
                onChange={email.onChange}
                onBlur={email.onBlur}
                error={email.error}
                type="email"
                placeholder="Ingresa tu correo"
                name="email"
                autoComplete="email"
                />

                <Input
                label="Contraseña"
                value={password.value}
                onChange={password.onChange}
                onBlur={password.onBlur}
                error={password.error}
                type="password"
                placeholder="Contraseña"
                name="password"
                autoComplete="new-password"
                />

                <Input
                label="Confirmar contraseña"
                value={confirmPassword.value}
                onChange={confirmPassword.onChange}
                onBlur={() => {
                    confirmPassword.onBlur();
                    validateConfirmPassword();
                }}
                error={confirmPassword.error}
                type="password"
                placeholder="Confirma tu contraseña"
                name="confirmPassword"
                autoComplete="new-password"
                />

                <Button
                type="submit" 
                loading={isSubmitting} 
                disabled={!isValid} 
                variant="blueDark"
                className="flex items-center justify-center gap-2"
                >
                Crear cuenta <LuBookCheck />
                </Button>

                <p className="mt-4 text-sm text-gray-600 text-center">
                ¿Ya tienes cuenta?{" "}
                <Link to="/login" className="text-blue-600 hover:underline">
                Inicia sesión
                </Link>
                </p>
            </form>
        </div>
    );
}