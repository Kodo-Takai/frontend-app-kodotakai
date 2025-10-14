import { useState, useEffect } from "react";

// --- Tipos y Constantes ---
export interface Place {
  id: string;
  name: string;
  location: { lat: number; lng: number };
  rating?: number;
  photo_url: string;
  place_id: string;
}

type LatLng = { lat: number; lng: number };

const FALLBACK_LOCATION: LatLng = { lat: -12.0464, lng: -77.0428 }; // Lima, Perú
const API_KEY = import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY;

// Configuración de búsqueda
const SEARCH_RADII = [2000, 5000, 10000]; // Radios en metros
const MIN_RATING = 2.0;
const MIN_REVIEWS = 3;

// --- Utilidades ---

// Loader de la API de Google Maps para evitar cargas múltiples
let mapsApiLoaded: Promise<void> | null = null;
export function loadGoogleMapsApi(): Promise<void> {
  if (mapsApiLoaded) return mapsApiLoaded;
  mapsApiLoaded = new Promise((resolve, reject) => {
    // Si la API ya está en window, resuelve inmediatamente
    if (window.google?.maps?.places) return resolve();

    // Si el script ya existe en el DOM, espera a que cargue
    const existingScript = document.getElementById("google-maps-script");
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve());
      existingScript.addEventListener("error", (err) => reject(err));
      return;
    }

    const script = document.createElement("script");
    script.id = "google-maps-script";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places&v=weekly`;
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
      () => resolve(FALLBACK_LOCATION),
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  });
};

// Función helper para búsqueda múltiple
const performMultipleSearch = async (
  service: google.maps.places.PlacesService,
  userLocation: LatLng,
  type: string
): Promise<google.maps.places.PlaceResult[]> => {
  const searchPromises = SEARCH_RADII.map(
    (radius) =>
      new Promise<google.maps.places.PlaceResult[]>((resolve) => {
        service.nearbySearch(
          { location: userLocation, radius, type },
          (results, status) => {
            if (status === "OK" && results) resolve(results);
            else resolve([]);
          }
        );
      })
  );

  const allResults = await Promise.all(searchPromises);
  const combinedResults = allResults.flat();

  // Eliminar duplicados por place_id
  return combinedResults.reduce((acc, place) => {
    if (!acc.find((p) => p.place_id === place.place_id)) {
      acc.push(place);
    }
    return acc;
  }, [] as google.maps.places.PlaceResult[]);
};

// Mapeo de categorías del UI a tipos de Google Places
const categoryMapping: Record<string, string> = {
  all: "establishment",
  lodging: "lodging",
  shopping_mall: "shopping_mall",
  restaurant: "restaurant",
  point_of_interest: "point_of_interest",
  stadium: "stadium",
  beach: "natural_feature",
  beaches: "natural_feature",
  restaurants: "restaurant",
  hotel: "lodging",
  hotels: "lodging",
  destination: "tourist_attraction",
  destinations: "tourist_attraction",
  tourist_attraction: "tourist_attraction",
  attraction: "tourist_attraction",
};

// --- El Hook Principal Simplificado ---
export const usePlacesSimple = (
  activeCategories: string,
  searchQuery?: string
) => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [mapCenter, setMapCenter] = useState<LatLng>(FALLBACK_LOCATION);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("Inicializando...");

  useEffect(() => {
    const fetchAndFilter = async () => {
      setLoading(true);

      try {
        await loadGoogleMapsApi();
        // Se crea un PlacesService usando un div temporal que no se añade al DOM
        const service = new window.google.maps.places.PlacesService(
          document.createElement("div")
        );

        // Función de ayuda para convertir el resultado de Google a nuestro tipo `Place`
        const formatPlaceResult = (
          p: google.maps.places.PlaceResult
        ): Place | null => {
          // Filtros de calidad: solo lugares con rating y fotos
          if (!p.place_id || !p.name || !p.geometry?.location) return null;
          if (!p.rating || p.rating < MIN_RATING) return null;
          if (!p.photos || p.photos.length === 0) return null;
          if (!p.user_ratings_total || p.user_ratings_total < MIN_REVIEWS)
            return null;

          return {
            id: p.place_id,
            name: p.name,
            location: p.geometry.location.toJSON(),
            rating: p.rating,
            photo_url: p.photos[0]?.getUrl() || "",
            place_id: p.place_id || "",
          };
        };

        // --- Lógica de Búsqueda ---

        // 1. Búsqueda por texto (tiene la máxima prioridad)
        if (searchQuery) {
          setStatus(`Buscando "${searchQuery}"...`);
          
          // OBTENER LA UBICACIÓN DEL USUARIO PRIMERO
          const userLocation = await getUserLocation();
          setMapCenter(userLocation);

          // Función para calcular distancia entre dos puntos
          const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
            const R = 6371; // Radio de la Tierra en km
            const dLat = (lat2 - lat1) * (Math.PI / 180);
            const dLon = (lng2 - lng1) * (Math.PI / 180);
            const a =
              Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * (Math.PI / 180)) *
                Math.cos(lat2 * (Math.PI / 180)) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return R * c;
          };

          // CONFIGURACIÓN CORREGIDA: Priorizar por ubicación
          service.textSearch(
            {
              query: searchQuery,
              // Usar location y radius para priorizar resultados cercanos
              location: new google.maps.LatLng(userLocation.lat, userLocation.lng),
              radius: 50000, // 50km de radio para priorizar cercanos
            },
            (
              results: google.maps.places.PlaceResult[] | null,
              searchStatus: google.maps.places.PlacesServiceStatus
            ) => {
              if (searchStatus === "OK" && results && results.length > 0) {
                // Ordenar resultados por distancia al usuario
                const sortedByDistance = results
                  .filter((r) => r.geometry?.location)
                  .map((r) => ({
                    result: r,
                    distance: calculateDistance(
                      userLocation.lat,
                      userLocation.lng,
                      r.geometry!.location!.lat(),
                      r.geometry!.location!.lng()
                    ),
                  }))
                  .sort((a, b) => a.distance - b.distance);

                // Tomar el más cercano
                if (sortedByDistance.length > 0) {
                  const closestResult = sortedByDistance[0].result;
                  const place = formatPlaceResult(closestResult);
                  
                  if (place) {
                    setPlaces([place]);
                    setMapCenter(place.location);
                    setStatus(`Mostrando: ${place.name} (${sortedByDistance[0].distance.toFixed(1)} km)`);
                  } else {
                    // Si el más cercano no cumple filtros de calidad, buscar el siguiente
                    const nextValidPlace = sortedByDistance.slice(1).find(item => {
                      const p = formatPlaceResult(item.result);
                      return p !== null;
                    });
                    
                    if (nextValidPlace) {
                      const validPlace = formatPlaceResult(nextValidPlace.result);
                      if (validPlace) {
                        setPlaces([validPlace]);
                        setMapCenter(validPlace.location);
                        setStatus(`Mostrando: ${validPlace.name}`);
                      }
                    } else {
                      setPlaces([]);
                      setStatus("No se encontraron resultados de calidad.");
                    }
                  }
                } else {
                  setPlaces([]);
                  setStatus("No se encontraron resultados.");
                }
              } else {
                setPlaces([]);
                setStatus("No se encontraron resultados.");
              }
              setLoading(false);
            }
          );

          // 2. Filtro por categorías (si no hay búsqueda por texto)
        } else if (activeCategories && activeCategories !== "all") {
          setStatus(`Buscando ${activeCategories}...`);
          const userLocation = await getUserLocation();
          setMapCenter(userLocation);

          const googleType =
            categoryMapping[activeCategories] || "establishment";

          try {
            const uniquePlaces = await performMultipleSearch(
              service,
              userLocation,
              googleType
            );
            const formattedPlaces = uniquePlaces
              .map((p) => formatPlaceResult(p))
              .filter((p): p is Place => p !== null);

            setPlaces(formattedPlaces);
            setStatus(
              `${formattedPlaces.length} lugares de calidad encontrados.`
            );
          } catch (error) {
            setPlaces([]);
            setStatus("Error en la búsqueda.");
          }
          setLoading(false);

          // 3. Vista por defecto (si no hay texto ni categorías)
        } else {
          setStatus("Buscando lugares cercanos...");
          const userLocation = await getUserLocation();
          setMapCenter(userLocation);

          try {
            const uniquePlaces = await performMultipleSearch(
              service,
              userLocation,
              "establishment"
            );
            const defaultPlaces = uniquePlaces
              .map((p) => formatPlaceResult(p))
              .filter((p): p is Place => p !== null);

            setPlaces(defaultPlaces);
            setStatus(`${defaultPlaces.length} lugares de calidad cercanos.`);
          } catch (error) {
            setPlaces([]);
            setStatus("Error en la búsqueda.");
          }
          setLoading(false);
        }
      } catch (error) {
        setStatus("Ocurrió un error.");
        setLoading(false);
      }
    };

    fetchAndFilter();
  }, [activeCategories, searchQuery]);

  return { places, mapCenter, loading, status };
};
export default usePlacesSimple;