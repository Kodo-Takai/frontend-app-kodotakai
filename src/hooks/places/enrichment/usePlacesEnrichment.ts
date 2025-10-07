// src/hooks/places/enrichment/usePlacesEnrichment.ts
import { useState, useCallback } from "react";
import type { Place, EnrichedPlace, PlaceCategory } from "../types";
import { EnrichmentConfigFactory, CACHE_CONFIG } from "./enrichmentConfigs";


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

  const info = priceConfig[priceLevel as keyof typeof priceConfig];
  const isInferred = place && priceLevel !== undefined;

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

// Hook para enriquecer datos de lugares usando Google Places Details API
export function usePlacesEnrichment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Función para enriquecer un lugar individual
  const enrichPlace = useCallback(async (
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
        fields: config.fields as any,
        language: config.language,
        region: config.region,
        sessionToken: config.sessionToken
      };

      // Realizar llamada a Google Places Details API
      const enrichedData = await new Promise<google.maps.places.PlaceResult>((resolve, reject) => {
        try {
          service.getDetails(request, (result, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK && result) {
              resolve(result);
            } else {
              console.error("Places API error:", { status, result });
              reject(new Error(`Places API error: ${status}`));
            }
          });
        } catch (err) {
          console.error("Error calling getDetails:", err);
          reject(new Error("Failed to call getDetails"));
        }
      });

      // Procesar datos enriquecidos
      const enrichedPlace = processEnrichedData(enrichedData, place);

      // Guardar en cache
      if (CACHE_CONFIG.enabled) {
        (enrichedPlace as any).cached_at = Date.now();
        enrichmentCache.set(cacheKey, enrichedPlace);
        
        // Limpiar cache si excede el tamaño máximo
        if (enrichmentCache.size > CACHE_CONFIG.maxSize) {
        const firstKey = enrichmentCache.keys().next().value;
        if (firstKey) {
          enrichmentCache.delete(firstKey);
        }
        }
      }

      return enrichedPlace;

    } catch (err) {
      console.error("Error enriching place:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
      return null;
    }
  }, []);

  // Función simplificada para enriquecer múltiples lugares
  const enrichPlaces = useCallback(async (
    places: Place[],
    category: PlaceCategory = "hotels"
  ): Promise<EnrichedPlace[]> => {
    if (!places.length) return [];

    setLoading(true);
    setError(null);

    try {
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

    } catch (err) {
      console.error("Error enriching places:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
      return [];
    } finally {
      setLoading(false);
    }
  }, [enrichPlace]);

  // Función para procesar datos enriquecidos de Google Places
  const processEnrichedData = useCallback((
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
          } : undefined
        })).filter(period => period.close) as Array<{
          open: { day: number; time: string };
          close: { day: number; time: string };
        }>,
        weekday_text: googleData.opening_hours.weekday_text || []
      } : undefined,
      // Estado de apertura usando el método oficial de Google Maps
      is_open_now: (() => {
        const openingHours = googleData.opening_hours;
        if (!openingHours) return undefined;
        
        // Intentar usar el método oficial isOpen()
        if (openingHours.isOpen && typeof openingHours.isOpen === 'function') {
          try {
            return openingHours.isOpen();
          } catch (error) {
            console.warn(`Error al llamar isOpen():`, error);
          }
        }
        
        // Fallback al campo open_now si isOpen() no está disponible
        return openingHours.open_now;
      })(),
      contact_info: {
        website: googleData.website,
        phone: googleData.formatted_phone_number,
        email: (googleData as any).email || undefined
      },
      // Información adicional de Google Maps
      google_maps_url: (googleData as any).url,
      utc_offset_minutes: (googleData as any).utc_offset_minutes,
      business_status: (googleData as any).business_status,
      price_level: (googleData as any).price_level,

      // Información de precios procesada
      price_info: getPriceInfo((googleData as any).price_level, originalPlace)
    };

    return enriched;
  }, []);

  // Función para limpiar cache
  const clearCache = useCallback(() => {
    enrichmentCache.clear();
  }, []);

  // Función para obtener estadísticas de cache
  const getCacheStats = useCallback(() => {
    return {
      size: enrichmentCache.size,
      maxSize: CACHE_CONFIG.maxSize,
      enabled: CACHE_CONFIG.enabled
    };
  }, []);

  return {
    enrichPlace,
    enrichPlaces,
    clearCache,
    getCacheStats,
    loading,
    error
  };
}
