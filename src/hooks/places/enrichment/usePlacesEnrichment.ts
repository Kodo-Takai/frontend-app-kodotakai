// src/hooks/places/enrichment/usePlacesEnrichment.ts
import { useState, useCallback } from "react";
import type { Place, EnrichedPlace, PlaceCategory } from "../types";
import { EnrichmentConfigFactory, RATE_LIMIT_CONFIG, CACHE_CONFIG } from "./enrichmentConfigs";

// Helper function para determinar si un lugar está abierto
const isPlaceOpen = (periods: Array<{open: {day: number; time: string}; close: {day: number; time: string}}>): boolean => {
  const now = new Date();
  const currentDay = now.getDay(); // 0 = Domingo, 1 = Lunes, etc.
  const currentTime = now.getHours() * 100 + now.getMinutes(); // HHMM format
  
  for (const period of periods) {
    if (period.open.day === currentDay) {
      const openTime = parseInt(period.open.time);
      const closeTime = parseInt(period.close.time);
      
      // Si cierra después de medianoche (ej: 23:00 - 02:00)
      if (closeTime < openTime) {
        return currentTime >= openTime || currentTime <= closeTime;
      } else {
        return currentTime >= openTime && currentTime <= closeTime;
      }
    }
  }
  
  return false; // No hay horarios para hoy
};

// Helper function para inferir precios basado en múltiples factores
const inferPriceFromData = (place: Place, googleData: any): number | null => {
  const name = place.name.toLowerCase();
  const types = googleData.types || [];
  const rating = place.rating || 0;
  const userRatingsTotal = googleData.user_ratings_total || 0;
  
  console.log("Inferencia de precio:", { name, types, rating, userRatingsTotal });
  
  // Factores para inferir precio
  const factors = {
    // Nombres que sugieren lujo
    luxury: ['lujo', 'luxury', 'premium', 'boutique', 'resort', 'spa', 'grand', 'palace', 'royal'],
    // Nombres que sugieren económico
    budget: ['hostal', 'hostel', 'pensión', 'pension', 'económico', 'budget', 'simple', 'básico'],
    // Nombres que sugieren moderado
    midRange: ['hotel', 'inn', 'suites', 'plaza', 'center', 'central'],
    // Tipos de Google que sugieren lujo
    luxuryTypes: ['lodging', 'spa', 'resort'],
    // Tipos que sugieren económico
    budgetTypes: ['lodging']
  };
  
  let score = 0;
  let confidence = 0;
  
  // Análisis del nombre
  if (factors.luxury.some(keyword => name.includes(keyword))) {
    score += 3;
    confidence += 0.8;
  } else if (factors.budget.some(keyword => name.includes(keyword))) {
    score += 1;
    confidence += 0.7;
  } else if (factors.midRange.some(keyword => name.includes(keyword))) {
    score += 2;
    confidence += 0.6;
  }
  
  // Análisis del rating
  if (rating >= 4.5) {
    score += 1;
    confidence += 0.3;
  } else if (rating <= 3.0) {
    score -= 1;
    confidence += 0.2;
  }
  
  // Análisis de reviews (más reviews = más establecido)
  if (userRatingsTotal > 100) {
    score += 0.5;
    confidence += 0.2;
  }
  
  // Análisis de tipos de Google
  if (types.includes('lodging')) {
    if (name.includes('resort') || name.includes('spa')) {
      score += 2;
      confidence += 0.4;
    }
  }
  
  // Determinar nivel de precio basado en score
  let inferredLevel = null;
  if (confidence >= 0.5) {
    if (score >= 3) inferredLevel = 4; // Lujo
    else if (score >= 2) inferredLevel = 3; // Caro
    else if (score >= 1) inferredLevel = 2; // Moderado
    else if (score >= 0) inferredLevel = 1; // Económico
    else inferredLevel = 1; // Por defecto económico
  }
  
  console.log("Inferencia completada:", { score, confidence, inferredLevel });
  return inferredLevel;
};

