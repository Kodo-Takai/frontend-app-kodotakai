import { useState } from 'react';
import { useConfetti } from '../context/confettiContext';

export const useItineraryGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [itineraryGenerated, setItineraryGenerated] = useState(false);
  const [destinations, setDestinations] = useState<any[]>([]);
  const { triggerConfetti } = useConfetti();

  const generateItinerary = async () => {
    setIsGenerating(true);
    setItineraryGenerated(false);
    setDestinations([]);

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

    // Simular tiempo de generación (3-5 segundos)
    setTimeout(() => {
      clearInterval(messageInterval);
      setIsGenerating(false);
      setItineraryGenerated(true);
      
      // Activar confetti inmediatamente con explosión
      triggerConfetti();
      
      // Datos de ejemplo para las cards (esto será reemplazado por datos reales de la API)
      setDestinations([
        {
          id: 1,
          name: "Playa del Carmen",
          type: "Playa",
          duration: "2 días",
          description: "Hermosa playa con aguas cristalinas",
          image: "/playa-image.svg"
        },
        {
          id: 2,
          name: "Tulum",
          type: "Arqueológico",
          duration: "1 día",
          description: "Ruinas mayas junto al mar",
          image: "/tulum-image.svg"
        },
        {
          id: 3,
          name: "Cenote Dos Ojos",
          type: "Aventura",
          duration: "Medio día",
          description: "Cenote para bucear y explorar",
          image: "/cenote-image.svg"
        }
      ]);
    }, 5000);
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
