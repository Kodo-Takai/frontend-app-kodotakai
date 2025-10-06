import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../redux/api/authApi";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import {
  setCredentials,
  logout as logoutAction,
} from "../../redux/slice/authSlice";
import { required, useField } from "../useField";

interface LoginCredentials {
  username: string;
  password: string;
}

export const useAuth = () => {
  const username = useField("", [required]);
  const password = useField("", [required]);
  const isValid = username.isValid && password.isValid;

  const [showWelcomeScreens, setShowWelcomeScreens] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, token } = useAppSelector(
    (state) => state.auth
  );

  const [loginMutation, { isLoading: isLoginLoading, error: loginError }] =
    useLoginMutation();

  // Función para verificar si es primera vez
  const checkIfFirstTime = (userId: string) => {
    const userKey = `user_${userId}_hasLoggedBefore`;
    return !localStorage.getItem(userKey);
  };

  // Función para marcar usuario como recurrente
  const markAsReturningUser = (userId: string) => {
    const userKey = `user_${userId}_hasLoggedBefore`;
    localStorage.setItem(userKey, "true");
  };

  const login = async (credentials?: LoginCredentials) => {
    try {
      const loginData = credentials || {
        username: username.value,
        password: password.value,
      };

      const loginRequest = {
        username: loginData.username,
        password: loginData.password,
      };

      const result = await loginMutation(loginRequest).unwrap();

      // Corregir: acceder a los datos dentro de result.data
      const userToken = result?.data?.access_token;

      if (!userToken) {
        return {
          success: false,
          error: "No se recibió token de autenticación",
        };
      }

      // Como no hay información del usuario en la respuesta, crear un objeto básico
      const userData = {
        id: loginData.username, // Usar el username como ID temporal
        userName: loginData.username,
        password: "", // No guardar la contraseña
        status: true, // Asumir activo si el login fue exitoso
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Guardar credenciales en Redux
      dispatch(
        setCredentials({
          user: userData,
          token: userToken,
        })
      );

      // ORDEN CORRECTO: Verificar ANTES de marcar como recurrente
      const isFirstTime = checkIfFirstTime(userData.id.toString());
      console.log('DEBUG: isFirstTime =', isFirstTime, 'for user ID:', userData.id);

      if (isFirstTime) {
        // Solo mostrar welcome screens, NO marcar como recurrente aún
        console.log('DEBUG: Setting showWelcomeScreens = true');
        setShowWelcomeScreens(true);
      } else {
        // Usuario recurrente, ir directo al home
        console.log('DEBUG: Navigating to /home');
        navigate("/home");
      }

      return { success: true, data: result };
    } catch (error: any) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.data?.message || "Error al iniciar sesión",
      };
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      await login();
    }
  };

  // Completar welcome screens - AQUÍ es donde marcamos como recurrente
  const completeWelcomeScreens = () => {
    if (user?.id) {
      markAsReturningUser(user.id.toString());
    }
    setShowWelcomeScreens(false);
    navigate("/home");
  };

  const logout = () => {
    dispatch(logoutAction());
    Object.keys(localStorage).forEach((key) => {
      if (key.includes("_hasLoggedBefore")) {
        localStorage.removeItem(key);
      }
    });
    navigate("/login");
  };

  const loginWithCredentials = async (data: {
    username: string;
    password: string;
  }) => {
    return await login({
      username: data.username,
      password: data.password,
    });
  };

  const resetForm = () => {
    username.reset();
    password.reset();
  };

  const getErrorMessage = () => {
    if (loginError) {
      return "data" in loginError
        ? (loginError.data as any)?.message || "Error en login"
        : "Error de conexión";
    }
    return null;
  };

  return {
    // Form fields
    username,
    password,
    isValid,

    // Auth state
    user,
    isAuthenticated,
    token,

    // Welcome screens state
    showWelcomeScreens,

    // Loading states
    isLoading: isLoginLoading,

    // Errors
    loginError,
    errorMessage: getErrorMessage(),

    // Actions
    login,
    loginWithCredentials,
    logout,
    handleFormSubmit,
    completeWelcomeScreens,
    resetForm,
  };
};