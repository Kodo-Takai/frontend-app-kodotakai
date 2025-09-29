import { useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../../redux/api/authApi";
import { required, emailValidator, useField } from "../useField";

// Validador para confirmar contraseña
const passwordConfirmValidator =
  (password: string) =>
  (value: string): string | undefined => {
    if (value !== password) {
      return "Las contraseñas no coinciden";
    }
    return undefined;
  };

// Validador para longitud mínima
const minLength =
  (min: number) =>
  (value: string): string | undefined => {
    if (value.length < min) {
      return `Mínimo ${min} caracteres`;
    }
    return undefined;
  };

interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  lastName: string;
}

export const useRegister = () => {
  // Campos del formulario según lo que espera el backend
  const username = useField("", [required, emailValidator]); 
  const email = useField("", [required, emailValidator]); 
  const password = useField("", [required, minLength(6)]);
  const confirmPassword = useField("", [
    required,
    passwordConfirmValidator(password.value),
  ]);
  const name = useField("", [required]); 
  const lastName = useField("", [required]);

  const isValid =
    username.isValid &&
    email.isValid &&
    password.isValid &&
    confirmPassword.isValid &&
    name.isValid &&
    lastName.isValid;

  const navigate = useNavigate();

  const [
    registerMutation,
    { isLoading: isRegisterLoading, error: registerError },
  ] = useRegisterMutation();

  const register = async (credentials?: RegisterCredentials) => {
    try {
      const registerData = credentials || {
        username: username.value,
        email: email.value,
        password: password.value,
        confirmPassword: confirmPassword.value,
        name: name.value,
        lastName: lastName.value,
      };

      // Estructura exacta que espera tu backend
      const registerRequest = {
        username: registerData.username,
        password: registerData.password,
        confirmPassword: registerData.confirmPassword,
        email: registerData.email,
        name: registerData.name,
        lastName: registerData.lastName,
      };

      const result = await registerMutation(registerRequest).unwrap();

      // Redirigir a login con un mensaje de éxito
      return { success: true, data: result };
    } catch (error: any) {
      return {
        success: false,
        error: error.data?.message || "Error al registrarse",
      };
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      const result = await register();

      if (result.success) {
        // Redirigir a login con mensaje de éxito
        navigate("/login", {
          state: {
            message: "Cuenta creada exitosamente. Por favor inicia sesión.",
            username: username.value,
          },
        });
      }
    }
  };

  const resetForm = () => {
    username.reset();
    email.reset();
    password.reset();
    confirmPassword.reset();
    name.reset();
    lastName.reset();
  };

  const getErrorMessage = () => {
    if (registerError) {
      return "data" in registerError
        ? (registerError.data as any)?.message || "Error en registro"
        : "Error de conexión";
    }
    return null;
  };

  return {
    // Form fields
    username,
    email,
    password,
    confirmPassword,
    name,
    lastName,
    isValid,

    // Loading states
    isLoading: isRegisterLoading,

    // Errors
    registerError,
    errorMessage: getErrorMessage(),

    // Actions
    register,
    handleFormSubmit,
    resetForm,
  };
};
