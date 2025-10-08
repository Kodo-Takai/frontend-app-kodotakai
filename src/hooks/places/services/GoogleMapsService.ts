import type { LatLng } from "../types";
import { CacheService } from "./CacheService";

// Configuración centralizada
const CONFIG = {
  API_KEY: import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY,
  SCRIPT_ID: "google-maps-script",
  API_CHECK_ATTEMPTS: 50,
  API_CHECK_INTERVAL: 100,
  LOCATION_CACHE_TTL: 30000,
  FALLBACK_LOCATION: { lat: -12.0464, lng: -77.0428 } as LatLng,
  SEARCH_RADII: [2000, 10000, 30000],
  GEOLOCATION_OPTIONS: {
    enableHighAccuracy: true,
    timeout: 20000,
    maximumAge: 60000,
  },
  CATEGORY_CONFIGS: {
    PHOTO_REQUIRED: ['restaurants', 'hotels', 'discos', 'beaches'],
    RATING_REQUIRED: ['restaurants', 'hotels'],
    LOW_RATING: ['estudiar', 'parques', 'destinations', 'tourist_attraction'],
    CATEGORY_KEYWORDS: {
      beaches: ['playa', 'beach', 'costa', 'playas'],
      restaurants: ['restaurant', 'restaurante', 'comida', 'gastronomía', 'cocina', 'café'],
      hotels: ['hotel', 'hospedaje', 'hostal', 'alojamiento', 'resort'],
      discos: ['discoteca', 'club nocturno', 'bar', 'pub', 'nightclub'],
      estudiar: ['biblioteca', 'centro de estudios', 'universidad', 'colegio', 'academia'],
      parques: ['parque', 'jardín', 'espacio verde', 'naturaleza', 'bosque'],
      destinations: ['museo', 'feria', 'artesanía', 'galería', 'arte', 'templo', 'historia', 'cultura', 'teatro'],
      tourist_attraction: ['monumento', 'estatua', 'memorial', 'hito', 'iglesia', 'catedral', 'basílica']
    }
  }
} as const;

export class GoogleMapsService {
  private static mapsApiLoaded: Promise<void> | null = null;

  // Carga asíncrona de la API de Google Maps
  static async loadApi(): Promise<void> {
    if (this.mapsApiLoaded) return this.mapsApiLoaded;

    this.mapsApiLoaded = new Promise((resolve, reject) => {
      if (this.isApiReady()) return resolve();

      const existingScript = document.getElementById(CONFIG.SCRIPT_ID);
      if (existingScript) {
        this.waitForApi(resolve);
        return;
      }

      this.loadScript(resolve, reject);
    });

    return this.mapsApiLoaded;
  }

  // Verificar si la API está lista
  private static isApiReady(): boolean {
    return Boolean(window.google?.maps?.places?.PlacesService);
  }

  // Esperar a que la API esté disponible
  private static waitForApi(resolve: () => void): void {
    const checkApi = () => {
      if (this.isApiReady()) {
        resolve();
      } else {
        setTimeout(checkApi, CONFIG.API_CHECK_INTERVAL);
      }
    };
    checkApi();
  }

