import { useCallback, useMemo, useState } from 'react';

export type Validator = (value: string) => string | undefined;

export const required: Validator = (v) =>
  v.trim() ? undefined : 'Este campo es obligatorio';

export const emailValidator: Validator = (v) =>
  /\S+@\S+\.\S+/.test(v) ? undefined : 'Email no válido';

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

  return { value, onChange, onBlur, error, touched, isValid, setValue, setError };
}

export function useInput() {
  const email = useField('', [required, emailValidator]);
  const password = useField('', [required]);
  const isValid = email.isValid && password.isValid;
  return { email, password, isValid };
}