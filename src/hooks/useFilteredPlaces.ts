import { useState, useEffect } from 'react';

// --- Tipos y Constantes ---

export interface Place {
  id: string;
  name: string;
  location: { lat: number; lng: number };
  rating?: number;
  photoUrl?: string;
}

type LatLng = { lat: number; lng: number };

const FALLBACK_LOCATION: LatLng = { lat: -12.0464, lng: -77.0428 }; // Lima, Perú
const API_KEY = import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY;

// --- Utilidades ---

// Loader de la API de Google Maps para evitar cargas múltiples
let mapsApiLoaded: Promise<void> | null = null;
export function loadGoogleMapsApi(): Promise<void> {
  if (mapsApiLoaded) return mapsApiLoaded;
  mapsApiLoaded = new Promise((resolve, reject) => {
    // Si la API ya está en window, resuelve inmediatamente
    if (window.google?.maps?.places) return resolve();
    
    // Si el script ya existe en el DOM, espera a que cargue
    const existingScript = document.getElementById('google-maps-script');
    if (existingScript) {
        existingScript.addEventListener('load', () => resolve());
        existingScript.addEventListener('error', (err) => reject(err));
        return;
    }

    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = (err) => reject(err);
    document.head.appendChild(script);
  });
  return mapsApiLoaded;
}

// Obtiene la geolocalización del usuario con un fallback
const getUserLocation = (): Promise<LatLng> => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) return resolve(FALLBACK_LOCATION);
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => resolve(FALLBACK_LOCATION)
    );
  });
};

// --- El Hook Principal ---

export const useFilteredPlaces = (searchQuery: string, activeCategories: string[]) => {
  const [placesToShow, setPlacesToShow] = useState<Place[]>([]);
  const [mapCenter, setMapCenter] = useState<LatLng>(FALLBACK_LOCATION);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('Inicializando...');

  // Crea una clave a partir de las categorías para usar en el array de dependencias de useEffect
  const categoriesKey = activeCategories.join(',');

  useEffect(() => {
    const fetchAndFilter = async () => {
      setLoading(true);

      try {
        await loadGoogleMapsApi();
        // Se crea un PlacesService usando un div temporal que no se añade al DOM
        const service = new window.google.maps.places.PlacesService(document.createElement('div'));

        // Función de ayuda para convertir el resultado de Google a nuestro tipo `Place`
        const formatPlaceResult = (p: google.maps.places.PlaceResult): Place | null => {
          if (!p.place_id || !p.name || !p.geometry?.location) return null;
          return {
            id: p.place_id,
            name: p.name,
            location: p.geometry.location.toJSON(),
            rating: p.rating,
            photoUrl: p.photos?.[0]?.getUrl(),
          };
        };

        // --- Lógica de Búsqueda ---

        // 1. Búsqueda por texto (tiene la máxima prioridad)
        if (searchQuery) {
          setStatus(`Buscando "${searchQuery}"...`);
          service.textSearch(
            { query: searchQuery },
            (
              results: google.maps.places.PlaceResult[] | null,
              searchStatus: google.maps.places.PlacesServiceStatus
            ) => {
              if (searchStatus === 'OK' && results?.[0]) {
                const place = formatPlaceResult(results[0]);
                if (place) {
                  setPlacesToShow([place]);
                  setMapCenter(place.location);
                  setStatus(`Mostrando: ${place.name}`);
                }
              } else {
                setPlacesToShow([]);
                setStatus('No se encontraron resultados.');
              }
              setLoading(false);
            }
          );
        
        // 2. Filtro por categorías (si no hay búsqueda por texto)
        } else if (activeCategories.length > 0) {
          setStatus(`Buscando en ${activeCategories.length} categorías...`);
          const userLocation = await getUserLocation();
          setMapCenter(userLocation);

          // Crea una promesa de búsqueda para cada categoría seleccionada
          const searchPromises = activeCategories.map(category =>
            new Promise<Place[]>((resolve) => {
              service.nearbySearch(
                { location: userLocation, radius: 5000, type: category },
                (
                  results: google.maps.places.PlaceResult[] | null,
                  searchStatus: google.maps.places.PlacesServiceStatus
                ) => {
                  if (searchStatus === 'OK' && results) {
                    // Formatea y filtra resultados nulos
                    resolve(results.map(p => formatPlaceResult(p)).filter((p): p is Place => p !== null));
                  } else {
                    resolve([]); // Resuelve un array vacío si no hay resultados o hay un error
                  }
                }
              );
            })
          );
          
          const resultsByCategory = await Promise.all(searchPromises);
          const allPlaces = resultsByCategory.flat();
          // Elimina duplicados usando un Map basado en el ID del lugar
          const uniquePlaces = Array.from(new Map(allPlaces.map(p => [p.id, p])).values());
          
          setPlacesToShow(uniquePlaces);
          setStatus(`${uniquePlaces.length} lugares encontrados.`);
          setLoading(false);

        // 3. Vista por defecto (si no hay texto ni categorías)
        } else {
          setStatus('Buscando lugares cercanos...');
          const userLocation = await getUserLocation();
          setMapCenter(userLocation);

          service.nearbySearch(
            { location: userLocation, radius: 5000, type: 'tourist_attraction' },
            (
              results: google.maps.places.PlaceResult[] | null,
              searchStatus: google.maps.places.PlacesServiceStatus
            ) => {
              if (searchStatus === 'OK' && results) {
                const defaultPlaces = results.map(p => formatPlaceResult(p)).filter((p): p is Place => p !== null);
                setPlacesToShow(defaultPlaces);
                setStatus(`${defaultPlaces.length} atracciones cercanas.`);
              } else {
                setPlacesToShow([]);
                setStatus('No se encontraron atracciones cercanas.');
              }
              setLoading(false);
            }
          );
        }
      } catch (error) {
        setStatus('Ocurrió un error.');
        console.error("Error en useFilteredPlaces:", error);
        setLoading(false);
      }
    };

    fetchAndFilter();

  }, [searchQuery, categoriesKey]); // El efecto se ejecuta si cambia el texto o las categorías

  return { placesToShow, mapCenter, loading, status };
};