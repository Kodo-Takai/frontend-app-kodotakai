// src/hooks/places/processors/amenitiesProcessor.ts
import { useMemo, useCallback } from "react";
import type { EnrichedPlace, LodgingInfo } from "../types";

// Configuración de detección de amenities
export interface AmenitiesConfig {
  confidenceThreshold: number;
  keywordWeights: Record<string, number>;
  categoryMappings: Record<string, string[]>;
}

// Configuración por defecto
const DEFAULT_CONFIG: AmenitiesConfig = {
  confidenceThreshold: 0.6,
  keywordWeights: {
    // Pet friendly
    "pet friendly": 0.9,
    "mascotas": 0.9,
    "perros": 0.8,
    "gatos": 0.8,
    "animales": 0.7,
    "acepta mascotas": 0.9,
    
    // Piscina
    "piscina": 0.9,
    "pool": 0.9,
    "natación": 0.8,
    "swimming": 0.8,
    "alberca": 0.9,
    "jacuzzi": 0.8,
    
    // Lujo
    "lujo": 0.9,
    "premium": 0.8,
    "exclusivo": 0.8,
    "VIP": 0.9,
    "5 estrellas": 0.9,
    "suite": 0.7,
    "presidencial": 0.8,
    "deluxe": 0.8,
    
    // Económico
    "económico": 0.8,
    "barato": 0.7,
    "budget": 0.8,
    "accesible": 0.7,
    "hostal": 0.9,
    "pensión": 0.8,
    "albergue": 0.8,
    
    // Playa
    "playa": 0.9,
    "beach": 0.9,
    "costa": 0.8,
    "litoral": 0.8,
    "mar": 0.7,
    "oceano": 0.7,
    
    // Servicios básicos
    "wifi": 0.9,
    "internet": 0.8,
    "parking": 0.8,
    "estacionamiento": 0.8,
    "desayuno": 0.8,
    "breakfast": 0.8,
    "restaurante": 0.7,
    "comida": 0.6,
    "gym": 0.8,
    "gimnasio": 0.8,
    "spa": 0.8,
    "sauna": 0.7,
    "concierge": 0.7,
    "room service": 0.8,
    "servicio a la habitación": 0.8
  },
  categoryMappings: {
    petfriendly: ["pet friendly", "mascotas", "perros", "gatos", "animales", "acepta mascotas"],
    luxury: ["lujo", "premium", "exclusivo", "VIP", "5 estrellas", "suite", "presidencial", "deluxe"],
    economic: ["económico", "barato", "budget", "accesible", "hostal", "pensión", "albergue"],
    beach: ["playa", "beach", "costa", "litoral", "mar", "oceano"],
    pool: ["piscina", "pool", "natación", "swimming", "alberca", "jacuzzi"]
  }
};

// Clase para detectar amenities
export class AmenitiesProcessor {
  private config: AmenitiesConfig;

