import type { LatLng } from "../types";
import { CacheService } from "./CacheService";

const FALLBACK_LOCATION: LatLng = { lat: -12.0464, lng: -77.0428 };
const API_KEY = import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY;
const SEARCH_RADII = [2000, 10000, 15000];
const MIN_RATING = 2.0;
const MIN_REVIEWS = 3;
const SCRIPT_ID = "google-maps-script";
const API_CHECK_ATTEMPTS = 50;
const API_CHECK_INTERVAL = 100;
const LOCATION_CACHE_TTL = 30000;
const GEOLOCATION_TIMEOUT = 15000;
const GEOLOCATION_MAX_AGE = 300000;

export class GoogleMapsService {
  private static mapsApiLoaded: Promise<void> | null = null;

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

      script.onerror = () => reject(new Error("Failed to load Google Maps API"));
      document.head.appendChild(script);
    });

    return this.mapsApiLoaded;
  }

  static async getUserLocation(): Promise<LatLng> {
    const cacheKey = "user_location";
    const cached = CacheService.get<LatLng>(cacheKey);
    if (cached) {
      return cached;
    }

    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        return resolve(FALLBACK_LOCATION);
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const location = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          CacheService.set(cacheKey, location, LOCATION_CACHE_TTL);
          resolve(location);
        },
        () => resolve(FALLBACK_LOCATION),
        { 
          enableHighAccuracy: true, 
          timeout: GEOLOCATION_TIMEOUT, 
          maximumAge: GEOLOCATION_MAX_AGE 
        }
      );
    });
  }

  static createService(): google.maps.places.PlacesService {
    return new window.google.maps.places.PlacesService(document.createElement("div"));
  }

  static async forceNewLocation(): Promise<LatLng> {
    CacheService.delete("user_location");
    return this.getUserLocation();
  }

  static isUsingRealLocation(location: LatLng): boolean {
    const fallback = FALLBACK_LOCATION;
    return !(location.lat === fallback.lat && location.lng === fallback.lng);
  }

  static async searchNearby(
    service: google.maps.places.PlacesService,
    location: LatLng,
    type: string
  ): Promise<google.maps.places.PlaceResult[]> {
    const results = await Promise.all(
      SEARCH_RADII.map(radius => 
        new Promise<google.maps.places.PlaceResult[]>((resolve) => {
          service.nearbySearch({ location, radius, type }, (results, status) => {
            resolve(status === "OK" && results ? results : []);
          });
        })
      )
    );

    const uniqueResults = new Map();
    results.flat().forEach(place => {
      if (place.place_id && !uniqueResults.has(place.place_id)) {
        uniqueResults.set(place.place_id, place);
      }
    });

    return Array.from(uniqueResults.values());
  }

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

  static formatPlaceResult(p: google.maps.places.PlaceResult): any {
    if (!p.place_id || !p.name || !p.geometry?.location) return null;
    if (!p.rating || p.rating < MIN_RATING) return null;
    if (!p.photos || p.photos.length === 0) return null;
    if (!p.user_ratings_total || p.user_ratings_total < MIN_REVIEWS) return null;

    return {
      id: p.place_id,
      name: p.name,
      location: p.geometry.location.toJSON(),
      rating: p.rating,
      photo_url: p.photos[0]?.getUrl() || "",
      place_id: p.place_id || "",
    };
  }
}