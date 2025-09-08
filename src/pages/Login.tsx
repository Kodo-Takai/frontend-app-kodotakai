import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import Input from '../components/Input';
import Button from '../components/Button';
import { useAuthForm } from '../hooks/useAuthForm';
import { signIn } from '../utils/auth';

// Iconos opcionales: puedes quitar estos spans o cambiar por una librería
const MailIcon = () => <span>@</span>;
const LockIcon = () => <span>🔒</span>;

export default function Login() {
  const { email, password, isValid } = useAuthForm();
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    email.onBlur();
    password.onBlur();
    if (!isValid) return;

    try {
      setLoading(true);
      const res = await signIn(email.value, password.value);
      if (res.ok) {
        // localStorage.setItem('token', res.token);
        navigate('/', { replace: true });
      }
    } catch (err: any) {
      setFormError(err?.message || 'Ocurrió un error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Iniciar sesión" helper="Accede con tu cuenta para continuar">
      <form onSubmit={onSubmit} className="form-grid">
        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="tucorreo@dominio.com"
          value={email.value}
          onChange={email.onChange}
          onBlur={email.onBlur}
          error={email.error}
          icon={<MailIcon />}
          autoComplete="email"
        />

        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="••••••••"
          value={password.value}
          onChange={password.onChange}
          onBlur={password.onBlur}
          error={password.error}
          icon={<LockIcon />}
          autoComplete="current-password"
        />

        {formError && <div className="error" role="alert">{formError}</div>}

        <div className="link-row">
          <Link to="/forgot-password">Recuperar contraseña</Link>
          <Link to="/register">Crear cuenta</Link>
        </div>

        <Button type="submit" loading={loading} disabled={!isValid || loading}>
          {loading ? 'Ingresando...' : 'Ingresar'}
        </Button>
      </form>
    </AuthLayout>
  );
}