  constructor(config: Partial<AmenitiesConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  // Detectar amenities de un lugar
  detectAmenities(place: EnrichedPlace): AmenitiesDetection {
    const textToAnalyze = this.getTextToAnalyze(place);
    const detectedAmenities = this.analyzeText(textToAnalyze);
    const lodgingInfo = this.extractLodgingInfo(place, detectedAmenities);
    const categories = this.categorizeAmenities(detectedAmenities);

    return {
      amenities: detectedAmenities,
      lodgingInfo,
      categories,
      confidence: this.calculateConfidence(detectedAmenities, textToAnalyze)
    };
  }

  // Obtener texto para analizar
  private getTextToAnalyze(place: EnrichedPlace): string {
    const texts: string[] = [];

    // Descripción editorial
    if (place.editorial_summary?.overview) {
      texts.push(place.editorial_summary.overview);
    }

    // Reviews
    if (place.reviews) {
      const reviewTexts = place.reviews.map(review => review.text);
      texts.push(...reviewTexts);
    }

    // Información básica
    if (place.name) texts.push(place.name);
    if (place.formatted_address) texts.push(place.formatted_address);
    if (place.vicinity) texts.push(place.vicinity);

    return texts.join(' ').toLowerCase();
  }

  // Analizar texto para detectar amenities
  private analyzeText(text: string): DetectedAmenity[] {
    const detected: DetectedAmenity[] = [];

    Object.entries(this.config.keywordWeights).forEach(([keyword, weight]) => {
      if (text.includes(keyword)) {
        detected.push({
          name: keyword,
          confidence: weight,
          category: this.getCategoryForKeyword(keyword)
        });
      }
    });

    // Ordenar por confianza
    return detected.sort((a, b) => b.confidence - a.confidence);
  }

  // Obtener categoría para una palabra clave
  private getCategoryForKeyword(keyword: string): string {
    for (const [category, keywords] of Object.entries(this.config.categoryMappings)) {
      if (keywords.includes(keyword)) {
        return category;
      }
    }
    return 'other';
  }

  // Extraer información de hospedaje
  private extractLodgingInfo(place: EnrichedPlace, amenities: DetectedAmenity[]): LodgingInfo {
    const lodgingInfo: LodgingInfo = {};

    // Detectar amenities específicos de hoteles
    amenities.forEach(amenity => {
      switch (amenity.name) {
        case 'pet friendly':
        case 'mascotas':
        case 'acepta mascotas':
          lodgingInfo.pet_friendly = true;
          break;
        case 'piscina':
        case 'pool':
          lodgingInfo.pool_available = true;
          break;
        case 'wifi':
        case 'internet':
          lodgingInfo.wifi_available = true;
          break;
        case 'parking':
        case 'estacionamiento':
          lodgingInfo.parking_available = true;
          break;
        case 'gym':
        case 'gimnasio':
          lodgingInfo.gym_available = true;
          break;
        case 'spa':
          lodgingInfo.spa_available = true;
          break;
        case 'restaurante':
        case 'comida':
          lodgingInfo.restaurant_available = true;
          break;
        case 'room service':
        case 'servicio a la habitación':
          lodgingInfo.room_service = true;
          break;
        case 'concierge':
          lodgingInfo.concierge = true;
          break;
      }
    });

    return lodgingInfo;
  }

  // Categorizar amenities
  private categorizeAmenities(amenities: DetectedAmenity[]): AmenitiesCategories {
    const categories: AmenitiesCategories = {
      petfriendly: { detected: false, confidence: 0, keywords: [] },
      luxury: { detected: false, confidence: 0, keywords: [] },
      economic: { detected: false, confidence: 0, keywords: [] },
      beach: { detected: false, confidence: 0, keywords: [] },
      pool: { detected: false, confidence: 0, keywords: [] }
    };

    // Agrupar amenities por categoría
    amenities.forEach(amenity => {
      const category = amenity.category as keyof AmenitiesCategories;
      if (categories[category]) {
        categories[category].detected = true;
        categories[category].confidence = Math.max(categories[category].confidence, amenity.confidence);
        categories[category].keywords.push(amenity.name);
      }
    });

    return categories;
  }

  // Calcular confianza del análisis
  private calculateConfidence(amenities: DetectedAmenity[], text: string): number {
    if (amenities.length === 0) return 0;

    // Factor de cantidad de amenities detectados
    const quantityFactor = Math.min(amenities.length / 10, 1);
    
    // Factor de confianza promedio
    const avgConfidence = amenities.reduce((sum, a) => sum + a.confidence, 0) / amenities.length;
    
    // Factor de longitud del texto analizado
    const lengthFactor = Math.min(text.length / 1000, 1);

    return (quantityFactor + avgConfidence + lengthFactor) / 3;
  }
}

// Interfaces para resultados
export interface DetectedAmenity {
  name: string;
  confidence: number;
  category: string;
}

export interface AmenitiesDetection {
  amenities: DetectedAmenity[];
  lodgingInfo: LodgingInfo;
  categories: AmenitiesCategories;
  confidence: number;
}

export interface AmenitiesCategories {
  petfriendly: { detected: boolean; confidence: number; keywords: string[] };
  luxury: { detected: boolean; confidence: number; keywords: string[] };
  economic: { detected: boolean; confidence: number; keywords: string[] };
  beach: { detected: boolean; confidence: number; keywords: string[] };
  pool: { detected: boolean; confidence: number; keywords: string[] };
}

// Hook para usar el procesador de amenities
export function useAmenitiesProcessor(config?: Partial<AmenitiesConfig>) {
  const processor = useMemo(() => new AmenitiesProcessor(config), [config]);
  
  const detectPlaceAmenities = useCallback((place: EnrichedPlace) => {
    return processor.detectAmenities(place);
  }, [processor]);

  return {
    detectPlaceAmenities,
    processor
  };
}
