export type LatLng = { lat: number; lng: number };

export type PlaceCategory =
  | "all"
  | "beaches"
  | "restaurants"
  | "hotels"
  | "destinations"
  | "tourist_attraction";

export interface Place {
  id: string;
  name: string;
  place_id: string;
  photo_url: string;
  location: LatLng;
  rating?: number;
  vicinity?: string;
  photos?: any[];
  mainPhoto?: any;
  opening_hours?: {
    open_now?: boolean;
  };
}

export interface EnrichedPlace extends Place {
  formatted_address?: string;
  website?: string;
  formatted_phone_number?: string;
  international_phone_number?: string;
  editorial_summary?: {
    overview?: string;
  };
  reviews?: Review[];
  amenities?: string[];
  services?: string[];
  types?: string[];
  lodging_info?: LodgingInfo;
  opening_hours_detailed?: OpeningHours;
  contact_info?: ContactInfo;
  ai_analysis?: AIAnalysis;
  google_maps_url?: string;
  utc_offset_minutes?: number;
  business_status?: string;
  price_level?: number;
  is_open_now?: boolean;
  user_ratings_total?: number;
  price_info?: {
    level: number | null;
    description: string;
    symbol: string;
    color: string;
    isInferred?: boolean;
  };
}

export interface Review {
  author_name: string;
  rating: number;
  text: string;
  time: number;
  relative_time_description: string;
}

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
  social_media?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
}

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
