import { useState, useEffect, useCallback, useRef } from "react";
import { usePlacesWithIA } from "../usePlacesWithIA";
import type { PlaceCategory, EnrichedPlace } from "../types";

interface UseTopRatedPlacesOptions {
  category: PlaceCategory;
  limit?: number;
  minRating?: number;
  requireDescription?: boolean;
  requirePrice?: boolean;
}

interface TopRatedPlacesState {
  places: EnrichedPlace[];
  loading: boolean;
  error: string | null;
  stats: {
    total: number;
    withDescription: number;
    withPrice: number;
    filtered: number;
  };
}

export function useTopRatedPlaces({
  category,
  limit = 20,
  minRating = 4.0,
  requireDescription = true,
  requirePrice = true
}: UseTopRatedPlacesOptions): TopRatedPlacesState {
  const [state, setState] = useState<TopRatedPlacesState>({
    places: [],
    loading: true,
    error: null,
    stats: {
      total: 0,
      withDescription: 0,
      withPrice: 0,
      filtered: 0
    }
  });

  const isProcessingRef = useRef(false);

  const { places: allPlaces, loading: baseLoading, error: baseError } = usePlacesWithIA({
    category,
    enableAI: false,
    requestedFilters: [],
    maxPlaces: limit * 2
  });

  const hasDescription = useCallback((place: EnrichedPlace): boolean => {
    return !!(
      place.editorial_summary?.overview && 
      place.editorial_summary.overview.length > 20
    );
  }, []);

  const hasPrice = useCallback((place: EnrichedPlace): boolean => {
    return !!(
      place.price_info?.level !== null && 
      place.price_info?.level !== undefined &&
      place.price_info.level > 0
    );
  }, []);

  const meetsRatingCriteria = useCallback((place: EnrichedPlace): boolean => {
    return !!(place.rating && place.rating >= minRating);
  }, [minRating]);

  useEffect(() => {
    if (baseLoading || isProcessingRef.current) {
      setState(prev => ({ ...prev, loading: true, error: null }));
      return;
    }

    const timeoutId = setTimeout(() => {
      if (isProcessingRef.current) return;

      if (baseError) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: baseError,
          places: []
        }));
        return;
      }

      if (allPlaces.length === 0) {
        setState(prev => ({
          ...prev,
          loading: false,
          places: [],
          stats: { total: 0, withDescription: 0, withPrice: 0, filtered: 0 }
        }));
        return;
      }

      isProcessingRef.current = true;

      try {
        const total = allPlaces.length;
        const withDescription = allPlaces.filter(hasDescription).length;
        const withPrice = allPlaces.filter(hasPrice).length;

        let filteredPlaces = allPlaces.filter(meetsRatingCriteria);

        if (requireDescription) {
          filteredPlaces = filteredPlaces.filter(hasDescription);
        }

        if (requirePrice) {
          filteredPlaces = filteredPlaces.filter(hasPrice);
        }

        const sortedPlaces = filteredPlaces
          .sort((a, b) => (b.rating || 0) - (a.rating || 0))
          .slice(0, limit);

        setState({
          places: sortedPlaces,
          loading: false,
          error: null,
          stats: {
            total,
            withDescription,
            withPrice,
            filtered: sortedPlaces.length
          }
        });

      } catch (error) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : "Error desconocido",
          places: []
        }));
      } finally {
        isProcessingRef.current = false;
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [
    allPlaces,
    baseLoading,
    baseError,
    hasDescription,
    hasPrice,
    meetsRatingCriteria,
    requireDescription,
    requirePrice,
    limit
  ]);

  return state;
}