import { apiSlice } from "./apiSlice";

export interface Destination {
    id: string;
    name: string;
    description: string;
    location: string;
    category: string;
}

export const destinationsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getDestinations: builder.query<Destination[], void>({
            query: () => ({ url: "/api/destinations", method: "GET" }),
            providesTags: ["User"],
        }),
    }),
});

export const { useGetDestinationsQuery, useLazyGetDestinationsQuery } = destinationsApi;
