import { useState } from 'react';

export function usePasswordRecovery() {
  const [step, setStep] = useState(1);  // 1 = Correo, 2 = Código, 3 = Nueva Contraseña
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleNextStep = () => {
    if (step === 1 && email) {
      setStep(2);  // Si es el paso 1 y el correo es válido, pasa al paso 2
    } else if (step === 2 && code) {
      setStep(3);  // Si el código es ingresado, pasa al paso 3
    }
  };

  const handleSubmit = () => {
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    // Aquí iría la lógica para enviar la nueva contraseña a la API
    alert('Contraseña actualizada correctamente');
  };

  return {
    step,
    email,
    setEmail,
    code,
    setCode,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    setError,
    handleNextStep,
    handleSubmit,
  };
}
