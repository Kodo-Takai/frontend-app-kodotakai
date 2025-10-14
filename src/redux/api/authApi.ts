import { apiSlice } from "./apiSlice";

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
  confirmPassword?: string;
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

    forgotPassword: builder.mutation<{ message: string }, { email: string }>({
      query: (data) => ({
        url: "/api/auth/forgot-password",
        method: "POST",
        body: data,
      }),
    }),

    resetPassword: builder.mutation<{ message: string }, { email: string; code: string; password: string; confirmPassword: string }>({
      query: (data) => ({
        url: "/api/auth/reset-password",
        method: "PATCH",
        body: data,
      }),
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useForgotPasswordMutation, useResetPasswordMutation } = authApi;
