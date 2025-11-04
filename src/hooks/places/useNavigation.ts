// src/hooks/useNavigation.ts
import { useState, useEffect, useRef } from 'react';

interface Place {
  location: { lat: number; lng: number };
}
type LatLng = { lat: number; lng: number };

const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; const dLat = (lat2-lat1) * Math.PI/180; const dLon = (lon2-lon1) * Math.PI/180; const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) * Math.sin(dLon/2) * Math.sin(dLon/2); const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); return R * c;
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
    if (!destination || !userPosition) {
      if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
      setCurrentDistance(null);
      setInitialDistance(null);
      return;
    }
    
    const initialDist = getDistance(userPosition.lat, userPosition.lng, destination.location.lat, destination.location.lng);
    setInitialDistance(initialDist);
    setCurrentDistance(initialDist);

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const newPos = { lat: position.coords.latitude, lng: position.coords.longitude };
        onPositionUpdate(newPos);
        setCurrentDistance(getDistance(newPos.lat, newPos.lng, destination.location.lat, destination.location.lng));
      },
      (error) => console.error("Error de seguimiento:", error),
      { enableHighAccuracy: true }
    );

    return () => {
      if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, [destination, userPosition, onPositionUpdate]);

  return { currentDistance, initialDistance };
};