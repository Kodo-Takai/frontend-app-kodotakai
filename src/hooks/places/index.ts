// src/hooks/places/index.ts - Barrel exports
export * from "./types";
export * from "./base/useGoogleMaps";
export * from "./base/useGeolocation";
export * from "./search/usePlacesSearch";
export * from "./filter/usePlacesFilter";
export * from "./photos/usePlacesPhotos";

// Hooks específicos por categoría
export { useHotelsTopRated } from "./categories/useHotelsTopRated";
export { useDestinations } from "./categories/useDestinations";
export { useBeaches } from "./categories/useBeaches";
export { useRestaurants } from "./categories/useRestaurants";

// Hook principal que combina todo (para compatibilidad) - ELIMINADO (redundante)

// Hooks de enriquecimiento y IA
export { usePlacesEnrichment } from "./enrichment/usePlacesEnrichment";
export { useReviewsProcessor } from "./processors/reviewsProcessor";
export { useAmenitiesProcessor } from "./processors/amenitiesProcessor";
export { useAIService } from "./ai/useAIService";
export { usePlacesWithIA } from "./usePlacesWithIA";
export { useIntelligentFilters } from "./filters/useIntelligentFilters";

// Hook principal (recomendado)
export { usePlaces } from "./usePlaces";

// Hook genérico para todas las categorías con filtros
export { usePlacesWithFilters } from "./usePlacesWithFilters";

// Hook para destinos mejor valorados
export { useTopRatedPlaces } from "./topRated/useTopRatedPlaces";
