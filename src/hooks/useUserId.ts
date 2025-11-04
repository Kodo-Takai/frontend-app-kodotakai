import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { useGetProfilesQuery } from "../redux/api/profileApi";
import { decodeJwt } from "../utils/jwt";

/**
 * Hook personalizado para obtener el userId de manera consistente
 * Usa la lógica del Profile para obtener el userId correcto
 */
export const useUserId = (): string | null => {
  const token = useSelector((state: RootState) => (state as any).auth?.token);
  const { data: profiles } = useGetProfilesQuery();
  
  return useSelector((state: RootState) => {
    // 1. Intentar obtener desde el Profile usando el token
    if (token && profiles) {
      try {
        const payload = decodeJwt(token);
        const profileIdFromToken = payload?.profileId;
        
        if (profileIdFromToken) {
          const currentProfile = profiles.find((p) => p.id === profileIdFromToken);
          if (currentProfile?.userId) {
            return currentProfile.userId;
          }
        }
        
        // Si no encuentra por profileId, intentar por email
        if (payload?.email) {
          const currentProfile = profiles.find((p) => p.email === payload.email);
          if (currentProfile?.userId) {
            return currentProfile.userId;
          }
        }
      } catch (error) {
        console.warn('Error decodificando token JWT:', error);
      }
    }
    
    // 2. Fallback: intentar desde auth.user.id
    const auth = (state as any).auth;
    if (auth?.user?.id) {
      return auth.user.id;
    }
    
    // 3. Fallback: intentar desde el token directamente
    if (auth?.token) {
      try {
        const payload = JSON.parse(atob(auth.token.split('.')[1]));
        const userId = payload.userId || payload.sub || payload.id || null;
        if (userId) {
          return userId;
        }
      } catch (error) {
        console.warn('Error decodificando token:', error);
      }
    }
    
    // 4. Fallback: intentar desde localStorage
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user.id) {
          return user.id;
        }
      }
    } catch (error) {
      console.warn('Error leyendo usuario desde localStorage:', error);
    }
    
    return null;
  });
};

/**
 * Hook para obtener información completa del usuario autenticado
 */
export const useAuthUser = () => {
  const userId = useUserId();
  const token = useSelector((state: RootState) => (state as any).auth?.token);
  const isAuthenticated = useSelector((state: RootState) => (state as any).auth?.isAuthenticated);
  
  return {
    userId,
    token,
    isAuthenticated: isAuthenticated && !!userId,
  };
};
