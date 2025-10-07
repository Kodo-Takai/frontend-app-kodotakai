import { useState, useCallback, useMemo } from "react";
import type { EnrichedPlace, AIAnalysis } from "../types";
import { AI_CONFIG } from "../enrichment/enrichmentConfigs";

export interface AIDataInput {
  location: {
    lat: number;
    lng: number;
  };
  places: EnrichedPlace[];
  requestedFilters: string[];
  timestamp: string;
}

export interface AIResponse {
  filtered_places: Record<string, EnrichedPlace[]>;
  confidence_scores: Record<string, number>;
  processing_time: number;
  timestamp: string;
}

export interface AIServiceConfig {
  endpoint: string;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
}

export class AIService {
  private config: AIServiceConfig;
  private cache: Map<string, AIResponse> = new Map();

  constructor(config: Partial<AIServiceConfig> = {}) {
    this.config = {
      endpoint: AI_CONFIG.endpoint,
      timeout: AI_CONFIG.timeout,
      retryAttempts: AI_CONFIG.retryAttempts,
      retryDelay: AI_CONFIG.retryDelay,
      ...config
    };
  }

  async analyzePlaces(
    places: EnrichedPlace[],
    requestedFilters: string[],
    location: { lat: number; lng: number }
  ): Promise<AIResponse> {
    try {
      const cacheKey = this.createCacheKey(places, requestedFilters, location);
      
      if (this.cache.has(cacheKey)) {
        const cached = this.cache.get(cacheKey);
        if (cached && this.isCacheValid(cached)) {
          return cached;
        }
      }

      const aiData: AIDataInput = {
        location,
        places: this.preparePlacesForAI(places),
        requestedFilters,
        timestamp: new Date().toISOString()
      };

      const response = await this.sendToAIWithRetry(aiData);
      this.cache.set(cacheKey, response);
      
      return response;

    } catch (error) {
      console.error("Error in AI service:", error);
      throw new Error(`AI service error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private preparePlacesForAI(places: EnrichedPlace[]): EnrichedPlace[] {
    return places.map(place => ({
      ...place,
      name: place.name,
      rating: place.rating,
      formatted_address: place.formatted_address,
      editorial_summary: place.editorial_summary,
      reviews: place.reviews?.slice(0, 10),
      amenities: place.amenities,
      services: place.services,
      lodging_info: place.lodging_info,
      contact_info: place.contact_info
    }));
  }

  private async sendToAIWithRetry(data: AIDataInput): Promise<AIResponse> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.config.retryAttempts; attempt++) {
      try {
        const response = await this.sendToAI(data);
        return response;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        
        if (attempt < this.config.retryAttempts) {
          await this.delay(this.config.retryDelay * attempt);
        }
      }
    }

    throw lastError || new Error('Max retry attempts reached');
  }

  private async sendToAI(data: AIDataInput): Promise<AIResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(this.config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (!this.isValidAIResponse(result)) {
        throw new Error('Invalid AI response format');
      }

      return result;

    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  private isValidAIResponse(response: any): response is AIResponse {
    return (
      response &&
      typeof response === 'object' &&
      'filtered_places' in response &&
      'confidence_scores' in response &&
      'processing_time' in response &&
      'timestamp' in response
    );
  }

  private createCacheKey(
    places: EnrichedPlace[],
    filters: string[],
    location: { lat: number; lng: number }
  ): string {
    const placesIds = places.map(p => p.place_id).sort().join(',');
    const filtersStr = filters.sort().join(',');
    const locationStr = `${location.lat.toFixed(4)},${location.lng.toFixed(4)}`;
    
    return `${placesIds}_${filtersStr}_${locationStr}`;
  }

  private isCacheValid(response: AIResponse): boolean {
    const cacheAge = Date.now() - new Date(response.timestamp).getTime();
    return cacheAge < 300000;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  clearCache(): void {
    this.cache.clear();
  }

  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

export function useAIService(config?: Partial<AIServiceConfig>) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const aiService = useMemo(() => new AIService(config), [config]);

  const analyzePlaces = useCallback(async (
    places: EnrichedPlace[],
    requestedFilters: string[],
    location: { lat: number; lng: number }
  ): Promise<AIResponse> => {
    setLoading(true);
    setError(null);

    try {
      const response = await aiService.analyzePlaces(places, requestedFilters, location);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [aiService]);

  const clearCache = useCallback(() => {
    aiService.clearCache();
  }, [aiService]);

  const getCacheStats = useCallback(() => {
    return aiService.getCacheStats();
  }, [aiService]);

  return {
    analyzePlaces,
    clearCache,
    getCacheStats,
    loading,
    error
  };
}