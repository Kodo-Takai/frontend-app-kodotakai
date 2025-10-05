// src/hooks/places/filter/filterFactory.ts
import type { FilterStrategy } from "../types";
import {
  RatingFilterStrategy,
  CategoryFilterStrategy,
  CustomFilterStrategy,
  DeduplicationFilterStrategy,
  SortingFilterStrategy,
  LimitFilterStrategy
} from "./filterStrategies";

// Factory Pattern: Crear estrategias de filtrado según configuración
export class FilterFactory {
  static createFilterChain(options: any): FilterStrategy[] {
    const filters: FilterStrategy[] = [];

    // Siempre aplicar filtro de rating si está especificado
    if (options.minRating !== undefined) {
      filters.push(new RatingFilterStrategy());
    }

    // Aplicar filtro de categoría si está especificado
    if (options.category && options.category !== "all") {
      filters.push(new CategoryFilterStrategy());
    }

    // Aplicar filtros personalizados si existen
    if (options.customFilters) {
      filters.push(new CustomFilterStrategy());
    }

    // Siempre aplicar deduplicación
    filters.push(new DeduplicationFilterStrategy());

    // Siempre aplicar ordenamiento por rating
    filters.push(new SortingFilterStrategy());

    // Aplicar límite si está especificado
    if (options.limit) {
      filters.push(new LimitFilterStrategy());
    }

    return filters;
  }
}

// Chain of Responsibility Pattern: Aplicar filtros en secuencia
export class FilterChain {
  private filters: FilterStrategy[];

  constructor(filters: FilterStrategy[]) {
    this.filters = filters;
  }

  apply(places: any[], options: any): any[] {
    return this.filters.reduce((filteredPlaces, filter) => {
      return filter.filter(filteredPlaces, options);
    }, places);
  }
}
