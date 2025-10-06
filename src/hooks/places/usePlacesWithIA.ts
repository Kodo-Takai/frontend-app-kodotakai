// src/hooks/places/usePlacesWithIA.ts
import { useState, useEffect, useCallback, useRef } from "react";
import type { Place, EnrichedPlace, PlaceCategory, AIAnalysis } from "./types";
import { usePlacesEnrichment } from "./enrichment/usePlacesEnrichment";
import { useReviewsProcessor } from "./processors/reviewsProcessor";
import { useAmenitiesProcessor } from "./processors/amenitiesProcessor";
import { useAIService } from "./ai/useAIService";
import { usePlaces } from "./usePlaces";

// Interface para opciones del hook híbrido
export interface PlacesWithIAOptions {
  category: PlaceCategory;
  searchQuery?: string;
  requestedFilters: string[];
  enableEnrichment?: boolean;
  enableAI?: boolean;
  maxPlaces?: number;
}

// Interface para estado del hook
export interface PlacesWithIAState {
  places: EnrichedPlace[];
  filteredPlaces: Record<string, EnrichedPlace[]>;
  loading: boolean;
  error: string | null;
  aiAnalysis: AIAnalysis | null;
  enrichmentStats: {
    enriched: number;
    total: number;
    processingTime: number;
  };
}

