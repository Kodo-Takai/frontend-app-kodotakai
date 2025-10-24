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

      // Guardar todas las recomendaciones para uso futuro
      const allRecIds = Array.from(new Set(recs.map((r) => r.destinationId)));
      setAllRecommendations(allRecIds);

      // Mensajes progresivos mientras hacemos fetch de detalles
      setCurrentMessage('Analizando recomendaciones de IA...');

      // Seleccionar hasta 3 recomendaciones únicas
      const uniqueRecIds = allRecIds.slice(0, 3);
      
      // Guardar los IDs que estamos usando
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
      // Encontrar el índice del destino a reemplazar
      const destinationIndex = destinations.findIndex(d => d.id === destinationId);
      if (destinationIndex === -1) return;

      // Obtener el nombre actual del destino que se va a reemplazar
      const currentDestName = destinations[destinationIndex].name;

      // Buscar destinos no usados de las recomendaciones
      const unusedRecommendations = allRecommendations.filter(
        recId => !usedDestinationIds.has(recId)
      );

      let newDestination: UIDestination | null = null;

      // Si hay recomendaciones sin usar, usar una de ellas
      if (unusedRecommendations.length > 0) {
        const newDestId = unusedRecommendations[0];
        
        try {
          const dest = await fetchDestinationById(String(newDestId)).unwrap();
          newDestination = {
            id: destinationId,
            name: dest.name,
            type: dest.category,
            duration: 'Sugerido',
            description: dest.description,
            image: dest.photo || '',
            latitude: Number(dest.latitude),
            longitude: Number(dest.longitude),
          };

          // Actualizar los IDs usados
          setUsedDestinationIds(prev => new Set([...prev, newDestId]));
        } catch (error) {
          console.error('Error fetching recommended destination:', error);
        }
      }

      // Si no hay recomendaciones o falló, buscar en todos los destinos
      if (!newDestination) {
        const all = await fetchAllDestinations().unwrap();
        
        // Filtrar destinos que no estén actualmente en uso
        const currentNames = new Set(destinations.map(d => d.name));
        const availableDestinations = all.filter(d => 
          !currentNames.has(d.name) && 
          !usedDestinationIds.has(d.id)
        );

        if (availableDestinations.length > 0) {
          // Seleccionar un destino aleatorio
          const randomDest = availableDestinations[Math.floor(Math.random() * availableDestinations.length)];
          
          newDestination = {
            id: destinationId,
            name: randomDest.name,
            type: randomDest.category,
            duration: 'Sugerido',
            description: randomDest.description,
            image: '',
            latitude: NaN,
            longitude: NaN,
          };

          // Actualizar los IDs usados
          setUsedDestinationIds(prev => new Set([...prev, randomDest.id]));
        }
      }

      // Si encontramos un nuevo destino, actualizar el array
      if (newDestination) {
        setDestinations(prev => {
          const newDestinations = [...prev];
          newDestinations[destinationIndex] = newDestination!;
          return newDestinations;
        });

        console.log(`Destino regenerado: "${currentDestName}" → "${newDestination.name}"`);
      } else {
        console.log('No hay más destinos disponibles para regenerar');
      }
    } catch (error) {
      console.error('Error regenerating destination:', error);
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
