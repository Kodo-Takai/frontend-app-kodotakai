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

// --- Funciones de Enrichment Integradas ---

// Helper function simplificada para inferir precios
const inferPriceFromData = (place: Place): number | null => {
  const name = place.name.toLowerCase();
  const rating = place.rating || 0;
  
  // Lógica simple basada en rating y palabras clave
  if (rating >= 4.5 || name.includes('lujo') || name.includes('luxury') || name.includes('resort')) {
    return 4; // Lujo
  } else if (rating >= 4.0 || name.includes('hotel')) {
    return 3; // Caro
  } else if (rating >= 3.5) {
    return 2; // Moderado
  } else if (name.includes('hostal') || name.includes('hostel')) {
    return 1; // Económico
  }
  
  return null; // No se puede inferir
};

// Helper function simplificada para interpretar niveles de precios
const getPriceInfo = (priceLevel: number | undefined, place?: Place) => {
  // Si no hay precio de Google, intentar inferir
  if (priceLevel === undefined || priceLevel === null) {
    if (place) {
      const inferredLevel = inferPriceFromData(place);
      if (inferredLevel !== null) {
        priceLevel = inferredLevel;
      }
    }
    
    // Si aún no hay precio, mostrar mensaje genérico
    if (priceLevel === undefined || priceLevel === null) {
      return {
        level: null,
        description: "Precio no disponible",
        symbol: "",
        color: "text-gray-500"
      };
    }
  }

  // Configuración simple de precios
  const priceConfig = {
    0: { description: "Gratis", color: "text-green-600" },
    1: { description: "Económico", color: "text-green-500" },
    2: { description: "Moderado", color: "text-yellow-500" },
    3: { description: "Caro", color: "text-orange-500" },
    4: { description: "Lujo", color: "text-red-500" }
  };

  const info = priceConfig[priceLevel as keyof typeof priceConfig] || priceConfig[0];
  const isInferred = place && inferPriceFromData(place) !== null;

  return {
    level: priceLevel,
    description: info.description,
    symbol: "",
    color: info.color,
    isInferred
  };
};

// Cache simple para evitar llamadas repetidas
const enrichmentCache = new Map<string, EnrichedPlace>();

// Función para procesar datos enriquecidos de Google Places
const processEnrichedData = (
  googleData: google.maps.places.PlaceResult,
  originalPlace: Place
): EnrichedPlace => {
  const enriched: EnrichedPlace = {
    ...originalPlace,
    formatted_address: googleData.formatted_address,
    website: googleData.website,
    formatted_phone_number: googleData.formatted_phone_number,
    international_phone_number: googleData.international_phone_number,

    // Procesar fotos si están disponibles
    photo_url: googleData.photos?.[0]?.getUrl() || originalPlace.photo_url,
    photos: googleData.photos || originalPlace.photos,
    editorial_summary: (googleData as any).editorial_summary ? {
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
        open: {
          day: period.open?.day || 0,
          time: period.open?.time || "0000"
        },
        close: period.close ? {
          day: period.close.day,
          time: period.close.time
        } : {
          day: 0,
          time: "0000"
        }
      })),
      weekday_text: googleData.opening_hours.weekday_text || []
    } : undefined,
    utc_offset_minutes: (googleData as any).utc_offset_minutes,
    is_open_now: (() => {
      // Usar isOpen() method si está disponible
      if (googleData.opening_hours?.isOpen && typeof googleData.opening_hours.isOpen === 'function') {
        return googleData.opening_hours.isOpen();
      }
      // Fallback a open_now si isOpen() no está disponible
      return (googleData as any).open_now;
    })(),
    price_info: getPriceInfo((googleData as any).price_level, originalPlace),
    business_status: googleData.business_status,
    // types: googleData.types || [], // Removido - no existe en EnrichedPlace
    vicinity: googleData.vicinity,
    // url: googleData.url, // Removido - no existe en EnrichedPlace
    // utc_offset: (googleData as any).utc_offset, // Removido - no existe en EnrichedPlace
    // adr_address: googleData.adr_address, // Removido - no existe en EnrichedPlace
    // geometry: googleData.geometry ? { // Removido - no existe en EnrichedPlace
    //   location: googleData.geometry.location?.toJSON(),
    //   viewport: googleData.geometry.viewport ? {
    //     northeast: googleData.geometry.viewport.getNorthEast().toJSON(),
    //     southwest: googleData.geometry.viewport.getSouthWest().toJSON()
    //   } : undefined
    // } : undefined,
    place_id: googleData.place_id || originalPlace.place_id,
    // plus_code: (googleData as any).plus_code, // Removido - no existe en EnrichedPlace
    // reference: (googleData as any).reference, // Removido - no existe en EnrichedPlace
    // scope: (googleData as any).scope, // Removido - no existe en EnrichedPlace
    // user_ratings_total: googleData.user_ratings_total || 0, // Removido - no existe en EnrichedPlace
    rating: googleData.rating || originalPlace.rating,
    name: googleData.name || originalPlace.name,
    location: googleData.geometry?.location?.toJSON() || originalPlace.location
  };

  return enriched;
};

