// src/hooks/places/filter/usePlacesFilter.ts
import { useMemo } from "react";
import type { UsePlacesOptions } from "../types";
import { FilterFactory, FilterChain } from "./filterFactory";

export function usePlacesFilter(places: any[], options: UsePlacesOptions) {
  const filteredPlaces = useMemo(() => {
    if (!places.length) return [];

    // Crear cadena de filtros usando Factory Pattern
    const filterChain = new FilterChain(
      FilterFactory.createFilterChain(options)
    );

    // Aplicar todos los filtros en secuencia
    return filterChain.apply(places, options);
  }, [places, options.minRating, options.category, options.customFilters, options.limit]);

  return filteredPlaces;
}
