// src/hooks/places/categories/useHotelsTopRated.ts
import { usePlaces } from "../usePlaces";
import type { UsePlacesOptions } from "../types";

export function useHotelsTopRated(customOptions: Partial<UsePlacesOptions> = {}) {
  const { places: allHotels, loading, error, status } = usePlaces({
    category: "hotels",
    enableEnrichment: true,
    maxResults: customOptions.limit || 20 
  });

  // Filtrar solo hoteles con rating 4.5+
  const topRatedHotels = allHotels.filter(place => (place.rating || 0) >= 4.5);

  return {
    places: topRatedHotels,
    loading,
    error,
    status,
    apiStatus: "ready"
  };
}