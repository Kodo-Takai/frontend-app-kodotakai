import type { FilterStrategy } from "../types";
import {
  RatingFilterStrategy,
  CategoryFilterStrategy,
  CustomFilterStrategy,
  DeduplicationFilterStrategy,
  SortingFilterStrategy,
  LimitFilterStrategy
} from "./filterStrategies";

export class FilterFactory {
  static createFilterChain(options: any): FilterStrategy[] {
    const filters: FilterStrategy[] = [];

    if (options.minRating !== undefined) {
      filters.push(new RatingFilterStrategy());
    }

    if (options.category && options.category !== "all") {
      filters.push(new CategoryFilterStrategy());
    }

    if (options.customFilters) {
      filters.push(new CustomFilterStrategy());
    }

    filters.push(new DeduplicationFilterStrategy());
    filters.push(new SortingFilterStrategy());

    if (options.limit) {
      filters.push(new LimitFilterStrategy());
    }

    return filters;
  }
}

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
