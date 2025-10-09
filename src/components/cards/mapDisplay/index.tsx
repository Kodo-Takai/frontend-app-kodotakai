import { useRef, useEffect, useState } from 'react';
import type { Place } from '../../../hooks/places';

interface MapDisplayProps {
  center: { lat: number; lng: number };
  zoom: number;
  markers: Place[];
  userLocation?: { lat: number; lng: number } | null;
  onMarkerClick: (place: Place) => void;
}

export function MapDisplay({ center, zoom, markers, userLocation, onMarkerClick }: MapDisplayProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const userMarkerRef = useRef<google.maps.Marker | null>(null);

  useEffect(() => {
    if (mapRef.current && !map) {
      const newMap = new window.google.maps.Map(mapRef.current, {
        center: center,
        zoom: zoom,
        disableDefaultUI: true,
        mapId: 'YOUR_CUSTOM_MAP_ID' 
      });
      setMap(newMap);
      infoWindowRef.current = new window.google.maps.InfoWindow();
    }
  }, [mapRef, map, center, zoom]);

  useEffect(() => {
    if (map) {
      map.panTo(center);
      map.setZoom(zoom);
    }
  }, [map, center, zoom]);

  useEffect(() => {
    if (map && infoWindowRef.current) {
      const infoWindow = infoWindowRef.current;
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];

      markers.forEach((place) => {
        if (!place.location) return;
        const marker = new window.google.maps.Marker({
          position: place.location,
          map: map,
          title: place.name,
          animation: window.google.maps.Animation.DROP,
        });
        
        marker.addListener('click', () => {
          // --- Contenido DETALLADO de la InfoWindow RESTAURADO ---
          const contentString = `
            <div style="font-family: sans-serif; width: 100%; max-width: 250px; color: #333; padding: 10px;">
              ${place.photo_url ? `<img src="${place.photo_url}" alt="${place.name}" style="width: 100%; max-height: 100px; object-fit: cover; border-radius: 8px; margin-bottom: 12px;" />` : ''}
              <h4 style="margin: 0 0 5px 0; font-weight: 600; font-size: 16px;">${place.name}</h4>
              ${place.rating ? `<p style="margin: 0; font-size: 14px; color: #f59e0b;">Calificación: ${place.rating} ★</p>`: ''}
              ${place.category ? `<p style="margin: 5px 0 0 0; font-size: 12px; color: #6b7280;">Categoría: ${place.category}</p>`: ''}
            </div>
          `;
          
          infoWindow.setContent(contentString);
          infoWindow.open(map, marker);
          
          onMarkerClick(place);
        });
        markersRef.current.push(marker);
      });
    }
  }, [map, markers, onMarkerClick]);

  useEffect(() => {
    if (map && userLocation) {
      if (!userMarkerRef.current) {
        userMarkerRef.current = new window.google.maps.Marker({ map, icon: { path: window.google.maps.SymbolPath.CIRCLE, scale: 8, fillColor: '#4285F4', fillOpacity: 1, strokeColor: 'white', strokeWeight: 2 }});
      }
      userMarkerRef.current.setPosition(userLocation);
    }
  }, [map, userLocation]);

  return <div ref={mapRef} style={{ width: '100%', height: '100%' }} />;
}