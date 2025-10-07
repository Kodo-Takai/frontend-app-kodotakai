// src/hooks/places/categories/useRestaurants.ts
import { usePlaces } from "../usePlaces";
import type { UsePlacesOptions } from "../types";

/**
 * Hook especializado para restaurantes
 * Usa usePlaces con configuración optimizada para restaurantes
 */
export function useRestaurants(customOptions: Partial<UsePlacesOptions> = {}) {
  const { places, loading, error, status } = usePlaces({
    category: "restaurant",
    enableEnrichment: true,
    maxResults: customOptions.limit || 6
  });

  return {
    places,
    loading,
    error,
    status,
    apiStatus: "ready"
  };
}