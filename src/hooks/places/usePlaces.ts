// src/hooks/places/usePlaces.ts - Hook principal que combina todo
import { usePlacesSearch } from "./search/usePlacesSearch";
import { usePlacesFilter } from "./filter/usePlacesFilter";
import { usePlacesPhotos } from "./photos/usePlacesPhotos";
import { CategoryConfigFactory } from "./categories/categoryConfigs";
import type { UsePlacesOptions, PlacesState } from "./types";

// Hook principal que combina todos los hooks base
export function usePlaces(options: UsePlacesOptions = {}) {
  // Crear configuración usando Factory Pattern
  const config = CategoryConfigFactory.createConfig(
    options.category || "all",
    options
  );

  // Usar hooks base
  const searchResult = usePlacesSearch(config);

  const filteredPlaces = usePlacesFilter(searchResult.places, config);

  const { processedPlaces, loading: photosLoading } = usePlacesPhotos(
    filteredPlaces,
    config.enableMultiplePhotos
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
