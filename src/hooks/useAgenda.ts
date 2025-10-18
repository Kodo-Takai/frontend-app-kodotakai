import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { type RootState } from '../redux/store';
import { 
  addAgendaItem, 
  updateAgendaItem, 
  removeAgendaItem, 
  moveAgendaItem,
  setSelectedDate,
  setAgendaItems,
  type AgendaItem 
} from '../redux/slice/agendaSlice';
import { 
  useGetAgendaItemsQuery,
  useCreateAgendaItemMutation,
  useUpdateAgendaItemMutation,
  useDeleteAgendaItemMutation,
} from '../redux/api/agendaApi';
import { isSameDay } from 'date-fns';

export const useAgenda = () => {
  const dispatch = useDispatch();
  const agenda = useSelector((state: RootState) => state.agenda);
  
  // Obtener userId del estado de autenticación
  const userId = useSelector((state: RootState) => {
    const auth = (state as any).auth;
    return auth?.user?.id || null;
  });

  // RTK Query hooks - usar endpoint que funciona y filtrar por userId
  const { data: allAgendaItems = [], isLoading: isLoadingFromApi, isError } = useGetAgendaItemsQuery(
    undefined,
    { skip: !userId } // Solo ejecutar si tenemos userId
  );
  
  // Filtrar elementos por userId
  const apiAgendaItems = allAgendaItems.filter((item: any) => item.userId === userId);
  
  const [createAgendaItemApi] = useCreateAgendaItemMutation();
  const [updateAgendaItemApi] = useUpdateAgendaItemMutation();
  const [deleteAgendaItemApi] = useDeleteAgendaItemMutation();

  // Función para obtener datos completos de destinos
  const getDestinationData = useCallback(async (destinationId: string) => {
    try {
      // Hacer petición directa al endpoint del destino
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/destinations/${destinationId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const destinationData = await response.json();
        return destinationData;
      } else {
        console.warn(`No se pudo obtener el destino con ID: ${destinationId}`);
        return null;
      }
    } catch (error) {
      console.error('Error obteniendo datos del destino:', error);
      return null;
    }
  }, []);

  // Sincronizar datos de API con Redux cuando se carga
  useEffect(() => {
    if (apiAgendaItems && apiAgendaItems.length > 0) {
      // Verificar si los items ya están sincronizados para evitar bucles infinitos
      const currentItems = agenda.items;
      if (currentItems.length === apiAgendaItems.length && 
          currentItems.every((item, index) => item.id === apiAgendaItems[index]?.id)) {
        return; // Ya están sincronizados, no hacer nada
      }

      // Función para procesar los items con datos de destino
      const processAgendaItems = async () => {
        const convertedItems: AgendaItem[] = await Promise.all(
          apiAgendaItems.map(async (item: any) => {
            // Obtener datos completos del destino
            const destinationData = await getDestinationData(item.destinationId);
            
            return {
              id: item.id,
              destinationId: item.destinationId,
              destinationName: destinationData?.name || item.destinationName || 'Sin nombre',
              location: destinationData?.location || item.location || 'Ubicación no disponible',
              scheduledDate: item.scheduledAt, // API usa scheduledAt, Redux usa scheduledDate
              scheduledTime: new Date(item.scheduledAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
              status: item.status?.toLowerCase() || 'pending',
              category: destinationData?.category || item.category || 'restaurant',
              image: destinationData?.image || item.image || 'https://picsum.photos/400/300?random=agenda',
              description: destinationData?.description || item.description || '',
              placeData: {
                ...item.placeData,
                // Agregar datos del destino si están disponibles
                ...(destinationData && {
                  name: destinationData.name,
                  location: destinationData.location,
                  description: destinationData.description,
                  category: destinationData.category,
                  precio: destinationData.precio,
                  latitude: destinationData.latitude,
                  longitude: destinationData.longitude,
                })
              },
            };
          })
        );
        
        dispatch(setAgendaItems(convertedItems));
      };

      processAgendaItems();
    }
  }, [apiAgendaItems, dispatch, agenda.items, getDestinationData]);

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

  // Función para limpiar placeData y hacerlo serializable
  const cleanPlaceData = useCallback((placeData: any) => {
    if (!placeData) return {};
    
    return {
      name: placeData.name,
      place_id: placeData.place_id,
      formatted_address: placeData.formatted_address,
      vicinity: placeData.vicinity,
      rating: placeData.rating,
      photo_url: placeData.photo_url,
      editorial_summary: placeData.editorial_summary,
      formatted_phone_number: placeData.formatted_phone_number,
      // Solo guardar URLs de fotos, no las funciones getUrl
      photos: placeData.photos ? placeData.photos.map((photo: any) => ({
        photo_reference: photo.photo_reference,
        height: photo.height,
        width: photo.width,
        // No incluir getUrl() que es una función
      })) : [],
    };
  }, []);

  // Agregar nuevo item a la agenda (guarda en API y Redux)
  const addItem = useCallback(async (item: Omit<AgendaItem, 'id'>) => {
    if (!userId) {
      console.error('No user ID available');
      return;
    }

    try {
      // Limpiar placeData antes de guardar en Redux
      const cleanItem = {
        ...item,
        placeData: cleanPlaceData(item.placeData),
      };

      // Guardar en Redux localmente primero (para UI rápida)
      dispatch(addAgendaItem(cleanItem));

      // Guardar en API
      const agendaData = {
        userId,
        destinationId: item.destinationId,
        scheduledAt: item.scheduledDate,
        status: 'PENDING' as 'PENDING' | 'COMPLETED' | 'CANCELLED',
      };
      
      console.log('DEBUG: Sending agenda data to API:', agendaData);
      const result = await createAgendaItemApi(agendaData).unwrap();
      console.log('DEBUG: Agenda item created successfully:', result);
    } catch (error) {
      console.error('Error creating agenda item:', error);
      console.error('Error details:', error);
      // Aquí podrías mostrar un toast o alerta
    }
  }, [dispatch, userId, createAgendaItemApi, cleanPlaceData]);

  // Actualizar item existente (guarda en API y Redux)
  const updateItem = useCallback(async (id: string, updates: Partial<AgendaItem>) => {
    try {
      // Actualizar en Redux localmente primero
      dispatch(updateAgendaItem({ id, updates }));

      // Map status to API enum and default to 'PENDING'
      const statusToSend: 'PENDING' | 'COMPLETED' | 'CANCELLED' = (() => {
        const s = updates.status ? String(updates.status).toLowerCase() : '';
        if (s === 'pending') return 'PENDING';
        if (s === 'completed') return 'COMPLETED';
        if (s === 'cancelled' || s === 'canceled') return 'CANCELLED';
        return 'PENDING';
      })();

      // Actualizar en API
      await updateAgendaItemApi({
        id,
        body: {
          status: statusToSend,
          scheduledAt: updates.scheduledDate,
        },
      }).unwrap();
    } catch (error) {
      console.error('Error updating agenda item:', error);
    }
  }, [dispatch, updateAgendaItemApi]);

  // Eliminar item (elimina de API y Redux)
  const removeItem = useCallback(async (id: string) => {
    try {
      // Eliminar de Redux localmente primero
      dispatch(removeAgendaItem(id));

      // Eliminar de API
      await deleteAgendaItemApi(id).unwrap();
    } catch (error) {
      console.error('Error deleting agenda item:', error);
    }
  }, [dispatch, deleteAgendaItemApi]);

  // Mover item a otra fecha/hora
  const moveItem = useCallback(async (id: string, newDate: Date, newTime?: string) => {
    try {
      // Actualizar en Redux - pasar fecha como string ISO
      dispatch(moveAgendaItem({ id, newDate: newDate.toISOString(), newTime }));

      // Actualizar en API
      await updateAgendaItemApi({
        id,
        body: {
          scheduledAt: newDate.toISOString(),
        },
      }).unwrap();
    } catch (error) {
      console.error('Error moving agenda item:', error);
    }
  }, [dispatch, updateAgendaItemApi]);

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
    selectedDate: new Date(agenda.selectedDate),
    isLoading: agenda.isLoading || isLoadingFromApi,
    error: agenda.error || (isError ? 'Error cargando agenda' : null),
    
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
    getDestinationData,
  };
};