import { useState, useCallback, useMemo } from "react";
import type { EnrichedPlace } from "../types";

export interface FilterConfig {
  minConfidence: number;
  maxResults: number;
  sortBy: 'confidence' | 'rating' | 'relevance';
  enableFallback: boolean;
}

export interface FilterResult {
  places: EnrichedPlace[];
  confidence: number;
  totalFound: number;
  filterApplied: string;
}

const DEFAULT_CONFIG: FilterConfig = {
  minConfidence: 0.6,
  maxResults: 20,
  sortBy: 'confidence',
  enableFallback: true
};

export function useIntelligentFilters(config: Partial<FilterConfig> = {}) {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [filterResults, setFilterResults] = useState<Record<string, FilterResult>>({});
  
  const finalConfig = useMemo(() => ({ ...DEFAULT_CONFIG, ...config }), [config]);

  const applyFilter = useCallback((
    places: EnrichedPlace[],
    filter: string,
    customConfig?: Partial<FilterConfig>
  ): FilterResult => {
    const filterConfig = { ...finalConfig, ...customConfig };
    
    const filteredPlaces = places.filter(place => {
      const analysis = place.ai_analysis?.categories[filter as keyof typeof place.ai_analysis.categories];
      return analysis?.detected && analysis.confidence >= filterConfig.minConfidence;
    });

    const sortedPlaces = sortPlaces(filteredPlaces, filterConfig.sortBy);
    const limitedPlaces = sortedPlaces.slice(0, filterConfig.maxResults);

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
          const aRelevance = (a.ai_analysis?.overall_confidence || 0) * 0.7 + (a.rating || 0) * 0.3;
          const bRelevance = (b.ai_analysis?.overall_confidence || 0) * 0.7 + (b.rating || 0) * 0.3;
          return bRelevance - aRelevance;
          
        default:
          return 0;
      }
    });
  }, []);

  const getPlacesByFilter = useCallback((
    places: EnrichedPlace[],
    filter: string,
    customConfig?: Partial<FilterConfig>
  ): EnrichedPlace[] => {
    const result = applyFilter(places, filter, customConfig);
    return result.places;
  }, [applyFilter]);

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

  const getHighConfidencePlaces = useCallback((
    places: EnrichedPlace[],
    minConfidence: number = 0.8
  ): EnrichedPlace[] => {
    return places.filter(place => 
      place.ai_analysis?.overall_confidence && 
      place.ai_analysis.overall_confidence >= minConfidence
    );
  }, []);

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
    
    if (criteria.minRating !== undefined) {
      filteredPlaces = filteredPlaces.filter(place => 
        place.rating && place.rating >= criteria.minRating!
      );
    }
    
    if (criteria.minConfidence !== undefined) {
      filteredPlaces = filteredPlaces.filter(place => 
        place.ai_analysis?.overall_confidence && 
        place.ai_analysis.overall_confidence >= criteria.minConfidence!
      );
    }
    
    if (criteria.filters && criteria.filters.length > 0) {
      filteredPlaces = filteredPlaces.filter(place => {
        return criteria.filters!.some(filter => {
          const analysis = place.ai_analysis?.categories[filter as keyof typeof place.ai_analysis.categories];
          return analysis?.detected && analysis.confidence >= finalConfig.minConfidence;
        });
      });
    }
    
    const sortedPlaces = sortPlaces(filteredPlaces, 'relevance');
    return sortedPlaces.slice(0, criteria.maxResults || finalConfig.maxResults);
  }, [finalConfig, sortPlaces]);

  const updateActiveFilters = useCallback((filters: string[]) => {
    setActiveFilters(filters);
  }, []);

  const clearFilters = useCallback(() => {
    setActiveFilters([]);
    setFilterResults({});
  }, []);

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
    applyFilter,
    applyMultipleFilters,
    getPlacesByFilter,
    getPlacesByCriteria,
    getRecommendedPlaces,
    getFilterStats,
    getHighConfidencePlaces,
    sortPlaces,
    activeFilters,
    filterResults,
    updateActiveFilters,
    clearFilters,
    config: finalConfig
  };
}
