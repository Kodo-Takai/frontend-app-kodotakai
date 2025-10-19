import { apiSlice } from './apiSlice';

interface AgendaItem {
  id: string;
  userId: string;
  destinationId: string;
  scheduledAt: string;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
}

interface CreateAgendaRequest {
  userId: string;
  destinationId: string;
  scheduledAt: string;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
}

export const agendaApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAgendaItems: builder.query<AgendaItem[], void>({
      query: () => ({ url: '/api/agenda', method: 'GET' }),
      providesTags: ['Agenda'],
    }),

    // FALTA: Obtener agenda por usuario
    getAgendaByUserId: builder.query<AgendaItem[], string>({
      query: (userId) => ({ url: `/api/agenda/user/${userId}`, method: 'GET' }),
      providesTags: ['Agenda'],
    }),

    // FALTA: Obtener item específico
    getAgendaItemById: builder.query<AgendaItem, string>({
      query: (id) => ({ url: `/api/agenda/${id}`, method: 'GET' }),
      providesTags: ['Agenda'],
    }),

    // FALTA: Crear nueva agenda
    createAgendaItem: builder.mutation<AgendaItem, CreateAgendaRequest>({
      query: (body) => ({
        url: '/api/agenda',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Agenda'],
    }),

    updateAgendaItem: builder.mutation<AgendaItem, { id: string; body: Partial<CreateAgendaRequest> }>({
      query: ({ id, body }) => ({
        url: `/api/agenda/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Agenda'],
    }),

    // OPCIONAL: Eliminar agenda
    deleteAgendaItem: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/api/agenda/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Agenda'],
    }),
  }),
});

export const {
  useGetAgendaItemsQuery,
  useGetAgendaByUserIdQuery,
  useGetAgendaItemByIdQuery,
  useCreateAgendaItemMutation,
  useUpdateAgendaItemMutation,
  useDeleteAgendaItemMutation,
} = agendaApi;