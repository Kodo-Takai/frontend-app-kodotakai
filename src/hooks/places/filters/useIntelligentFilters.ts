// src/hooks/places/filters/useIntelligentFilters.ts
import { useState, useCallback, useMemo } from "react";
import type { EnrichedPlace, AIAnalysis } from "../types";

// Interface para configuración de filtros
export interface FilterConfig {
  minConfidence: number;
  maxResults: number;
  sortBy: 'confidence' | 'rating' | 'relevance';
  enableFallback: boolean;
}

// Interface para resultado de filtro
export interface FilterResult {
  places: EnrichedPlace[];
  confidence: number;
  totalFound: number;
  filterApplied: string;
}

// Configuración por defecto
const DEFAULT_CONFIG: FilterConfig = {
  minConfidence: 0.6,
  maxResults: 20,
  sortBy: 'confidence',
  enableFallback: true
};

// Hook para filtros inteligentes basados en IA
export function useIntelligentFilters(config: Partial<FilterConfig> = {}) {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [filterResults, setFilterResults] = useState<Record<string, FilterResult>>({});
  
  const finalConfig = useMemo(() => ({ ...DEFAULT_CONFIG, ...config }), [config]);

  // Aplicar filtro inteligente
  const applyFilter = useCallback((
    places: EnrichedPlace[],
    filter: string,
    customConfig?: Partial<FilterConfig>
  ): FilterResult => {
    const filterConfig = { ...finalConfig, ...customConfig };
    
    // Obtener lugares que coinciden con el filtro
    const filteredPlaces = places.filter(place => {
      const analysis = place.ai_analysis?.categories[filter as keyof typeof place.ai_analysis.categories];
      return analysis?.detected && analysis.confidence >= filterConfig.minConfidence;
    });

    // Ordenar resultados
    const sortedPlaces = sortPlaces(filteredPlaces, filterConfig.sortBy);

    // Limitar resultados
    const limitedPlaces = sortedPlaces.slice(0, filterConfig.maxResults);

    // Calcular confianza promedio
    const avgConfidence = limitedPlaces.length > 0 
      ? limitedPlaces.reduce((sum, place) => {
          const analysis = place.ai_analysis?.categories[filter as keyof typeof place.ai_analysis.categories];
          return sum + (analysis?.confidence || 0);
        }, 0) / limitedPlaces.length
      : 0;

    const result: FilterResult = {
      places: limitedPlaces,
      confidence: avgConfidence,
      totalFound: filteredPlaces.length,
      filterApplied: filter
    };

    return result;
  }, [finalConfig]);

  // Aplicar múltiples filtros
  const applyMultipleFilters = useCallback((
    places: EnrichedPlace[],
    filters: string[],
    customConfig?: Partial<FilterConfig>
  ): Record<string, FilterResult> => {
    const results: Record<string, FilterResult> = {};
    
    filters.forEach(filter => {
      results[filter] = applyFilter(places, filter, customConfig);
    });

    return results;
  }, [applyFilter]);

  // Ordenar lugares
  const sortPlaces = useCallback((
    places: EnrichedPlace[],
    sortBy: 'confidence' | 'rating' | 'relevance'
  ): EnrichedPlace[] => {
    return [...places].sort((a, b) => {
      switch (sortBy) {
        case 'confidence':
          const aConfidence = a.ai_analysis?.overall_confidence || 0;
          const bConfidence = b.ai_analysis?.overall_confidence || 0;
          return bConfidence - aConfidence;
          
        case 'rating':
          const aRating = a.rating || 0;
          const bRating = b.rating || 0;
          return bRating - aRating;
          
        case 'relevance':
          // Combinar confianza y rating
          const aRelevance = (a.ai_analysis?.overall_confidence || 0) * 0.7 + (a.rating || 0) * 0.3;
          const bRelevance = (b.ai_analysis?.overall_confidence || 0) * 0.7 + (b.rating || 0) * 0.3;
          return bRelevance - aRelevance;
          
        default:
          return 0;
      }
    });
  }, []);

  // Obtener lugares por filtro específico
  const getPlacesByFilter = useCallback((
    places: EnrichedPlace[],
    filter: string,
    customConfig?: Partial<FilterConfig>
  ): EnrichedPlace[] => {
    const result = applyFilter(places, filter, customConfig);
    return result.places;
  }, [applyFilter]);

  // Obtener estadísticas de filtros
  const getFilterStats = useCallback((
    places: EnrichedPlace[],
    filters: string[]
  ): Record<string, { count: number; avgConfidence: number }> => {
    const stats: Record<string, { count: number; avgConfidence: number }> = {};
    
    filters.forEach(filter => {
      const filteredPlaces = places.filter(place => {
        const analysis = place.ai_analysis?.categories[filter as keyof typeof place.ai_analysis.categories];
        return analysis?.detected && analysis.confidence >= finalConfig.minConfidence;
      });
      
      const avgConfidence = filteredPlaces.length > 0
        ? filteredPlaces.reduce((sum, place) => {
            const analysis = place.ai_analysis?.categories[filter as keyof typeof place.ai_analysis.categories];
            return sum + (analysis?.confidence || 0);
          }, 0) / filteredPlaces.length
        : 0;
      
      stats[filter] = {
        count: filteredPlaces.length,
        avgConfidence
      };
    });
    
    return stats;
  }, [finalConfig.minConfidence]);

  // Obtener lugares con alta confianza
  const getHighConfidencePlaces = useCallback((
    places: EnrichedPlace[],
    minConfidence: number = 0.8
  ): EnrichedPlace[] => {
    return places.filter(place => 
      place.ai_analysis?.overall_confidence && 
      place.ai_analysis.overall_confidence >= minConfidence
    );
  }, []);

  // Obtener lugares por múltiples criterios
  const getPlacesByCriteria = useCallback((
    places: EnrichedPlace[],
    criteria: {
      filters?: string[];
      minRating?: number;
      minConfidence?: number;
      maxResults?: number;
    }
  ): EnrichedPlace[] => {
    let filteredPlaces = [...places];
    
    // Filtrar por rating mínimo
    if (criteria.minRating) {
      filteredPlaces = filteredPlaces.filter(place => 
        place.rating && place.rating >= criteria.minRating
      );
    }
    
    // Filtrar por confianza mínima
    if (criteria.minConfidence) {
      filteredPlaces = filteredPlaces.filter(place => 
        place.ai_analysis?.overall_confidence && 
        place.ai_analysis.overall_confidence >= criteria.minConfidence
      );
    }
    
    // Filtrar por categorías específicas
    if (criteria.filters && criteria.filters.length > 0) {
      filteredPlaces = filteredPlaces.filter(place => {
        return criteria.filters!.some(filter => {
          const analysis = place.ai_analysis?.categories[filter as keyof typeof place.ai_analysis.categories];
          return analysis?.detected && analysis.confidence >= finalConfig.minConfidence;
        });
      });
    }
    
    // Ordenar por relevancia
    const sortedPlaces = sortPlaces(filteredPlaces, 'relevance');
    
    // Limitar resultados
    return sortedPlaces.slice(0, criteria.maxResults || finalConfig.maxResults);
  }, [finalConfig, sortPlaces]);

  // Actualizar filtros activos
  const updateActiveFilters = useCallback((filters: string[]) => {
    setActiveFilters(filters);
  }, []);

  // Limpiar filtros
  const clearFilters = useCallback(() => {
    setActiveFilters([]);
    setFilterResults({});
  }, []);

  // Obtener lugares recomendados
  const getRecommendedPlaces = useCallback((
    places: EnrichedPlace[],
    userPreferences: string[] = []
  ): EnrichedPlace[] => {
    if (userPreferences.length === 0) {
      return getHighConfidencePlaces(places);
    }
    
    return getPlacesByCriteria(places, {
      filters: userPreferences,
      minConfidence: 0.7,
      maxResults: 10
    });
  }, [getHighConfidencePlaces, getPlacesByCriteria]);

  return {
    // Funciones principales
    applyFilter,
    applyMultipleFilters,
    getPlacesByFilter,
    getPlacesByCriteria,
    getRecommendedPlaces,
    
    // Utilidades
    getFilterStats,
    getHighConfidencePlaces,
    sortPlaces,
    
    // Estado
    activeFilters,
    filterResults,
    updateActiveFilters,
    clearFilters,
    
    // Configuración
    config: finalConfig
  };
}
