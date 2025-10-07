import type { PlaceCategory } from "../types";

export interface EnrichmentConfig {
  fields: string[];
  language: string;
  region: string;
  sessionToken?: string;
}

const COMMON_FIELDS = [
  "name", "rating", "formatted_address", "geometry", "place_id", "photos",
  "editorial_summary", "reviews", "opening_hours", "website", "formatted_phone_number",
  "types", "user_ratings_total", "vicinity", "business_status"
];

const HOTEL_SPECIFIC_FIELDS = [
  "international_phone_number", "price_level", "url", "utc_offset_minutes"
];

const RESTAURANT_SPECIFIC_FIELDS = [
  "price_level", "url", "utc_offset_minutes"
];

export const ENRICHMENT_CONFIGS: Record<PlaceCategory, EnrichmentConfig> = {
  hotels: {
    fields: [...COMMON_FIELDS, ...HOTEL_SPECIFIC_FIELDS],
    language: "es",
    region: "PE"
  },
  restaurants: {
    fields: [...COMMON_FIELDS, ...RESTAURANT_SPECIFIC_FIELDS],
    language: "es",
    region: "PE"
  },
  beaches: {
    fields: COMMON_FIELDS,
    language: "es",
    region: "PE"
  },
  destinations: {
    fields: COMMON_FIELDS,
    language: "es",
    region: "PE"
  },
  tourist_attraction: {
    fields: COMMON_FIELDS,
    language: "es",
    region: "PE"
  },
  all: {
    fields: COMMON_FIELDS,
    language: "es",
    region: "PE"
  }
};

export class EnrichmentConfigFactory {
  static createConfig(
    category: PlaceCategory,
    customOptions: Partial<EnrichmentConfig> = {}
  ): EnrichmentConfig {
    const baseConfig = ENRICHMENT_CONFIGS[category] || ENRICHMENT_CONFIGS['all'];
    
    return {
      fields: customOptions.fields || baseConfig.fields,
      language: customOptions.language || baseConfig.language,
      region: customOptions.region || baseConfig.region,
      sessionToken: customOptions.sessionToken || baseConfig.sessionToken
    };
  }
}

export const RATE_LIMIT_CONFIG = {
  maxRequestsPerSecond: 10,
  maxRequestsPerDay: 100000,
  retryDelay: 1000,
  maxRetries: 3
};

export const CACHE_CONFIG = {
  ttl: 3600000,
  maxSize: 1000,
  enabled: true
};


//Para poner el endpoint de la IA
export const AI_CONFIG = {
  endpoint: import.meta.env.VITE_AI_ENDPOINT || "http://localhost:8000/api/hotels/analyze",
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 2000
};