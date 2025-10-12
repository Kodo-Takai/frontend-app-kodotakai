import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { type RootState } from '../redux/store';
import { 
  addAgendaItem, 
  updateAgendaItem, 
  removeAgendaItem, 
  moveAgendaItem,
  setSelectedDate,
  type AgendaItem 
} from '../redux/slice/agendaSlice';
import { isSameDay } from 'date-fns';

export const useAgenda = () => {
  const dispatch = useDispatch();
  const agenda = useSelector((state: RootState) => state.agenda);

  // Obtener items del día seleccionado
  const getItemsForSelectedDate = useCallback(() => {
    return agenda.items.filter(item => 
      isSameDay(new Date(item.scheduledDate), new Date(agenda.selectedDate))
    );
  }, [agenda.items, agenda.selectedDate]);

  // Obtener items por categoría
  const getItemsByCategory = useCallback((category: string) => {
    return agenda.items.filter(item => item.category === category);
  }, [agenda.items]);

  // Agregar nuevo item a la agenda
  const addItem = useCallback((item: Omit<AgendaItem, 'id'>) => {
    dispatch(addAgendaItem(item));
  }, [dispatch]);

  // Actualizar item existente
  const updateItem = useCallback((id: string, updates: Partial<AgendaItem>) => {
    dispatch(updateAgendaItem({ id, updates }));
  }, [dispatch]);

  // Eliminar item
  const removeItem = useCallback((id: string) => {
    dispatch(removeAgendaItem(id));
  }, [dispatch]);

  // Mover item a otra fecha/hora
  const moveItem = useCallback((id: string, newDate: Date, newTime?: string) => {
    dispatch(moveAgendaItem({ id, newDate, newTime }));
  }, [dispatch]);

  // Cambiar fecha seleccionada
  const selectDate = useCallback((date: Date) => {
    dispatch(setSelectedDate(date.toISOString()));
  }, [dispatch]);

  // Verificar si hay items en una fecha específica
  const hasItemsOnDate = useCallback((date: Date) => {
    return agenda.items.some(item => 
      isSameDay(new Date(item.scheduledDate), date)
    );
  }, [agenda.items]);

  return {
    // Estado
    items: agenda.items,
    selectedDate: new Date(agenda.selectedDate), // Convertir de vuelta a Date para el componente
    isLoading: agenda.isLoading,
    error: agenda.error,
    
    // Items filtrados
    itemsForSelectedDate: getItemsForSelectedDate(),
    itemsByCategory: getItemsByCategory,
    
    // Acciones
    addItem,
    updateItem,
    removeItem,
    moveItem,
    selectDate,
    hasItemsOnDate,
  };
};
