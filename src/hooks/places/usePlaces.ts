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
  
  // Debug: Verificar datos de búsqueda
  console.log('usePlaces - searchResult:', {
    placesCount: searchResult.places.length,
    firstPlace: searchResult.places[0],
    loading: searchResult.loading,
    apiStatus: searchResult.apiStatus
  });
  
  const filteredPlaces = usePlacesFilter(searchResult.places, config);
  
  // Debug: Verificar datos filtrados
  console.log('usePlaces - filteredPlaces:', {
    placesCount: filteredPlaces.length,
    firstPlace: filteredPlaces[0]
  });
  
  const { processedPlaces, loading: photosLoading } = usePlacesPhotos(
    filteredPlaces, 
    config.enableMultiplePhotos
  );
  
  // Debug: Verificar datos procesados
  console.log('usePlaces - processedPlaces:', {
    placesCount: processedPlaces.length,
    firstPlace: processedPlaces[0]
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
