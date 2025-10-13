import { useState, useCallback } from "react";
import { useField, required, emailValidator } from "./useField";
import { useCodeInput, codeValidator } from "./useCodeInput";
import { useForgotPasswordMutation, useResetPasswordMutation } from "../redux/api/authApi";
import { useNavigate } from "react-router-dom";

const minLengthValidator = (len: number) => (v: string) =>
  v.length >= len ? undefined : `Debe tener al menos ${len} caracteres`;

export function usePasswordRecovery() {
  const [forgotPassword] = useForgotPasswordMutation();
  const [resetPassword] = useResetPasswordMutation();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState("");

  // Campos usando diferentes hooks
  const email = useField("", [required, emailValidator]);
  const code = useCodeInput("", [codeValidator]);
  const newPassword = useField("", [required, minLengthValidator(8)]);
  const confirmPassword = useField("", [required]);

  // Validación para confirmar contraseña
  const validateConfirmPassword = useCallback(() => {
    if (confirmPassword.value !== newPassword.value) {
      confirmPassword.setError("Las contraseñas no coinciden");
      return false;
    }
    confirmPassword.setError(undefined);
    return true;
  }, [confirmPassword, newPassword.value]);

  const navigate = useNavigate();

  const handleNextStep = async () => {
    setIsSubmitting(true);
    setGeneralError("");

    try {
      if (step === 1 && email.isValid) {
        // Paso 1: Enviar código al correo
        await forgotPassword({ email: email.value }).unwrap();
        setStep(2);
      } else if (step === 2 && code.isValid && code.isComplete) {
        // Paso 2: Validar código (solo verificación local, el backend valida en reset)
        setStep(3);
      }
    } catch (error: any) {
      const errorMessage = error?.data?.message || "Ocurrió un error. Inténtalo de nuevo.";
      setGeneralError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    if (!newPassword.isValid || !validateConfirmPassword()) {
      return;
    }

    setIsSubmitting(true);
    setGeneralError("");

    try {
      // Enviar todos los datos necesarios para reset-password
      await resetPassword({
        email: email.value,           // Email del paso 1
        code: code.value,             // Código del paso 2
        password: newPassword.value,  // Nueva contraseña del paso 3
        confirmPassword: confirmPassword.value, // Confirmación del paso 3
      }).unwrap();
      
      alert("Contraseña actualizada correctamente");
      // Redirigir al login después de actualizar la contraseña
      navigate("/login");
    } catch (error: any) {
      const errorMessage = error?.data?.message || "Error al actualizar la contraseña";
      setGeneralError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Validaciones por paso
  const canProceedStep1 = email.isValid && !isSubmitting;
  const canProceedStep2 = code.isValid && code.isComplete && !isSubmitting;
  const canSubmitStep3 =
    newPassword.isValid &&
    confirmPassword.isValid &&
    newPassword.value === confirmPassword.value &&
    !isSubmitting;

  return {
    step,
    email,
    code,
    newPassword,
    confirmPassword,
    validateConfirmPassword,
    generalError,
    isSubmitting,
    canProceedStep1,
    canProceedStep2,
    canSubmitStep3,
    handleNextStep,
    handleSubmit,
    setGeneralError,
  };
}