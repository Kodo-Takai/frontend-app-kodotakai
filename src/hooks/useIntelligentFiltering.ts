import { useState, useMemo } from 'react';
import type { EnrichedPlace } from './places';
import { getFilterConfig, getAvailableFilters, hasFilter } from './useIntelligentFilteringConfig';

export interface FilterResult {
  places: EnrichedPlace[];
  totalMatches: number;
  filterApplied: string | null;
}

export const useIntelligentFiltering = (places: EnrichedPlace[], category: string = 'hotels') => {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const analyzePlaceContent = (place: EnrichedPlace, filterConfig: any): number => {
    const { keywords, weight } = filterConfig;
    const textFields = extractTextFields(place);
    const scoringWeights = getScoringWeights();
    
    let totalScore = 0;
    
    Object.entries(scoringWeights).forEach(([field, weights]) => {
      const text = textFields[field as keyof typeof textFields];
      if (text) {
        totalScore += calculateScore(text, keywords.primary, weights.primary);
        totalScore += calculateScore(text, keywords.secondary, weights.secondary);
        totalScore += calculateScore(text, keywords.amenities, weights.amenities);
      }
    });
    
    const bonusScore = calculateBonusScore(textFields, keywords.primary);
    return (totalScore + bonusScore) * weight;
  };

  const extractTextFields = (place: EnrichedPlace) => {
    return {
      primary: [place.name, place.vicinity, place.formatted_address, place.editorial_summary?.overview]
        .filter(Boolean).join(' ').toLowerCase(),
      amenities: (place.amenities || []).join(' ').toLowerCase(),
      services: (place.services || []).join(' ').toLowerCase(),
      contact: [place.website, place.formatted_phone_number, place.international_phone_number]
        .filter(Boolean).join(' ').toLowerCase(),
      lodging: place.lodging_info ? Object.values(place.lodging_info).join(' ').toLowerCase() : '',
      reviews: (place.reviews || []).map(review => review.text).join(' ').toLowerCase()
    };
  };

  const getScoringWeights = () => {
    return {
      primary: { primary: 3, secondary: 1, amenities: 0 },
      amenities: { primary: 4, secondary: 1.5, amenities: 5 },
      services: { primary: 2.5, secondary: 1, amenities: 0 },
      contact: { primary: 1.5, secondary: 0.5, amenities: 0 },
      lodging: { primary: 2, secondary: 1, amenities: 0 },
      reviews: { primary: 1.5, secondary: 0.5, amenities: 0 }
    };
  };

  const calculateScore = (text: string, keywords: string[], multiplier: number): number => {
    return keywords.reduce((score, keyword) => {
      const matches = (text.match(new RegExp(keyword.toLowerCase(), 'g')) || []).length;
      return score + (matches * multiplier);
    }, 0);
  };

  const calculateBonusScore = (textFields: any, primaryKeywords: string[]): number => {
    const allText = Object.values(textFields).join(' ');
    const primaryMatches = primaryKeywords.filter((keyword: string) => 
      allText.includes(keyword.toLowerCase())
    ).length;
    
    return primaryMatches >= 3 ? 2 : 0;
  };

  const filteredPlaces = useMemo(() => {
    if (!activeFilter || activeFilter === 'todo') {
      return { places, totalMatches: places.length, filterApplied: null };
    }

    const filterConfig = getFilterConfig(category, activeFilter);
    if (!filterConfig) {
      return { places, totalMatches: places.length, filterApplied: null };
    }

    const placesWithScores = places.map(place => ({
      place,
      score: analyzePlaceContent(place, filterConfig),
      category: (filterConfig as any).category
    }));

    const minScore = 1.0;
    const filtered = placesWithScores
      .filter(item => item.score >= minScore)
      .sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score;
        }
        return (b.place.rating || 0) - (a.place.rating || 0);
      })
      .map(item => item.place);

    return {
      places: filtered,
      totalMatches: filtered.length,
      filterApplied: activeFilter
    };
  }, [places, activeFilter, category, analyzePlaceContent]);

  const applyFilter = (filterId: string | null) => {
    setActiveFilter(filterId);
  };

  const clearFilter = () => {
    setActiveFilter(null);
  };

  const getFilterStats = () => {
    if (!activeFilter || activeFilter === 'todo') {
      return null;
    }

    const filterConfig = getFilterConfig(category, activeFilter);
    if (!filterConfig) return null;

    return {
      filterName: activeFilter,
      category: (filterConfig as any).category,
      totalKeywords: (filterConfig as any).keywords.primary.length + (filterConfig as any).keywords.secondary.length + (filterConfig as any).keywords.amenities.length,
      primaryKeywords: (filterConfig as any).keywords.primary,
      secondaryKeywords: (filterConfig as any).keywords.secondary,
      amenityKeywords: (filterConfig as any).keywords.amenities
    };
  };

  const analyzeContentMatch = (place: EnrichedPlace, filterId: string) => {
    const filterConfig = getFilterConfig(category, filterId);
    if (!filterConfig) return null;

    const analysis = {
      name: { text: place.name, matches: [] as string[] },
      address: { text: place.formatted_address || place.vicinity, matches: [] as string[] },
      description: { text: place.editorial_summary?.overview, matches: [] as string[] },
      amenities: { text: (place.amenities || []).join(', '), matches: [] as string[] },
      services: { text: (place.services || []).join(', '), matches: [] as string[] }
    };

    Object.keys(analysis).forEach(field => {
      const fieldData = analysis[field as keyof typeof analysis];
      if (fieldData.text) {
        const text = fieldData.text.toLowerCase();
        [...(filterConfig as any).keywords.primary, ...(filterConfig as any).keywords.secondary, ...(filterConfig as any).keywords.amenities].forEach(keyword => {
          if (text.includes(keyword.toLowerCase())) {
            fieldData.matches.push(keyword);
          }
        });
      }
    });

    return analysis;
  };

  const getAvailableFiltersForCategory = () => {
    return getAvailableFilters(category);
  };

  const filterExists = (filterId: string) => {
    return hasFilter(category, filterId);
  };

  return {
    ...filteredPlaces,
    activeFilter,
    applyFilter,
    clearFilter,
    isFilterActive: activeFilter !== null && activeFilter !== 'todo',
    getFilterStats,
    analyzeContentMatch,
    getAvailableFiltersForCategory,
    filterExists,
    currentCategory: category
  };
};
