import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';

// Configuración base de la API
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_REACT_APP_BACKEND_URL,
    prepareHeaders: (headers, { getState }) => {
      // Obtener token desde Redux store
      const state = getState() as RootState & { auth?: { token?: string } }
      const token = state.auth?.token

      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }

      headers.set('content-type', 'application/json')
      return headers
    },
  }),
  tagTypes: ['User', 'Auth', 'Agenda', 'Destinations'], // Tags para cache invalidation
  endpoints: () => ({}), // Los endpoints los agregaremos después
})

export default apiSlice