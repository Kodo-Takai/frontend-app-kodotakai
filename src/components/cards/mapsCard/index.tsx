// src/components/cards/MapsCard.tsx
import { useState, useCallback, useRef, useEffect } from "react";
import { usePlaces } from "../../../hooks/places";

type Props = {
  className?: string;
  height?: string
};

type LatLng = { lat: number; lng: number };

const FALLBACK = { lat: 10.3000, lng: -75.5000 }; // Parque Nacional Natural de los Corales del Rosario y San Bernardo, Cartagena
export default function MapsCard({ className = "w-1/2", height= "h-44" }: Props) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [loadingLocation, setLoadingLocation] = useState<boolean>(false);
  
  const miniMapRef = useRef<HTMLDivElement>(null);
  const expandedMapRef = useRef<HTMLDivElement>(null);
  const miniMapInstance = useRef<google.maps.Map | null>(null);
  const expandedMapInstance = useRef<google.maps.Map | null>(null);
  
  const { places, loading: placesLoading } = usePlaces({
    category: "destinations",
    searchQuery: "",
    enableEnrichment: false,
    maxResults: 10
  });

  // Obtener ubicación del usuario
  const getUserLocation = useCallback((): Promise<LatLng> => {
    return new Promise((resolve) => {
      if (!("geolocation" in navigator)) {
        return resolve(FALLBACK);
      }

      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          const location = { lat: coords.latitude, lng: coords.longitude };
          setUserLocation(location);
          resolve(location);
        },
        (error) => {
          console.warn('Error obteniendo ubicación:', error.message);
          resolve(FALLBACK);
        },
        { 
          enableHighAccuracy: true, 
          timeout: 10000, 
          maximumAge: 300000 
        }
      );
    });
  }, []);

  // Inicializar mapa mini
  useEffect(() => {
    if (!miniMapRef.current || !window.google?.maps || placesLoading) return;

    const center = places[0]?.location || FALLBACK;

    try {
      const map = new window.google.maps.Map(miniMapRef.current, {
        center,
        zoom: 16,
        disableDefaultUI: true,
        clickableIcons: false,
        gestureHandling: "none",
        styles: [
          // Ocultar elementos innecesarios
          { featureType: "poi", stylers: [{ visibility: "off" }] },
          { featureType: "transit", stylers: [{ visibility: "off" }] },
          { featureType: "road", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
          
          // Personalizar con tu paleta de colores
          { featureType: "water", elementType: "geometry", stylers: [{ color: "#FDE7C2" }] }, // Beige para agua
          { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#FFFFF0" }] }, // Bone para tierra
          { featureType: "road", elementType: "geometry", stylers: [{ color: "#4A7A8A" }] }, // Blue light para calles
          { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#295B72" }] }, // Blue para texto de calles
          { featureType: "administrative", elementType: "labels.text.fill", stylers: [{ color: "#295B72" }] }, // Blue para etiquetas
          { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#295B72" }] }, // Blue para POI
          { featureType: "poi", elementType: "labels.text.stroke", stylers: [{ color: "#FFFFF0" }] }, // Bone para contorno
          { featureType: "poi", elementType: "geometry", stylers: [{ color: "#D1DC5A" }] }, // Green para POI
          { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#D1DC5A" }] }, // Green para parques
          { featureType: "poi.business", elementType: "geometry", stylers: [{ color: "#FDE7C2" }] }, // Beige para negocios
        ],
      });

      miniMapInstance.current = map;
      
      // Marcador principal personalizado
      new window.google.maps.Marker({ 
        position: center, 
        map,
        icon: {
          url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#9baa3b"/>
              <circle cx="12" cy="9" r="2.5" fill="#747e31"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(36, 36),
        }
      });

    } catch (error) {
      console.error('Error inicializando mapa mini:', error);
    }
  }, [places, placesLoading]);

  // Inicializar mapa expandido
  useEffect(() => {
    if (!isExpanded || !expandedMapRef.current || !window.google?.maps) return;

    const initExpandedMap = async (): Promise<void> => {
      setLoadingLocation(true);
      
      try {
        const location = await getUserLocation();
        
        if (!expandedMapRef.current) return;
        
        const map = new window.google.maps.Map(expandedMapRef.current, {
          center: location,
          zoom: 15,
          disableDefaultUI: false,
          clickableIcons: true,
          gestureHandling: "auto",
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
        });

        expandedMapInstance.current = map;

        // Marcador de ubicación del usuario personalizado
        new window.google.maps.Marker({
          position: location,
          map,
          title: "Tu ubicación",
          icon: {
            url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#D1DC5A"/>
                <circle cx="12" cy="9" r="2.5" fill="#9baa3b"/>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(32, 32),
          }
        });

        // Agregar lugares desde tu hook
        places.slice(0, 10).forEach((place) => {
          if (place.location) {
            const marker = new window.google.maps.Marker({
              position: place.location,
              map,
              title: place.name,
              icon: {
                url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#D1DC5A"/>
                    <circle cx="12" cy="9" r="2.5" fill="#9baa3b"/>
                  </svg>
                `),
                scaledSize: new window.google.maps.Size(28, 28),
              }
            });

            // InfoWindow al hacer clic
            

            marker.addListener('click', () => {
            });
          }
        });

      } catch (error) {
        console.error('Error inicializando mapa expandido:', error);
      } finally {
        setLoadingLocation(false);
      }
    };

    initExpandedMap();
  }, [isExpanded, places, getUserLocation]);

  // Manejar expansión del mapa
  const handleExpand = useCallback(() => {
    setIsExpanded(true);
  }, []);

  // Cerrar mapa expandido
  const handleClose = useCallback(() => {
    setIsExpanded(false);
  }, []);

  // Cerrar con Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    if (isExpanded) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isExpanded, handleClose]);

  // Estado de carga
  if (placesLoading || !window.google?.maps) {
    return (
      <div className={`${className} min-w-[160px]`}>
        <div className="rounded-2xl border border-gray-200 bg-[var(--color-blue-light)] shadow-sm overflow-hidden h-full flex items-center justify-center">
          <div className="text-center">
            <div className="w-6 h-6 border-2 border-[var(--color-bone)] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-xs font-medium text-[var(--color-bone)]">Cargando mapa...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Mapa mini */}
      <div 
        className={`relative ${className} min-w-[160px] cursor-pointer group z-10`} 
        aria-label="Mapa mini - Click para expandir"
        onClick={handleExpand}
      >
        <div className="rounded-3xl border-5 border-white shadow-sm overflow-hidden group-hover:shadow-md transition-shadow relative">
          <div ref={miniMapRef} className={`${height} w-full`}/>
          
          {/* Overlay de hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200 rounded-2xl flex items-center justify-center pointer-events-none z-20">
            <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg">
              <span className="text-sm font-medium text-gray-700">Click para expandir</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mapa expandido (Modal) */}
      {isExpanded && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative w-[90vw] h-[90vh] max-w-6xl max-h-4xl bg-white rounded-xl shadow-2xl overflow-hidden">
            {/* Header del modal */}
            <div className="absolute top-0 left-0 right-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <h3 className="font-semibold text-gray-800">
                  {loadingLocation ? 'Obteniendo ubicación...' : 'Explorar mapa'}
                </h3>
              </div>
              
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Cerrar mapa"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Contenedor del mapa */}
            <div className="pt-16 h-full">
              {loadingLocation && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
                  <div className="text-center">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-gray-600">Cargando tu ubicación...</p>
                  </div>
                </div>
              )}
              
              <div ref={expandedMapRef} className="w-full h-full" />
            </div>

            {/* Indicadores de ubicación */}
            <div className="absolute bottom-4 left-4 space-y-2">
              {userLocation && !loadingLocation && (
                <div className="bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg border border-gray-200">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700">Tu ubicación</span>
                  </div>
                </div>
              )}
              
              {places.length > 0 && (
                <div className="bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg border border-gray-200">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-[var(--color-blue)] rounded-full"></div>
                    <span className="text-gray-700">{places.length} lugares cercanos</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}