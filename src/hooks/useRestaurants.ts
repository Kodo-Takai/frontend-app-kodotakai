import { useEffect, useState } from "react";

declare global {
  interface Window {
    google: any;
  }
}

type LatLng = { lat: number; lng: number };

const API_KEY = import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY;

const isRestaurant = (place: any): boolean => {
  const types = place.types || [];

  return (
    types.includes("restaurant") ||
    types.includes("restaurante") ||
    types.includes("comedor") ||
    types.includes("fonda") ||
    types.includes("parador")
  );
};

// Función para buscar restaurantes usando Text Search
async function searchRestaurantsWithText(userPosition: LatLng, radius: number) {
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

  // Búsquedas específicas para restaurantes
  const searchQueries = ["restaurant", "comedor", "menu", "restaurante"];

  const allResults: any[] = [];

  for (const query of searchQueries) {
    try {
      const results = await new Promise<any[]>((resolve) => {
        service.textSearch(
          {
            query: query,
            location: userPosition,
            radius: radius,
            type: "restaurant",
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

// Función para obtener fotos adicionales de un lugar específico
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

export const useRestaurants = () => {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState("Buscando restaurantes...");

  useEffect(() => {
    let cancelled = false;

    async function searchRestaurants() {
      try {
        setLoading(true);
        setApiStatus("Obteniendo ubicación...");

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
        await new Promise<void>((resolve) => {
          if (window.google?.maps?.places) return resolve();

          const script = document.createElement("script");
          script.async = true;
          script.defer = true;
          script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places`;
          script.onload = () => resolve();
          document.head.appendChild(script);
        });

        if (cancelled) return;

        setApiStatus("Buscando restaurantes...");

        const textSearchResults = await searchRestaurantsWithText(
          userPosition,
          20000
        );

        // Filtrar solo restaurantes y deduplicar
        const uniqueRestaurants = new Map();

        textSearchResults
          .filter(isRestaurant)
          .filter((place) => (place.rating ?? 0) >= 4.0)
          .forEach((place) => {
            // Usar place_id como clave única, o name si no hay place_id
            const key = place.place_id || place.name;
            if (!uniqueRestaurants.has(key)) {
              uniqueRestaurants.set(key, place);
            }
          });

        const restaurantResults = Array.from(uniqueRestaurants.values())
          .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
          .slice(0, 6);

        if (cancelled) return;

        // Procesar restaurantes
        const processedRestaurants = await Promise.all(
          restaurantResults.map(async (place) => {
            // Obtener fotos adicionales del lugar
            let additionalPhotos: any[] = [];
            if (place.place_id) {
              try {
                additionalPhotos = await getPlacePhotos(place.place_id);
              } catch (error) {
                console.warn(
                  `Error getting additional photos for ${place.name}:`,
                  error
                );
              }
            }

            // Combinar fotos del lugar principal con fotos adicionales
            const allPhotos = [...(place.photos || []), ...additionalPhotos];

            // Usar la primera foto disponible o placeholder
            const photoUrl =
              allPhotos.length > 0
                ? allPhotos[0]?.getUrl?.({ maxWidth: 400, maxHeight: 200 }) ||
                  "https://picsum.photos/400/200?random=restaurant"
                : "https://picsum.photos/400/200?random=restaurant";

            // Mejorar la obtención de ubicación
            let location =
              place.vicinity ||
              place.formatted_address ||
              "Ubicación no disponible";

            // Si no hay ubicación específica, usar la ciudad general
            if (!location || location === "Ubicación no disponible") {
              location = "Bogotá, Colombia"; // Fallback para Colombia
            }

            return {
              name: place.name,
              photo_url: photoUrl,
              rating: place.rating,
              vicinity: location,
            };
          })
        );

        setRestaurants(processedRestaurants);
        setApiStatus(`Encontrados ${processedRestaurants.length} restaurantes`);
        setLoading(false);
      } catch (error) {
        if (!cancelled) {
          console.error("Error searching restaurants:", error);
          setApiStatus(
            "Error: Necesitas permitir la ubicación para buscar restaurantes cercanos"
          );
          setRestaurants([]);
          setLoading(false);
        }
      }
    }

    searchRestaurants();

    return () => {
      cancelled = true;
    };
  }, []);

  return { restaurants, loading, apiStatus };
};
