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
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const userLocationMarkerRef = useRef<google.maps.Marker | null>(null);


  // Inicializa el mapa de Google Maps
  useEffect(() => {
    if (mapRef.current && !map && window.google?.maps) {
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

  // Actualiza el centro, zoom y marcadores del mapa
  useEffect(() => {
    if (map) {
      const currentCenter = map.getCenter();
      if (!currentCenter || 
          Math.abs(currentCenter.lat() - center.lat) > 0.001 || 
          Math.abs(currentCenter.lng() - center.lng) > 0.001) {
        map.panTo(center);
      }
      
      map.setZoom(zoom);
      
      if (userLocationMarkerRef.current) {
        userLocationMarkerRef.current.setMap(null);
      }
      
      const userLocationIcon = {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 12,
        fillColor: '#4285F4',
        fillOpacity: 1,
        strokeColor: '#FFFFFF',
        strokeWeight: 3,
      };
      
      userLocationMarkerRef.current = new window.google.maps.Marker({
        position: center,
        map: map,
        icon: userLocationIcon,
        title: 'Tu ubicación actual',
        zIndex: 1000,
      });
      
      if (markers.length > 0) {
        const bounds = new window.google.maps.LatLngBounds();
        bounds.extend(center);
        markers.forEach(marker => {
          if (marker.location) {
            bounds.extend(marker.location);
          }
        });
        
        if (markers.length === 1) {
          map.setZoom(16);
        } else if (markers.length <= 5) {
          map.setZoom(15);
        } else {
          map.setZoom(13);
        }
      } else {
        map.setZoom(15);
      }
    }
  }, [map, center, zoom, markers]);


  // Actualiza los marcadores de lugares en el mapa
  useEffect(() => {
    if (map && infoWindowRef.current && window.google?.maps) {
      const infoWindow = infoWindowRef.current;
      
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];

      markers.forEach((place) => {
        if (!place.location) {
          return;
        }
        
        const marker = new window.google.maps.Marker({
          position: place.location,
          map: map,
          title: place.name,
          animation: window.google.maps.Animation.DROP,
        });
        
        marker.addListener('click', () => {
          const contentString = `
            <div style="font-family: sans-serif; max-width: 220px; color: #333;">
              ${
                place.photo_url
                ? `<img 
                    src="${place.photo_url}" 
                    alt="${place.name}" 
                    style="width: 100%; height: 60px; object-fit: cover; border-radius: 8px; margin-bottom: 12px;" 
                  />`
                : ''
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

        markersRef.current.push(marker);
      });
    }
  }, [map, markers]);

  return <div ref={mapRef} style={{ width: '100%', height: '80%' }} />;
}