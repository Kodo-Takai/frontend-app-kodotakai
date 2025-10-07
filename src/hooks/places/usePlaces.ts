import { useState, useEffect } from "react";
import type { Place, EnrichedPlace, PlaceCategory } from "./types";
import { EnrichmentConfigFactory, CACHE_CONFIG } from "./enrichment/enrichmentConfigs";

// --- Tipos y Constantes ---
// Place interface movido a types.ts para evitar duplicación

type LatLng = { lat: number; lng: number };

const FALLBACK_LOCATION: LatLng = { lat: -12.0464, lng: -77.0428 };
const API_KEY = import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY;

const SEARCH_RADII = [2000, 10000, 15000]; // Radios en metros
const MIN_RATING = 2.0;
const MIN_REVIEWS = 3;

// --- Funciones de Enrichment Simplificadas ---

const PRICE_LEVELS = {
  0: { description: "Gratis", color: "text-green-600" },
  1: { description: "Económico", color: "text-green-500" },
  2: { description: "Moderado", color: "text-yellow-500" },
  3: { description: "Caro", color: "text-orange-500" },
  4: { description: "Lujo", color: "text-red-500" }
};

const getPriceInfo = (priceLevel: number | undefined, place?: Place) => {
  const level = priceLevel ?? (place?.rating && place.rating >= 4 ? 3 : 2);
  const info = PRICE_LEVELS[level as keyof typeof PRICE_LEVELS] || PRICE_LEVELS[2];
  
  return {
    level,
    description: info.description,
    symbol: "",
    color: info.color,
    isInferred: !priceLevel
  };
};

// Cache simple para evitar llamadas repetidas
const enrichmentCache = new Map<string, EnrichedPlace>();

// Función simplificada para procesar datos enriquecidos
const processEnrichedData = (googleData: google.maps.places.PlaceResult, originalPlace: Place): EnrichedPlace => {
  return {
    ...originalPlace,
    formatted_address: googleData.formatted_address,
    website: googleData.website,
    formatted_phone_number: googleData.formatted_phone_number,
    international_phone_number: googleData.international_phone_number,
    photo_url: googleData.photos?.[0]?.getUrl() || originalPlace.photo_url,
    photos: googleData.photos || originalPlace.photos,
    editorial_summary: (googleData as any).editorial_summary?.overview ? {
      overview: (googleData as any).editorial_summary.overview
    } : undefined,
    reviews: googleData.reviews?.map(review => ({
      author_name: review.author_name || "",
      rating: review.rating || 0,
      text: review.text || "",
      time: review.time || 0,
      relative_time_description: review.relative_time_description || ""
    })) || [],
    opening_hours_detailed: googleData.opening_hours ? {
      periods: (googleData.opening_hours.periods || []).map(period => ({
        open: { day: period.open?.day || 0, time: period.open?.time || "0000" },
        close: period.close ? { day: period.close.day, time: period.close.time } : { day: 0, time: "0000" }
      })),
      weekday_text: googleData.opening_hours.weekday_text || []
    } : undefined,
    utc_offset_minutes: (googleData as any).utc_offset_minutes,
    is_open_now: googleData.opening_hours?.isOpen?.() ?? (googleData as any).open_now,
    price_info: getPriceInfo((googleData as any).price_level, originalPlace),
    business_status: googleData.business_status,
    vicinity: googleData.vicinity,
    place_id: googleData.place_id || originalPlace.place_id,
    rating: googleData.rating || originalPlace.rating,
    name: googleData.name || originalPlace.name,
    location: googleData.geometry?.location?.toJSON() || originalPlace.location
  };
};

// Función simplificada para enriquecer un lugar
const enrichPlace = async (place: Place, category: PlaceCategory = "hotels"): Promise<EnrichedPlace | null> => {
  try {
    // Verificar cache
    const cacheKey = `${place.place_id}_${category}`;
    if (CACHE_CONFIG.enabled && enrichmentCache.has(cacheKey)) {
      const cached = enrichmentCache.get(cacheKey);
      if (cached && Date.now() - (cached as any).cached_at < CACHE_CONFIG.ttl) {
        return cached;
      }
    }

    // Verificar API
    if (!window.google?.maps?.places?.PlacesService) {
      throw new Error("Google Maps API not loaded");
    }

    const service = new window.google.maps.places.PlacesService(document.createElement('div'));
    const config = EnrichmentConfigFactory.createConfig(category);

    return new Promise((resolve, reject) => {
      service.getDetails({
        placeId: place.place_id,
        fields: config.fields
      }, (result, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && result) {
          const enrichedPlace = processEnrichedData(result, place);
          if (CACHE_CONFIG.enabled) {
            (enrichedPlace as any).cached_at = Date.now();
            enrichmentCache.set(cacheKey, enrichedPlace);
          }
          resolve(enrichedPlace);
        } else {
          reject(new Error(`Places API error: ${status}`));
        }
      });
    });
  } catch (err) {
    console.error("Error enriching place:", err);
    return null;
  }
};

