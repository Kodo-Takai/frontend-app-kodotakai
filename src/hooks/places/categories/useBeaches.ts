// src/hooks/places/categories/useBeaches.ts
import { usePlacesSearch } from "../search/usePlacesSearch";
import { usePlacesFilter } from "../filter/usePlacesFilter";
import { usePlacesPhotos } from "../photos/usePlacesPhotos";
import { CategoryConfigFactory } from "./categoryConfigs";
import type { UsePlacesOptions, PlacesState } from "../types";

// Hook específico para playas
export function useBeaches(customOptions: Partial<UsePlacesOptions> = {}) {
  // Crear configuración específica para playas
  const options = CategoryConfigFactory.createConfig("beaches", {
    minRating: 3.0,
    enableMultiplePhotos: true,
    ...customOptions,
  });

  // Debug: Log de configuración
  console.log("🏖️ useBeaches - Configuración:", options);

  // Usar hooks base
  const searchResult = usePlacesSearch(options);
  const filteredPlaces = usePlacesFilter(searchResult.places, options);
  const { processedPlaces, loading: photosLoading } = usePlacesPhotos(
    filteredPlaces, 
    options.enableMultiplePhotos
  );

  // Debug: Log de resultados
  console.log("🏖️ useBeaches - Resultados:", {
    searchPlaces: searchResult.places.length,
    filteredPlaces: filteredPlaces.length,
    processedPlaces: processedPlaces.length,
    loading: searchResult.loading || photosLoading,
    error: searchResult.error
  });

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