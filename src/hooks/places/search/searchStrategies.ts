// src/hooks/places/search/searchStrategies.ts
import type { LatLng, UsePlacesOptions, SearchStrategy } from "../types";

// Strategy Pattern: Diferentes estrategias de búsqueda
export class NearbySearchStrategy implements SearchStrategy {
  async search(userPosition: LatLng, options: UsePlacesOptions): Promise<any[]> {
    if (!window.google?.maps?.places) return [];

    const phantom = document.createElement("div");
    phantom.style.width = "0";
    phantom.style.height = "0";
    phantom.style.overflow = "hidden";
    document.body.appendChild(phantom);

    const map = new window.google.maps.Map(phantom, {
      center: userPosition,
      zoom: 12,
    });

    const service = new window.google.maps.places.PlacesService(map);

    try {
      const results = await new Promise<any[]>((resolve) => {
        service.nearbySearch(
          { 
            location: userPosition, 
            radius: options.radius || 5000, 
            type: options.type || "establishment" 
          },
          (results: any[], status: string) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
              resolve(results || []);
            } else {
              resolve([]);
            }
          }
        );
      });

      document.body.removeChild(phantom);
      return results;
    } catch (error) {
      console.warn("Error in nearby search:", error);
      document.body.removeChild(phantom);
      return [];
    }
  }
}

export class TextSearchStrategy implements SearchStrategy {
  async search(userPosition: LatLng, options: UsePlacesOptions): Promise<any[]> {
    if (!window.google?.maps?.places) return [];

    const phantom = document.createElement("div");
    phantom.style.width = "0";
    phantom.style.height = "0";
    phantom.style.overflow = "hidden";
    document.body.appendChild(phantom);

    const map = new window.google.maps.Map(phantom, {
      center: userPosition,
      zoom: 12,
    });

    const service = new window.google.maps.places.PlacesService(map);
    const allResults: any[] = [];

    const searchQueries = options.searchQueries || [];
    
    for (const query of searchQueries) {
      try {
        const results = await new Promise<any[]>((resolve) => {
          service.textSearch(
            {
              query: query,
              location: userPosition,
              radius: options.radius || 5000,
              type: options.type || "establishment",
            },
            (results: any[], status: string) => {
              if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                resolve(results || []);
              } else {
                resolve([]);
              }
            }
          );
        });

        allResults.push(...results);
      } catch (error) {
        console.warn(`Error searching for "${query}":`, error);
      }
    }

    document.body.removeChild(phantom);
    return allResults;
  }
}

export class CombinedSearchStrategy implements SearchStrategy {
  private nearbyStrategy: NearbySearchStrategy;
  private textStrategy: TextSearchStrategy;

  constructor(
    nearbyStrategy: NearbySearchStrategy,
    textStrategy: TextSearchStrategy
  ) {
    this.nearbyStrategy = nearbyStrategy;
    this.textStrategy = textStrategy;
  }

  async search(userPosition: LatLng, options: UsePlacesOptions): Promise<any[]> {
    const [nearbyResults, textResults] = await Promise.all([
      this.nearbyStrategy.search(userPosition, options),
      this.textStrategy.search(userPosition, options)
    ]);

    return [...nearbyResults, ...textResults];
  }
}
