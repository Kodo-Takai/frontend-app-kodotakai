// src/hooks/places/usePlacesWithIA.ts
import { useState, useEffect, useCallback, useRef } from "react";
import type { EnrichedPlace, PlaceCategory, AIAnalysis } from "./types";
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
  const { processPlaceReviews } = useReviewsProcessor();
  const { detectPlaceAmenities } = useAmenitiesProcessor();
  const { error: aiError } = useAIService();

  // Hook de Google Maps (ya con datos enriquecidos)
  const { places: enrichedPlaces, mapCenter, loading: mapsLoading, status } = usePlaces({
    category,
    searchQuery,
    enableEnrichment: enableEnrichment,
    maxResults: maxPlaces
  });

  // Función para procesar lugares con IA (movida dentro del useEffect)

  // Ref para evitar múltiples ejecuciones
  const isProcessingRef = useRef(false);
  
  // Efecto principal para procesar lugares
  useEffect(() => {
    const processPlaces = async () => {
      if (enrichedPlaces.length === 0 || isProcessingRef.current) return;
      
      isProcessingRef.current = true;

      setState(prev => ({ ...prev, loading: true, error: null }));

      try {
        const startTime = Date.now();
        
        // Procesar cada lugar enriquecido con amenities y reviews
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
                overall_confidence: 0.8, // Valor por defecto
                processed_at: new Date().toISOString()
              };

              return {
                ...place,
                ai_analysis: localAIAnalysis
              };
            } catch (error) {
              console.warn(`Error processing place ${place.name}:`, error);
              return place;
            }
          })
        );

        // Procesar con IA si está habilitado
        let aiResult: { filteredPlaces: Record<string, EnrichedPlace[]>; aiAnalysis: AIAnalysis | null } = { 
          filteredPlaces: {}, 
          aiAnalysis: null 
        };
        if (enableAI && requestedFilters.length > 0) {
          try {
            // Análisis con IA (simplificado por ahora)
            // const aiAnalysis = await analyzePlaces(processedPlaces, requestedFilters, { lat: -12.0464, lng: -77.0428 });
            
            // Filtrar lugares basado en análisis de IA
            const filteredPlaces: Record<string, EnrichedPlace[]> = {};
            
            for (const filter of requestedFilters) {
              filteredPlaces[filter] = processedPlaces.filter(place => {
                const analysis = place.ai_analysis;
                if (!analysis) return false;
                
                const categoryAnalysis = analysis.categories[filter as keyof typeof analysis.categories];
                return categoryAnalysis?.detected && (categoryAnalysis.confidence || 0) > 0.5;
              });
            }

            aiResult = { filteredPlaces, aiAnalysis: null }; // IA analysis simplificado por ahora
          } catch (error) {
            console.error("Error in AI processing:", error);
            aiResult = { filteredPlaces: {}, aiAnalysis: null };
          }
        }
        
        const processingTime = Date.now() - startTime;

        setState(prev => ({
          ...prev,
          places: processedPlaces,
          filteredPlaces: aiResult.filteredPlaces,
          aiAnalysis: aiResult.aiAnalysis as AIAnalysis | null,
          enrichmentStats: {
            enriched: processedPlaces.length,
            total: enrichedPlaces.length,
            processingTime
          },
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
  }, [enrichedPlaces.length, enableEnrichment, enableAI, requestedFilters.length]);

  // Obtener lugares filtrados por categoría
  const getFilteredPlaces = useCallback((filter: string): EnrichedPlace[] => {
    return state.filteredPlaces[filter] || [];
  }, [state.filteredPlaces]);

  // Obtener estadísticas de filtros
  const getFilterStatistics = useCallback(() => {
    const stats: Record<string, number> = {};
    for (const [filter, places] of Object.entries(state.filteredPlaces)) {
      stats[filter] = places.length;
    }
    return stats;
  }, [state.filteredPlaces]);

  return {
    // Estados principales
    places: state.places,
    filteredPlaces: state.filteredPlaces,
    loading: state.loading || mapsLoading,
    error: state.error || aiError,
    
    // Análisis de IA
    aiAnalysis: state.aiAnalysis,
    
    // Estadísticas
    enrichmentStats: state.enrichmentStats,
    
    // Funciones utilitarias
    getFilteredPlaces,
    getFilterStatistics,
    
    // Estados de Google Maps
    mapCenter,
    status
  };
}