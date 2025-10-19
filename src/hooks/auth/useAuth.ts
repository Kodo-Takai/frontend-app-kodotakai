import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../redux/api/authApi";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import {
  setCredentials,
  logout as logoutAction,
} from "../../redux/slice/authSlice";
import { required, useField } from "../useField";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { SerializedError } from "@reduxjs/toolkit";

// Tipos basados en la respuesta de authApi.login
interface LoginApiResponse {
  status_code: number;
  message: string;
  data: {
    message: string;
    access_token: string;
    refresh_token: string;
  };
}

// Payload mínimo del JWT si queremos extraer datos adicionales con seguridad
type JwtPayload = {
  sub?: string;
  userId?: string;
  email?: string;
  username?: string;
};

const parseJwt = (token: string): JwtPayload | null => {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = atob(parts[1]);
    const data = JSON.parse(payload) as unknown;
    if (data && typeof data === "object") {
      return data as JwtPayload;
    }
    return null;
  } catch {
    return null;
  }
};

const isFetchError = (err: unknown): err is FetchBaseQueryError => {
  return typeof err === "object" && err !== null && "status" in err;
};

const hasMessage = (err: unknown): err is { message: string } => {
  if (typeof err !== "object" || err === null) return false;
  return typeof (err as { message?: unknown }).message === "string";
};

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

      const result: LoginApiResponse = await loginMutation(loginRequest).unwrap();

      // Extraer token desde la estructura tipada
      const userToken = result?.data?.access_token;

      if (!userToken) {
        return {
          success: false,
          error: "No se recibió token de autenticación",
        };
      }

      // Intentar extraer userId/email del JWT si existe
      const decoded = userToken ? parseJwt(userToken) : null;
      const userId = decoded?.userId || decoded?.sub || loginData.username;
      const userEmail = decoded?.email || loginData.username;
      const userName = decoded?.username || loginData.username;

      // Lanzar error si no se encuentra userId
      if (!userId) {
        console.error('Error crítico: No se encontró userId en la respuesta del backend.');
        return {
          success: false,
          error: "No se pudo obtener el ID del usuario. Por favor, contacte al soporte.",
        };
      }

      // Crear objeto de usuario
      const userData = {
        id: userId, // UUID del usuario real
        username: userName || loginData.username,
        email: userEmail || loginData.username,
        status: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Guardar en Redux
      dispatch(
        setCredentials({
          user: userData,
          token: userToken,
        })
      );

      // Navegación estándar sin llamadas adicionales a perfiles (evita 404 de /profiles/me)
      const isFirstTime = checkIfFirstTime(userId);
      console.log('DEBUG: isFirstTime =', isFirstTime, 'for userId:', userId);

      if (isFirstTime) {
        setShowWelcomeScreens(true);
      } else {
        navigate("/home");
      }

      return { success: true, data: result };
    } catch (error: unknown) {
      console.error('Login error:', error);
      let message = "Error al iniciar sesión";
      if (isFetchError(error)) {
        const maybeData = (error as FetchBaseQueryError).data as { message?: string } | undefined;
        if (maybeData?.message) message = maybeData.message;
      } else if (hasMessage(error)) {
        message = error.message;
      }
      return {
        success: false,
        error: message,
      };
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      await login();
    }
  };

  // Completar welcome screens
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
    const err = loginError as FetchBaseQueryError | SerializedError | undefined;
    if (!err) return null;
    if (isFetchError(err)) {
      const data = err.data as { message?: string } | undefined;
      return data?.message || "Error en login";
    }
    if (hasMessage(err)) return err.message;
    return "Error de conexión";
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