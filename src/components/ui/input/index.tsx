import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

interface InputProps {
  id?: string; 
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
  disabled?: boolean;
  showPasswordRequirements?: boolean;
}

export default function Input({
  id,
  label,
  icon,
  value,
  onChange,
  onBlur,
  error,
  type = 'text',
  placeholder,
  name,
  autoComplete,
  disabled = false,
  showPasswordRequirements = false,
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || name || label || placeholder || 'input'; 
  const invalid = !!error;

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const getPasswordRequirements = () => {
    if (type !== 'password' || !showPasswordRequirements) return null;
    
    const hasMinLength = value.length >= 8;
    const hasUpperCase = /[A-Z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);

    return (
      <div className="mt-2 text-xs text-gray-600">
        <div className="grid grid-cols-2 gap-1">
          <div className={`flex items-center gap-1 ${hasMinLength ? 'text-green-600' : 'text-gray-400'}`}>
            <span>{hasMinLength ? '✓' : '○'}</span>
            <span>Mínimo 8 caracteres</span>
          </div>
          <div className={`flex items-center gap-1 ${hasUpperCase ? 'text-green-600' : 'text-gray-400'}`}>
            <span>{hasUpperCase ? '✓' : '○'}</span>
            <span>Una mayúscula</span>
          </div>
          <div className={`flex items-center gap-1 ${hasNumber ? 'text-green-600' : 'text-gray-400'}`}>
            <span>{hasNumber ? '✓' : '○'}</span>
            <span>Un número</span>
          </div>
          <div className={`flex items-center gap-1 ${hasSpecialChar ? 'text-green-600' : 'text-gray-400'}`}>
            <span>{hasSpecialChar ? '✓' : '○'}</span>
            <span>Carácter especial</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mb-6">
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </span>
        )}

        <input
          id={inputId}
          name={name}
          type={showPassword && type === 'password' ? 'text' : type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`block w-full px-4 py-4 pr-10 text-sm rounded-2xl border focus:outline-none ${
            invalid ? 'border-red-500' : 'border-[#DEDEDE]'
          } bg-[#EEEEEE] text-[#AEAEAE]`}
          aria-invalid={invalid}
          aria-describedby={invalid ? `${inputId}-error` : undefined}
          disabled={disabled}
        />

        {type === 'password' && (
          <span
            onClick={handleTogglePassword}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
          >
            {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
          </span>
        )}
      </div>

      {getPasswordRequirements()}
      
      {invalid && (
        <span className="text-sm text-red-500 mt-2" id={`${inputId}-error`}>
          {error}
        </span>
      )}
    </div>
  );
}