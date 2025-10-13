import { useCallback, useMemo, useState } from 'react';

export type Validator = (value: string) => string | undefined;

export const required: Validator = (v) =>
  v.trim() ? undefined : 'Este campo es obligatorio';

export const emailValidator: Validator = (v) =>
  /\S+@\S+\.\S+/.test(v) ? undefined : 'Email no válido';

export const usernameValidator: Validator = (v) =>
  /\S+@\S+\.\S+/.test(v) ? undefined : 'Email no válido';

export const minLengthValidator = (len: number): Validator => (v) =>
  v.length >= len ? undefined : `Debe tener al menos ${len} caracteres`;

export const passwordValidator: Validator = (v) => {
  if (v.length < 8) {
    return 'La contraseña debe tener al menos 8 caracteres';
  }
  
  if (!/[A-Z]/.test(v)) {
    return 'La contraseña debe contener al menos una letra mayúscula';
  }
  
  if (!/[0-9]/.test(v)) {
    return 'La contraseña debe contener al menos un número';
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(v)) {
    return 'La contraseña debe contener al menos un carácter especial (@, !, #, etc.)';
  }
  
  return undefined;
};

export const nameValidator: Validator = (v) => {
  if (v.trim().length < 2) {
    return 'El nombre debe tener al menos 2 caracteres';
  }
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(v)) {
    return 'El nombre solo puede contener letras y espacios';
  }
  return undefined;
};

export function useField(initial = '', validators: Validator[] = []) {
  const [value, setValue] = useState(initial);
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const runValidation = useCallback((val: string) => {
    for (const validate of validators) {
      const msg = validate(val);
      if (msg) return msg;
    }
    return undefined;
  }, [validators]);

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setValue(v);
    if (touched) setError(runValidation(v));
  }, [touched, runValidation]);

  const onBlur = useCallback(() => {
    setTouched(true);
    setError(runValidation(value));
  }, [value, runValidation]);

  const isValid = useMemo(() => !runValidation(value), [value, runValidation]);

  const reset = useCallback(() => {
    setValue(initial);
    setTouched(false);
    setError(undefined);
  }, [initial]);

  return { value, onChange, onBlur, error, touched, isValid, setValue, setError, reset };
}
