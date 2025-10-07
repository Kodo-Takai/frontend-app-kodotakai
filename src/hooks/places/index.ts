// src/hooks/places/index.ts - Barrel exports
export * from "./types";
export * from "./base/useGoogleMaps";
export * from "./base/useGeolocation";
export * from "./search/usePlacesSearch";
export * from "./filter/usePlacesFilter";
export * from "./photos/usePlacesPhotos";

// Hooks específicos por categoría
export { useHotels } from "./categories/useHotels";
export { useHotelsTopRated } from "./categories/useHotelsTopRated";
export { useDestinations } from "./categories/useDestinations";
export { useBeaches } from "./categories/useBeaches";
export { useRestaurants } from "./categories/useRestaurants";

// Configuraciones de categorías
export { CATEGORY_CONFIGS, getCategoryConfig, filterByKeywords } from "./categories/categoryConfigs";

// Hook principal que combina todo (para compatibilidad) - ELIMINADO (redundante)

// Hooks de enriquecimiento y IA
export { usePlacesEnrichment } from "./enrichment/usePlacesEnrichment"; // Mantener para casos especiales
export { useReviewsProcessor } from "./processors/reviewsProcessor";
export { useAmenitiesProcessor } from "./processors/amenitiesProcessor";
export { useAIService } from "./ai/useAIService";
export { useIntelligentFilters } from "./filters/useIntelligentFilters";

// Hook principal con datos detallados (recomendado) - SIEMPRE ENRIQUECIDO
export { usePlaces } from "./usePlaces";

// Hook con IA para filtros avanzados - USA usePlaces ENRIQUECIDO
export { usePlacesWithIA } from "./usePlacesWithIA";

// Hook para destinos mejor valorados
export { useTopRatedPlaces } from "./topRated/useTopRatedPlaces";
