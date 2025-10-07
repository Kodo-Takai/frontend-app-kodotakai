// src/hooks/places/processors/reviewsProcessor.ts
import { useMemo, useCallback } from "react";
import type { Review, EnrichedPlace } from "../types";

// Configuración de análisis de reviews
export interface ReviewAnalysisConfig {
  minReviewLength: number;
  maxReviewsToAnalyze: number;
  sentimentThreshold: number;
  keywordWeights: Record<string, number>;
}

// Configuración por defecto
const DEFAULT_CONFIG: ReviewAnalysisConfig = {
  minReviewLength: 10,
  maxReviewsToAnalyze: 20,
  sentimentThreshold: 0.6,
  keywordWeights: {
    "excelente": 0.9,
    "perfecto": 0.9,
    "recomiendo": 0.8,
    "genial": 0.8,
    "bueno": 0.7,
    "malo": -0.8,
    "terrible": -0.9,
    "no recomiendo": -0.9,
    "horrible": -0.9
  }
};

// Clase para procesar reviews
export class ReviewsProcessor {
  private config: ReviewAnalysisConfig;

  constructor(config: Partial<ReviewAnalysisConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  // Procesar reviews de un lugar
  processReviews(place: EnrichedPlace): ProcessedReviews {
    if (!place.reviews || place.reviews.length === 0) {
      return {
        overallSentiment: 0,
        sentimentScore: 0,
        positiveKeywords: [],
        negativeKeywords: [],
        relevantReviews: [],
        confidence: 0
      };
    }

    // Filtrar reviews relevantes
    const relevantReviews = this.filterRelevantReviews(place.reviews);
    
    // Analizar sentimientos
    const sentimentAnalysis = this.analyzeSentiment(relevantReviews);
    
    // Extraer palabras clave
    const keywordAnalysis = this.extractKeywords(relevantReviews);
    
    // Calcular confianza
    const confidence = this.calculateConfidence(relevantReviews, sentimentAnalysis);

    return {
      overallSentiment: sentimentAnalysis.overall,
      sentimentScore: sentimentAnalysis.score,
      positiveKeywords: keywordAnalysis.positive,
      negativeKeywords: keywordAnalysis.negative,
      relevantReviews: relevantReviews.slice(0, this.config.maxReviewsToAnalyze),
      confidence
    };
  }

  // Filtrar reviews relevantes
  private filterRelevantReviews(reviews: Review[]): Review[] {
    return reviews
      .filter(review => review.text && review.text.length >= this.config.minReviewLength)
      .sort((a, b) => b.time - a.time) // Más recientes primero
      .slice(0, this.config.maxReviewsToAnalyze);
  }

  // Analizar sentimientos de reviews
  private analyzeSentiment(reviews: Review[]): SentimentAnalysis {
    if (reviews.length === 0) {
      return { overall: 0, score: 0, positive: 0, negative: 0, neutral: 0 };
    }

    let totalScore = 0;
    let positiveCount = 0;
    let negativeCount = 0;
    let neutralCount = 0;

    reviews.forEach(review => {
      const sentiment = this.calculateReviewSentiment(review);
      totalScore += sentiment;
      
      if (sentiment > 0.3) positiveCount++;
      else if (sentiment < -0.3) negativeCount++;
      else neutralCount++;
    });

    const averageScore = totalScore / reviews.length;
    const overall = averageScore > 0.3 ? 1 : averageScore < -0.3 ? -1 : 0;

    return {
      overall,
      score: averageScore,
      positive: positiveCount,
      negative: negativeCount,
      neutral: neutralCount
    };
  }

  // Calcular sentimiento de un review individual
  private calculateReviewSentiment(review: Review): number {
    const text = review.text.toLowerCase();
    let score = 0;
    let keywordCount = 0;

    // Analizar palabras clave
    Object.entries(this.config.keywordWeights).forEach(([keyword, weight]) => {
      if (text.includes(keyword)) {
        score += weight;
        keywordCount++;
      }
    });

    // Normalizar por número de palabras clave encontradas
    if (keywordCount > 0) {
      score = score / keywordCount;
    }

    // Considerar rating del review
    const ratingScore = (review.rating - 3) / 2; // Normalizar rating 1-5 a -1 a 1
    score = (score + ratingScore) / 2;

    return Math.max(-1, Math.min(1, score));
  }

  // Extraer palabras clave de reviews
  private extractKeywords(reviews: Review[]): KeywordAnalysis {
    const allText = reviews.map(r => r.text).join(' ').toLowerCase();
    
    const positiveKeywords: string[] = [];
    const negativeKeywords: string[] = [];

    // Palabras clave positivas
    const positivePatterns = [
      'excelente', 'perfecto', 'recomiendo', 'genial', 'bueno', 'fantástico',
      'maravilloso', 'increíble', 'espectacular', 'magnífico', 'súper',
      'limpio', 'cómodo', 'acogedor', 'servicio', 'atención', 'personal'
    ];

    // Palabras clave negativas
    const negativePatterns = [
      'malo', 'terrible', 'horrible', 'no recomiendo', 'pésimo', 'decepcionante',
      'sucio', 'incómodo', 'mal servicio', 'mal atención', 'problema', 'queja'
    ];

    // Palabras clave específicas para hoteles
    const hotelKeywords = [
      'pet friendly', 'mascotas', 'perros', 'gatos', 'animales',
      'piscina', 'pool', 'natación', 'swimming',
      'lujo', 'premium', 'exclusivo', 'VIP', '5 estrellas',
      'económico', 'barato', 'budget', 'accesible',
      'playa', 'beach', 'costa', 'mar', 'oceano',
      'wifi', 'internet', 'parking', 'estacionamiento',
      'desayuno', 'breakfast', 'restaurante', 'comida'
    ];

    // Buscar palabras clave positivas
    positivePatterns.forEach(pattern => {
      if (allText.includes(pattern)) {
        positiveKeywords.push(pattern);
      }
    });

    // Buscar palabras clave negativas
    negativePatterns.forEach(pattern => {
      if (allText.includes(pattern)) {
        negativeKeywords.push(pattern);
      }
    });

    // Buscar palabras clave específicas de hoteles
    const specificKeywords = hotelKeywords.filter(keyword => 
      allText.includes(keyword)
    );

    return {
      positive: [...new Set(positiveKeywords)],
      negative: [...new Set(negativeKeywords)],
      specific: [...new Set(specificKeywords)]
    };
  }

  // Calcular confianza del análisis
  private calculateConfidence(reviews: Review[], sentimentAnalysis: SentimentAnalysis): number {
    if (reviews.length === 0) return 0;

    // Factor de cantidad de reviews
    const quantityFactor = Math.min(reviews.length / 10, 1);
    
    // Factor de consistencia en sentimientos
    const totalReviews = sentimentAnalysis.positive + sentimentAnalysis.negative + sentimentAnalysis.neutral;
    const consistencyFactor = totalReviews > 0 ? 
      Math.max(sentimentAnalysis.positive, sentimentAnalysis.negative) / totalReviews : 0;
    
    // Factor de longitud promedio de reviews
    const avgLength = reviews.reduce((sum, r) => sum + r.text.length, 0) / reviews.length;
    const lengthFactor = Math.min(avgLength / 100, 1);

    return (quantityFactor + consistencyFactor + lengthFactor) / 3;
  }
}

// Interfaces para resultados
export interface ProcessedReviews {
  overallSentiment: number; // -1 a 1
  sentimentScore: number; // -1 a 1
  positiveKeywords: string[];
  negativeKeywords: string[];
  relevantReviews: Review[];
  confidence: number; // 0 a 1
}

export interface SentimentAnalysis {
  overall: number; // -1, 0, 1
  score: number; // -1 a 1
  positive: number;
  negative: number;
  neutral: number;
}

export interface KeywordAnalysis {
  positive: string[];
  negative: string[];
  specific: string[];
}

// Hook para usar el procesador de reviews
export function useReviewsProcessor(config?: Partial<ReviewAnalysisConfig>) {
  const processor = useMemo(() => new ReviewsProcessor(config), [config]);
  
  const processPlaceReviews = useCallback((place: EnrichedPlace) => {
    return processor.processReviews(place);
  }, [processor]);

  return {
    processPlaceReviews,
    processor
  };
}