// Función simplificada para enriquecer múltiples lugares
const enrichPlaces = async (places: Place[], category: PlaceCategory = "hotels"): Promise<EnrichedPlace[]> => {
  if (!places.length) return [];
  
  const results = await Promise.allSettled(
    places.map(place => enrichPlace(place, category))
  );
  
  return results
    .filter((result): result is PromiseFulfilledResult<EnrichedPlace | null> => result.status === 'fulfilled')
    .map(result => result.value)
    .filter((place): place is EnrichedPlace => place !== null);
};

// Loader simplificado de Google Maps API
let mapsApiLoaded: Promise<void> | null = null;
export function loadGoogleMapsApi(): Promise<void> {
  if (mapsApiLoaded) return mapsApiLoaded;

  mapsApiLoaded = new Promise((resolve, reject) => {
    if (window.google?.maps?.places?.PlacesService) {
      return resolve();
    }

    const existingScript = document.getElementById("google-maps-script");
    if (existingScript) {
      const checkApi = () => {
        if (window.google?.maps?.places?.PlacesService) {
          resolve();
        } else {
          setTimeout(checkApi, 100);
        }
      };
      checkApi();
      return;
    }

    const script = document.createElement("script");
    script.id = "google-maps-script";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places&v=weekly`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      let attempts = 0;
      const checkApi = () => {
        if (window.google?.maps?.places?.PlacesService) {
          resolve();
        } else if (++attempts < 50) {
          setTimeout(checkApi, 100);
        } else {
          reject(new Error("Google Maps API failed to initialize"));
        }
      };
      checkApi();
    };

    script.onerror = () => reject(new Error("Failed to load Google Maps API"));
    document.head.appendChild(script);
  });

  return mapsApiLoaded;
}

// Cache de geolocalización
let locationCache: { location: LatLng; timestamp: number } | null = null;
const CACHE_DURATION = 30000;

const getUserLocation = (): Promise<LatLng> => {
  return new Promise((resolve) => {
    if (locationCache && (Date.now() - locationCache.timestamp) < CACHE_DURATION) {
      return resolve(locationCache.location);
    }

    if (!navigator.geolocation) {
      return resolve(FALLBACK_LOCATION);
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const location = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        locationCache = { location, timestamp: Date.now() };
        resolve(location);
      },
      () => resolve(FALLBACK_LOCATION),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 300000 }
    );
  });
};

// Búsqueda múltiple simplificada
const performMultipleSearch = async (
  service: google.maps.places.PlacesService,
  userLocation: LatLng,
  type: string
): Promise<google.maps.places.PlaceResult[]> => {
  const results = await Promise.all(
    SEARCH_RADII.map(radius => 
      new Promise<google.maps.places.PlaceResult[]>((resolve) => {
        service.nearbySearch({ location: userLocation, radius, type }, (results, status) => {
          resolve(status === "OK" && results ? results : []);
        });
      })
    )
  );

  // Eliminar duplicados
  const uniqueResults = new Map();
  results.flat().forEach(place => {
    if (place.place_id && !uniqueResults.has(place.place_id)) {
      uniqueResults.set(place.place_id, place);
    }
  });

  return Array.from(uniqueResults.values());
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

// --- El Hook Principal con Datos Detallados ---
export const usePlaces = (options: {
  category: PlaceCategory;
  searchQuery?: string;
  enableEnrichment?: boolean; // true por defecto, pero mantenido para compatibilidad
  maxResults?: number;
}) => {
  const { category, searchQuery, enableEnrichment = true, maxResults = 20 } = options;
  
  const [places, setPlaces] = useState<EnrichedPlace[]>([]);
  const [mapCenter, setMapCenter] = useState<LatLng>(FALLBACK_LOCATION);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("Inicializando...");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndFilter = async () => {
      console.log("🔍 usePlaces - Iniciando búsqueda:", { category, searchQuery, enableEnrichment, maxResults });
      
      setLoading(true);
      setError(null);
      setStatus("Cargando Google Maps API...");

      try {
        // Esperar a que Google Maps API esté completamente cargada
        await loadGoogleMapsApi();

        // Verificar que la API esté disponible
        if (!window.google?.maps?.places?.PlacesService) {
          throw new Error("Google Maps Places API not available");
        }

        console.log("🔍 usePlaces - Google Maps API cargada correctamente");
        setStatus("Inicializando búsqueda...");

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
          service.textSearch(
            { query: searchQuery },
            async (
              results: google.maps.places.PlaceResult[] | null,
              searchStatus: google.maps.places.PlacesServiceStatus
            ) => {
              if (searchStatus === "OK" && results?.[0]) {
                const place = formatPlaceResult(results[0]);
                if (place) {
                  // Enriquecer datos si está habilitado
                  if (enableEnrichment) {
                    try {
                      const enrichedPlaces = await enrichPlaces([place], category);
                      setPlaces(enrichedPlaces);
                    } catch (error) {
                      console.warn("Error enriching place:", error);
                      setPlaces([place as EnrichedPlace]);
                    }
                  } else {
                    setPlaces([place as EnrichedPlace]);
                  }
                  setMapCenter(place.location);
                  setStatus(`Mostrando: ${place.name}`);
                }
              } else {
                setPlaces([]);
                setStatus("No se encontraron resultados.");
              }
              setLoading(false);
            }
          );

          // 2. Filtro por categorías (si no hay búsqueda por texto)
        } else if (category && category !== "all") {
          setStatus(`Buscando ${category}...`);
          const userLocation = await getUserLocation();
          setMapCenter(userLocation);

          const googleType = categoryMapping[category] || "establishment";

          try {
            console.log("🔍 usePlaces - Realizando búsqueda múltiple:", { googleType, userLocation });
            
            const uniquePlaces = await performMultipleSearch(
              service,
              userLocation,
              googleType
            );
            
            console.log("🔍 usePlaces - Lugares únicos obtenidos:", {
              count: uniquePlaces.length,
              places: uniquePlaces.map(p => ({ name: p.name, vicinity: p.vicinity }))
            });
            
            const formattedPlaces = uniquePlaces
              .map((p) => formatPlaceResult(p))
              .filter((p): p is Place => p !== null)
              .slice(0, maxResults);

            console.log("🔍 usePlaces - Lugares formateados:", {
              count: formattedPlaces.length,
              places: formattedPlaces.map(p => ({ name: p.name, vicinity: p.vicinity }))
            });

            // Enriquecer datos si está habilitado
            if (enableEnrichment) {
              try {
                console.log("🔍 usePlaces - Iniciando enriquecimiento de datos...");
                const enrichedPlaces = await enrichPlaces(formattedPlaces, category);
                console.log("🔍 usePlaces - Lugares enriquecidos:", {
                  count: enrichedPlaces.length,
                  places: enrichedPlaces.map(p => ({ name: p.name, vicinity: p.vicinity }))
                });
                setPlaces(enrichedPlaces);
              } catch (error) {
                console.warn("Error enriching places:", error);
                setPlaces(formattedPlaces as EnrichedPlace[]);
              }
            } else {
              setPlaces(formattedPlaces as EnrichedPlace[]);
            }
            
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
              .filter((p): p is Place => p !== null)
              .slice(0, maxResults);

            // Enriquecer datos si está habilitado
            if (enableEnrichment) {
              try {
                const enrichedPlaces = await enrichPlaces(defaultPlaces, category);
                setPlaces(enrichedPlaces);
              } catch (error) {
                console.warn("Error enriching places:", error);
                setPlaces(defaultPlaces as EnrichedPlace[]);
              }
            } else {
              setPlaces(defaultPlaces as EnrichedPlace[]);
            }
            
            setStatus(`${defaultPlaces.length} lugares de calidad cercanos.`);
          } catch (error) {
            setPlaces([]);
            setStatus("Error en la búsqueda.");
          }
          setLoading(false);
        }
      } catch (error) {
        console.error("Error en usePlaces:", error);
        setPlaces([]);
        setError(error instanceof Error ? error.message : "Error al cargar lugares");
        setStatus("Error al cargar lugares. Verifica tu conexión a internet.");
        setLoading(false);
      }
    };

    fetchAndFilter();
  }, [category, searchQuery, enableEnrichment, maxResults]);

  return { places, mapCenter, loading, status, error };
};
