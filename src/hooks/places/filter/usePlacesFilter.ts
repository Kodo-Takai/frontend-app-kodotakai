import { useMemo } from "react";
import type { UsePlacesOptions } from "../types";
import { FilterFactory, FilterChain } from "./filterFactory";

export function usePlacesFilter(places: any[], options: UsePlacesOptions) {
  const filteredPlaces = useMemo(() => {
    if (!places.length) return [];

    const filterChain = new FilterChain(
      FilterFactory.createFilterChain(options)
    );

    return filterChain.apply(places, options);
  }, [places, options.minRating, options.category, options.customFilters, options.limit]);

  return filteredPlaces;
}
