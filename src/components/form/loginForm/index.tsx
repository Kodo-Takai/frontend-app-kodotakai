// LoginForm.tsx - Componente actualizado
import React from "react";
import { RiLock2Line } from "react-icons/ri";
import Input from "../../ui/input";
import Button from "../../ui/button";
import { useLoginForm } from "../../../hooks/useLoginForm";

interface LoginFormProps {
  onSubmit?: (data: { email: string; password: string }) => void;
  onLoginSuccess?: () => void; // Nueva prop para manejar login exitoso
  loading?: boolean;
  error?: string | null;
}

export default function LoginForm({ 
  onSubmit, 
  onLoginSuccess, 
  loading = false, 
  error 
}: LoginFormProps) {
  const { email, password, isValid } = useLoginForm();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid && onSubmit) {
      try {
        await onSubmit({
          email: email.value,
          password: password.value,
        });
        // Si el login fue exitoso, llamar onLoginSuccess
        if (onLoginSuccess) {
          onLoginSuccess();
        }
      } catch (error) {
        // El error se manejará en el componente padre
        console.error('Login failed:', error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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

      {error && (
        <div className="text-red-500 text-sm text-center p-2 bg-red-50 rounded-lg">
          {error}
        </div>
      )}

      <Button
        className="flex items-center justify-center gap-2"
        type="submit"
        variant="red"
        disabled={!isValid || loading}
        loading={loading}
      >
        Iniciar Sesión <RiLock2Line />
      </Button>

      <div className="mt-4 text-center">
        <a
          href="forgot-password"
          className="text-sm text-[#6D7178] hover:underline"
        >
          ¿Olvidaste tu contraseña?
        </a>
      </div>

      <p className="mt-6 text-center text-sm">
        ¿No tienes una cuenta?{" "}
        <a href="/register" className="text-blue-500 hover:underline">
          Regístrate ahora
        </a>
      </p>
    </form>
  );
}