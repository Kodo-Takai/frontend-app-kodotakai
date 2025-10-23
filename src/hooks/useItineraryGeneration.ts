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
  const { triggerConfetti } = useConfetti();
  // Podemos guardar recomendaciones si se requieren más adelante (omitir por ahora)

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

      // Mensajes progresivos mientras hacemos fetch de detalles
      setCurrentMessage('Analizando recomendaciones de IA...');

      // Seleccionar hasta 3 recomendaciones únicas
      const uniqueRecIds = Array.from(new Set(recs.map((r) => r.destinationId))).slice(0, 3);

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
  };

  const regenerateDestination = (destinationId: number) => {
    // Aquí se implementará la lógica para regenerar un destino específico
    console.log('Regenerando destino:', destinationId);
    // TODO: Implementar llamada a API para regenerar destino específico
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