// Helper function para interpretar niveles de precios
const getPriceInfo = (priceLevel: number | undefined, category: string, place?: Place, googleData?: any) => {
  console.log("Procesando precio:", { priceLevel, category });
  
  // Si no hay precio de Google, intentar inferir
  if (priceLevel === undefined || priceLevel === null) {
    if (place && googleData && category === "hotels") {
      const inferredLevel = inferPriceFromData(place, googleData);
      if (inferredLevel !== null) {
        console.log("Precio inferido:", inferredLevel);
        // Usar el precio inferido
        priceLevel = inferredLevel;
      }
    }
    
    // Si aún no hay precio, mostrar mensaje apropiado
    if (priceLevel === undefined || priceLevel === null) {
      if (category === "hotels") {
        return {
          level: null,
          description: "Precio no especificado",
          symbol: "🏨",
          color: "text-blue-500"
        };
      }
      
      return {
        level: null,
        description: "Precio no disponible",
        symbol: "❓",
        color: "text-gray-500"
      };
    }
  }

  const priceInfo = {
    0: { description: "Gratis", symbol: "🆓", color: "text-green-600" },
    1: { description: "Económico", symbol: "💰", color: "text-green-500" },
    2: { description: "Moderado", symbol: "💵", color: "text-yellow-500" },
    3: { description: "Caro", symbol: "💸", color: "text-orange-500" },
    4: { description: "Muy caro", symbol: "💎", color: "text-red-500" }
  };

  const info = priceInfo[priceLevel as keyof typeof priceInfo];
  
  // Ajustar descripción según categoría
  let categorySpecificDescription = info.description;
  if (category === "hotels") {
    const hotelDescriptions = {
      0: "Gratis",
      1: "Económico ($)",
      2: "Moderado ($$)",
      3: "Caro ($$$)",
      4: "Lujo ($$$$)"
    };
    categorySpecificDescription = hotelDescriptions[priceLevel as keyof typeof hotelDescriptions];
  } else if (category === "restaurants") {
    const restaurantDescriptions = {
      0: "Gratis",
      1: "Económico ($)",
      2: "Moderado ($$)",
      3: "Caro ($$$)",
      4: "Gourmet ($$$$)"
    };
    categorySpecificDescription = restaurantDescriptions[priceLevel as keyof typeof restaurantDescriptions];
  }

  // Determinar si el precio fue inferido
  const isInferred = place && googleData && (googleData as any).price_level === undefined;

  return {
    level: priceLevel,
    description: categorySpecificDescription,
    symbol: info.symbol,
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

      // Debug: Log de datos obtenidos
      console.log("Datos enriquecidos obtenidos:", {
        name: enrichedData.name,
        price_level: (enrichedData as any).price_level,
        user_ratings_total: (enrichedData as any).user_ratings_total,
        reviews_count: enrichedData.reviews?.length || 0,
        photos_count: enrichedData.photos?.length || 0,
        has_photos: !!(enrichedData.photos && enrichedData.photos.length > 0)
      });

      // Procesar datos enriquecidos
      const enrichedPlace = processEnrichedData(enrichedData, place, category);

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

  // Función para enriquecer múltiples lugares
  const enrichPlaces = useCallback(async (
    places: Place[],
    category: PlaceCategory = "hotels"
  ): Promise<EnrichedPlace[]> => {
    setLoading(true);
    setError(null);

    try {
      const enrichedPlaces: EnrichedPlace[] = [];
      
      // Procesar lugares en lotes para respetar rate limits
      const batchSize = Math.floor(RATE_LIMIT_CONFIG.maxRequestsPerSecond);
      const batches = [];
      
      for (let i = 0; i < places.length; i += batchSize) {
        batches.push(places.slice(i, i + batchSize));
      }

      // Procesar cada lote con delay
      for (const batch of batches) {
        const batchPromises = batch.map(place => enrichPlace(place, category));
        const batchResults = await Promise.allSettled(batchPromises);
        
        batchResults.forEach((result) => {
          if (result.status === 'fulfilled' && result.value) {
            enrichedPlaces.push(result.value);
          }
        });

        // Delay entre lotes para respetar rate limits
        if (batches.indexOf(batch) < batches.length - 1) {
          await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_CONFIG.retryDelay));
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
    originalPlace: Place,
    category: PlaceCategory = "hotels"
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
        // open_now removido por deprecación - usar isOpen() method en su lugar
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
      // Estado de apertura calculado sin usar campo deprecado
      is_open_now: googleData.opening_hours ? 
        isPlaceOpen((googleData.opening_hours.periods || []).map(period => ({
          open: { day: period.open?.day || 0, time: period.open?.time || "0000" },
          close: { day: period.close?.day || 0, time: period.close?.time || "0000" }
        })).filter(period => period.close)) : undefined,
      contact_info: {
        website: googleData.website,
        phone: googleData.formatted_phone_number,
        email: (googleData as any).email || undefined
      },
      // Información adicional de Google Maps
      google_maps_url: (googleData as any).url,
      utc_offset_minutes: (googleData as any).utc_offset_minutes,
      wheelchair_accessible: (googleData as any).wheelchair_accessible_entrance,
      serves_wine: (googleData as any).serves_wine,
      serves_breakfast: (googleData as any).serves_breakfast,
      business_status: (googleData as any).business_status,
      price_level: (googleData as any).price_level,
      // Información de precios procesada
      price_info: getPriceInfo((googleData as any).price_level, category, originalPlace, googleData)
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
