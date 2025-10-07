// src/hooks/places/usePlacesWithFilters.ts - Hook híbrido genérico para todas las categorías
import { useState, useCallback, useEffect } from "react";
import { usePlacesWithIA } from "./usePlacesWithIA";
import { useIntelligentFilters } from "./filters/useIntelligentFilters";
import type { EnrichedPlace, PlaceCategory } from "./types";

// Opciones del hook genérico
export interface PlacesWithFiltersOptions {
  searchQuery?: string;
  activeFilters?: string[];
  category: PlaceCategory;
  maxResults?: number;
  enableEnrichment?: boolean;
  enableAI?: boolean;
  limit?: number;
}

// Estado del hook genérico
export interface PlacesWithFiltersState {
  places: EnrichedPlace[];
  filteredPlaces: Record<string, EnrichedPlace[]>;
  loading: boolean;
  error: string | null;
  enrichmentStats?: any;
  aiAnalysis?: any;
  activeFilters: string[];
  filterStats: Record<string, any>;
}

// Hook híbrido genérico para todas las categorías
export function usePlacesWithFilters(options: PlacesWithFiltersOptions) {
  const {
    searchQuery = "",
    activeFilters = [],
    category,
    maxResults = 20,
    enableEnrichment = false,
    enableAI = false,
    limit = 20
  } = options;

  // Estado local
  const [state, setState] = useState<PlacesWithFiltersState>({
    places: [],
    filteredPlaces: {},
    loading: true,
    error: null,
    activeFilters: [],
    filterStats: {}
  });

  // Hook híbrido con IA
  const {
    places,
    loading: iaLoading,
    error: iaError,
    enrichmentStats,
    aiAnalysis
  } = usePlacesWithIA({
    searchQuery,
    category,
    maxPlaces: limit,
    enableEnrichment,
    enableAI,
    requestedFilters: activeFilters
  });

  // Hook de filtros inteligentes
  const {
    applyMultipleFilters,
    getPlacesByCriteria,
    getRecommendedPlaces,
    getHighConfidencePlaces,
    getFilterStats
  } = useIntelligentFilters({
    minConfidence: 0.6,
    maxResults,
    sortBy: 'relevance',
    enableFallback: true
  });

  // Efecto para procesar filtros cuando cambian
  useEffect(() => {
    const processFilters = async () => {
      if (places.length === 0 || activeFilters.length === 0) {
        setState(prev => ({
          ...prev,
          places,
          filteredPlaces: {},
          filterStats: {},
          activeFilters: [],
          loading: iaLoading,
          error: iaError
        }));
        return;
      }

      try {
        // Aplicar filtros inteligentes
        const filterResults = applyMultipleFilters(places, activeFilters);
        
        // Obtener estadísticas de filtros
        const stats = getFilterStats(places, activeFilters);
        
        setState(prev => ({
          ...prev,
          places,
          filteredPlaces: Object.fromEntries(
            Object.entries(filterResults).map(([key, result]) => [key, result.places])
          ),
          filterStats: stats,
          activeFilters,
          loading: false,
          error: null
        }));

      } catch (error) {
        console.error("Error processing filters:", error);
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Unknown error',
          loading: false
        }));
      }
    };

    processFilters();
  }, [places, activeFilters, applyMultipleFilters, getFilterStats, iaLoading, iaError]);

  // Funciones de filtrado específicas por categoría
  const getPlacesByFilter = useCallback((filter: string) => {
    if (filter === "todo" || !filter) return places;
    
    // Filtros específicos por categoría
    switch (category) {
      case "hotels":
        return getHotelPlacesByFilter(places, filter);
      case "beaches":
        return getBeachPlacesByFilter(places, filter);
      case "restaurants":
        return getRestaurantPlacesByFilter(places, filter);
      case "destinations":
        return getDestinationPlacesByFilter(places, filter);
      default:
        return places;
    }
  }, [places, category]);

  // Función para actualizar filtros activos
  const updateActiveFilters = useCallback((newFilters: string[]) => {
    setState(prev => ({
      ...prev,
      activeFilters: newFilters
    }));
  }, []);

  // Función para obtener estadísticas de filtros
  const getFilterStatistics = useCallback(() => {
    return state.filterStats;
  }, [state.filterStats]);

  // Función para obtener lugares recomendados
  const getRecommendedPlacesLocal = useCallback(() => {
    return getRecommendedPlaces(places);
  }, [places, getRecommendedPlaces]);

  // Función para obtener lugares de alta confianza
  const getHighConfidencePlacesLocal = useCallback(() => {
    return getHighConfidencePlaces(places);
  }, [places, getHighConfidencePlaces]);

  // Función para obtener lugares por criterios
  const getPlacesByCriteriaLocal = useCallback((criteria: any) => {
    return getPlacesByCriteria(places, criteria);
  }, [places, getPlacesByCriteria]);

  return {
    ...state,
    getPlacesByFilter,
    getFilterStatistics,
    getRecommendedPlaces: getRecommendedPlacesLocal,
    getHighConfidencePlaces: getHighConfidencePlacesLocal,
    getPlacesByCriteria: getPlacesByCriteriaLocal,
    updateActiveFilters,
    enrichmentStats,
    aiAnalysis
  };
}

