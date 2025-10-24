import { useState, useEffect, useCallback } from "react";
import { GoogleMapsService } from "../services/GoogleMapsService";
import type { LatLng } from "../types";

interface NearbyPlace {
  id: string;
  name: string;
  location: LatLng;
  rating?: number;
  photo_url?: string;
  place_id: string;
  vicinity?: string;
  types?: string[];
  user_ratings_total?: number;
  distance?: number; // Distancia en metros
}

interface UseNearbyPlacesOptions {
  radius?: number; // Radio de búsqueda en metros (default: 2000)
  type?: string; // Tipo de lugar (restaurant, hotel, etc.)
  limit?: number; // Límite de resultados (default: 10)
  minRating?: number; // Rating mínimo (default: 3.0)
  autoFetch?: boolean; // Si debe buscar automáticamente (default: false)
}

interface UseNearbyPlacesResult {
  places: NearbyPlace[];
  loading: boolean;
  error: string | null;
  fetchNearbyPlaces: (location: LatLng) => Promise<void>;
  clearPlaces: () => void;
}

/**
 * Hook para obtener lugares cercanos a una ubicación específica usando Google Places API
 * 
 * @example
 * ```tsx
 * const { places, loading, fetchNearbyPlaces } = useNearbyPlaces({
 *   radius: 5000,
 *   type: 'restaurant',
 *   limit: 10,
 *   minRating: 4.0
 * });
 * 
 * // Buscar lugares cercanos a una ubicación
 * fetchNearbyPlaces({ lat: -12.0464, lng: -77.0428 });
 * ```
 */
export function useNearbyPlaces(options: UseNearbyPlacesOptions = {}): UseNearbyPlacesResult {
  const {
    radius = 2000,
    type,
    limit = 10,
    minRating = 3.0,
    autoFetch = false,
  } = options;

  const [places, setPlaces] = useState<NearbyPlace[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [targetLocation, setTargetLocation] = useState<LatLng | null>(null);

  // Calcular distancia entre dos puntos (fórmula de Haversine)
  const calculateDistance = useCallback((lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371000; // Radio de la Tierra en metros
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLng = (lng2 - lng1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }, []);

  const fetchNearbyPlaces = useCallback(
    async (location: LatLng) => {
      setLoading(true);
      setError(null);
      setTargetLocation(location);

      try {
        // Cargar Google Maps API
        await GoogleMapsService.loadApi();

        // Crear servicio de Places
        const service = GoogleMapsService.createService();

        // Buscar lugares cercanos
        const results = await new Promise<google.maps.places.PlaceResult[]>((resolve) => {
          const request: google.maps.places.PlaceSearchRequest = {
            location,
            radius,
          };

          // Agregar tipo si se especifica
          if (type) {
            request.type = type;
          }

          service.nearbySearch(request, (results, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
              resolve(results);
            } else {
              resolve([]);
            }
          });
        });

        // Procesar y filtrar resultados
        const mappedPlaces = results
          .map((place) => {
            if (!place.place_id || !place.name || !place.geometry?.location) {
              return null;
            }

            const placeLocation = place.geometry.location.toJSON();
            const distance = calculateDistance(
              location.lat,
              location.lng,
              placeLocation.lat,
              placeLocation.lng
            );

            return {
              id: place.place_id,
              name: place.name,
              location: placeLocation,
              rating: place.rating,
              photo_url: place.photos?.[0]?.getUrl({ maxWidth: 400, maxHeight: 200 }),
              place_id: place.place_id,
              vicinity: place.vicinity || place.formatted_address || "",
              types: place.types || [],
              user_ratings_total: place.user_ratings_total,
              distance,
            } as NearbyPlace;
          })
          .filter((place): place is NearbyPlace => {
            if (!place) return false;
            // Filtrar por rating mínimo si se especifica
            if (minRating && place.rating && place.rating < minRating) return false;
            return true;
          });

        // Ordenar por distancia y limitar resultados
        const processedPlaces = mappedPlaces
          .sort((a, b) => {
            const distA = a.distance || 0;
            const distB = b.distance || 0;
            return distA - distB;
          })
          .slice(0, limit);

        setPlaces(processedPlaces);
        setLoading(false);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Error al buscar lugares cercanos";
        setError(errorMessage);
        setLoading(false);
        console.error("Error fetching nearby places:", err);
      }
    },
    [radius, type, limit, minRating, calculateDistance]
  );

  const clearPlaces = useCallback(() => {
    setPlaces([]);
    setError(null);
    setTargetLocation(null);
  }, []);

  // Auto-fetch si se especifica una ubicación inicial
  useEffect(() => {
    if (autoFetch && targetLocation) {
      fetchNearbyPlaces(targetLocation);
    }
  }, [autoFetch, targetLocation, fetchNearbyPlaces]);

  return {
    places,
    loading,
    error,
    fetchNearbyPlaces,
    clearPlaces,
  };
}

// Hook especializado para restaurantes cercanos
export function useNearbyRestaurants(location?: LatLng, options: Omit<UseNearbyPlacesOptions, 'type'> = {}) {
  return useNearbyPlaces({
    ...options,
    type: 'restaurant',
    autoFetch: !!location,
  });
}

// Hook especializado para hoteles cercanos
export function useNearbyHotels(location?: LatLng, options: Omit<UseNearbyPlacesOptions, 'type'> = {}) {
  return useNearbyPlaces({
    ...options,
    type: 'lodging',
    autoFetch: !!location,
  });
}

// Hook especializado para atracciones turísticas cercanas
export function useNearbyAttractions(location?: LatLng, options: Omit<UseNearbyPlacesOptions, 'type'> = {}) {
  return useNearbyPlaces({
    ...options,
    type: 'tourist_attraction',
    autoFetch: !!location,
  });
}
