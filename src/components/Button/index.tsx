import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  variant?: 'red' | 'blueDark';
};

export default function Button({
  loading = false,
  disabled,
  className = '',
  children,
  variant = 'red',
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const baseClasses =
    'w-full py-4 text-white font-semibold rounded-2xl transition-all duration-300';

  const variants: Record<string, string> = {
    red: 'bg-red-600 hover:bg-red-700',
    blueDark: 'bg-[#00324A] hover:bg-[#002535]',
  };

  const appliedClasses = isDisabled
    ? 'bg-gray-400 cursor-not-allowed'
    : variants[variant] || variants.red;

  return (
    <button
      disabled={isDisabled}
      className={`${baseClasses} ${appliedClasses} ${className}`}
      aria-busy={loading}
      {...rest}
    >
      {loading ? <span>Cargando...</span> : children}
    </button>
  );
}
