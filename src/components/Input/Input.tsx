import React from 'react';

interface InputProps {
  label?: string;
  icon?: React.ReactNode;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  error?: string;
  type?: 'text' | 'password' | 'email' | 'number' | 'search' | 'tel' | 'url';
  placeholder?: string;
  name?: string;
  autoComplete?: string;
}

export default function Input({
  label,
  icon,
  value,
  onChange,
  onBlur,
  error,
  type = 'text',
  placeholder,
  name,
  autoComplete
}: InputProps) {
  const inputId = name || label || placeholder || 'input';
  const invalid = !!error;

  return (
    <div className="input-wrapper">
      {label && <label htmlFor={inputId}>{label}</label>}

      <div className={`input-field ${invalid ? 'input-invalid' : ''}`} aria-invalid={invalid}>
        {icon && <span className="icon">{icon}</span>}
        <input
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={invalid}
          aria-describedby={invalid ? `${inputId}-error` : undefined}
        />
      </div>

      {invalid && <span className="error" id={`${inputId}-error`}>{error}</span>}
    </div>
  );
}
