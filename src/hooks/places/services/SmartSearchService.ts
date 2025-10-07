import type { Place, PlaceCategory, LatLng } from "../types";
import { GoogleMapsService } from "./GoogleMapsService";
import { CategoryConfigFactory } from "../config/categoryConfigs";

// Configuración de búsqueda inteligente
const DEFAULT_MAX_RESULTS = 20;
const SEARCH_RADII = [2000, 10000, 30000];

export class SmartSearchService {
  /**
   * Busca lugares de una categoría específica cerca de la ubicación del usuario
   */
  static async searchPlaces(
    category: PlaceCategory,
    userLocation: LatLng,
    maxResults: number = DEFAULT_MAX_RESULTS
  ): Promise<Place[]> {
    try {
      const config = CategoryConfigFactory.getConfig(category);
      const service = GoogleMapsService.createService();
      
      const searchPromises = SEARCH_RADII.map(radius => 
        new Promise<google.maps.places.PlaceResult[]>((resolve) => {
          service.nearbySearch(
            { location: userLocation, radius, type: config.type },
            (results, status) => {
              if (status === "OK" && results) resolve(results);
              else resolve([]);
            }
          );
        })
      );

      const allResults = await Promise.all(searchPromises);
      const combinedResults = allResults.flat();

      const uniqueResults = combinedResults.reduce((acc, place) => {
        if (!acc.find((p) => p.place_id === place.place_id)) {
          acc.push(place);
        }
        return acc;
      }, [] as google.maps.places.PlaceResult[]);

      const places = uniqueResults
        .map(GoogleMapsService.formatPlaceResult)
        .filter((p): p is Place => p !== null)
        .slice(0, maxResults);
      
      return places;
    } catch (error) {
      return [];
    }
  }
}