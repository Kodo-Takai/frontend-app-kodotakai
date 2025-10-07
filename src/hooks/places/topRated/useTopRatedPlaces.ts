import { useState, useEffect, useMemo } from "react";
import { usePlaces } from "../usePlaces";
import type { PlaceCategory, EnrichedPlace } from "../types";

interface UseTopRatedPlacesOptions {
  category: PlaceCategory;
  limit?: number;
  minRating?: number;
}

interface TopRatedPlacesState {
  places: EnrichedPlace[];
  loading: boolean;
  error: string | null;
}

/**
 * Hook optimizado para obtener lugares mejor valorados
 * Usa usePlaces directamente y filtra por rating mínimo
 */
export function useTopRatedPlaces({
  category,
  limit = 20,
  minRating = 4.0
}: UseTopRatedPlacesOptions): TopRatedPlacesState {
  const { places: allPlaces, loading, error } = usePlaces({
    category,
    enableEnrichment: true,
    maxResults: limit * 2
  });

  const places = useMemo(() => {
    if (!allPlaces.length) return [];
    
    return allPlaces
      .filter(place => place.rating && place.rating >= minRating)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, limit);
  }, [allPlaces, minRating, limit]);

  return {
    places,
    loading,
    error
  };
}