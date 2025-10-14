// src/hooks/useGeolocation.ts
import { useState, useEffect } from 'react';

type LatLng = { lat: number; lng: number };

export const useGeolocation = () => {
  const [position, setPosition] = useState<LatLng | null>(null);
  const [address, setAddress] = useState<string>('Buscando ubicación...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocalización no soportada');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const currentPos = { lat: latitude, lng: longitude };
        setPosition(currentPos);

        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: currentPos }, (results, status) => {
          if (status === 'OK' && results?.[0]) {
            setAddress(results[0].formatted_address);
          } else {
            setAddress('Dirección no encontrada');
          }
        });
      },
      () => {
        setError('No se pudo acceder a la ubicación');
        setAddress('Acceso a ubicación denegado');
      },
      { enableHighAccuracy: true }
    );
  }, []);

  return { position, address, error, setPosition };
};