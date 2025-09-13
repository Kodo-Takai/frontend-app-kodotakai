import { usePasswordRecovery } from "../../../hooks/usePasswordRecovery";
import { RiMailSendLine } from "react-icons/ri";
import { IoLockClosedOutline } from "react-icons/io5";
import Button from "../../Button";
import Input from "../../input";

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
        <div className="flex flex-col">
          <div className="flex flex-col gap-2 mb-6">
            <h1 className="text-4xl font-extrabold font-sf-pro">
              Olvidaste tu <span className="text-red-500">Contraseña?</span>
            </h1>
            <p className="text-gray-300 text-sm">
              Porfavor, ingresa el email que está vinculado a tu cuenta para
              poder recuperar tu contraseña
            </p>
          </div>

          <Input
            label="Correo electrónico"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ingresa tu correo"
          />
          <Button
            className="flex items-center justify-center gap-4 font-semibold text-md "
            variant="blue"
            onClick={handleNextStep}
          >
            Enviar código al correo <RiMailSendLine className="w-5 h-5" />
          </Button>
        </div>
      )}

      {step === 2 && (
        <div>
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl font-extrabold font-sf-pro">
              Ingresa el <span className="text-red-500">código</span> de tu
              correo
            </h1>
            <p className="text-gray-300 text-sm mb-6">
              {" "}
              Ingresa el código de verificación que se envió al correo vinculado
              a tu usuario
            </p>
          </div>

          <Input
            label="Código de verificación"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Ingresa el código"
          />
          <Button variant="blue" onClick={handleNextStep}>
            Verificar
          </Button>
        </div>
      )}

      {step === 3 && (
        <div>
          <div className="flex flex-col gap-4 mb-6">
            <h1 className="text-4xl font-extrabold font-sf-pro">
              Crea una nueva <span className="text-red-500">contraseña</span>
            </h1>
            <p className="text-gray-300 text-sm">
              {" "}
              Ingresa una nueva contraseña para restablecer el acceso a tu
              cuenta
            </p>
          </div>
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
          <Button className="flex items-center justify-center gap-2" variant="blue" onClick={handleSubmit}>
            Restablecer Contraseña <IoLockClosedOutline className="w-5 h-5 font-bold" />
          </Button>
          {error && <p className="error">{error}</p>}
        </div>
      )}
    </div>
  );
}
