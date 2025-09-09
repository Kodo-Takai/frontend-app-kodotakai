import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
};

export default function Button({
  loading = false,
  disabled,
  className = 'btn btn--red',
  children,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      disabled={isDisabled}
      className={`w-full py-3 text-white font-semibold rounded-lg transition-all duration-300 ${
        isDisabled
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-red-600 hover:bg-red-700'
      } ${className}`}
      aria-busy={loading}
      {...rest}
    >
      {loading ? (
        <span>Cargando...</span> // O podrías usar un ícono de carga aquí
      ) : (
        children
      )}
    </button>
  );
}
