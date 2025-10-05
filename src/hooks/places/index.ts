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

// Hook principal que combina todo (para compatibilidad)
export { usePlaces } from "./usePlaces";
