// src/hooks/places/filter/filterStrategies.ts
import type { UsePlacesOptions, FilterStrategy } from "../types";

// Strategy Pattern: Diferentes estrategias de filtrado
export class RatingFilterStrategy implements FilterStrategy {
  filter(places: any[], options: UsePlacesOptions): any[] {
    const minRating = options.minRating || 0;
    return places.filter(place => (place.rating ?? 0) >= minRating);
  }
}

export class CategoryFilterStrategy implements FilterStrategy {
  private isBeach = (place: any): boolean => {
    const name = place.name?.toLowerCase() || "";
    return name.startsWith("playa");
  };

  private isRestaurant = (place: any): boolean => {
    const types = place.types || [];
    return (
      types.includes("restaurant") ||
      types.includes("comedor") ||
      types.includes("fonda") ||
      types.includes("parador")
    );
  };

  filter(places: any[], options: UsePlacesOptions): any[] {
    switch (options.category) {
      case "beaches":
        return places.filter(this.isBeach);
      case "restaurants":
        return places.filter(this.isRestaurant);
      default:
        return places;
    }
  }
}

export class CustomFilterStrategy implements FilterStrategy {
  filter(places: any[], options: UsePlacesOptions): any[] {
    if (!options.customFilters) return places;
    return places.filter(options.customFilters);
  }
}

export class DeduplicationFilterStrategy implements FilterStrategy {
  filter(places: any[], _options: UsePlacesOptions): any[] {
    const uniqueResults = new Map();
    places.forEach((place) => {
      const key = place.place_id || place.name;
      if (!uniqueResults.has(key)) {
        uniqueResults.set(key, place);
      }
    });
    return Array.from(uniqueResults.values());
  }
}

export class SortingFilterStrategy implements FilterStrategy {
  filter(places: any[], _options: UsePlacesOptions): any[] {
    return places.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
  }
}

export class LimitFilterStrategy implements FilterStrategy {
  filter(places: any[], options: UsePlacesOptions): any[] {
    const limit = options.limit || 5;
    return places.slice(0, limit);
  }
}
