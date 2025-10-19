import { apiSlice } from "./apiSlice";

export interface Recommendation {
    id: string;
    userId: string;
    destinationId: string;
    fecha: string;
    tipo: string | null;
    aceptada: boolean;
}

export interface DestinationDetails {
    id: string;
    name: string;
    description: string;
    location: string;
    latitude: number;
    longitude: number;
    precio: number;
    category: string;
    photo?: string | null;
}

export type RecommendationWithDestination = Recommendation & {
    destination: DestinationDetails | null;
};

export const recommendationsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getRecommendations: builder.query<Recommendation[], void>({
            query: () => ({ url: "/api/recomendaciones-ia", method: "GET" }),
            providesTags: ["Destinations"],
        }),
        getDestinationById: builder.query<DestinationDetails, string>({
            query: (id) => ({ url: `/api/destinations/${id}`, method: "GET" }),
            providesTags: ["Destinations"],
        }),
    }),
});

export const { useGetRecommendationsQuery, useLazyGetRecommendationsQuery, useGetDestinationByIdQuery, useLazyGetDestinationByIdQuery } = recommendationsApi;
