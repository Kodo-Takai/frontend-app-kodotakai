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
import { useUserId } from './useUserId';

export const useAgenda = () => {
  const dispatch = useDispatch();
  const agenda = useSelector((state: RootState) => state.agenda);
  
  // Usar el hook personalizado para obtener userId
  const userId = useUserId();

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
        
        // Si es un array, buscar el destino específico por ID
        if (Array.isArray(destinationData)) {
          const specificDestination = destinationData.find(dest => dest.id === destinationId);
          return specificDestination || null;
        }
        
        return destinationData;
      } else {
        console.warn(`No se pudo obtener el destino con ID: ${destinationId}, status: ${response.status}`);
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
            
            // Intentar obtener datos del localStorage como fallback
            let localDestinationData = null;
            try {
              const storageKey = `destination_${item.destinationId}`;
              const storedData = localStorage.getItem(storageKey);
              if (storedData) {
                localDestinationData = JSON.parse(storedData);
              }
            } catch (error) {
              console.warn('Error leyendo datos del destino desde localStorage:', error);
            }
            
            // Usar datos de la API o localStorage como fallback
            const finalDestinationData = destinationData || localDestinationData;
            
            const processedItem = {
              id: item.id,
              destinationId: item.destinationId,
              destinationName: finalDestinationData?.name || item.destinationName || 'Sin nombre',
              location: finalDestinationData?.location || item.location || 'Ubicación no disponible',
              scheduledDate: item.scheduledAt, // API usa scheduledAt, Redux usa scheduledDate
              scheduledTime: new Date(item.scheduledAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
              status: item.status?.toLowerCase() || 'pending',
              category: finalDestinationData?.category || item.category || 'restaurant',
              image: finalDestinationData?.image || item.image || 'https://picsum.photos/400/300?random=agenda',
              description: finalDestinationData?.description || item.description || '',
              placeData: {
                ...item.placeData,
                // Agregar datos del destino si están disponibles
                ...(finalDestinationData && {
                  name: finalDestinationData.name,
                  location: finalDestinationData.location,
                  description: finalDestinationData.description,
                  category: finalDestinationData.category,
                  precio: finalDestinationData.precio,
                  latitude: finalDestinationData.latitude,
                  longitude: finalDestinationData.longitude,
                  rating: finalDestinationData.rating,
                  user_ratings_total: finalDestinationData.user_ratings_total,
                })
              },
            };
            
            return processedItem;
          })
        );
        
        // Ordenar por fecha de creación (más reciente primero)
        const sortedItems = convertedItems.sort((a, b) => {
          const dateA = new Date(a.scheduledDate);
          const dateB = new Date(b.scheduledDate);
          return dateB.getTime() - dateA.getTime(); // Más reciente primero
        });
        
        dispatch(setAgendaItems(sortedItems));
      };

      processAgendaItems();
    }
  }, [apiAgendaItems, dispatch, agenda.items, getDestinationData]);

  // Función para comparar fechas ignorando la hora
  const isSameDate = useCallback((date1: Date, date2: Date) => {
    const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
    const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
    return d1.getTime() === d2.getTime();
  }, []);

  // Obtener items del día seleccionado
  const getItemsForSelectedDate = useCallback(() => {
    const filteredItems = agenda.items.filter(item => {
      const itemDate = new Date(item.scheduledDate);
      const selectedDate = new Date(agenda.selectedDate);
      
      return isSameDate(itemDate, selectedDate);
    });
    
    return filteredItems;
  }, [agenda.items, agenda.selectedDate, isSameDate]);

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
      console.log('DEBUG: Moviendo item:', { id, newDate, newTime });
      
      // Combinar fecha y hora si se proporciona nueva hora
      let scheduledAt = newDate.toISOString();
      if (newTime) {
        const [hours, minutes] = newTime.split(':');
        const combinedDateTime = new Date(newDate);
        combinedDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        scheduledAt = combinedDateTime.toISOString();
        console.log('DEBUG: Fecha y hora combinadas:', scheduledAt);
      }

      // Actualizar en Redux - pasar fecha como string ISO
      dispatch(moveAgendaItem({ id, newDate: scheduledAt, newTime }));

      // Actualizar en API
      await updateAgendaItemApi({
        id,
        body: {
          scheduledAt: scheduledAt,
        },
      }).unwrap();
      
      console.log('DEBUG: Item movido exitosamente');
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

  // Función para eliminar un item de agenda
  const deleteAgendaItem = useCallback(async (id: string) => {
    try {
      await deleteAgendaItemApi(id).unwrap();
      dispatch(removeAgendaItem(id));
    } catch (error) {
      console.error('Error eliminando item de agenda:', error);
      throw error;
    }
  }, [deleteAgendaItemApi, dispatch]);

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
    deleteAgendaItem,
  };
};