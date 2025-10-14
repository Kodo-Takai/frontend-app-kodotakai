import { useState, useCallback } from "react";
import { useField, required, emailValidator, passwordValidator, nameValidator } from "./useField";

export function useRegisterForm() {
    const name = useField("", [required, nameValidator]);
    const lastName = useField("", [required, nameValidator]);
    const username = useField("", [required, emailValidator]);
    const email = useField("", [required, emailValidator]);
    const password = useField("", [required, passwordValidator]);
    const confirmPassword = useField("", [required]);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [backendError, setBackendError] = useState<string | null>(null);

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
        name.isValid &&
        lastName.isValid &&
        username.isValid &&
        email.isValid &&
        password.isValid &&
        confirmPassword.isValid &&
        confirmPassword.value === password.value;

    const handleSubmit = async (onSuccess: () => void) => {
        if (!isValid) return;

        setIsSubmitting(true);
        setBackendError(null);
        
        try {
            // 👉 Aquí deberías llamar a tu API/servicio real de registro
            // const response = await registerUser({
            //     username: username.value,
            //     email: email.value,
            //     password: password.value,
            //     name: name.value,
            //     lastName: lastName.value
            // });
            
            // Simulación temporal
            await new Promise((resolve) => setTimeout(resolve, 1500));

            onSuccess(); // redirigir
        } catch (error: any) {
            // Manejo de errores del backend
            if (error.response?.data?.message) {
                const errorMessage = error.response.data.message;
                
                // Mapear errores específicos del backend a campos específicos
                if (errorMessage.includes('usuario ya existe')) {
                    username.setError('Este usuario ya está registrado');
                } else if (errorMessage.includes('email ya está en uso')) {
                    email.setError('Este email ya está registrado');
                } else {
                    setBackendError(errorMessage);
                }
            } else {
                setBackendError('Error interno del servidor. Inténtalo de nuevo.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        name,
        lastName,
        username,
        email,
        password,
        confirmPassword,
        validateConfirmPassword,
        isValid,
        isSubmitting,
        backendError,
        setBackendError,
        handleSubmit,
    };
}