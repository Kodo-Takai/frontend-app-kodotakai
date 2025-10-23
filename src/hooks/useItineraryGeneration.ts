import { useState } from 'react';
import { useConfetti } from '../context/confettiContext';
import { useLazyGetPersonalizedRecommendationsQuery, useLazyGetDestinationByIdQuery } from '../redux/api/recommendationsApi';
import { useLazyGetDestinationsQuery } from '../redux/api/destinationsApi';
import { useUserId } from './useUserId';

export const useItineraryGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [itineraryGenerated, setItineraryGenerated] = useState(false);
  type UIDestination = {
    id: number;
    name: string;
    type: string;
    duration: string;
    description: string;
    image: string; // resolved later
    latitude: number;
    longitude: number;
  };

  const [destinations, setDestinations] = useState<UIDestination[]>([]);
  const [allRecommendations, setAllRecommendations] = useState<string[]>([]); // Guardar todos los IDs de recomendaciones
  const [usedDestinationIds, setUsedDestinationIds] = useState<Set<string>>(new Set()); // IDs ya usados
  const { triggerConfetti } = useConfetti();

  // Obtener userId del hook personalizado
  const userId = useUserId();

  // RTK Query lazy hooks
  const [fetchPersonalizedRecommendations, { error: recsError }] = useLazyGetPersonalizedRecommendationsQuery();
  const [fetchDestinationById] = useLazyGetDestinationByIdQuery();
  const [fetchAllDestinations] = useLazyGetDestinationsQuery();

  const generateItinerary = async () => {
    setIsGenerating(true);
    setItineraryGenerated(false);
    setDestinations([]);

    // Verificar que tengamos userId
    if (!userId) {
      setCurrentMessage('Error: No se pudo obtener el ID de usuario');
      setIsGenerating(false);
      return;
    }

    // Mensajes de carga que cambian cada segundo
    const loadingMessages = [
      "Leyendo tus gustos...",
      "Anotando tus preferencias...",
      "Analizando destinos...",
      "Optimizando rutas...",
      "Generando recomendaciones...",
      "Finalizando itinerario..."
    ];

    let messageIndex = 0;
    const messageInterval = setInterval(() => {
      setCurrentMessage(loadingMessages[messageIndex]);
      messageIndex++;
      if (messageIndex >= loadingMessages.length) {
        clearInterval(messageInterval);
      }
    }, 1000);

    try {
      // Paso 1: Traer recomendaciones personalizadas de IA usando el userId
      const recs = await fetchPersonalizedRecommendations(userId).unwrap();

      // Guardar todas las recomendaciones para usar después en "regenerar"
      const allRecIds = Array.from(new Set(recs.map((r) => r.destinationId)));
      setAllRecommendations(allRecIds);

      // Mensajes progresivos mientras hacemos fetch de detalles
      setCurrentMessage('Analizando recomendaciones de IA...');

      // Seleccionar hasta 3 recomendaciones únicas
      const uniqueRecIds = allRecIds.slice(0, 3);

      // Marcar los IDs usados
      setUsedDestinationIds(new Set(uniqueRecIds));

      // Paso 2: Traer detalles de recomendados
      const recommendedDetails = await Promise.all(
        uniqueRecIds.map(async (destId, i: number) => {
          try {
            const dest = await fetchDestinationById(String(destId)).unwrap();
            return {
              id: i + 1,
              name: dest.name,
              type: dest.category,
              duration: 'Sugerido',
              description: dest.description,
              image: dest.photo || '',
              latitude: Number(dest.latitude),
              longitude: Number(dest.longitude),
              location: dest.location,
            };
          } catch {
            return null;
          }
        })
      );

      let valid = recommendedDetails.filter(Boolean) as (UIDestination & { location?: string })[];

      // Completar hasta 3 si faltan con destinos generales
      if (valid.length < 3) {
        setCurrentMessage('Buscando más destinos para completar tu itinerario...');
        const all = await fetchAllDestinations().unwrap();
        const usedIds = new Set(uniqueRecIds);
        const fillers = all
          .filter(d => !usedIds.has(d.id))
          .slice(0, 3 - valid.length)
          .map((dest, i) => ({
            id: valid.length + i + 1,
            name: dest.name,
            type: dest.category,
            duration: 'Sugerido',
            description: dest.description,
            image: '',
            latitude: NaN, // no tenemos coordenadas seguras en este endpoint simple
            longitude: NaN,
            location: dest.location,
          }));
        valid = [...valid, ...fillers];
      }

      // Paso 3: Asignar imágenes de mapa en segundo plano usando el primer elemento para iniciar
      setDestinations(
        valid.map((v) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { location, ...rest } = v;
          return rest;
        })
      );

      clearInterval(messageInterval);
      setIsGenerating(false);
      setItineraryGenerated(true);
      triggerConfetti();
    } catch (error) {
      clearInterval(messageInterval);
      setIsGenerating(false);
      setItineraryGenerated(false);
      setCurrentMessage('Ocurrió un error al generar el itinerario');
      console.error('Error fetching recommendations/destinations', error, recsError);
    }
  };

  const resetToLobby = () => {
    setItineraryGenerated(false);
    setDestinations([]);
    setIsGenerating(false);
    setCurrentMessage('');
    setAllRecommendations([]);
    setUsedDestinationIds(new Set());
  };

  const regenerateDestination = async (destinationId: number) => {
    try {
      // Encontrar el destino a reemplazar
      const destinationIndex = destinations.findIndex(d => d.id === destinationId);
      if (destinationIndex === -1) return;

      // Buscar un destino no usado de las recomendaciones
      const availableRecommendations = allRecommendations.filter(
        recId => !usedDestinationIds.has(recId)
      );

      let newDestId: string | null = null;

      // Si hay recomendaciones disponibles, usar una
      if (availableRecommendations.length > 0) {
        newDestId = availableRecommendations[0];
      } else {
        // Si no hay más recomendaciones, buscar de la lista general
        const allDests = await fetchAllDestinations().unwrap();
        const availableFromAll = allDests.filter(d => !usedDestinationIds.has(d.id));

        if (availableFromAll.length > 0) {
          newDestId = availableFromAll[0].id;
        } else {
          console.warn('No hay más destinos disponibles para regenerar');
          return;
        }
      }

      // Obtener detalles del nuevo destino
      const newDest = await fetchDestinationById(newDestId).unwrap();

      // Crear el nuevo destino con el mismo ID (posición)
      const newDestination: UIDestination = {
        id: destinationId, // Mantener el mismo ID para la posición
        name: newDest.name,
        type: newDest.category,
        duration: 'Sugerido',
        description: newDest.description,
        image: newDest.photo || '',
        latitude: Number(newDest.latitude),
        longitude: Number(newDest.longitude),
      };

      // Actualizar la lista de destinos
      const updatedDestinations = [...destinations];
      updatedDestinations[destinationIndex] = newDestination;
      setDestinations(updatedDestinations);

      // Marcar el nuevo destino como usado
      setUsedDestinationIds(prev => new Set([...prev, newDestId!]));

    } catch (error) {
      console.error('Error regenerando destino:', error);
    }
  };

  return {
    isGenerating,
    currentMessage,
    itineraryGenerated,
    destinations,
    generateItinerary,
    resetToLobby,
    regenerateDestination
  };
};
