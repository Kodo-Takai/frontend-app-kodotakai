import { usePasswordRecovery } from '../../../hooks/usePasswordRecovery';
import Button from '../../Button';
import Input from '../../input';  

export default function PasswordRecoveryForm() {
  const {
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
    handleNextStep,
    handleSubmit,
  } = usePasswordRecovery();

  return (
    <div className="password-recovery-form">
      {step === 1 && (
        <div>
          <h2>Recuperar Contraseña</h2>
          <Input
            label="Correo electrónico"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ingresa tu correo"
          />
          <Button onClick={handleNextStep}>Enviar código</Button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2>Verificación de código</h2>
          <Input
            label="Código de verificación"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Ingresa el código"
          />
          <Button onClick={handleNextStep}>Validar código</Button>
        </div>
      )}

      {step === 3 && (
        <div>
          <h2>Cambiar Contraseña</h2>
          <Input
            label="Nueva contraseña"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Ingresa tu nueva contraseña"
          />
          <Input
            label="Confirmar nueva contraseña"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirma tu nueva contraseña"
          />
          <Button onClick={handleSubmit}>Actualizar Contraseña</Button>
          {error && <p className="error">{error}</p>}
        </div>
      )}
    </div>
  );
}
