import type { PlaceCategory } from "../types";

export interface EnrichmentConfig {
  fields: string[];
  language: string;
  region: string;
  sessionToken?: string;
}

// Campos comunes para todas las categorías
const COMMON_FIELDS = [
  "name", "rating", "formatted_address", "geometry", "place_id", "photos",
  "editorial_summary", "reviews", "opening_hours", "website", "formatted_phone_number",
  "types", "user_ratings_total", "vicinity", "business_status"
];

// Campos específicos para hoteles
const HOTEL_SPECIFIC_FIELDS = [
  "international_phone_number", "price_level", "url", "utc_offset_minutes",
  "wheelchair_accessible_entrance", "curbside_pickup", "delivery", "dine_in",
  "takeout", "reservable", "serves_breakfast", "serves_lunch", "serves_dinner",
  "serves_beer", "serves_wine", "serves_brunch", "serves_vegetarian_food"
];

// Campos específicos para restaurantes
const RESTAURANT_SPECIFIC_FIELDS = ["price_level", "url", "utc_offset_minutes"];

// Configuración base común
const BASE_CONFIG = { language: "es", region: "PE" } as const;

// Configuraciones de enriquecimiento optimizadas
export const ENRICHMENT_CONFIGS: Record<PlaceCategory, EnrichmentConfig> = {
  hotels: {
    ...BASE_CONFIG,
    fields: [...COMMON_FIELDS, ...HOTEL_SPECIFIC_FIELDS],
  },
  restaurants: {
    ...BASE_CONFIG,
    fields: [...COMMON_FIELDS, ...RESTAURANT_SPECIFIC_FIELDS],
  },
  beaches: { ...BASE_CONFIG, fields: COMMON_FIELDS },
  destinations: { ...BASE_CONFIG, fields: COMMON_FIELDS },
  tourist_attraction: { ...BASE_CONFIG, fields: COMMON_FIELDS },
  discos: { ...BASE_CONFIG, fields: COMMON_FIELDS },
  estudiar: { ...BASE_CONFIG, fields: COMMON_FIELDS },
  parques: { ...BASE_CONFIG, fields: COMMON_FIELDS },
  all: { ...BASE_CONFIG, fields: COMMON_FIELDS },
};

// Factory para configuraciones de enriquecimiento
export class EnrichmentConfigFactory {
  static createConfig(
    category: PlaceCategory,
    customOptions: Partial<EnrichmentConfig> = {}
  ): EnrichmentConfig {
    const baseConfig = ENRICHMENT_CONFIGS[category] || ENRICHMENT_CONFIGS.all;
    return { ...baseConfig, ...customOptions };
  }
}

// Configuraciones de límites y caché
export const RATE_LIMIT_CONFIG = {
  maxRequestsPerSecond: 10,
  maxRequestsPerDay: 100000,
  retryDelay: 1000,
  maxRetries: 3,
};

export const CACHE_CONFIG = {
  ttl: 3600000, // 1 hora
  maxSize: 1000,
  enabled: true,
};

// Configuración de IA
export const AI_CONFIG = {
  endpoint: import.meta.env.VITE_AI_ENDPOINT || "http://localhost:8000/api/hotels/analyze",
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 2000,
};
