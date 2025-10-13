import { useState, useCallback } from 'react';

export type CodeValidator = (value: string) => string | undefined;

// Validadores específicos para códigos
export const requiredCode: CodeValidator = (v) =>
  v.trim() ? undefined : 'El código es obligatorio';

export const exactLengthValidator = (len: number): CodeValidator => (v) =>
  v.length === len ? undefined : `El código debe tener exactamente ${len} dígitos`;



// Validador compuesto común para códigos de 6 dígitos
export const codeValidator = (v: string) => {
  const required = requiredCode(v);
  if (required) return required;
  
  // Solo mayúsculas A-Z y números
  if (!/^[A-Z0-9]*$/.test(v)) {
    return 'Solo se permiten letras A–Z y números';
  }

  // No permitir minúsculas
  if (/[a-z]/.test(v)) {
    return 'El código debe estar en mayúsculas';
  }
  
  const exactLength = exactLengthValidator(6)(v);
  if (exactLength) return exactLength;
  
  return undefined;
};
export function useCodeInput(initialValue = '', validators: CodeValidator[] = [codeValidator]) {
  const [value, setValue] = useState(initialValue);
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const runValidation = useCallback((val: string) => {
    for (const validate of validators) {
      const msg = validate(val);
      if (msg) return msg;
    }
    return undefined;
  }, [validators]);

  const onChange = useCallback((newValue: string) => {
    setValue(newValue);
    if (touched) {
      setError(runValidation(newValue));
    }
  }, [touched, runValidation]);

  const onBlur = useCallback(() => {
    setTouched(true);
    setError(runValidation(value));
  }, [value, runValidation]);

  const isValid = !runValidation(value);
  const isComplete = value.length === 6 && !runValidation(value);

  return {
    value,
    onChange,
    onBlur,
    error,
    touched,
    isValid,
    isComplete,
    setValue,
    setError,
    setTouched
  };
}