// Hook híbrido que combina Google Maps + IA
export function usePlacesWithIA(options: PlacesWithIAOptions) {
  const {
    category,
    searchQuery,
    requestedFilters,
    enableEnrichment = true,
    enableAI = true,
    maxPlaces = 20
  } = options;

  // Estados
  const [state, setState] = useState<PlacesWithIAState>({
    places: [],
    filteredPlaces: {},
    loading: false,
    error: null,
    aiAnalysis: null,
    enrichmentStats: {
      enriched: 0,
      total: 0,
      processingTime: 0
    }
  });

  // Hooks base
  const { enrichPlaces, loading: enrichmentLoading, error: enrichmentError } = usePlacesEnrichment();
  const { processPlaceReviews } = useReviewsProcessor();
  const { detectPlaceAmenities } = useAmenitiesProcessor();
  const { analyzePlaces, loading: aiLoading, error: aiError } = useAIService();

  // Hook de Google Maps (datos base)
  const { places: basePlaces, mapCenter, loading: mapsLoading, status } = usePlaces(
    category,
    searchQuery
  );

  // Procesar lugares con enriquecimiento
  const processPlacesWithEnrichment = useCallback(async (places: Place[]) => {
    if (!enableEnrichment || places.length === 0) {
      return places.map(place => ({ ...place } as EnrichedPlace));
    }

    // Verificar que Google Maps API esté disponible antes de enriquecer
    if (!window.google?.maps?.places?.PlacesService) {
      console.warn("Google Maps API not available, skipping enrichment");
      return places.map(place => ({ ...place } as EnrichedPlace));
    }

    const startTime = Date.now();
    
    try {
      // Enriquecer lugares
      const enrichedPlaces = await enrichPlaces(places.slice(0, maxPlaces), category);
      
      // Procesar cada lugar enriquecido
      const processedPlaces = await Promise.all(
        enrichedPlaces.map(async (place) => {
          try {
            // Procesar reviews
            processPlaceReviews(place);
            
            // Detectar amenities
            const amenitiesAnalysis = detectPlaceAmenities(place);
            
            // Crear análisis de IA local
            const localAIAnalysis: AIAnalysis = {
              categories: {
                petfriendly: {
                  confidence: amenitiesAnalysis.categories.petfriendly.confidence,
                  detected: amenitiesAnalysis.categories.petfriendly.detected
                },
                luxury: {
                  confidence: amenitiesAnalysis.categories.luxury.confidence,
                  detected: amenitiesAnalysis.categories.luxury.detected
                },
                economic: {
                  confidence: amenitiesAnalysis.categories.economic.confidence,
                  detected: amenitiesAnalysis.categories.economic.detected
                },
                beach: {
                  confidence: amenitiesAnalysis.categories.beach.confidence,
                  detected: amenitiesAnalysis.categories.beach.detected
                },
                pool: {
                  confidence: amenitiesAnalysis.categories.pool.confidence,
                  detected: amenitiesAnalysis.categories.pool.detected
                }
              },
              overall_confidence: amenitiesAnalysis.confidence,
              processed_at: new Date().toISOString()
            };

            return {
              ...place,
              ai_analysis: localAIAnalysis,
              amenities: amenitiesAnalysis.amenities.map(a => a.name),
              services: Object.keys(amenitiesAnalysis.lodgingInfo).filter(
                key => amenitiesAnalysis.lodgingInfo[key as keyof typeof amenitiesAnalysis.lodgingInfo]
              )
            };
          } catch (error) {
            console.error(`Error processing place ${place.name}:`, error);
            return place;
          }
        })
      );

      const processingTime = Date.now() - startTime;
      
      return {
        places: processedPlaces,
        stats: {
          enriched: processedPlaces.length,
          total: places.length,
          processingTime
        }
      };

    } catch (error) {
      console.error("Error in enrichment process:", error);
      throw error;
    }
  }, [enableEnrichment, category, maxPlaces, enrichPlaces, processPlaceReviews, detectPlaceAmenities]);

  // Procesar lugares con IA
  const processPlacesWithAI = useCallback(async (places: EnrichedPlace[]) => {
    if (!enableAI || places.length === 0 || requestedFilters.length === 0) {
      return { filteredPlaces: {}, aiAnalysis: null };
    }

    try {
      // Enviar a IA para análisis
      const aiResponse = await analyzePlaces(places, requestedFilters, mapCenter);
      
      return {
        filteredPlaces: aiResponse.filtered_places,
        aiAnalysis: {
          categories: Object.fromEntries(
            Object.entries(aiResponse.confidence_scores).map(([key, value]) => [
              key,
              { confidence: value, detected: value > 0.5 }
            ])
          ),
          overall_confidence: Object.values(aiResponse.confidence_scores).reduce((a, b) => a + b, 0) / Object.values(aiResponse.confidence_scores).length,
          processed_at: aiResponse.timestamp
        }
      };

    } catch (error) {
      console.error("Error in AI processing:", error);
      throw error;
    }
  }, [enableAI, requestedFilters, mapCenter, analyzePlaces]);

  // Ref para evitar múltiples ejecuciones
  const isProcessingRef = useRef(false);
  
  // Efecto principal para procesar lugares
  useEffect(() => {
    const processPlaces = async () => {
      if (basePlaces.length === 0 || isProcessingRef.current) return;
      
      isProcessingRef.current = true;

      setState(prev => ({ ...prev, loading: true, error: null }));

      try {
        // Paso 1: Enriquecer datos (solo si está habilitado)
        let enrichmentResult: { places: EnrichedPlace[]; stats: any };
        if (enableEnrichment) {
          const result = await processPlacesWithEnrichment(basePlaces);
          enrichmentResult = Array.isArray(result) 
            ? { places: result, stats: { enriched: result.length, total: basePlaces.length } }
            : result;
        } else {
          // Usar datos básicos sin enriquecimiento
          enrichmentResult = {
            places: basePlaces.map(place => ({ ...place } as EnrichedPlace)),
            stats: { enriched: 0, total: basePlaces.length }
          };
        }
        
        // Paso 2: Procesar con IA (solo si está habilitado)
        let aiResult: { filteredPlaces: Record<string, EnrichedPlace[]>; aiAnalysis: AIAnalysis | null } = { 
          filteredPlaces: {}, 
          aiAnalysis: null 
        };
        if (enableAI && requestedFilters.length > 0) {
          aiResult = await processPlacesWithAI(enrichmentResult.places);
        }

        setState(prev => ({
          ...prev,
          places: enrichmentResult.places,
          filteredPlaces: aiResult.filteredPlaces,
          aiAnalysis: aiResult.aiAnalysis,
          enrichmentStats: enrichmentResult.stats,
          loading: false
        }));

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setState(prev => ({
          ...prev,
          error: errorMessage,
          loading: false
        }));
      } finally {
        isProcessingRef.current = false;
      }
    };

    processPlaces();
  }, [basePlaces.length, enableEnrichment, enableAI, requestedFilters.length]);

  // Obtener lugares filtrados por categoría
  const getFilteredPlaces = useCallback((filter: string): EnrichedPlace[] => {
    return state.filteredPlaces[filter] || [];
  }, [state.filteredPlaces]);

  // Obtener estadísticas de filtros
  const getFilterStats = useCallback(() => {
    const stats: Record<string, number> = {};
    Object.entries(state.filteredPlaces).forEach(([filter, places]) => {
      stats[filter] = places.length;
    });
    return stats;
  }, [state.filteredPlaces]);

  // Limpiar cache
  const clearCache = useCallback(() => {
    // Implementar limpieza de cache si es necesario
  }, []);

  // Obtener lugares por confianza de IA
  const getPlacesByConfidence = useCallback((minConfidence: number = 0.5): EnrichedPlace[] => {
    return state.places.filter(place => 
      place.ai_analysis?.overall_confidence && 
      place.ai_analysis.overall_confidence >= minConfidence
    );
  }, [state.places]);

  // Obtener lugares por categoría específica
  const getPlacesByCategory = useCallback((category: string, minConfidence: number = 0.5): EnrichedPlace[] => {
    return state.places.filter(place => {
      const analysis = place.ai_analysis?.categories[category as keyof typeof place.ai_analysis.categories];
      return analysis?.detected && analysis.confidence >= minConfidence;
    });
  }, [state.places]);

  return {
    // Datos principales
    places: state.places,
    filteredPlaces: state.filteredPlaces,
    mapCenter,
    
    // Estados
    loading: state.loading || mapsLoading || enrichmentLoading || aiLoading,
    error: state.error || enrichmentError || aiError,
    status,
    
    // Análisis de IA
    aiAnalysis: state.aiAnalysis,
    enrichmentStats: state.enrichmentStats,
    
    // Funciones de utilidad
    getFilteredPlaces,
    getFilterStats,
    getPlacesByConfidence,
    getPlacesByCategory,
    clearCache
  };
}
