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
  minRating = 4.0,
}: UseTopRatedPlacesOptions): TopRatedPlacesState {
  const {
    places: allPlaces,
    loading,
    error,
  } = usePlaces({
    category,
    enableEnrichment: true,
    maxResults: Math.max(limit * 3, 30),
  });

  const places = useMemo(() => {
    if (!allPlaces.length) return [];

    return allPlaces
      .filter((place) => {
        const hasRating = place.rating && place.rating >= minRating;
        const hasName = place.name && place.name.length > 0;
        const hasLocation =
          place.location && place.location.lat && place.location.lng;

        return hasRating && hasName && hasLocation;
      })
      .sort((a, b) => {
        const ratingA = a.rating || 0;
        const ratingB = b.rating || 0;

        if (ratingA !== ratingB) {
          return ratingB - ratingA;
        }

        const reviewsA = a.user_ratings_total || 0;
        const reviewsB = b.user_ratings_total || 0;

        return reviewsB - reviewsA;
      })
      .slice(0, limit);
  }, [allPlaces, minRating, limit]);

  return {
    places,
    loading,
    error,
  };
}
