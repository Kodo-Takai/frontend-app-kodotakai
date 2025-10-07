import type { PlaceCategory } from "../types";

export interface CategoryConfig {
  searchQueries: string[];
  type: string;
  minRating: number;
  enableMultiplePhotos: boolean;
  radius: number;
  defaultLimit: number;
}

export const CATEGORY_CONFIGS: Record<PlaceCategory, CategoryConfig> = {
  beaches: {
    searchQueries: ["playa", "playas"],
    type: "natural_feature",
    minRating: 3.0,
    enableMultiplePhotos: true,
    radius: 20000,
    defaultLimit: 6,
  },
  restaurants: {
    searchQueries: ["restaurant", "menu", "restaurante"],
    type: "restaurant",
    minRating: 4.0,
    enableMultiplePhotos: true,
    radius: 5000,
    defaultLimit: 8,
  },
  hotels: {
    searchQueries: ["hotel", "hospedaje", "hostal"],
    type: "lodging",
    minRating: 3.5,
    enableMultiplePhotos: true,
    radius: 10000,
    defaultLimit: 6,
  },
  destinations: {
    searchQueries: ["lugar turístico", "destino", "atracción", "sitio de interés", "tourist"],
    type: "tourist_attraction",
    minRating: 4.0,
    enableMultiplePhotos: true,
    radius: 3000,
    defaultLimit: 6,
  },
  tourist_attraction: {
    searchQueries: ["lugar turístico", "destino", "atracción", "sitio de interés", "tourist"],
    type: "tourist_attraction",
    minRating: 4.0,
    enableMultiplePhotos: true,
    radius: 3000,
    defaultLimit: 6,
  },
  all: {
    searchQueries: ["restaurant", "hotel", "shopping", "attraction", "tourist"],
    type: "establishment",
    minRating: 2.0,
    enableMultiplePhotos: false,
    radius: 5000,
    defaultLimit: 15,
  },
};

export class CategoryConfigFactory {
  static getConfig(category: PlaceCategory): CategoryConfig {
    return CATEGORY_CONFIGS[category] || CATEGORY_CONFIGS.all;
  }

  static getSearchQueries(category: PlaceCategory): string[] {
    return this.getConfig(category).searchQueries;
  }

  static getGoogleType(category: PlaceCategory): string {
    return this.getConfig(category).type;
  }

  static getMinRating(category: PlaceCategory): number {
    return this.getConfig(category).minRating;
  }

  static shouldEnableMultiplePhotos(category: PlaceCategory): boolean {
    return this.getConfig(category).enableMultiplePhotos;
  }

  static getRadius(category: PlaceCategory): number {
    return this.getConfig(category).radius;
  }
}

export function getCategoryConfig(category: keyof typeof CATEGORY_CONFIGS) {
  return CATEGORY_CONFIGS[category];
}

export function filterByKeywords(places: any[], keywords: string[]): any[] {
  return places.filter(place => {
    const name = place.name?.toLowerCase() || "";
    const vicinity = place.vicinity?.toLowerCase() || "";
    const address = place.formatted_address?.toLowerCase() || "";
    
    return keywords.some(keyword => 
      name.includes(keyword) || 
      vicinity.includes(keyword) || 
      address.includes(keyword)
    );
  });
}