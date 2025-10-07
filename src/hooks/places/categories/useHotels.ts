// src/hooks/places/categories/useHotels.ts
import { usePlaces } from "../usePlaces";
import type { UsePlacesOptions } from "../types";

/**
 * Hook especializado para hoteles
 * Usa usePlaces con configuración optimizada para hoteles
 */
export function useHotels(customOptions: Partial<UsePlacesOptions> = {}) {
  const { places, loading, error, status } = usePlaces({
    category: "hotels",
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