// Función para enriquecer un lugar individual
const enrichPlace = async (
  place: Place,
  category: PlaceCategory = "hotels"
): Promise<EnrichedPlace | null> => {
  try {
    // Verificar cache primero
    const cacheKey = `${place.place_id}_${category}`;
    if (CACHE_CONFIG.enabled && enrichmentCache.has(cacheKey)) {
      const cached = enrichmentCache.get(cacheKey);
      if (cached && Date.now() - (cached as any).cached_at < CACHE_CONFIG.ttl) {
        return cached;
      }
    }

    // Verificar que Google Maps API esté disponible
    if (!window.google?.maps?.places?.PlacesService) {
      console.error("Google Maps API not fully loaded:", {
        google: !!window.google,
        maps: !!window.google?.maps,
        places: !!window.google?.maps?.places,
        PlacesService: !!window.google?.maps?.places?.PlacesService
      });
      throw new Error("Google Maps API not fully loaded");
    }

    // Crear servicio de Places con manejo de errores
    let service;
    try {
      service = new window.google.maps.places.PlacesService(
        document.createElement('div')
      );
    } catch (err) {
      console.error("Error creating PlacesService:", err);
      throw new Error("Failed to create PlacesService");
    }

    // Obtener configuración de enriquecimiento
    const config = EnrichmentConfigFactory.createConfig(category);

    // Crear request para Google Places Details
    const request: google.maps.places.PlaceDetailsRequest = {
      placeId: place.place_id,
      fields: config.fields
    };

    return new Promise((resolve, reject) => {
      service.getDetails(request, (result, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && result) {
          try {
            const enrichedPlace = processEnrichedData(result, place);
            
            // Guardar en cache
            if (CACHE_CONFIG.enabled) {
              (enrichedPlace as any).cached_at = Date.now();
              enrichmentCache.set(cacheKey, enrichedPlace);
            }
            
            resolve(enrichedPlace);
          } catch (err) {
            console.error("Error processing enriched data:", err);
            reject(err);
          }
        } else {
          console.warn(`Places API error for ${place.name}:`, status);
          reject(new Error(`Places API error: ${status}`));
        }
      });
    });

  } catch (err) {
    console.error("Error enriching place:", err);
    return null;
  }
};

// Función para enriquecer múltiples lugares
const enrichPlaces = async (
  places: Place[],
  category: PlaceCategory = "hotels"
): Promise<EnrichedPlace[]> => {
  if (!places.length) return [];

  const enrichedPlaces: EnrichedPlace[] = [];
  
  // Procesar todos los lugares secuencialmente
  for (const place of places) {
    try {
      const enriched = await enrichPlace(place, category);
      if (enriched) {
        enrichedPlaces.push(enriched);
      }
    } catch (err) {
      console.warn(`Error enriching place ${place.name}:`, err);
      // Continuar con el siguiente lugar
    }
  }

  return enrichedPlaces;
};

// Loader de la API de Google Maps para evitar cargas múltiples
let mapsApiLoaded: Promise<void> | null = null;
export function loadGoogleMapsApi(): Promise<void> {
  if (mapsApiLoaded) return mapsApiLoaded;

  mapsApiLoaded = new Promise((resolve, reject) => {
    // Verificar si la API ya está cargada y disponible
    if (window.google?.maps?.places?.PlacesService) {
      console.log("Google Maps API already loaded");
      return resolve();
    }

    // Si el script ya existe en el DOM, esperar a que cargue
    const existingScript = document.getElementById("google-maps-script");
    if (existingScript) {
      console.log("Google Maps script exists, waiting for load...");
      const checkApiLoaded = () => {
        if (window.google?.maps?.places?.PlacesService) {
          console.log("Google Maps API loaded from existing script");
          resolve();
        } else {
          setTimeout(checkApiLoaded, 100);
        }
      };
      checkApiLoaded();
      return;
    }

    console.log("Loading Google Maps API...");
    // Crear nuevo script
    const script = document.createElement("script");
    script.id = "google-maps-script";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places&v=weekly`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      console.log("Google Maps script loaded, checking API availability...");
      // Verificar que la API esté completamente cargada con más intentos
      let attempts = 0;
      const maxAttempts = 50; // 5 segundos máximo

      const checkApiReady = () => {
        attempts++;
        if (window.google?.maps?.places?.PlacesService) {
          console.log("Google Maps API fully loaded and ready");
          resolve();
        } else if (attempts < maxAttempts) {
          setTimeout(checkApiReady, 100);
        } else {
          console.error(
            "Google Maps API failed to load after maximum attempts"
          );
          reject(new Error("Google Maps API failed to initialize"));
        }
      };
      checkApiReady();
    };

    script.onerror = (err) => {
      console.error("Error loading Google Maps API script:", err);
      reject(new Error("Failed to load Google Maps API script"));
    };

    document.head.appendChild(script);
  });

  return mapsApiLoaded;
}

// Obtiene la geolocalización del usuario con un fallback
  // Cache para evitar múltiples llamadas de geolocalización
  let locationCache: { location: LatLng; timestamp: number } | null = null;
  const CACHE_DURATION = 30000; // 30 segundos

  const getUserLocation = (): Promise<LatLng> => {
    return new Promise((resolve) => {
      // Verificar cache
      if (locationCache && (Date.now() - locationCache.timestamp) < CACHE_DURATION) {
        resolve(locationCache.location);
        return;
      }

      if (!navigator.geolocation) {
        console.log("Geolocation not available, using fallback location");
        return resolve(FALLBACK_LOCATION);
      }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const location = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        
        // Actualizar cache
        locationCache = { location, timestamp: Date.now() };
        
        // Solo log en desarrollo
        if (process.env.NODE_ENV === 'development') {
          console.log("User location obtained:", location);
        }
        resolve(location);
      },
      (error) => {
        console.warn(
          "Geolocation error:",
          error.message,
          "Using fallback location"
        );
        resolve(FALLBACK_LOCATION);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
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
            const uniquePlaces = await performMultipleSearch(
              service,
              userLocation,
              googleType
            );
            const formattedPlaces = uniquePlaces
              .map((p) => formatPlaceResult(p))
              .filter((p): p is Place => p !== null)
              .slice(0, maxResults);

            // Enriquecer datos si está habilitado
            if (enableEnrichment) {
              try {
                const enrichedPlaces = await enrichPlaces(formattedPlaces, category);
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
