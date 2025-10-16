import React from 'react';
import './index.scss';

type ButtonVariant = 'red' | 'blue' | 'neutral';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  variant?: ButtonVariant;
};

export default function Button({
  loading = false,
  disabled,
  variant = 'red', // Por defecto usa el estilo rojo
  className = '',
  children,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      disabled={isDisabled}
      className={`btn btn--${variant} w-full py-4 text-[var(--color-bone)] font-semibold rounded-lg transition-all duration-300 ${className}`}
      aria-busy={loading}
      {...rest}
    >
      {loading ? (
        <span>Cargando...</span>
      ) : (
        children
      )}
    </button>
  );
}