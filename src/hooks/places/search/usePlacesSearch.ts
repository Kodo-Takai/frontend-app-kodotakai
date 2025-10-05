// src/hooks/places/search/usePlacesSearch.ts
import { useState, useEffect } from "react";
import type { UsePlacesOptions, PlacesState } from "../types";
import { useGoogleMaps } from "../base/useGoogleMaps";
import { useGeolocation } from "../base/useGeolocation";
import { 
  NearbySearchStrategy, 
  TextSearchStrategy, 
  CombinedSearchStrategy 
} from "./searchStrategies";

export function usePlacesSearch(options: UsePlacesOptions = {}) {
  const [state, setState] = useState<PlacesState>({
    places: [],
    loading: true,
    error: null,
    apiStatus: "Inicializando..."
  });

  const { isLoaded: mapsLoaded, error: mapsError } = useGoogleMaps();
  const { location, loading: locationLoading, error: locationError } = useGeolocation(options.fallbackLocation);

  useEffect(() => {
    let cancelled = false;

    async function performSearch() {
      console.log('usePlacesSearch - performSearch iniciado:', {
        mapsLoaded,
        location,
        options: options.searchMethod
      });
      
      if (!mapsLoaded || !location) {
        console.log('usePlacesSearch - Condiciones no cumplidas:', { mapsLoaded, location });
        return;
      }

      try {
        setState(prev => ({ ...prev, apiStatus: "Buscando lugares...", loading: true }));

        // Crear estrategias de búsqueda
        const nearbyStrategy = new NearbySearchStrategy();
        const textStrategy = new TextSearchStrategy();
        const combinedStrategy = new CombinedSearchStrategy(nearbyStrategy, textStrategy);

        let results: any[] = [];

        // Aplicar estrategia según el método de búsqueda
        console.log('usePlacesSearch - Aplicando estrategia:', options.searchMethod);
        
        switch (options.searchMethod) {
          case "nearby":
            console.log('usePlacesSearch - Ejecutando NearbySearchStrategy');
            results = await nearbyStrategy.search(location, options);
            break;
          case "text":
            console.log('usePlacesSearch - Ejecutando TextSearchStrategy');
            results = await textStrategy.search(location, options);
            break;
          case "both":
          default:
            console.log('usePlacesSearch - Ejecutando CombinedSearchStrategy');
            results = await combinedStrategy.search(location, options);
            break;
        }
        
        console.log('usePlacesSearch - Resultados obtenidos:', results.length);

        if (cancelled) return;

        setState(prev => ({
          ...prev,
          places: results,
          loading: false,
          apiStatus: `Encontrados ${results.length} lugares`
        }));

      } catch (error) {
        if (!cancelled) {
          setState(prev => ({
            ...prev,
            loading: false,
            error: error instanceof Error ? error.message : "Error desconocido",
            apiStatus: "Error en la búsqueda"
          }));
        }
      }
    }

    performSearch();

    return () => {
      cancelled = true;
    };
  }, [mapsLoaded, location, options.searchMethod, options.radius, options.type, JSON.stringify(options.searchQueries)]);

  // Manejar errores de dependencias
  useEffect(() => {
    if (mapsError) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: `Error cargando Google Maps: ${mapsError}`,
        apiStatus: "Error de API"
      }));
    }
  }, [mapsError]);

  useEffect(() => {
    if (locationError) {
      setState(prev => ({
      ...prev,
      loading: false,
      error: `Error de geolocalización: ${locationError}`,
      apiStatus: "Usando ubicación por defecto"
    }));
    }
  }, [locationError]);

  return {
    ...state,
    location,
    isLocationLoading: locationLoading
  };
}
