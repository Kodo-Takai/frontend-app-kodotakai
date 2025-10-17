import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import RegisterForm from "../components/form/registerForm";
import { useRegister } from "../hooks/auth/useRegister";
import { useToast } from "../hooks/useToast";

export default function Register() {
  const navigate = useNavigate();
  const {
    username,
    email,
    password,
    confirmPassword,
    name,
    lastName,
    isValid,
    isLoading,
    errorMessage,
    register,
  } = useRegister();
  const { success: toastSuccess, error: toastError } = useToast();

  const handleSubmitWithToast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || isLoading) return;
    const result = await register();
    if (result?.success) {
      toastSuccess(result.data);
      navigate("/login", {
        state: {
          message: "Cuenta creada exitosamente. Por favor inicia sesión.",
          username: username.value,
        },
      });
    } else {
      toastError("Error al registrarse");
    }
  };

  return (
    <div
      className="max-w-md mx-auto p-6 rounded-lg justify-center"
      style={{ backgroundColor: "var(--color-bone)" }}
    >
      <div
        className="cursor-pointer"
        onClick={() => navigate(-1)}
        aria-label="Regresar"
      >
        <div
          className="w-10 h-10 flex items-center justify-center rounded-xl transition-colors"
          style={{
            backgroundColor: "var(--color-blue)",
            color: "var(--color-bone)",
          }}
        >
          <FaArrowLeft className="w-4 h-4" />
        </div>
      </div>

      <h2
        className="text-[40px] font-extrabold mb-4 mt-4 font-sf-pro tracking-tight leading-10"
        style={{ color: "var(--color-blue)" }}
      >
        Crea tu <span style={{ color: "var(--color-green)" }}>nueva</span>{" "}
        <br /> cuenta
      </h2>

      <p
        className="text-sm mb-6 font-medium"
        style={{ color: "var(--color-blue-light)" }}
      >
        Crea una cuenta para que puedas comenzar una nueva aventura y disfrutar
        la experiencia al máximo
      </p>

      <RegisterForm
        username={username}
        email={email}
        password={password}
        confirmPassword={confirmPassword}
        name={name}
        lastName={lastName}
        isValid={isValid}
        isLoading={isLoading}
        backendError={errorMessage}
        onSubmit={handleSubmitWithToast}
      />
    </div>
  );
}
