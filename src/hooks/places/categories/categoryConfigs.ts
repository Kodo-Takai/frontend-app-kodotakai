// src/hooks/places/categories/categoryConfigs.ts
import type { UsePlacesOptions, PlaceCategory } from "../types";

// Configuration Pattern: Configuraciones específicas por categoría
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
    searchQueries: ["playa", "beach", "costa", "litoral"],
    type: "establishment",
    minRating: 3.0,
    enableMultiplePhotos: true,
    radius: 50000,
    defaultLimit: 6,
  },
  restaurants: {
    searchQueries: ["restaurant", "menu", "restaurante"],
    type: "restaurant",
    minRating: 4.0,
    enableMultiplePhotos: true,
    radius: 20000,
    defaultLimit: 8,
  },
  hotels: {
    searchQueries: ["hotel", "hospedaje", "hostal", "motel", "lodging"],
    type: "lodging",
    minRating: 3.5,
    enableMultiplePhotos: true,
    radius: 30000,
    defaultLimit: 6,
  },
  destinations: {
    searchQueries: ["lugar turístico", "destino", "atracción", "sitio de interés"],
    type: "tourist_attraction",
    minRating: 4.0,
    enableMultiplePhotos: true,
    radius: 15000,
    defaultLimit: 6,
  },
  all: {
    searchQueries: ["restaurant", "hotel", "shopping", "attraction", "tourist"],
    type: "establishment",
    minRating: 2.0,
    enableMultiplePhotos: false,
    radius: 15000,
    defaultLimit: 15,
  },
};

// Factory para crear configuraciones personalizadas
export class CategoryConfigFactory {
  static createConfig(category: PlaceCategory, customOptions: Partial<UsePlacesOptions> = {}): UsePlacesOptions {
    const baseConfig = CATEGORY_CONFIGS[category];
    
    // Validar que la configuración existe
    if (!baseConfig) {
      console.error(`Category '${category}' not found in CATEGORY_CONFIGS. Available categories:`, Object.keys(CATEGORY_CONFIGS));
      // Fallback a 'all' si la categoría no existe
      const fallbackConfig = CATEGORY_CONFIGS['all'];
      if (!fallbackConfig) {
        throw new Error(`Neither '${category}' nor 'all' category found in CATEGORY_CONFIGS`);
      }
      return {
        category: 'all',
        searchQueries: customOptions.searchQueries || fallbackConfig.searchQueries,
        type: customOptions.type || fallbackConfig.type,
        minRating: customOptions.minRating ?? fallbackConfig.minRating,
        enableMultiplePhotos: customOptions.enableMultiplePhotos ?? fallbackConfig.enableMultiplePhotos,
        radius: customOptions.radius ?? fallbackConfig.radius,
        limit: customOptions.limit ?? fallbackConfig.defaultLimit,
        searchMethod: customOptions.searchMethod || "both",
        fallbackLocation: customOptions.fallbackLocation,
        customFilters: customOptions.customFilters,
      };
    }
    
    return {
      category,
      searchQueries: customOptions.searchQueries || baseConfig.searchQueries,
      type: customOptions.type || baseConfig.type,
      minRating: customOptions.minRating ?? baseConfig.minRating,
      enableMultiplePhotos: customOptions.enableMultiplePhotos ?? baseConfig.enableMultiplePhotos,
      radius: customOptions.radius ?? baseConfig.radius,
      limit: customOptions.limit ?? baseConfig.defaultLimit,
      searchMethod: customOptions.searchMethod || "both",
      fallbackLocation: customOptions.fallbackLocation,
      customFilters: customOptions.customFilters,
    };
  }
}
