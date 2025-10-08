import type { Place, PlaceCategory, LatLng } from "../types";
import { GoogleMapsService } from "./GoogleMapsService";
import { CategoryConfigFactory, filterByKeywords } from "../config/categoryConfigs";

// Configuración centralizada
const CONFIG = {
  DEFAULT_MAX_RESULTS: 20,
  TEXT_SEARCH_SUFFIX: " cerca de mi",
  MAX_TEXT_QUERIES: 10,
  ALL_CATEGORY_TEXT_LIMIT: 3,
  ALL_CATEGORY_SPECIFIC_TYPES: ["restaurant", "lodging", "tourist_attraction"]
} as const;

export class SmartSearchService {
  // Búsqueda principal de lugares por categoría
  static async searchPlaces(
    category: PlaceCategory,
    userLocation: LatLng,
    maxResults: number = CONFIG.DEFAULT_MAX_RESULTS
  ): Promise<Place[]> {
    try {
      const config = CategoryConfigFactory.getConfig(category);
      const service = GoogleMapsService.createService();
      const allResults = await this.performUnifiedSearch(service, userLocation, config);
      const uniqueResults = this.deduplicateResults(allResults);
      const formattedPlaces = this.formatResults(uniqueResults);
      const filteredPlaces = this.applyFiltering(formattedPlaces, config, category);

      return filteredPlaces.slice(0, maxResults);
    } catch (error) {
      return [];
    }
  }

  // Estrategia de búsqueda unificada
  private static async performUnifiedSearch(
    service: google.maps.places.PlacesService,
    userLocation: LatLng,
    config: any
  ): Promise<google.maps.places.PlaceResult[]> {
    const searchPromises: Promise<google.maps.places.PlaceResult[]>[] = [];

    if (config.type === "establishment") {
      // Búsqueda genérica + específica para variedad
      searchPromises.push(this.performNearbySearch(service, userLocation, "establishment"));
      CONFIG.ALL_CATEGORY_SPECIFIC_TYPES.forEach(type => {
        searchPromises.push(this.performNearbySearch(service, userLocation, type));
      });
      
      if (config.searchQueries?.length > 0) {
        const limitedQueries = config.searchQueries.slice(0, CONFIG.ALL_CATEGORY_TEXT_LIMIT);
        searchPromises.push(this.performTextSearch(service, limitedQueries));
      }
    } else if (config.type && config.type !== "establishment") {
      // Búsqueda específica para categorías
      searchPromises.push(this.performNearbySearch(service, userLocation, config.type));
      
      if (config.searchQueries?.length > 0) {
        searchPromises.push(this.performTextSearch(service, config.searchQueries));
      }
    }

    const results = await Promise.all(searchPromises);
    return results.flat();
  }

  // Aplicar filtrado según categoría
  private static applyFiltering(formattedPlaces: Place[], config: any, category: PlaceCategory): Place[] {
    if (category === 'all') {
      return formattedPlaces.filter(place => !place.rating || place.rating >= config.minRating);
    }
    return filterByKeywords(formattedPlaces, config.searchQueries);
  }

  // Búsqueda por texto con límite de queries
  private static async performTextSearch(
    service: google.maps.places.PlacesService,
    searchQueries: string[]
  ): Promise<google.maps.places.PlaceResult[]> {
    const limitedQueries = searchQueries.length > CONFIG.MAX_TEXT_QUERIES 
      ? searchQueries.slice(0, CONFIG.MAX_TEXT_QUERIES) 
      : searchQueries;
    
    const textSearchPromises = limitedQueries.map((query) =>
      GoogleMapsService.searchByText(service, `${query}${CONFIG.TEXT_SEARCH_SUFFIX}`)
    );
    const textResults = await Promise.all(textSearchPromises);
    return textResults.flat();
  }

  // Búsqueda nearby delegada
  private static async performNearbySearch(
    service: google.maps.places.PlacesService,
    userLocation: LatLng,
    type: string
  ): Promise<google.maps.places.PlaceResult[]> {
    return GoogleMapsService.searchNearby(service, userLocation, type);
  }

  // Eliminar duplicados por place_id
  private static deduplicateResults(results: google.maps.places.PlaceResult[]): google.maps.places.PlaceResult[] {
    const uniqueResults = new Map<string, google.maps.places.PlaceResult>();
    results.forEach((place) => {
      if (place.place_id && !uniqueResults.has(place.place_id)) {
        uniqueResults.set(place.place_id, place);
      }
    });
    return Array.from(uniqueResults.values());
  }

  // Formatear resultados a formato Place
  private static formatResults(results: google.maps.places.PlaceResult[]): Place[] {
    return results
      .map((p) => GoogleMapsService.formatPlaceResult(p))
      .filter((p): p is Place => p !== null);
  }
}
