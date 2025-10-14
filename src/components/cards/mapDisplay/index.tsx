// src/components/cards/mapDisplay/index.tsx
import React, { useState, memo, useMemo } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, DirectionsRenderer } from '@react-google-maps/api';
import { FaStar } from 'react-icons/fa';
import type { Place } from '../../../hooks/places/usePlacesSimple';

interface MapDisplayProps {
  markers: Place[];
  center?: { lat: number; lng: number };
  zoom?: number;
  userLocation: { lat: number; lng: number } | null;
  onMarkerClick: (place: Place) => void;
  destination: Place | null;
  directions: google.maps.DirectionsResult | undefined;
}

const containerStyle = { width: '100%', height: '100%' };
const mapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
};

const libraries: ('places' | 'geocoding')[] = ['places', 'geocoding'];

const MapDisplayComponent = ({ markers, center, zoom, userLocation, onMarkerClick, destination, directions }: MapDisplayProps) => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [activeMarker, setActiveMarker] = useState<Place | null>(null);

  // --- SOLUCIÓN DE LÍNEA DINÁMICA CON NUEVO DISEÑO ---
  const polylineOptions = useMemo(() => {
    // Si hay un destino, la ruta es visible con estilo de puntos.
    if (destination) {
      return {
        strokeOpacity: 0, // La línea sólida principal es invisible
        icons: [
          {
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE, // Usamos círculos como símbolo
              fillColor: 'red',      // Tu color verde para el relleno
              fillOpacity: 1,           // Totalmente opacos
              scale: 4,                 // Tamaño de cada punto
              strokeWeight: 0,          // Sin borde para un look más limpio
            },
            offset: '0',      // Empezar a dibujar desde el inicio de la línea
            repeat: '15px',   // Repetir un punto cada 15 píxeles
          },
        ],
      };
    }
    // Si no hay destino, la línea es completamente invisible.
    return {
      strokeOpacity: 0,
    };
  }, [destination]);


  const handleMarkerClick = (marker: Place) => {
    setActiveMarker(marker);
    onMarkerClick(marker);
  };

  if (loadError) return <div>Error cargando el mapa: {loadError.message}</div>;
  if (!isLoaded) return <div className="flex h-full w-full items-center justify-center bg-gray-300"><p>Cargando mapa...</p></div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={zoom}
      options={mapOptions}
    >
      {/* Marcador para la ubicación del usuario */}
      {userLocation && (
        <Marker 
          position={userLocation}
          icon={{
            path: window.google.maps.SymbolPath.CIRCLE, scale: 8,
            fillColor: "#4285F4", fillOpacity: 1,
            strokeWeight: 2, strokeColor: "white",
          }}
          title="Tu Ubicación"
        />
      )}

      {/* Marcadores de lugares */}
      {!destination && markers.map((marker) => (
        <Marker
          key={marker.id}
          position={marker.location}
          onClick={() => handleMarkerClick(marker)}
          animation={window.google.maps.Animation.DROP}
          title={marker.name}
        />
      ))}
      
      {/* Marcador del destino */}
      {destination && (
         <Marker
          key={destination.id}
          position={destination.location}
          icon={{ url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png' }}
          title={`Destino: ${destination.name}`}
        />
      )}

      {/* InfoWindow para detalles */}
      {activeMarker && !destination && (
        <InfoWindow position={activeMarker.location} onCloseClick={() => setActiveMarker(null)}>
          <div className="max-w-xs flex flex-col gap-2 p-1">
            {activeMarker.photo_url && <img src={activeMarker.photo_url} alt={activeMarker.name} className="w-full h-24 object-cover rounded-md" />}
            <h3 className="font-bold text-md">{activeMarker.name}</h3>
            {activeMarker.rating && <div className="flex items-center gap-1 text-sm"><FaStar className="text-yellow-500" /><span>{activeMarker.rating}</span></div>}
          </div>
        </InfoWindow>
      )}

      {/* Renderizador de ruta */}
      <DirectionsRenderer 
        directions={directions}
        options={{
          suppressMarkers: true,
          polylineOptions: polylineOptions, // <-- Usa la variable dinámica con el nuevo diseño
        }}
      />
    </GoogleMap>
  );
};

export const MapDisplay = memo(MapDisplayComponent);