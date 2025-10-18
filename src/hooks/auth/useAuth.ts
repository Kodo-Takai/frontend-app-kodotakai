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

      // Normalizar la carga útil: algunos endpoints devuelven { data: { ... } } otros devuelven la carga raíz.
      const payload: any = (result as any)?.data ?? (result as any);

      // Extraer token
      const userToken = payload?.access_token || payload?.accessToken || payload?.token;

      if (!userToken) {
        return {
          success: false,
          error: "No se recibió token de autenticación",
        };
      }

      // IMPORTANTE: Extraer userId de la respuesta del backend
      // El backend probablemente devuelve:
      // 1. payload.user.id (si devuelve el usuario)
      // 2. payload.userId (si es un campo separado)
      // 3. payload.profile.userId (si devuelve el perfil)
      // 4. payload.data.user.id (si está anidado en data)
      
      let userId: string | undefined;
      let userEmail: string | undefined;
      let userName: string | undefined;

      console.log('DEBUG: Full login response:', result);
      console.log('DEBUG: Payload structure:', payload);

      // Intentar extraer en el orden correcto
      if (payload?.user?.id) {
        userId = payload.user.id;
        userEmail = payload.user.email;
        userName = payload.user.username;
      } else if (payload?.userId) {
        userId = payload.userId;
        userEmail = payload.email;
        userName = payload.username;
      } else if (payload?.profile?.userId) {
        userId = payload.profile.userId;
        userEmail = payload.profile.email;
        userName = payload.profile.name;
      } else if (payload?.data?.user?.id) {
        userId = payload.data.user.id;
        userEmail = payload.data.user.email;
        userName = payload.data.user.username;
      } else if (payload?.data?.userId) {
        userId = payload.data.userId;
        userEmail = payload.data.email;
        userName = payload.data.username;
      }

      // Fallback: si no encontramos userId, usar username
      if (!userId) {
        console.warn('No se encontró userId en la respuesta, usando username como fallback');
        userId = loginData.username;
      }

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

      // Estrategia alternativa: intentar obtener userId del endpoint de perfiles
      try {
        // Primero intentar con /api/profiles/me
        let profileResponse = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/profiles/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${userToken}`,
            'Content-Type': 'application/json',
          },
        });

        let profileData = null;
        let realUserId = null;

        if (profileResponse.ok) {
          profileData = await profileResponse.json();
          console.log('DEBUG: Profile response from /me:', profileData);
          realUserId = profileData.userId;
        } else {
          console.log('DEBUG: /api/profiles/me failed, trying /api/profiles');
          
          // Si /me falla, intentar con /api/profiles y filtrar por email
          profileResponse = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/profiles`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${userToken}`,
              'Content-Type': 'application/json',
            },
          });

          if (profileResponse.ok) {
            const profiles = await profileResponse.json();
            console.log('DEBUG: All profiles:', profiles);
            
            // Buscar el perfil que coincida con el email del usuario
            const userProfile = profiles.find((profile: any) => 
              profile.email === loginData.username || profile.email === userEmail
            );
            
            if (userProfile) {
              profileData = userProfile;
              realUserId = userProfile.userId;
              console.log('DEBUG: Found user profile:', userProfile);
            }
          }
        }

        if (realUserId) {
          console.log('DEBUG: Real userId from profile:', realUserId);
          
          // Actualizar el usuario en Redux con el userId real
          const updatedUserData = {
            ...userData,
            id: realUserId,
          };
          
          dispatch(
            setCredentials({
              user: updatedUserData,
              token: userToken,
            })
          );
          
          // Verificar si es primera vez con el userId real
          const isFirstTime = checkIfFirstTime(realUserId);
          console.log('DEBUG: isFirstTime =', isFirstTime, 'for userId:', realUserId);

          if (isFirstTime) {
            setShowWelcomeScreens(true);
          } else {
            navigate("/home");
          }
        } else {
          // Fallback si no se puede obtener el perfil
          console.warn('No se pudo obtener el perfil, usando userId temporal');
          const isFirstTime = checkIfFirstTime(userId);
          console.log('DEBUG: isFirstTime =', isFirstTime, 'for userId:', userId);

          if (isFirstTime) {
            setShowWelcomeScreens(true);
          } else {
            navigate("/home");
          }
        }
      } catch (profileError) {
        console.error('Error obteniendo perfil:', profileError);
        // Fallback si hay error al obtener el perfil
        const isFirstTime = checkIfFirstTime(userId);
        console.log('DEBUG: isFirstTime =', isFirstTime, 'for userId:', userId);

        if (isFirstTime) {
          setShowWelcomeScreens(true);
        } else {
          navigate("/home");
        }
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