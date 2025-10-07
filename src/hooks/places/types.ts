// src/hooks/places/types.ts
export type LatLng = { lat: number; lng: number };

export type PlaceCategory = "all" | "beaches" | "restaurants" | "hotels" | "destinations";

export interface Place {
  // Propiedades básicas (siempre disponibles)
  id: string;
  name: string;
  place_id: string;
  photo_url: string;
  location: LatLng;
  rating?: number;
  vicinity?: string;
  
  // Propiedades opcionales (Google Maps básico)
  photos?: any[];
  mainPhoto?: any;
  opening_hours?: {
    open_now?: boolean;
  };
}

// Interface para datos enriquecidos
export interface EnrichedPlace extends Place {
  // Información básica enriquecida
  formatted_address?: string;
  website?: string;
  formatted_phone_number?: string;
  international_phone_number?: string;
  
  // Descripción y editorial
  editorial_summary?: {
    overview?: string;
  };
  
  // Reviews enriquecidos
  reviews?: Review[];
  
  // Amenities y servicios
  amenities?: string[];
  services?: string[];
  
  // Información específica de hoteles
  lodging_info?: LodgingInfo;
  
  // Horarios detallados
  opening_hours_detailed?: OpeningHours;
  
  // Información de contacto
  contact_info?: ContactInfo;
  
  // Datos para IA
  ai_analysis?: AIAnalysis;
  
  // Información adicional de Google Maps
  google_maps_url?: string;
  utc_offset_minutes?: number;
  business_status?: string;
  price_level?: number;
  is_open_now?: boolean; // Estado de apertura calculado sin usar campo deprecado
  
  // Información de precios procesada
  price_info?: {
    level: number | null;
    description: string;
    symbol: string;
    color: string;
    isInferred?: boolean; // Indica si el precio fue inferido
  };
}

// Interface para reviews
export interface Review {
  author_name: string;
  rating: number;
  text: string;
  time: number;
  relative_time_description: string;
}

// Interface para información de hospedaje
export interface LodgingInfo {
  check_in_time?: string;
  check_out_time?: string;
  pet_friendly?: boolean;
  wifi_available?: boolean;
  parking_available?: boolean;
  pool_available?: boolean;
  gym_available?: boolean;
  spa_available?: boolean;
  restaurant_available?: boolean;
  business_center?: boolean;
  conference_rooms?: boolean;
  room_service?: boolean;
  laundry_service?: boolean;
  concierge?: boolean;
  valet_parking?: boolean;
  airport_shuttle?: boolean;
}

// Interface para horarios detallados
export interface OpeningHours {
  // open_now removido por deprecación - usar isOpen() method en su lugar
  periods: Array<{
    open: { day: number; time: string };
    close: { day: number; time: string };
  }>;
  weekday_text: string[];
}

// Interface para información de contacto
export interface ContactInfo {
  website?: string;
  phone?: string;
  email?: string;
  social_media?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
}

// Interface para análisis de IA
export interface AIAnalysis {
  categories: {
    petfriendly?: { confidence: number; detected: boolean };
    luxury?: { confidence: number; detected: boolean };
    economic?: { confidence: number; detected: boolean };
    beach?: { confidence: number; detected: boolean };
    pool?: { confidence: number; detected: boolean };
  };
  overall_confidence: number;
  processed_at: string;
}

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

export interface PlacesState {
  places: Place[];
  loading: boolean;
  error: string | null;
  apiStatus: string;
}

export interface SearchStrategy {
  search(userPosition: LatLng, options: UsePlacesOptions): Promise<any[]>;
}

export interface FilterStrategy {
  filter(places: any[], options: UsePlacesOptions): any[];
}
