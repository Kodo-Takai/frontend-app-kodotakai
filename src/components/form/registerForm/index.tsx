import React from "react";
import { Link } from "react-router-dom";
import { LuBookCheck } from "react-icons/lu";
import Input from "../../ui/input";
import Button from "../../ui/button";

interface RegisterFormProps {
  username: any;
  email: any;
  password: any;
  confirmPassword: any;
  name: any;
  lastName: any;
  isValid: boolean;
  isLoading: boolean;
  backendError: string | null;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

export default function RegisterForm({
  username,
  email,
  password,
  confirmPassword,
  name,
  lastName,
  isValid,
  isLoading,
  backendError,
  onSubmit
}: RegisterFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Input
        label="Nombre"
        value={name.value}
        onChange={name.onChange}
        onBlur={name.onBlur}
        error={name.error}
        placeholder="Tu nombre"
        name="name"
        autoComplete="given-name"
        id="name"
      />

      <Input
        label="Apellido"
        value={lastName.value}
        onChange={lastName.onChange}
        onBlur={lastName.onBlur}
        error={lastName.error}
        placeholder="Tu apellido"
        name="lastName"
        autoComplete="family-name"
        id="lastName"
      />

      <Input
        label="Usuario"
        value={username.value}
        onChange={username.onChange}
        onBlur={username.onBlur}
        error={username.error}
        placeholder="example@email.com"
        name="username"
        autoComplete="username"
        id="username"
      />

      <Input
        label="Email"
        value={email.value}
        onChange={email.onChange}
        onBlur={email.onBlur}
        error={email.error}
        type="email"
        placeholder="example@email.com"
        name="email"
        autoComplete="email"
        id="email"
      />

      <Input
        label="Contraseña"
        value={password.value}
        onChange={password.onChange}
        onBlur={password.onBlur}
        error={password.error}
        type="password"
        placeholder="Mínimo 8 caracteres con mayúscula, número y carácter especial"
        name="password"
        autoComplete="new-password"
        id="password"
        showPasswordRequirements={true}
      />

      <Input
        label="Confirmar contraseña"
        value={confirmPassword.value}
        onChange={confirmPassword.onChange}
        onBlur={confirmPassword.onBlur}
        error={confirmPassword.error}
        type="password"
        placeholder="Repite tu contraseña"
        name="confirmPassword"
        autoComplete="new-password"
        id="confirmPassword"
      />

      {backendError && (
        <div className="text-red-500 text-sm text-center p-3 bg-red-50 rounded-lg border border-red-200">
          {backendError}
        </div>
      )}

      <Button
        type="submit"
        loading={isLoading}
        disabled={!isValid}
        variant="red"
        className="flex items-center justify-center gap-2 w-full"
      >
        {isLoading ? 'Creando cuenta...' : 'Crear cuenta'} <LuBookCheck />
      </Button>

      <p className="mt-4 text-sm font-medium text-[var(--color-blue)] text-center">
        ¿Ya tienes cuenta?{" "}
        <Link to="/login" className="text-[var(--color-green)] hover:underline">
          Inicia sesión
        </Link>
      </p>
    </form>
  );
}