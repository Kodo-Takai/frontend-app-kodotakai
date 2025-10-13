import React, { useRef, useEffect } from 'react';

interface CodeInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  label?: string;
  disabled?: boolean;
  autoFocus?: boolean;
}

export default function CodeInput({ 
  length = 6, 
  value, 
  onChange, 
  onBlur,
  error,
  label,
  disabled = false,
  autoFocus = false
}: CodeInputProps) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const invalid = !!error;

  // Asegurar que value sea un string
  const stringValue = String(value || '');
  const digits = stringValue.split('').slice(0, length);
  while (digits.length < length) {
    digits.push('');
  }

  const handleChange = (index: number, newValue: string) => {
    if (disabled) return;
    
    // Tomar solo el último carácter ingresado
    const char = newValue.slice(-1);

    const newDigits = [...digits];
    newDigits[index] = char;

    const newCode = newDigits.join('');
    onChange(newCode);

    // Auto-focus al siguiente input si se ingresó un carácter
    if (char && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (disabled) return;

    // Backspace: borra el carácter actual y va al anterior
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    }
    // Flecha izquierda/derecha para navegación
    else if (e.key === 'ArrowLeft' && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
    else if (e.key === 'ArrowRight' && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
    else if (e.key === 'Enter') {
      onBlur?.();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    if (disabled) return;
    
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    
    // Tomar los primeros 'length' caracteres del texto pegado
    const cleanedData = pastedData.slice(0, length);
    
    onChange(cleanedData);
    
    // Enfocar el último input lleno o el siguiente vacío
    const focusIndex = Math.min(cleanedData.length, length - 1);
    setTimeout(() => inputsRef.current[focusIndex]?.focus(), 0);
  };

  const handleFocus = (index: number) => {
    // Seleccionar todo el contenido al hacer focus
    inputsRef.current[index]?.select();
  };

  useEffect(() => {
    if (autoFocus) {
      const firstEmptyIndex = digits.findIndex(digit => !digit);
      const targetIndex = firstEmptyIndex !== -1 ? firstEmptyIndex : 0;
      setTimeout(() => inputsRef.current[targetIndex]?.focus(), 100);
    }
  }, [autoFocus]);

  return (
    <div className="mb-6">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-3">
          {label}
        </label>
      )}
      
      <div className="flex gap-2 justify-center">
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(el) => { inputsRef.current[index] = el; }}
            type="text"
            inputMode="text"
            maxLength={1}
            value={digit}
            disabled={disabled}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            onBlur={onBlur}
            onFocus={() => handleFocus(index)}
            className={`
              w-12 h-12 text-center text-xl font-bold rounded-xl border-2
              focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all duration-200
              ${disabled 
                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                : invalid 
                  ? 'border-red-500 bg-red-50 text-red-700 focus:border-red-500 focus:ring-red-200' 
                  : 'border-gray-300 bg-white text-gray-900 hover:border-gray-400 focus:border-blue-500'
              }
              ${digit ? 'bg-blue-50 border-blue-300' : ''}
            `}
            aria-label={`Carácter ${index + 1} de ${length}`}
            autoComplete="one-time-code"
          />
        ))}
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}