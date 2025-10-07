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
    searchQueries: ["playa", "playas", "beach", "costa", "mar"],
    type: "establishment",
    minRating: 3.0,
    enableMultiplePhotos: true,
    radius: 20000,
    defaultLimit: 6,
  },
  restaurants: {
    searchQueries: [
      "restaurant",
      "restaurante",
      "comida",
      "gastronomía",
      "cocina",
    ],
    type: "restaurant",
    minRating: 4.0,
    enableMultiplePhotos: true,
    radius: 10000,
    defaultLimit: 8,
  },
  hotels: {
    searchQueries: ["hotel", "hospedaje", "hostal", "alojamiento", "resort"],
    type: "lodging",
    minRating: 1.5,
    enableMultiplePhotos: true,
    radius: 10000,
    defaultLimit: 20,
  },
  destinations: {
    searchQueries: [
      "museo",
      "parque",
      "monumento",
      "iglesia",
      "plaza",
      "centro histórico",
      "mirador",
      "cascada",
      "ruinas",
      "catedral",
      "basílica",
      "zoológico",
      "acuario",
      "teatro",
      "centro cultural",
    ],
    type: "establishment",
    minRating: 4.0,
    enableMultiplePhotos: true,
    radius: 10000,
    defaultLimit: 6,
  },
  tourist_attraction: {
    searchQueries: [
      "monumento",
      "iglesia",
      "plaza",
      "mirador",
      "cascada",
      "ruinas",
      "catedral",
      "basílica",
    ],
    type: "establishment",
    minRating: 4.0,
    enableMultiplePhotos: true,
    radius: 10000,
    defaultLimit: 6,
  },
  all: {
    searchQueries: ["restaurant", "hotel", "shopping", "attraction", "tourist"],
    type: "establishment",
    minRating: 2.0,
    enableMultiplePhotos: false,
    radius: 10000,
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
  return places.filter((place) => {
    const searchText = buildSearchText(place);
    return keywords.some((keyword) => matchesKeyword(searchText, keyword));
  });
}

function buildSearchText(place: any): string {
  const name = place.name?.toLowerCase() || "";
  const vicinity = place.vicinity?.toLowerCase() || "";
  const address = place.formatted_address?.toLowerCase() || "";
  const types = place.types?.join(" ").toLowerCase() || "";

  return `${name} ${vicinity} ${address} ${types}`;
}

function matchesKeyword(searchText: string, keyword: string): boolean {
  const lowerKeyword = keyword.toLowerCase();

  const exclusionRules = getExclusionRules();
  if (exclusionRules[lowerKeyword]) {
    return false;
  }

  const inclusionRules = getInclusionRules();
  if (inclusionRules[lowerKeyword]) {
    return inclusionRules[lowerKeyword].some((term) =>
      searchText.includes(term)
    );
  }

  return searchText.includes(lowerKeyword);
}

function getExclusionRules(): Record<string, boolean> {
  return {
    cerro: true,
    montaña: true,
    mountain: true,
    destino: true,
    destinos: true,
  };
}

function getInclusionRules(): Record<string, string[]> {
  return {
    // Playas
    playa: ["playa", "beach", "costa", "mar", "oceano", "litoral"],
    playas: ["playa", "beach", "costa", "mar", "oceano", "litoral"],
    beach: ["playa", "beach", "costa", "mar", "oceano", "litoral"],

    // Restaurantes
    restaurant: [
      "restaurant",
      "restaurante",
      "comida",
      "gastronomía",
      "cocina",
      "mesón",
      "café",
    ],
    restaurante: [
      "restaurant",
      "restaurante",
      "comida",
      "gastronomía",
      "cocina",
      "mesón",
      "café",
    ],
    comida: [
      "restaurant",
      "restaurante",
      "comida",
      "gastronomía",
      "cocina",
      "mesón",
      "café",
    ],

    // Hoteles
    hotel: [
      "hotel",
      "hospedaje",
      "hostal",
      "alojamiento",
      "resort",
      "posada",
      "hospedería",
    ],
    hospedaje: [
      "hotel",
      "hospedaje",
      "hostal",
      "alojamiento",
      "resort",
      "posada",
      "hospedería",
    ],
    alojamiento: [
      "hotel",
      "hospedaje",
      "hostal",
      "alojamiento",
      "resort",
      "posada",
      "hospedería",
    ],

    // Destinos turísticos
    museo: ["museo", "galería", "exposición", "arte", "historia", "cultura"],
    parque: ["parque", "jardín", "plaza", "espacio verde", "recreación"],
    monumento: ["monumento", "estatua", "memorial", "hito", "landmark"],
    iglesia: [
      "iglesia",
      "catedral",
      "basílica",
      "templo",
      "santuario",
      "capilla",
    ],
    plaza: ["plaza", "square", "centro", "plaza mayor", "plaza principal"],
  };
}
