import type { PlaceCategory } from "../types";

export interface CategoryConfig {
  searchQueries: string[];
  type: string;
  minRating: number;
  enableMultiplePhotos: boolean;
  radius: number;
  defaultLimit: number;
}

// Grupos de términos de búsqueda optimizados
const TERM_GROUPS: Record<string, string[]> = {
  beaches: ["playa", "beach", "playa de","playas","bahia"],
  restaurants: ["restaurant", "restaurante", "comida", "gastronomía", "cocina", "café"],
  hotels: ["hotel", "hospedaje", "hostal", "alojamiento", "resort"],
  cultural: ["museo","feria","artesanía", "galería", "arte", "templo", "historia", "cultura", "teatro"],
  religious: ["iglesia", "catedral", "basílica", "templo", "santuario"],
  nightlife: ["discoteca", "club nocturno", "bar", "pub", "nightclub"],
  study: ["biblioteca", "centro de estudios", "universidad","teatro","colegio", "academia"],
  parks: ["parque", "jardín", "espacio verde", "naturaleza", "bosque"],
  monuments: ["monumento", "estatua", "memorial", "hito"],
  historical: ["centro histórico", "ruinas", "mirador", "cascada"],
  entertainment: ["zoológico", "acuario", "teatro"]
};

// Configuraciones base optimizadas
const BASE_CONFIGS = {
  establishment: { type: "establishment", enableMultiplePhotos: true },
  restaurant: { type: "restaurant", enableMultiplePhotos: true },
  lodging: { type: "lodging", enableMultiplePhotos: true },
  nightClub: { type: "night_club", enableMultiplePhotos: true },
  park: { type: "park", enableMultiplePhotos: true },
  beach: { type: "establishment", enableMultiplePhotos: true }
} as const;

// Configuraciones de categorías optimizadas
export const CATEGORY_CONFIGS: Record<PlaceCategory, CategoryConfig> = {
  beaches: {
    ...BASE_CONFIGS.beach,
    searchQueries: TERM_GROUPS.beaches,
    minRating: 3.0,
    radius: 20000,
    defaultLimit: 6,
  },
  restaurants: {
    ...BASE_CONFIGS.restaurant,
    searchQueries: TERM_GROUPS.restaurants,
    minRating: 3.0,
    radius: 10000,
    defaultLimit: 8,
  },
  hotels: {
    ...BASE_CONFIGS.lodging,
    searchQueries: TERM_GROUPS.hotels,
    minRating: 2.5,
    radius: 10000,
    defaultLimit: 20,
  },
  destinations: {
    ...BASE_CONFIGS.establishment,
    searchQueries: [
      ...TERM_GROUPS.cultural,
      ...TERM_GROUPS.parks,
      ...TERM_GROUPS.monuments,
      ...TERM_GROUPS.religious,
      ...TERM_GROUPS.historical,
      ...TERM_GROUPS.entertainment,
    ],
    minRating: 4.0,
    radius: 10000,
    defaultLimit: 6,
  },
  tourist_attraction: {
    ...BASE_CONFIGS.establishment,
    searchQueries: [...TERM_GROUPS.monuments, ...TERM_GROUPS.religious],
    minRating: 4.0,
    radius: 10000,
    defaultLimit: 6,
  },
  discos: {
    ...BASE_CONFIGS.nightClub,
    searchQueries: TERM_GROUPS.nightlife,
    minRating: 3.5,
    radius: 15000,
    defaultLimit: 6,
  },
  estudiar: {
    ...BASE_CONFIGS.establishment,
    searchQueries: [
      ...TERM_GROUPS.study,
      ...TERM_GROUPS.cultural,
      ...TERM_GROUPS.entertainment,
      ...TERM_GROUPS.parks,
    ],
    minRating: 2.5,
    radius: 30000,
    defaultLimit: 15,
  },
  parques: {
    ...BASE_CONFIGS.park,
    searchQueries: [...TERM_GROUPS.parks, "bosque urbano", "área recreativa"],
    minRating: 3.5,
    radius: 12000,
    defaultLimit: 6,
  },
  all: {
    type: "establishment",
    searchQueries: [
      // Términos muy generales que funcionan bien
      "lugar", "centro", "plaza"
    ],
    minRating: 0.5, // Rating muy bajo para incluir más lugares
    enableMultiplePhotos: false,
    radius: 25000, // Radio amplio pero no excesivo
    defaultLimit: 25, // Resultados balanceados
  },
};

// Factory para configuraciones de categorías
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

// Filtrado optimizado por palabras clave
export function filterByKeywords(places: any[], keywords: string[]): any[] {
  if (!keywords?.length) return places;

  return places.filter((place) => {
    const searchText = buildSearchText(place);
    return keywords.some((keyword) => searchText.includes(keyword.toLowerCase()));
  });
}

// Construcción optimizada del texto de búsqueda
function buildSearchText(place: any): string {
  const fields = [
    place.name,
    place.vicinity,
    place.formatted_address,
    place.types?.join(" ")
  ];
  
  return fields.filter(Boolean).join(" ").toLowerCase();
}

