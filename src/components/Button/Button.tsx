import React from 'react';

interface ButtonProps {
  loading?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export default function Button({
  loading = false,
  disabled = false,
  children,
  onClick,
  type = 'button',
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className="button-primary"
      aria-busy={loading}
    >
      {loading ? 'Cargando...' : children}
    </button>
  );
}
