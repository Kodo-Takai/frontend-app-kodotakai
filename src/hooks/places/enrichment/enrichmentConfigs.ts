// src/hooks/places/enrichment/enrichmentConfigs.ts
import type { PlaceCategory } from "../types";

// Configuración de campos de Google Places Details API
export interface EnrichmentConfig {
  fields: string[];
  language: string;
  region: string;
  sessionToken?: string;
}

// Configuraciones específicas por tipo de lugar
export const ENRICHMENT_CONFIGS: Record<PlaceCategory, EnrichmentConfig> = {
  hotels: {
    fields: [
      "name",
      "rating",
      "formatted_address",
      "geometry",
      "place_id",
      "photos",
      "editorial_summary",
      "reviews",
      "opening_hours",
      "website",
      "formatted_phone_number",
      "international_phone_number",
      "types",
      "price_level",
      "user_ratings_total",
      "vicinity",
      "business_status",
      "url", // URL de Google Maps
      "utc_offset_minutes", // Zona horaria (actualizado)
      "wheelchair_accessible_entrance", // Accesibilidad
      "serves_wine", // Servicios
      "serves_breakfast"
    ],
    language: "es",
    region: "PE"
  },
  restaurants: {
    fields: [
      "name",
      "rating",
      "formatted_address",
      "geometry",
      "place_id",
      "photos",
      "editorial_summary",
      "reviews",
      "opening_hours",
      "website",
      "formatted_phone_number",
      "types",
      "price_level", // Nivel de precios 0-4
      "user_ratings_total",
      "vicinity",
      "business_status",
      "url", // URL de Google Maps
      "utc_offset_minutes", // Zona horaria
      "wheelchair_accessible_entrance", // Accesibilidad
      "serves_wine", // Servicios
      "serves_breakfast"
    ],
    language: "es",
    region: "PE"
  },
  beaches: {
    fields: [
      "name",
      "rating",
      "formatted_address",
      "geometry",
      "place_id",
      "photos",
      "editorial_summary",
      "reviews",
      "opening_hours",
      "website",
      "formatted_phone_number",
      "types",
      "user_ratings_total",
      "vicinity",
      "business_status"
    ],
    language: "es",
    region: "PE"
  },
  destinations: {
    fields: [
      "name",
      "rating",
      "formatted_address",
      "geometry",
      "place_id",
      "photos",
      "editorial_summary",
      "reviews",
      "opening_hours",
      "website",
      "formatted_phone_number",
      "types",
      "user_ratings_total",
      "vicinity",
      "business_status"
    ],
    language: "es",
    region: "PE"
  },
  all: {
    fields: [
      "name",
      "rating",
      "formatted_address",
      "geometry",
      "place_id",
      "photos",
      "editorial_summary",
      "reviews",
      "opening_hours",
      "website",
      "formatted_phone_number",
      "types",
      "user_ratings_total",
      "vicinity",
      "business_status"
    ],
    language: "es",
    region: "PE"
  }
};

// Factory para crear configuraciones de enriquecimiento
export class EnrichmentConfigFactory {
  static createConfig(
    category: PlaceCategory,
    customOptions: Partial<EnrichmentConfig> = {}
  ): EnrichmentConfig {
    const baseConfig = ENRICHMENT_CONFIGS[category];
    
    if (!baseConfig) {
      const fallbackConfig = ENRICHMENT_CONFIGS['all'];
      if (!fallbackConfig) {
        throw new Error(`Neither '${category}' nor 'all' category found in ENRICHMENT_CONFIGS`);
      }
      return {
        fields: customOptions.fields || fallbackConfig.fields,
        language: customOptions.language || fallbackConfig.language,
        region: customOptions.region || fallbackConfig.region,
        sessionToken: customOptions.sessionToken
      };
    }
    
    return {
      fields: customOptions.fields || baseConfig.fields,
      language: customOptions.language || baseConfig.language,
      region: customOptions.region || baseConfig.region,
      sessionToken: customOptions.sessionToken || baseConfig.sessionToken
    };
  }
}

// Configuración de rate limiting para Google Places API
export const RATE_LIMIT_CONFIG = {
  maxRequestsPerSecond: 10,
  maxRequestsPerDay: 100000,
  retryDelay: 1000, // 1 segundo
  maxRetries: 3
};

// Configuración de cache
export const CACHE_CONFIG = {
  ttl: 3600000, // 1 hora en milisegundos
  maxSize: 1000, // Máximo 1000 lugares en cache
  enabled: true
};

// Configuración de IA
export const AI_CONFIG = {
  endpoint: import.meta.env.VITE_AI_ENDPOINT || "http://localhost:8000/api/hotels/analyze",
  timeout: 30000, // 30 segundos
  retryAttempts: 3,
  retryDelay: 2000 // 2 segundos
};
