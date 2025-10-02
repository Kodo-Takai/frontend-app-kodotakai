// src/hooks/usePlaces.ts
import { useEffect, useState } from "react";

declare global {
  interface Window {
    google: any;
  }
}

type LatLng = { lat: number; lng: number };

const API_KEY = import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY;

export type PlaceCategory = "all" | "beaches" | "restaurants" | "hotels";

export interface UsePlacesOptions {
  type?: string;
  category?: PlaceCategory;
  searchMethod?: "nearby" | "text" | "both";
  radius?: number;
  limit?: number;
  minRating?: number;
  customFilters?: (place: any) => boolean;
  searchQueries?: string[];
  fallbackLocation?: LatLng;
  enableMultiplePhotos?: boolean;
}

// ---- Loader singleton (evita cargar el script más de una vez) ----
let gmapsLoader: Promise<void> | null = null;

export function loadGoogleMaps(): Promise<void> {
  if (window.google?.maps?.places) return Promise.resolve();
  if (gmapsLoader) return gmapsLoader;

  gmapsLoader = new Promise<void>((resolve, reject) => {
    const existing = document.getElementById("gmaps-sdk");
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () =>
        reject(new Error("Failed to load Google Maps"))
      );
      return;
    }

    const script = document.createElement("script");
    script.id = "gmaps-sdk";
    script.async = true;
    script.defer = true;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places`;

    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google Maps"));
    document.head.appendChild(script);
  });

  return gmapsLoader;
}

// ---- Funciones de filtrado por categoría ----
const isBeach = (place: any): boolean => {
  const name = place.name?.toLowerCase() || "";
  return name.startsWith("playa");
};

const isRestaurant = (place: any): boolean => {
  const types = place.types || [];
  return (
    types.includes("restaurant") ||
    types.includes("comedor") ||
    types.includes("fonda") ||
    types.includes("parador")
  );
};

// ---- Configuración por categoría ----
const getCategoryConfig = (category: PlaceCategory) => {
  switch (category) {
    case "beaches":
      return {
        searchQueries: ["playa", "beach", "costa", "litoral"],
        type: "establishment",
        minRating: 3.0,
        enableMultiplePhotos: true,
        radius: 50000,
      };
    case "restaurants":
      return {
        searchQueries: ["restaurant", "menu", "restaurante"],
        type: "restaurant",
        minRating: 4.0,
        enableMultiplePhotos: true,
        radius: 20000,
      };
    case "hotels":
      return {
        searchQueries: ["hotel", "hospedaje", "hostal", "motel", "lodging"],
        type: "lodging",
        minRating: 3.5,
        enableMultiplePhotos: true,
        radius: 30000,
      };
    default:
      return {
        searchQueries: ["lugar", "sitio", "destino"],
        type: "tourist_attraction",
        minRating: 4.0,
        enableMultiplePhotos: false,
        radius: 5000,
      };
  }
};

// ---- Función para obtener fotos adicionales ----
async function getPlacePhotos(placeId: string) {
  if (!window.google?.maps?.places) return [];

  const phantom = document.createElement("div");
  phantom.style.width = "0";
  phantom.style.height = "0";
  phantom.style.overflow = "hidden";
  document.body.appendChild(phantom);

  const map = new window.google.maps.Map(phantom, {
    center: { lat: 0, lng: 0 },
    zoom: 12,
  });

  const service = new window.google.maps.places.PlacesService(map);

  try {
    const placeDetails = await new Promise<any>((resolve) => {
      service.getDetails(
        {
          placeId: placeId,
          fields: ["photos", "name", "rating", "vicinity"],
        },
        (place: any, status: string) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            resolve(place);
          } else {
            resolve(null);
          }
        }
      );
    });

    document.body.removeChild(phantom);
    return placeDetails?.photos || [];
  } catch (error) {
    console.warn(`Error getting photos for place ${placeId}:`, error);
    document.body.removeChild(phantom);
    return [];
  }
}

// ---- Búsqueda por texto ----
async function searchWithText(
  userPosition: LatLng,
  radius: number,
  searchQueries: string[],
  type: string
) {
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

  for (const query of searchQueries) {
    try {
      const results = await new Promise<any[]>((resolve) => {
        service.textSearch(
          {
            query: query,
            location: userPosition,
            radius: radius,
            type: type,
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

// ---- Búsqueda por proximidad ----
async function searchNearby(
  userPosition: LatLng,
  radius: number,
  type: string
) {
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
        { location: userPosition, radius, type },
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

// ---- Hook principal mejorado ----
export function usePlaces(options: UsePlacesOptions = {}) {
  const [places, setPlaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState("Inicializando...");

  const {
    category = "all",
    searchMethod = "nearby",
    radius,
    limit = 5,
    minRating,
    customFilters,
    searchQueries,
    fallbackLocation,
    enableMultiplePhotos = false,
  } = options;

  // Obtener configuración de la categoría
  const categoryConfig = getCategoryConfig(category);
  const finalRadius = radius ?? categoryConfig.radius;
  const finalMinRating = minRating ?? categoryConfig.minRating;
  const finalSearchQueries = searchQueries ?? categoryConfig.searchQueries;
  const finalEnableMultiplePhotos =
    enableMultiplePhotos || categoryConfig.enableMultiplePhotos;

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        setApiStatus("Obteniendo ubicación...");

        // Obtener ubicación del usuario
        const userPosition = await new Promise<LatLng>((resolve, reject) => {
          if (!("geolocation" in navigator)) {
            reject(new Error("Geolocalización no disponible"));
            return;
          }
          navigator.geolocation.getCurrentPosition(
            ({ coords }) =>
              resolve({ lat: coords.latitude, lng: coords.longitude }),
            (error) => {
              console.error("Error obteniendo ubicación:", error);
              reject(error);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
          );
        });

        if (cancelled) return;

        setApiStatus("Cargando Google Maps...");
        await loadGoogleMaps();
        if (cancelled) return;

        setApiStatus(`Buscando ${category}...`);

        let allResults: any[] = [];

        // Búsqueda por texto si está habilitada
        if (searchMethod === "text" || searchMethod === "both") {
          const textResults = await searchWithText(
            userPosition,
            finalRadius,
            finalSearchQueries,
            categoryConfig.type
          );
          allResults.push(...textResults);
        }

        // Búsqueda por proximidad si está habilitada
        if (searchMethod === "nearby" || searchMethod === "both") {
          const nearbyResults = await searchNearby(
            userPosition,
            finalRadius,
            categoryConfig.type
          );
          allResults.push(...nearbyResults);
        }

        if (cancelled) return;

        // Aplicar filtros específicos por categoría
        let filteredResults = allResults;

        if (category === "beaches") {
          filteredResults = allResults.filter(isBeach);
        } else if (category === "restaurants") {
          filteredResults = allResults.filter(isRestaurant);
        }

        // Aplicar filtros adicionales
        filteredResults = filteredResults
          .filter((place) => (place.rating ?? 0) >= finalMinRating)
          .filter((place) => !customFilters || customFilters(place));

        // Eliminar duplicados
        const uniqueResults = new Map();
        filteredResults.forEach((place) => {
          const key = place.place_id || place.name;
          if (!uniqueResults.has(key)) {
            uniqueResults.set(key, place);
          }
        });

        const finalResults = Array.from(uniqueResults.values())
          .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
          .slice(0, limit);

        if (cancelled) return;

        // Procesar resultados según la categoría
        let processedResults: any[] = [];

        if (
          (category === "beaches" || category === "restaurants") &&
          finalEnableMultiplePhotos
        ) {
          // Procesamiento especial para playas y restaurantes con múltiples fotos
          const placeGroups = new Map();
          finalResults.forEach((place) => {
            const placeName = place.name;
            if (!placeGroups.has(placeName)) {
              placeGroups.set(placeName, []);
            }
            placeGroups.get(placeName).push(place);
          });

          processedResults = await Promise.all(
            Array.from(placeGroups.entries()).map(async ([name, places]) => {
              // Tomar el primer lugar como principal
              const mainPlace = places[0];

              // Obtener fotos adicionales del lugar principal
              let additionalPhotos: any[] = [];
              if (mainPlace.place_id) {
                try {
                  additionalPhotos = await getPlacePhotos(mainPlace.place_id);
                } catch (error) {
                  console.warn(
                    `Error getting additional photos for ${name}:`,
                    error
                  );
                }
              }

              const allPhotos = [
                ...(mainPlace.photos || []),
                ...additionalPhotos,
              ];

              const photos = [];

              //Primera foto disponible del lugar
              if (allPhotos.length > 0) {
                photos.push({
                  photo_url:
                    allPhotos[0]?.getUrl?.({ maxWidth: 400, maxHeight: 200 }) ||
                    "https://picsum.photos/400/200?random=1",
                  rating: mainPlace.rating,
                  vicinity: mainPlace.vicinity,
                });
              } else {
                photos.push({
                  photo_url: "https://picsum.photos/400/200?random=1",
                  rating: mainPlace.rating,
                  vicinity: mainPlace.vicinity,
                });
              }

              //Segunda foto del lugar o primera foto de lugar similar
              if (allPhotos.length > 1) {
                photos.push({
                  photo_url:
                    allPhotos[1]?.getUrl?.({ maxWidth: 400, maxHeight: 200 }) ||
                    "https://picsum.photos/400/200?random=2",
                  rating: mainPlace.rating,
                  vicinity: mainPlace.vicinity,
                });
              } else if (
                places.length > 1 &&
                places[1].photos &&
                places[1].photos.length > 0
              ) {
                // Usar foto de un lugar similar en la misma área
                photos.push({
                  photo_url:
                    places[1].photos[0]?.getUrl?.({
                      maxWidth: 400,
                      maxHeight: 200,
                    }) || "https://picsum.photos/400/200?random=2",
                  rating: places[1].rating,
                  vicinity: places[1].vicinity,
                });
              } else {
                // Si no hay fotos disponibles, usar placeholder
                photos.push({
                  photo_url: "https://picsum.photos/400/200?random=2",
                  rating: mainPlace.rating,
                  vicinity: mainPlace.vicinity,
                });
              }

              // Foto 3: Tercera foto del lugar o foto de otro lugar similar
              if (allPhotos.length > 2) {
                // Usar tercera foto del mismo lugar
                photos.push({
                  photo_url:
                    allPhotos[2]?.getUrl?.({ maxWidth: 400, maxHeight: 200 }) ||
                    "https://picsum.photos/400/200?random=3",
                  rating: mainPlace.rating,
                  vicinity: mainPlace.vicinity,
                });
              } else if (
                places.length > 2 &&
                places[2].photos &&
                places[2].photos.length > 0
              ) {
                // Usar foto de otro lugar similar en la misma área
                photos.push({
                  photo_url:
                    places[2].photos[0]?.getUrl?.({
                      maxWidth: 400,
                      maxHeight: 200,
                    }) || "https://picsum.photos/400/200?random=3",
                  rating: places[2].rating,
                  vicinity: places[2].vicinity,
                });
              } else if (
                places.length > 1 &&
                places[1].photos &&
                places[1].photos.length > 1
              ) {
                // Usar segunda foto del segundo lugar similar
                photos.push({
                  photo_url:
                    places[1].photos[1]?.getUrl?.({
                      maxWidth: 400,
                      maxHeight: 200,
                    }) || "https://picsum.photos/400/200?random=3",
                  rating: places[1].rating,
                  vicinity: places[1].vicinity,
                });
              } else {
                // Si no hay fotos disponibles, usar placeholder
                photos.push({
                  photo_url: "https://picsum.photos/400/200?random=3",
                  rating: mainPlace.rating,
                  vicinity: mainPlace.vicinity,
                });
              }

              return {
                name,
                photos,
                mainPhoto: photos[0],
                photo_url: photos[0]?.photo_url || "https://picsum.photos/400/200?random=restaurant",
                rating: mainPlace.rating,
                vicinity: mainPlace.vicinity || mainPlace.formatted_address || "Ubicación no disponible",
              };
            })
          );
        } else {
          // Procesamiento estándar para otras categorías
          processedResults = await Promise.all(
            finalResults.map(async (place) => {
              let additionalPhotos: any[] = [];

              if (place.place_id) {
                try {
                  additionalPhotos = await getPlacePhotos(place.place_id);
                } catch (error) {
                  console.warn(
                    `Error getting photos for ${place.name}:`,
                    error
                  );
                }
              }

              const allPhotos = [...(place.photos || []), ...additionalPhotos];
              const photoUrl =
                allPhotos.length > 0
                  ? allPhotos[0]?.getUrl?.({ maxWidth: 400, maxHeight: 200 }) ||
                    `https://picsum.photos/400/200?random=${category}`
                  : `https://picsum.photos/400/200?random=${category}`;

              return {
                name: place.name,
                photo_url: photoUrl,
                rating: place.rating,
                vicinity:
                  place.vicinity ||
                  place.formatted_address ||
                  "Ubicación no disponible",
                place_id: place.place_id,
                location: place.geometry?.location?.toJSON?.(),
              };
            })
          );
        }

        if (cancelled) return;

        setPlaces(processedResults);
        setApiStatus(`Encontrados ${processedResults.length} ${category}`);
        setLoading(false);
      } catch (error) {
        if (!cancelled) {
          console.error(`Error searching ${category}:`, error);
          setApiStatus(
            `Error: Necesitas permitir la ubicación para buscar ${category} cercanos`
          );
          setPlaces([]);
          setLoading(false);
        }
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [
    category,
    searchMethod,
    finalRadius,
    limit,
    finalMinRating,
    fallbackLocation?.lat,
    fallbackLocation?.lng,
  ]);

  return { places, loading, apiStatus };
}

export const useBeaches = () =>
  usePlaces({
    category: "beaches",
    searchMethod: "text",
    limit: 10,
    enableMultiplePhotos: true,
  });

export const useRestaurants = () =>
  usePlaces({
    category: "restaurants",
    searchMethod: "both",
    limit: 6,
    enableMultiplePhotos: true,
  });
