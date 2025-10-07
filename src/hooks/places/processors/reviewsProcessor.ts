import { useMemo, useCallback } from "react";
import type { Review, EnrichedPlace } from "../types";

export interface ReviewAnalysisConfig {
  minReviewLength: number;
  maxReviewsToAnalyze: number;
  sentimentThreshold: number;
  keywordWeights: Record<string, number>;
}

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

export class ReviewsProcessor {
  private config: ReviewAnalysisConfig;

  constructor(config: Partial<ReviewAnalysisConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

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

    const relevantReviews = this.filterRelevantReviews(place.reviews);
    const sentimentAnalysis = this.analyzeSentiment(relevantReviews);
    const keywordAnalysis = this.extractKeywords(relevantReviews);
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

  private filterRelevantReviews(reviews: Review[]): Review[] {
    return reviews
      .filter(review => review.text && review.text.length >= this.config.minReviewLength)
      .sort((a, b) => b.time - a.time)
      .slice(0, this.config.maxReviewsToAnalyze);
  }

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

  private calculateReviewSentiment(review: Review): number {
    const text = review.text.toLowerCase();
    let score = 0;
    let keywordCount = 0;

    Object.entries(this.config.keywordWeights).forEach(([keyword, weight]) => {
      if (text.includes(keyword)) {
        score += weight;
        keywordCount++;
      }
    });

    if (keywordCount > 0) {
      score = score / keywordCount;
    }

    const ratingScore = (review.rating - 3) / 2;
    score = (score + ratingScore) / 2;

    return Math.max(-1, Math.min(1, score));
  }

  private extractKeywords(reviews: Review[]): KeywordAnalysis {
    const allText = reviews.map(r => r.text).join(' ').toLowerCase();
    
    const positiveKeywords: string[] = [];
    const negativeKeywords: string[] = [];

    const positivePatterns = [
      'excelente', 'perfecto', 'recomiendo', 'genial', 'bueno', 'fantástico',
      'maravilloso', 'increíble', 'espectacular', 'magnífico', 'súper',
      'limpio', 'cómodo', 'acogedor', 'servicio', 'atención', 'personal'
    ];

    const negativePatterns = [
      'malo', 'terrible', 'horrible', 'no recomiendo', 'pésimo', 'decepcionante',
      'sucio', 'incómodo', 'mal servicio', 'mal atención', 'problema', 'queja'
    ];

    const hotelKeywords = [
      'pet friendly', 'mascotas', 'perros', 'gatos', 'animales',
      'piscina', 'pool', 'natación', 'swimming',
      'lujo', 'premium', 'exclusivo', 'VIP', '5 estrellas',
      'económico', 'barato', 'budget', 'accesible',
      'playa', 'beach', 'costa', 'mar', 'oceano',
      'wifi', 'internet', 'parking', 'estacionamiento',
      'desayuno', 'breakfast', 'restaurante', 'comida'
    ];

    positivePatterns.forEach(pattern => {
      if (allText.includes(pattern)) {
        positiveKeywords.push(pattern);
      }
    });

    negativePatterns.forEach(pattern => {
      if (allText.includes(pattern)) {
        negativeKeywords.push(pattern);
      }
    });

    const specificKeywords = hotelKeywords.filter(keyword => 
      allText.includes(keyword)
    );

    return {
      positive: [...new Set(positiveKeywords)],
      negative: [...new Set(negativeKeywords)],
      specific: [...new Set(specificKeywords)]
    };
  }

  private calculateConfidence(reviews: Review[], sentimentAnalysis: SentimentAnalysis): number {
    if (reviews.length === 0) return 0;

    const quantityFactor = Math.min(reviews.length / 10, 1);
    const totalReviews = sentimentAnalysis.positive + sentimentAnalysis.negative + sentimentAnalysis.neutral;
    const consistencyFactor = totalReviews > 0 ? 
      Math.max(sentimentAnalysis.positive, sentimentAnalysis.negative) / totalReviews : 0;
    const avgLength = reviews.reduce((sum, r) => sum + r.text.length, 0) / reviews.length;
    const lengthFactor = Math.min(avgLength / 100, 1);

    return (quantityFactor + consistencyFactor + lengthFactor) / 3;
  }
}

export interface ProcessedReviews {
  overallSentiment: number;
  sentimentScore: number;
  positiveKeywords: string[];
  negativeKeywords: string[];
  relevantReviews: Review[];
  confidence: number;
}

export interface SentimentAnalysis {
  overall: number;
  score: number;
  positive: number;
  negative: number;
  neutral: number;
}

export interface KeywordAnalysis {
  positive: string[];
  negative: string[];
  specific: string[];
}

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