// Funciones de filtrado específicas por categoría

// Filtros para hoteles
function getHotelPlacesByFilter(places: EnrichedPlace[], filter: string): EnrichedPlace[] {
  return places.filter(place => {
    const lowerName = place.name.toLowerCase();
    const lowerVicinity = place.vicinity?.toLowerCase() || "";
    
    switch (filter) {
      case "spa":
        return lowerName.includes("spa") || lowerName.includes("sauna") || 
               lowerVicinity.includes("spa") || lowerVicinity.includes("sauna");
      case "sauna":
        return lowerName.includes("sauna") || lowerVicinity.includes("sauna");
      case "cocina":
        return lowerName.includes("cocina") || lowerName.includes("kitchen") || 
               lowerVicinity.includes("cocina") || lowerVicinity.includes("kitchen");
      case "gym":
        return lowerName.includes("gym") || lowerName.includes("gimnasio") || 
               lowerVicinity.includes("gym") || lowerVicinity.includes("gimnasio");
      case "rest":
        return lowerName.includes("restaurante") || lowerName.includes("restaurant") || 
               lowerVicinity.includes("restaurante") || lowerVicinity.includes("restaurant");
      default:
        return true;
    }
  });
}

// Filtros para playas
function getBeachPlacesByFilter(places: EnrichedPlace[], filter: string): EnrichedPlace[] {
  return places.filter(place => {
    const lowerName = place.name.toLowerCase();
    const lowerVicinity = place.vicinity?.toLowerCase() || "";
    
    switch (filter) {
      case "surf":
        return lowerName.includes("surf") || lowerName.includes("surfing") || 
               lowerVicinity.includes("surf") || lowerVicinity.includes("surfing");
      case "pesca":
        return lowerName.includes("pesca") || lowerName.includes("fishing") || 
               lowerVicinity.includes("pesca") || lowerVicinity.includes("fishing");
      case "camping":
        return lowerName.includes("camping") || lowerName.includes("camp") || 
               lowerVicinity.includes("camping") || lowerVicinity.includes("camp");
      case "petfriendly":
        return lowerName.includes("pet") || lowerName.includes("mascota") || 
               lowerVicinity.includes("pet") || lowerVicinity.includes("mascota");
      default:
        return true;
    }
  });
}

// Filtros para restaurantes
function getRestaurantPlacesByFilter(places: EnrichedPlace[], filter: string): EnrichedPlace[] {
  return places.filter(place => {
    const lowerName = place.name.toLowerCase();
    const lowerVicinity = place.vicinity?.toLowerCase() || "";
    
    switch (filter) {
      case "vegetariano":
        return lowerName.includes("vegetariano") || lowerName.includes("vegano") || 
               lowerVicinity.includes("vegetariano") || lowerVicinity.includes("vegano");
      case "mariscos":
        return lowerName.includes("mariscos") || lowerName.includes("seafood") || 
               lowerVicinity.includes("mariscos") || lowerVicinity.includes("seafood");
      case "italiano":
        return lowerName.includes("italiano") || lowerName.includes("italian") || 
               lowerVicinity.includes("italiano") || lowerVicinity.includes("italian");
      case "asiatico":
        return lowerName.includes("asiático") || lowerName.includes("asian") || 
               lowerVicinity.includes("asiático") || lowerVicinity.includes("asian");
      default:
        return true;
    }
  });
}

// Filtros para destinos
function getDestinationPlacesByFilter(places: EnrichedPlace[], filter: string): EnrichedPlace[] {
  return places.filter(place => {
    const lowerName = place.name.toLowerCase();
    const lowerVicinity = place.vicinity?.toLowerCase() || "";
    
    switch (filter) {
      case "historico":
        return lowerName.includes("histórico") || lowerName.includes("historical") || 
               lowerVicinity.includes("histórico") || lowerVicinity.includes("historical");
      case "natural":
        return lowerName.includes("natural") || lowerName.includes("nature") || 
               lowerVicinity.includes("natural") || lowerVicinity.includes("nature");
      case "cultural":
        return lowerName.includes("cultural") || lowerName.includes("culture") || 
               lowerVicinity.includes("cultural") || lowerVicinity.includes("culture");
      case "aventura":
        return lowerName.includes("aventura") || lowerName.includes("adventure") || 
               lowerVicinity.includes("aventura") || lowerVicinity.includes("adventure");
      default:
        return true;
    }
  });
}
