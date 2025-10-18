import { apiSlice } from "./apiSlice";

// Backend DTO Contract
export interface UserPreferenceCreateRequestDto {
    userId: string;
    destinationId: string;
    unliked: string; // Will carry JSON string with user selections
    precio: number;
    category: string; // e.g., playa, restaurante, hotel, parque, discoteca, estudiar
}

export interface UserPreferenceCreateResponseDto {
    id: string;
    userId: string;
    destinationId: string;
    unliked: string;
    precio: number;
    category: string;
    status_code: number;
}

export const userPreferencesApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createUserPreference: builder.mutation<
            UserPreferenceCreateResponseDto,
            UserPreferenceCreateRequestDto
        >({
            query: (body) => ({
                url: "/api/user-preferences",
                method: "POST",
                body,
            }),
            invalidatesTags: ["User"],
        }),

        getUserPreferencesByUser: builder.query<UserPreferenceCreateResponseDto[], string>({
            // userId
            query: (userId) => ({
                url: `/api/user-preferences/preferences/${userId}`,
                method: "GET",
            }),
            providesTags: ["User"],
        }),
    }),
});

export const { useCreateUserPreferenceMutation, useGetUserPreferencesByUserQuery } = userPreferencesApi;
