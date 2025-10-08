import { apiSlice } from "./apiSlice";

export interface Profile {
  id: string;
  name: string;
  lastName: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  gender?: string | null;
  photo?: string | null;
  birthDate?: string | null;
  status: boolean;
  createdAt: string;
  updatedAt?: string | null;
  userId: string;
}

export type ProfileUpdateRequest = Partial<
  Pick<
    Profile,
    "name" | "lastName" | "gender" | "birthDate" | "address" | "phone" | "photo"
  >
>;

export const profileApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProfiles: builder.query<Profile[], void>({
      query: () => ({ url: "/api/profiles", method: "GET" }),
      providesTags: ["User"],
    }),
    updateProfile: builder.mutation<Profile, { id: string; body: ProfileUpdateRequest }>({
      query: ({ id, body }) => ({
        url: `/api/profiles/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const { useGetProfilesQuery, useUpdateProfileMutation } = profileApi;
