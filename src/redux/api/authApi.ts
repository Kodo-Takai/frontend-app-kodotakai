import { apiSlice } from "./apiSlice";

interface LoginRequest {
  username: string;
  password: string;
}

interface AuthResponse {
  data: any;
  user: {
    id: string;
    username: string;
    email: string;
    password: string;
    status: boolean | string;
    createdAt?: string;
    updatedAt?: string;
  };
  token: string;
  message: string;
}

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => {
        console.log("🔧 Login request:", credentials);
        return {
          url: "/api/auth/login",
          method: "POST",
          body: credentials,
        };
      },
    }),
  }),
});

export const { useLoginMutation } = authApi;
