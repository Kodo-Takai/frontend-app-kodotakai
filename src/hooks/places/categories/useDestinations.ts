// src/hooks/places/categories/useDestinations.ts
import { usePlacesSearch } from "../search/usePlacesSearch";
import { usePlacesFilter } from "../filter/usePlacesFilter";
import { usePlacesPhotos } from "../photos/usePlacesPhotos";
import { CategoryConfigFactory } from "./categoryConfigs";
import type { UsePlacesOptions, PlacesState } from "../types";

// Hook específico para destinos turísticos
export function useDestinations(customOptions: Partial<UsePlacesOptions> = {}) {
  // Crear configuración específica para destinos
  const options = CategoryConfigFactory.createConfig("destinations", {
    minRating: 4.0,
    enableMultiplePhotos: true,
    ...customOptions,
  });

  // Usar hooks base
  const searchResult = usePlacesSearch(options);
  const filteredPlaces = usePlacesFilter(searchResult.places, options);
  const { processedPlaces, loading: photosLoading } = usePlacesPhotos(
    filteredPlaces, 
    options.enableMultiplePhotos
  );

  // Combinar estados
  const state: PlacesState = {
    places: processedPlaces,
    loading: searchResult.loading || photosLoading,
    error: searchResult.error,
    apiStatus: searchResult.apiStatus,
  };

  return {
    ...state,
    location: searchResult.location,
    isLocationLoading: searchResult.isLocationLoading,
  };
}
