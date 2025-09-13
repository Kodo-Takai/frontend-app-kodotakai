import { useState, useCallback } from "react";
import { useField, required, emailValidator } from "./useInput";

const minLengthValidator = (len: number) => (v: string) =>
    v.length >= len ? undefined : `Debe tener al menos ${len} caracteres`;

export function useAuthForm() {
    const firstName = useField("", [required]);
    const email = useField("", [required, emailValidator]);
    const password = useField("", [required, minLengthValidator(8)]);
    const confirmPassword = useField("", [required]);

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Validación extra para confirmar password
    const validateConfirmPassword = useCallback(() => {
        if (confirmPassword.value !== password.value) {
        confirmPassword.setError("Las contraseñas no coinciden");
        return false;
        }
        confirmPassword.setError(undefined);
        return true;
    }, [confirmPassword, password]);

    const isValid =
    firstName.isValid &&
    email.isValid &&
    password.isValid &&
    confirmPassword.isValid &&
    confirmPassword.value === password.value;

    const handleSubmit = async (onSuccess: () => void) => {
        if (!isValid) return;

        setIsSubmitting(true);
        try {
        // 👉 Aquí deberías llamar a tu API/servicio real de registro
        await new Promise((resolve) => setTimeout(resolve, 1500));

        onSuccess(); // redirigir
        } finally {
        setIsSubmitting(false);
        }
    };
    
    return {
    firstName,
    email,
    password,
    confirmPassword,
    validateConfirmPassword,
    isValid,
    isSubmitting,
    handleSubmit,
    };
}