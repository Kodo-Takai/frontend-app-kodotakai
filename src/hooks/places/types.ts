// src/hooks/places/types.ts
export type LatLng = { lat: number; lng: number };

export type PlaceCategory = "all" | "beaches" | "restaurants" | "hotels" | "destinations";

export interface Place {
  name: string;
  rating?: number;
  vicinity?: string;
  place_id: string;
  photo_url: string;
  location?: LatLng;
  photos?: any[];
  mainPhoto?: any;
  // Propiedades específicas de hoteles
  opening_hours?: {
    open_now?: boolean;
  };
  wheelchair_accessible_entrance?: boolean;
  serves_wine?: boolean;
  serves_breakfast?: boolean;
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
