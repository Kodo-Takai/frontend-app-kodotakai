import { apiSlice } from "./apiSlice";

interface Destination {
  id: string;
  name: string;
  description: string;
  location: string;
  latitude: number;
  longitude: number;
  precio: number;
  category: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
  status_code: number;
}

interface CreateDestinationRequest {
  name: string;
  description: string;
  location: string;
  latitude: number;
  longitude: number;
  precio: number;
  category: string;
  status: boolean;
}

export const destinationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDestinations: builder.query<Destination[], void>({
      query: () => ({ url: '/api/destinations', method: 'GET' }),
      providesTags: ['Destinations'],
    }),

    getDestinationById: builder.query<Destination, string>({
      query: (id) => ({ url: `/api/destinations/${id}`, method: 'GET' }),
      providesTags: ['Destinations'],
    }),

    // FALTA: Crear nuevo destino
    createDestination: builder.mutation<Destination, CreateDestinationRequest>({
      query: (body) => ({
        url: '/api/destinations',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Destinations'],
    }),

    // OPCIONAL: Actualizar destino
    updateDestination: builder.mutation<Destination, { id: string; body: Partial<CreateDestinationRequest> }>({
      query: ({ id, body }) => ({
        url: `/api/destinations/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Destinations'],
    }),

    // OPCIONAL: Eliminar destino
    deleteDestination: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/api/destinations/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Destinations'],
    }),
  }),
});

export const {
  useGetDestinationsQuery,
  useGetDestinationByIdQuery,
  useCreateDestinationMutation,
  useUpdateDestinationMutation,
  useDeleteDestinationMutation,
} = destinationApi;

export default destinationApi;