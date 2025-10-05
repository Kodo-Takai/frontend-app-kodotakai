import { useRef, useEffect, useState } from 'react';
import type { Place } from '../../../hooks/places';

interface MapDisplayProps {
  center: { lat: number; lng: number };
  zoom: number;
  markers: Place[];
}

export function MapDisplay({ center, zoom, markers }: MapDisplayProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null); // Para reutilizar la misma ventana


  // ... (Efecto 1 y 2 se mantienen igual) ...
  useEffect(() => {
    if (mapRef.current && !map) {
      const newMap = new window.google.maps.Map(mapRef.current, {
        center: center,
        zoom: zoom,
        disableDefaultUI: true,
        mapId: 'YOUR_CUSTOM_MAP_ID' 
      });
      setMap(newMap);
      // AÑADIDO: Creamos una única InfoWindow que reutilizaremos
      infoWindowRef.current = new window.google.maps.InfoWindow();
    }
  }, [mapRef, map, center, zoom]);

  useEffect(() => {
    if (map) {
      map.panTo(center);
      map.setZoom(zoom);
    }
  }, [map, center, zoom]);


  // Efecto 3: Se ejecuta cada vez que la lista de marcadores cambia
  useEffect(() => {
    if (map && infoWindowRef.current) {
      const infoWindow = infoWindowRef.current;
      // 1. Limpia los marcadores anteriores
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];

      // 2. Crea los nuevos marcadores
      markers.forEach((place) => {
        // Validar que el lugar tenga ubicación
        if (!place.location) {
          return;
        }
        
        const marker = new window.google.maps.Marker({
          position: place.location,
          map: map,
          title: place.name,
          animation: window.google.maps.Animation.DROP,
        });
        
        // --- CORRECCIÓN PRINCIPAL AQUÍ ---
        // Añadimos la etiqueta <img> al contenido del InfoWindow
        marker.addListener('click', () => {
          const contentString = `
            <div style="font-family: sans-serif; max-width: 220px; color: #333;">
              ${
                // Si el lugar tiene foto, la mostramos
                place.photo_url
                ? `<img 
                    src="${place.photo_url}" 
                    alt="${place.name}" 
                    style="width: 100%; height: 60px; object-fit: cover; border-radius: 8px; margin-bottom: 12px;" 
                  />`
                : '' // Si no, no mostramos nada
              }
              <h4 style="margin: 0 0 5px 0; font-weight: 600; font-size: 16px;">${place.name}</h4>
              ${
                place.rating 
                ? `<p style="margin: 0; font-size: 14px;">Calificación: ${place.rating} ★</p>` 
                : ''
              }
            </div>
          `;
          
          infoWindow.setContent(contentString);
          infoWindow.open(map, marker);
        });

        // Guarda la referencia del nuevo marcador
        markersRef.current.push(marker);
      });
    }
  }, [map, markers]);

  return <div ref={mapRef} style={{ width: '100%', height: '80%' }} />;
}