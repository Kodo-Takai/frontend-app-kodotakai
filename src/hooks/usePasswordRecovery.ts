import { useState, useCallback } from 'react';
import { useField, required, emailValidator } from './useField';
import { useCodeInput, codeValidator } from './useCodeInput';

const minLengthValidator = (len: number) => (v: string) =>
  v.length >= len ? undefined : `Debe tener al menos ${len} caracteres`;

export function usePasswordRecovery() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState('');

  // Campos usando diferentes hooks
  const email = useField('', [required, emailValidator]);
  const code = useCodeInput('', [codeValidator]); // ← USANDO useCodeInput
  const newPassword = useField('', [required, minLengthValidator(8)]);
  const confirmPassword = useField('', [required]);

  // Validación para confirmar contraseña
  const validateConfirmPassword = useCallback(() => {
    if (confirmPassword.value !== newPassword.value) {
      confirmPassword.setError('Las contraseñas no coinciden');
      return false;
    }
    confirmPassword.setError(undefined);
    return true;
  }, [confirmPassword, newPassword.value]);

  const handleNextStep = async () => {
    setIsSubmitting(true);
    setGeneralError('');

    try {
      if (step === 1 && email.isValid) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setStep(2);
      } else if (step === 2 && code.isValid && code.isComplete) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setStep(3);
      }
    } catch (error) {
      setGeneralError('Ocurrió un error. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    if (!newPassword.isValid || !validateConfirmPassword()) {
      return;
    }

    setIsSubmitting(true);
    setGeneralError('');

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert('Contraseña actualizada correctamente');
    } catch (error) {
      setGeneralError('Error al actualizar la contraseña');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Validaciones por paso
  const canProceedStep1 = email.isValid && !isSubmitting;
  const canProceedStep2 = code.isValid && code.isComplete && !isSubmitting;
  const canSubmitStep3 = newPassword.isValid && confirmPassword.isValid && 
                        newPassword.value === confirmPassword.value && !isSubmitting;

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