  // Cargar script de Google Maps
  private static loadScript(resolve: () => void, reject: (error: Error) => void): void {
    const script = document.createElement("script");
    script.id = CONFIG.SCRIPT_ID;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${CONFIG.API_KEY}&libraries=places&v=weekly`;
    script.async = true;
    script.defer = true;

    script.onload = () => this.waitForApiWithRetries(resolve, reject);
    script.onerror = () => reject(new Error("Failed to load Google Maps API"));
    
    document.head.appendChild(script);
  }

  // Esperar API con reintentos limitados
  private static waitForApiWithRetries(resolve: () => void, reject: (error: Error) => void): void {
    let attempts = 0;
    const checkApi = () => {
      if (this.isApiReady()) {
        resolve();
      } else if (++attempts < CONFIG.API_CHECK_ATTEMPTS) {
        setTimeout(checkApi, CONFIG.API_CHECK_INTERVAL);
      } else {
        reject(new Error("Google Maps API failed to initialize"));
      }
    };
    checkApi();
  }

  // Obtener ubicación del usuario con caché
  static async getUserLocation(): Promise<LatLng> {
    const cacheKey = "user_location";
    const cached = CacheService.get<LatLng>(cacheKey);
    if (cached) return cached;

    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        return resolve(CONFIG.FALLBACK_LOCATION);
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const location = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          CacheService.set(cacheKey, location, CONFIG.LOCATION_CACHE_TTL);
          resolve(location);
        },
        () => resolve(CONFIG.FALLBACK_LOCATION),
        CONFIG.GEOLOCATION_OPTIONS
      );
    });
  }

  // Crear instancia del servicio Places
  static createService(): google.maps.places.PlacesService {
    return new window.google.maps.places.PlacesService(document.createElement("div"));
  }

  // Forzar nueva ubicación
  static async forceNewLocation(): Promise<LatLng> {
    CacheService.delete("user_location");
    return this.getUserLocation();
  }

  // Verificar si es ubicación real
  static isUsingRealLocation(location: LatLng): boolean {
    return !(location.lat === CONFIG.FALLBACK_LOCATION.lat && location.lng === CONFIG.FALLBACK_LOCATION.lng);
  }

  // Búsqueda nearby en múltiples radios
  static async searchNearby(
    service: google.maps.places.PlacesService,
    location: LatLng,
    type: string
  ): Promise<google.maps.places.PlaceResult[]> {
    const results = await Promise.all(
      CONFIG.SEARCH_RADII.map(radius => this.performNearbySearch(service, location, type, radius))
    );
    return this.deduplicatePlaces(results.flat());
  }

  // Ejecutar búsqueda nearby individual
  private static performNearbySearch(
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

  // Eliminar duplicados por place_id
  private static deduplicatePlaces(places: google.maps.places.PlaceResult[]): google.maps.places.PlaceResult[] {
    const uniqueResults = new Map<string, google.maps.places.PlaceResult>();
    places.forEach((place) => {
      if (place.place_id && !uniqueResults.has(place.place_id)) {
        uniqueResults.set(place.place_id, place);
      }
    });
    return Array.from(uniqueResults.values());
  }

  // Búsqueda por texto
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

  // Formatear resultado de Google Places
  static formatPlaceResult(p: google.maps.places.PlaceResult, category?: string): any {
    if (!p.place_id || !p.name || !p.geometry?.location) return null;
    
    const categoryConfig = this.getCategoryConfig(category);
    
    if (!p.rating || p.rating < categoryConfig.minRating) return null;
    if (categoryConfig.requirePhotos && (!p.photos?.length)) return null;
    if (categoryConfig.requireRatingsTotal && (!p.user_ratings_total || p.user_ratings_total < 1)) return null;
    
    // Validación específica por categoría
    if (category && !this.isCategoryRelated(p, category)) return null;

    return {
      id: p.place_id,
      name: p.name,
      location: p.geometry.location.toJSON(),
      rating: p.rating,
      photo_url: p.photos?.[0]?.getUrl() || "",
      place_id: p.place_id,
      vicinity: p.vicinity || "",
      types: p.types || [],
      user_ratings_total: p.user_ratings_total || 0,
    };
  }

  // Validar si un lugar está relacionado con la categoría específica
  private static isCategoryRelated(place: google.maps.places.PlaceResult, category: string): boolean {
    const categoryKeywords = CONFIG.CATEGORY_CONFIGS.CATEGORY_KEYWORDS[category as keyof typeof CONFIG.CATEGORY_CONFIGS.CATEGORY_KEYWORDS];
    
    // Si no hay palabras clave definidas para la categoría, permitir el lugar
    if (!categoryKeywords) return true;
    
    const searchText = [
      place.name,
      place.vicinity,
      place.formatted_address,
      place.types?.join(" ")
    ].filter(Boolean).join(" ").toLowerCase();

    return categoryKeywords.some(keyword => 
      searchText.includes(keyword.toLowerCase())
    );
  }

  // Configuración de validación por categoría
  private static getCategoryConfig(category?: string) {
    const categoryStr = category || '';
    return {
      minRating: CONFIG.CATEGORY_CONFIGS.LOW_RATING.includes(categoryStr as any) ? 1.0 : 2.0,
      requirePhotos: CONFIG.CATEGORY_CONFIGS.PHOTO_REQUIRED.includes(categoryStr as any),
      requireRatingsTotal: CONFIG.CATEGORY_CONFIGS.RATING_REQUIRED.includes(categoryStr as any)
    };
  }
}
