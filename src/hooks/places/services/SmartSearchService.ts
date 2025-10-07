import type { Place, PlaceCategory, LatLng } from "../types";
import { GoogleMapsService } from "./GoogleMapsService";
import { CategoryConfigFactory } from "../config/categoryConfigs";
import type { CategoryConfig } from "../config/categoryConfigs";

const DEFAULT_MAX_RESULTS = 20;
const RATING_DIFF_THRESHOLD = 0.5;

export class SmartSearchService {
  static async searchPlaces(
    category: PlaceCategory,
    userLocation: LatLng,
    maxResults: number = DEFAULT_MAX_RESULTS
  ): Promise<Place[]> {
    try {
      const config = CategoryConfigFactory.getConfig(category);
      const service = GoogleMapsService.createService();
      
      const searchPromises = [
        this.searchByType(service, userLocation, config.type, config.radius),
        ...config.searchQueries.map(query => 
          this.searchByKeyword(service, userLocation, query, config.radius)
        )
      ];

      const allResults = await Promise.all(searchPromises);
      const combinedResults = allResults.flat();

      const uniqueResults = new Map();
      combinedResults.forEach(place => {
        if (place.place_id && !uniqueResults.has(place.place_id)) {
          uniqueResults.set(place.place_id, place);
        }
      });

      const places = Array.from(uniqueResults.values())
        .map(GoogleMapsService.formatPlaceResult)
        .filter((p): p is Place => p !== null);

      const filteredPlaces = this.applyCategoryFilters(places, category, config)
        .slice(0, maxResults);
      
      return filteredPlaces;
    } catch (error) {
      console.error("Error in SmartSearchService:", error);
      return [];
    }
  }

  private static async searchByType(
    service: google.maps.places.PlacesService,
    location: LatLng,
    type: string,
    radius: number
  ): Promise<google.maps.places.PlaceResult[]> {
    return new Promise((resolve) => {
      service.nearbySearch({ location, radius, type }, (results, status) => {
        resolve(status === "OK" && results ? results : []);
      });
    });
  }

  private static async searchByKeyword(
    service: google.maps.places.PlacesService,
    location: LatLng,
    keyword: string,
    radius: number
  ): Promise<google.maps.places.PlaceResult[]> {
    return new Promise((resolve) => {
      service.nearbySearch({ 
        location, 
        radius, 
        type: "establishment",
        keyword 
      }, (results, status) => {
        resolve(status === "OK" && results ? results : []);
      });
    });
  }

  private static applyCategoryFilters(
    places: Place[],
    category: PlaceCategory,
    config: CategoryConfig
  ): Place[] {
    return places
      .filter(place => {
        if (place.rating && place.rating < config.minRating) return false;
        return this.matchesCategory(place, category);
      })
      .sort((a, b) => {
        const ratingDiff = (b.rating || 0) - (a.rating || 0);
        if (Math.abs(ratingDiff) > RATING_DIFF_THRESHOLD) {
          return ratingDiff;
        }
        return 0;
      });
  }

  private static matchesCategory(place: Place, category: PlaceCategory): boolean {
    const name = place.name?.toLowerCase() || "";
    const vicinity = place.vicinity?.toLowerCase() || "";
    
    const searchText = `${name} ${vicinity}`;
    const keywords = CategoryConfigFactory.getSearchQueries(category);
    
    if (category === "beaches") {
      return keywords.some(keyword => 
        searchText.includes(keyword.toLowerCase())
      );
    }
    
    return true;
  }
}