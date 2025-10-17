// src/hooks/useNavigation.ts
import { useState, useEffect, useRef } from 'react';

interface Place {
  location: { lat: number; lng: number };
}
type LatLng = { lat: number; lng: number };

const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

export const useNavigation = (
  destination: Place | null,
  userPosition: LatLng | null,
  onPositionUpdate: (pos: LatLng) => void
) => {
  const [currentDistance, setCurrentDistance] = useState<number | null>(null);
  const [initialDistance, setInitialDistance] = useState<number | null>(null);
  const watchIdRef = useRef<number | null>(null);

  useEffect(() => {
    // Si no hay destino o ubicación del usuario, detenemos el seguimiento.
    if (!destination || !userPosition) {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      setCurrentDistance(null);
      setInitialDistance(null);
      return;
    }
    
    // Calculamos la distancia inicial una vez.
    const initialDist = getDistance(userPosition.lat, userPosition.lng, destination.location.lat, destination.location.lng);
    setInitialDistance(initialDist);
    setCurrentDistance(initialDist);

    // Iniciamos el seguimiento de la posición.
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const newPos = { lat: position.coords.latitude, lng: position.coords.longitude };
        onPositionUpdate(newPos); // Actualizamos la posición del usuario en el componente padre.
        
        // Recalculamos la distancia actual.
        const newDist = getDistance(newPos.lat, newPos.lng, destination.location.lat, destination.location.lng);
        setCurrentDistance(newDist);
      },
      (error) => console.error("Error de seguimiento de geolocalización:", error),
      { enableHighAccuracy: true }
    );

    // Función de limpieza para detener el seguimiento cuando el componente se desmonte o el destino cambie.
    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [destination, userPosition, onPositionUpdate]);

  return { currentDistance, initialDistance };
};