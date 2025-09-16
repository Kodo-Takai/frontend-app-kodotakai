import { emailValidator, required, useField } from "./useField";

export function useLoginForm() {
  const email = useField("", [required, emailValidator]);
  const password = useField("", [required]);
  const isValid = email.isValid && password.isValid;
  return { email, password, isValid };
}