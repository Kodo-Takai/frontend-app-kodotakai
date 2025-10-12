import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { EnrichedPlace } from '../../hooks/places/types';

export interface AgendaItem {
  id: string;
  destinationId: string;
  destinationName: string;
  location: string;
  scheduledDate: string; // Cambiado a string ISO
  scheduledTime: string;
  status: 'pending' | 'completed' | 'cancelled';
  category: 'restaurant' | 'hotel' | 'beach' | 'park' | 'disco' | 'study';
  image: string;
  description?: string;
  notes?: string;
  // Datos completos del lugar
  placeData: EnrichedPlace;
}

export interface AgendaState {
  items: AgendaItem[];
  selectedDate: string; // Cambiado a string ISO
  isLoading: boolean;
  error: string | null;
}

export type AgendaSection = 'agendados' | 'itinerarios';

const initialState: AgendaState = {
  items: [],
  selectedDate: new Date().toISOString(),
  isLoading: false,
  error: null,
};

const agendaSlice = createSlice({
  name: 'agenda',
  initialState,
  reducers: {
    setSelectedDate: (state, action: PayloadAction<string>) => {
      state.selectedDate = action.payload;
    },
    
    addAgendaItem: (state, action: PayloadAction<Omit<AgendaItem, 'id'>>) => {
      const newItem: AgendaItem = {
        ...action.payload,
        id: `agenda_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      };
      state.items.push(newItem);
    },
    
    updateAgendaItem: (state, action: PayloadAction<{ id: string; updates: Partial<AgendaItem> }>) => {
      const { id, updates } = action.payload;
      const index = state.items.findIndex(item => item.id === id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...updates };
      }
    },
    
    removeAgendaItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    
    moveAgendaItem: (state, action: PayloadAction<{ id: string; newDate: Date; newTime?: string }>) => {
      const { id, newDate, newTime } = action.payload;
      const item = state.items.find(item => item.id === id);
      if (item) {
        item.scheduledDate = newDate.toISOString();
        if (newTime) {
          item.scheduledTime = newTime;
        }
      }
    },
    
    setAgendaItems: (state, action: PayloadAction<AgendaItem[]>) => {
      state.items = action.payload;
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setSelectedDate,
  addAgendaItem,
  updateAgendaItem,
  removeAgendaItem,
  moveAgendaItem,
  setAgendaItems,
  setLoading,
  setError,
  clearError,
} = agendaSlice.actions;

export default agendaSlice.reducer;
