// components/form/LoginForm.tsx
import { RiLock2Line } from "react-icons/ri";
import Input from "../../ui/input";
import Button from "../../ui/button";

interface LoginFormProps {
  username: any;
  password: any;
  isValid: boolean;
  isLoading: boolean;
  errorMessage: string | null;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

export default function LoginForm({
  username,
  password,
  isValid,
  isLoading,
  errorMessage,
  onSubmit
}: LoginFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Input
        label="Ingresa tu usuario"
        name="username"
        type="text"
        value={username.value}
        onChange={username.onChange}
        onBlur={username.onBlur}
        error={username.error}
        placeholder="usuario o email@ejemplo.com"
        disabled={isLoading}
        autoComplete="username"
        id="username"
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
        disabled={isLoading}
        autoComplete="current-password"
        id="password"
      />

      {errorMessage && (
        <div className="text-sm text-center p-2 rounded-lg" style={{ color: 'var(--color-green)', backgroundColor: 'var(--color-beige-light)' }}>
          {errorMessage}
        </div>
      )}

      <Button
        className="flex items-center justify-center gap-2"
        type="submit"
        variant="blue"
        disabled={!isValid || isLoading}
        loading={isLoading}
      >
        {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'} 
        <RiLock2Line />
      </Button>

      <div className="mt-4 text-center">
        <a
          href="/forgot-password"
          className="text-sm text-[var(--color-blue)] hover:underline font-medium"
        >
          ¿Olvidaste tu contraseña?
        </a>
      </div>

      <p className="mt-6 text-center text-sm font-medium" style={{ color: 'var(--color-blue-light)' }}>
        ¿No tienes una cuenta?{" "}
        <a href="/register" className="hover:underline" style={{ color: 'var(--color-green)' }}>
          Regístrate ahora
        </a>
      </p>
    </form>
  );
}