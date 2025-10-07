import type { Place, PlaceCategory, LatLng } from "../types";
import { GoogleMapsService } from "./GoogleMapsService";
import {
  CategoryConfigFactory,
  filterByKeywords,
} from "../config/categoryConfigs";

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

      const allResults = await this.performSearch(
        service,
        category,
        userLocation,
        config
      );
      const uniqueResults = this.deduplicateResults(allResults);
      const formattedPlaces = this.formatResults(uniqueResults, category);
      const filteredPlaces = filterByKeywords(
        formattedPlaces,
        config.searchQueries
      );

      return filteredPlaces.slice(0, maxResults);
    } catch (error) {
      return [];
    }
  }

  private static async performSearch(
    service: google.maps.places.PlacesService,
    category: PlaceCategory,
    userLocation: LatLng,
    config: any
  ): Promise<google.maps.places.PlaceResult[]> {
    const shouldUseTextSearch = this.shouldUseTextSearch(category);
    const shouldUseHybridSearch = this.shouldUseHybridSearch(category);

    if (shouldUseTextSearch) {
      return this.performTextSearch(service, config.searchQueries);
    } else if (shouldUseHybridSearch) {
      return this.performHybridSearch(service, userLocation, config);
    } else {
      return this.performNearbySearch(service, userLocation, config.type);
    }
  }

  private static shouldUseTextSearch(category: PlaceCategory): boolean {
    const textSearchCategories: PlaceCategory[] = [
      "beaches",
      "destinations",
      "tourist_attraction",
    ];
    return textSearchCategories.includes(category);
  }

  private static shouldUseHybridSearch(category: PlaceCategory): boolean {
    const hybridSearchCategories: PlaceCategory[] = ["restaurants", "hotels"];
    return hybridSearchCategories.includes(category);
  }

  private static async performTextSearch(
    service: google.maps.places.PlacesService,
    searchQueries: string[]
  ): Promise<google.maps.places.PlaceResult[]> {
    const textSearchPromises = searchQueries.map((query) =>
      GoogleMapsService.searchByText(service, `${query} cerca de mi`)
    );
    const textResults = await Promise.all(textSearchPromises);
    return textResults.flat();
  }

  private static async performHybridSearch(
    service: google.maps.places.PlacesService,
    userLocation: LatLng,
    config: any
  ): Promise<google.maps.places.PlaceResult[]> {
    const nearbyResults = await this.performNearbySearch(
      service,
      userLocation,
      config.type
    );
    const textResults = await this.performTextSearch(
      service,
      config.searchQueries
    );

    return [...nearbyResults, ...textResults];
  }

  private static async performNearbySearch(
    service: google.maps.places.PlacesService,
    userLocation: LatLng,
    type: string
  ): Promise<google.maps.places.PlaceResult[]> {
    const searchPromises = SEARCH_RADII.map(
      (radius) =>
        new Promise<google.maps.places.PlaceResult[]>((resolve) => {
          service.nearbySearch(
            { location: userLocation, radius, type },
            (results, status) => {
              if (status === "OK" && results) resolve(results);
              else resolve([]);
            }
          );
        })
    );
    return (await Promise.all(searchPromises)).flat();
  }

  private static deduplicateResults(
    results: google.maps.places.PlaceResult[]
  ): google.maps.places.PlaceResult[] {
    return results.reduce((acc, place) => {
      if (!acc.find((p) => p.place_id === place.place_id)) {
        acc.push(place);
      }
      return acc;
    }, [] as google.maps.places.PlaceResult[]);
  }

  private static formatResults(
    results: google.maps.places.PlaceResult[],
    category: PlaceCategory
  ): Place[] {
    return results
      .map((p) => GoogleMapsService.formatPlaceResult(p, category))
      .filter((p): p is Place => p !== null);
  }
}
