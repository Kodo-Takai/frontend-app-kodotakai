import { apiSlice } from "./apiSlice";
interface User {
  id: string | number;
  username?: string;
  email?: string;
  password?: string;
  status?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
interface LoginRequest {
  username: string;
  password: string;
}

interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  name: string;
  lastName: string;
}

// Estructura real que devuelve tu backend para LOGIN
interface LoginResponse {
  status_code: number;
  message: string;
  data: {
    message: string;
    access_token: string;
    refresh_token: string;
  };
}

// Estructura real que devuelve tu backend para REGISTER
interface RegisterResponse {
  message: string; // Solo mensaje de éxito
}

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => {
        console.log("🔧 Login request:", credentials);
        return {
          url: "/api/auth/login",
          method: "POST",
          body: credentials,
        };
      },
      invalidatesTags: ["Auth"],
    }),

    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (userData) => ({
        url: "/api/auth/register",
        method: "POST",
        body: userData,
      }),
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation } = authApi;
