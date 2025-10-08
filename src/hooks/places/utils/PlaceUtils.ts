// src/hooks/places/utils/PlaceUtils.ts
import type { PlaceCategory } from "../types";

// Mapeo de categorías del UI a tipos de Google Places
export const CATEGORY_MAPPING: Record<string, string> = {
  all: "establishment",
  lodging: "lodging",
  shopping_mall: "shopping_mall",
  restaurant: "restaurant",
  point_of_interest: "point_of_interest",
  stadium: "stadium",
  beach: "natural_feature",
  beaches: "natural_feature",
  restaurants: "restaurant",
  hotel: "lodging",
  hotels: "lodging",
  destination: "tourist_attraction",
  destinations: "tourist_attraction",
  tourist_attraction: "tourist_attraction",
  attraction: "tourist_attraction",
};

export class PlaceUtils {
  static getGoogleType(category: PlaceCategory): string {
    return CATEGORY_MAPPING[category] || "establishment";
  }

  static isValidPlace(place: any): boolean {
    return !!(
      place?.place_id &&
      place?.name &&
      place?.geometry?.location &&
      place?.rating &&
      place?.photos?.length
    );
  }

  static formatPlaceName(name: string, maxLength: number = 50): string {
    if (name.length <= maxLength) return name;
    return name.substring(0, maxLength - 3) + "...";
  }

  static getPlaceDistance(place1: any, place2: any): number {
    if (!place1?.location || !place2?.location) return Infinity;

    const R = 6371; // Radio de la Tierra en km
    const dLat = this.toRad(place2.location.lat - place1.location.lat);
    const dLon = this.toRad(place2.location.lng - place1.location.lng);
    const lat1 = this.toRad(place1.location.lat);
    const lat2 = this.toRad(place2.location.lat);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  private static toRad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  static sortByRating(places: any[]): any[] {
    return places.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }

  static sortByDistance(places: any[], userLocation: any): any[] {
    return places.sort((a, b) => {
      const distA = this.getPlaceDistance(a, userLocation);
      const distB = this.getPlaceDistance(b, userLocation);
      return distA - distB;
    });
  }

  static filterByRating(places: any[], minRating: number): any[] {
    return places.filter((place) => (place.rating || 0) >= minRating);
  }

  static filterByPhotos(places: any[]): any[] {
    return places.filter((place) => place.photos && place.photos.length > 0);
  }
}
