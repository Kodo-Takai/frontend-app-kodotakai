import type { LatLng } from "../types";
import { CacheService } from "./CacheService";

// Configuración de la API de Google Maps
const API_KEY = import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY;
const SCRIPT_ID = "google-maps-script";
const API_CHECK_ATTEMPTS = 50;
const API_CHECK_INTERVAL = 100;
const LOCATION_CACHE_TTL = 30000;
const FALLBACK_LOCATION: LatLng = { lat: -12.0464, lng: -77.0428 };

export class GoogleMapsService {
  private static mapsApiLoaded: Promise<void> | null = null;

  /**
   * Carga la API de Google Maps de forma asíncrona
   */
  static async loadApi(): Promise<void> {
    if (this.mapsApiLoaded) return this.mapsApiLoaded;

    this.mapsApiLoaded = new Promise((resolve, reject) => {
      if (window.google?.maps?.places?.PlacesService) {
        return resolve();
      }

      const existingScript = document.getElementById(SCRIPT_ID);
      if (existingScript) {
        const checkApi = () => {
          if (window.google?.maps?.places?.PlacesService) {
            resolve();
          } else {
            setTimeout(checkApi, API_CHECK_INTERVAL);
          }
        };
        checkApi();
        return;
      }

      const script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places&v=weekly`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        let attempts = 0;
        const checkApi = () => {
          if (window.google?.maps?.places?.PlacesService) {
            resolve();
          } else if (++attempts < API_CHECK_ATTEMPTS) {
            setTimeout(checkApi, API_CHECK_INTERVAL);
          } else {
            reject(new Error("Google Maps API failed to initialize"));
          }
        };
        checkApi();
      };

      script.onerror = () =>
        reject(new Error("Failed to load Google Maps API"));
      document.head.appendChild(script);
    });

    return this.mapsApiLoaded;
  }

  /**
   * Obtiene la ubicación del usuario con fallback a ubicación por defecto
   */
  static async getUserLocation(): Promise<LatLng> {
    const cacheKey = "user_location";
    const cached = CacheService.get<LatLng>(cacheKey);
    if (cached) return cached;

    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        return resolve(FALLBACK_LOCATION);
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const location = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          CacheService.set(cacheKey, location, LOCATION_CACHE_TTL);
          resolve(location);
        },
        () => resolve(FALLBACK_LOCATION),
        {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 60000,
        }
      );
    });
  }

  /**
   * Crea una instancia del servicio de Places de Google Maps
   */
  static createService(): google.maps.places.PlacesService {
    return new window.google.maps.places.PlacesService(
      document.createElement("div")
    );
  }

  /**
   * Fuerza la obtención de una nueva ubicación eliminando la caché
   */
  static async forceNewLocation(): Promise<LatLng> {
    CacheService.delete("user_location");
    return this.getUserLocation();
  }

  /**
   * Verifica si la ubicación es real o es la ubicación de fallback
   */
  static isUsingRealLocation(location: LatLng): boolean {
    return !(
      location.lat === FALLBACK_LOCATION.lat &&
      location.lng === FALLBACK_LOCATION.lng
    );
  }

  /**
   * Busca lugares cercanos en múltiples radios para obtener más resultados
   */
  static async searchNearby(
    service: google.maps.places.PlacesService,
    location: LatLng,
    type: string
  ): Promise<google.maps.places.PlaceResult[]> {
    const SEARCH_RADII = [2000, 10000, 30000];
    const results = await Promise.all(
      SEARCH_RADII.map(
        (radius) =>
          new Promise<google.maps.places.PlaceResult[]>((resolve) => {
            service.nearbySearch(
              { location, radius, type },
              (results, status) => {
                resolve(status === "OK" && results ? results : []);
              }
            );
          })
      )
    );

    const uniqueResults = new Map();
    results.flat().forEach((place) => {
      if (place.place_id && !uniqueResults.has(place.place_id)) {
        uniqueResults.set(place.place_id, place);
      }
    });

    return Array.from(uniqueResults.values());
  }

  /**
   * Busca lugares por texto usando Google Places API
   */
  static async searchByText(
    service: google.maps.places.PlacesService,
    query: string
  ): Promise<google.maps.places.PlaceResult[]> {
    return new Promise((resolve) => {
      service.textSearch({ query }, (results, status) => {
        resolve(status === "OK" && results ? results : []);
      });
    });
  }

  /**
   * Formatea un resultado de Google Places a formato estándar de la aplicación
   */
  static formatPlaceResult(
    p: google.maps.places.PlaceResult,
    _category?: string
  ): any {
    if (!p.place_id || !p.name || !p.geometry?.location) return null;
    if (!p.rating || p.rating < 1.5) return null;
    if (!p.photos || p.photos.length === 0) return null;
    if (!p.user_ratings_total || p.user_ratings_total < 1) return null;

    return {
      id: p.place_id,
      name: p.name,
      location: p.geometry.location.toJSON(),
      rating: p.rating,
      photo_url: p.photos?.[0]?.getUrl() || "",
      place_id: p.place_id || "",
      vicinity: p.vicinity || "",
      types: p.types || [],
      user_ratings_total: p.user_ratings_total || 0,
    };
  }
}
