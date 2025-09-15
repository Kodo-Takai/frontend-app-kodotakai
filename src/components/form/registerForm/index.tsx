import React from "react";
import { Link } from "react-router-dom";
import { LuBookCheck } from "react-icons/lu";
import { useRegisterForm } from "../../../hooks/useRegisterForm";
import Input from "../../ui/input";
import Button from "../../ui/button";

interface RegisterFormProps {
    onSubmit: (e: React.FormEvent) => Promise<void>;
}

export default function RegisterForm({ onSubmit }: RegisterFormProps) {
    const {
        firstName,
        email,
        password,
        confirmPassword,
        validateConfirmPassword,
        isValid,
        isSubmitting,
    } = useRegisterForm();

    return (
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
                variant="blue"
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
    );
}