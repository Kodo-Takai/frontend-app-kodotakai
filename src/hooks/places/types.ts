export type LatLng = { lat: number; lng: number };

export type PlaceCategory =
  | "all"
  | "beaches"
  | "restaurants"
  | "hotels"
  | "destinations"
  | "tourist_attraction"
  | "discos"
  | "estudiar"
  | "parques";

// Interfaz base para lugares
export interface Place {
  id: string;
  name: string;
  place_id: string;
  photo_url: string;
  location: LatLng;
  rating?: number;
  vicinity?: string;
  photos?: any[];
  opening_hours?: { open_now?: boolean };
}

// Interfaz extendida con datos enriquecidos
export interface EnrichedPlace extends Place {
  formatted_address?: string;
  website?: string;
  formatted_phone_number?: string;
  international_phone_number?: string;
  editorial_summary?: { overview?: string };
  reviews?: Review[];
  types?: string[];
  lodging_info?: LodgingInfo;
  opening_hours_detailed?: OpeningHours;
  contact_info?: ContactInfo;
  ai_analysis?: AIAnalysis;
  business_status?: string;
  price_level?: number;
  user_ratings_total?: number;
  price_info?: PriceInfo;
  amenities?: string[];
  services?: string[];
}

export interface Review {
  author_name: string;
  rating: number;
  text: string;
  time: number;
  relative_time_description: string;
}

// Información de hospedaje optimizada
export interface LodgingInfo {
  check_in_time?: string;
  check_out_time?: string;
  amenities: string[]; // Array de amenidades en lugar de campos booleanos individuales
}

export interface OpeningHours {
  periods: Array<{
    open: { day: number; time: string };
    close: { day: number; time: string };
  }>;
  weekday_text: string[];
}

export interface ContactInfo {
  website?: string;
  phone?: string;
  email?: string;
  social_media?: Record<string, string>;
}

export interface AIAnalysis {
  categories: Record<string, { confidence: number; detected: boolean }>;
  overall_confidence: number;
  processed_at: string;
}

export interface PriceInfo {
  level: number | null;
  description: string;
  symbol: string;
  color: string;
  isInferred?: boolean;
}

// Opciones para búsqueda de lugares
export interface UsePlacesOptions {
  type?: string;
  category?: PlaceCategory;
  searchMethod?: "nearby" | "text" | "both";
  radius?: number;
  limit?: number;
  minRating?: number;
  customFilters?: (place: any) => boolean;
  searchQueries?: string[];
  fallbackLocation?: LatLng;
  enableMultiplePhotos?: boolean;
}

// Estado de lugares
export interface PlacesState {
  places: Place[];
  loading: boolean;
  error: string | null;
  apiStatus: string;
}

// Estrategias de búsqueda y filtrado
export interface SearchStrategy {
  search(userPosition: LatLng, options: UsePlacesOptions): Promise<any[]>;
}

export interface FilterStrategy {
  filter(places: any[], options: UsePlacesOptions): any[];
}
