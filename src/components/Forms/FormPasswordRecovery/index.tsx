import { usePasswordRecovery } from "../../../hooks/usePasswordRecovery";
import { RiMailSendLine } from "react-icons/ri";
import { IoLockClosedOutline } from "react-icons/io5";
import Button from "../../Button";
import Input from "../../input";
import CodeInput from "../../CodeInput"; 

export default function PasswordRecoveryForm() {
  const {
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
  } = usePasswordRecovery();

  return (
    <div className="password-recovery-form">
      {/* Paso 1: Ingreso de correo */}
      {step === 1 && (
        <div className="flex flex-col">
          <div className="flex flex-col gap-2 mb-6">
            <h1 className="text-4xl font-extrabold font-sf-pro">
              ¿Olvidaste tu <span className="text-red-500">Contraseña?</span>
            </h1>
            <p className="text-gray-500 text-sm">
              Por favor, ingresa el email que está vinculado a tu cuenta para
              poder recuperar tu contraseña
            </p>
          </div>

          <Input
            label="Correo electrónico"
            type="email"
            value={email.value}
            onChange={email.onChange}
            onBlur={email.onBlur}
            error={email.error}
            placeholder="Ingresa tu correo"
            name="email"
          />

          {generalError && (
            <div className="text-red-500 text-sm text-center p-2 bg-red-50 rounded-lg mb-4">
              {generalError}
            </div>
          )}

          <Button
            className="flex items-center justify-center gap-4 font-semibold text-md"
            variant="blue"
            onClick={handleNextStep}
            disabled={!canProceedStep1}
            loading={isSubmitting}
          >
            Enviar código al correo <RiMailSendLine className="w-5 h-5" />
          </Button>
        </div>
      )}

      {/* Paso 2: Verificación de código - ¡AQUÍ USAMOS CodeInput! */}
      {step === 2 && (
        <div>
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl font-extrabold font-sf-pro">
              Ingresa el <span className="text-red-500">código</span> de tu
              correo
            </h1>
            <p className="text-gray-500 text-sm mb-6">
              Ingresa el código de verificación que se envió a <strong>{email.value}</strong>
            </p>
          </div>

          <CodeInput
            label="Código de verificación"
            value={code.value}
            onChange={code.onChange}
            onBlur={code.onBlur}
            error={code.error}
            length={6}
            autoFocus={true}
            disabled={isSubmitting}
          />

          {generalError && (
            <div className="text-red-500 text-sm text-center p-2 bg-red-50 rounded-lg mb-4">
              {generalError}
            </div>
          )}

          <Button 
            variant="blue" 
            onClick={handleNextStep}
            disabled={!canProceedStep2}
            loading={isSubmitting}
          >
            Verificar código
          </Button>
        </div>
      )}

      {/* Paso 3: Nueva contraseña */}
      {step === 3 && (
        <div>
          <div className="flex flex-col gap-4 mb-6">
            <h1 className="text-4xl font-extrabold font-sf-pro">
              Crea una nueva <span className="text-red-500">contraseña</span>
            </h1>
            <p className="text-gray-500 text-sm">
              Ingresa una nueva contraseña para restablecer el acceso a tu
              cuenta
            </p>
          </div>

          <Input
            label="Nueva contraseña"
            type="password"
            value={newPassword.value}
            onChange={newPassword.onChange}
            onBlur={newPassword.onBlur}
            error={newPassword.error}
            placeholder="Ingresa tu nueva contraseña"
            name="newPassword"
            autoComplete="new-password"
          />

          <Input
            label="Confirmar nueva contraseña"
            type="password"
            value={confirmPassword.value}
            onChange={confirmPassword.onChange}
            onBlur={() => {
              confirmPassword.onBlur();
              validateConfirmPassword();
            }}
            error={confirmPassword.error}
            placeholder="Confirma tu nueva contraseña"
            name="confirmPassword"
            autoComplete="new-password"
          />

          {generalError && (
            <div className="text-red-500 text-sm text-center p-2 bg-red-50 rounded-lg mb-4">
              {generalError}
            </div>
          )}

          <Button 
            className="flex items-center justify-center gap-2" 
            variant="blue" 
            onClick={handleSubmit}
            disabled={!canSubmitStep3}
            loading={isSubmitting}
          >
            Restablecer Contraseña <IoLockClosedOutline className="w-5 h-5 font-bold" />
          </Button>
        </div>
      )}
    </div>
  );
}