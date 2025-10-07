import { useState, useEffect, useCallback } from "react";
import type { EnrichedPlace, PlaceCategory, AIAnalysis } from "./types";
import { useAIService } from "./ai/useAIService";
import { usePlaces } from "./usePlaces";

export interface PlacesWithIAOptions {
  category: PlaceCategory;
  searchQuery?: string;
  requestedFilters: string[];
  enableAI?: boolean;
  maxPlaces?: number;
}

export function usePlacesWithIA(options: PlacesWithIAOptions) {
  const {
    category,
    searchQuery,
    requestedFilters,
    enableAI = false,
    maxPlaces = 20
  } = options;

  const [filteredPlaces, setFilteredPlaces] = useState<Record<string, EnrichedPlace[]>>({});
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const { places, loading, error } = usePlaces({
    category,
    searchQuery,
    enableEnrichment: true,
    maxResults: maxPlaces
  });

  const { analyzePlaces } = useAIService();

  useEffect(() => {
    if (!enableAI || !places.length) {
      setFilteredPlaces({});
      setAiAnalysis(null);
      return;
    }

    const processWithAI = async () => {
      setAiLoading(true);
      try {
        const analysis = await analyzePlaces(places, requestedFilters, { lat: -12.0464, lng: -77.0428 });
        
        if (analysis) {
          const filtered: Record<string, EnrichedPlace[]> = {};
          
          requestedFilters.forEach(filter => {
            filtered[filter] = places.filter(place => {
              return place.rating && place.rating >= 4.0;
            });
          });

          setFilteredPlaces(filtered);
          setAiAnalysis(analysis as unknown as AIAnalysis);
        }
      } catch (error) {
        console.error("Error in AI processing:", error);
      } finally {
        setAiLoading(false);
      }
    };

    processWithAI();
  }, [enableAI, places.length, JSON.stringify(requestedFilters)]);

  const getFilteredPlaces = useCallback((filter: string): EnrichedPlace[] => {
    return filteredPlaces[filter] || [];
  }, [filteredPlaces]);

  return {
    places,
    filteredPlaces,
    loading: loading || aiLoading,
    error,
    aiAnalysis,
    getFilteredPlaces
  };
}