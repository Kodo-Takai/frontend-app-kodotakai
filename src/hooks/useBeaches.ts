import { useEffect, useState } from "react";

declare global {
  interface Window {
    google: any;
  }
}

type LatLng = { lat: number; lng: number };

const API_KEY = import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY;

const isBeach = (place: any): boolean => {
  const name = place.name?.toLowerCase() || "";

  return name.startsWith("playa");
};

async function searchBeachesWithText(userPosition: LatLng, radius: number) {
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

  const searchQueries = ["playa", "beach", "costa", "litoral"];

  const allResults: any[] = [];

  for (const query of searchQueries) {
    try {
      const results = await new Promise<any[]>((resolve) => {
        service.textSearch(
          {
            query: query,
            location: userPosition,
            radius: radius,
            type: "establishment",
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

export const useBeaches = () => {
  const [beaches, setBeaches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState("Buscando playas...");

  useEffect(() => {
    let cancelled = false;

    async function searchBeaches() {
      try {
        setLoading(true);
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

        setApiStatus("Buscando playas...");

        // Búsqueda principal con Text Search
        const textSearchResults = await searchBeachesWithText(
          userPosition,
          50000
        );

        const beachResults = textSearchResults
          .filter(isBeach)
          .filter((place) => (place.rating ?? 0) >= 3.0)
          .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
          .slice(0, 10);

        if (cancelled) return;

        const beachGroups = new Map();
        beachResults.forEach((place) => {
          const beachName = place.name;
          if (!beachGroups.has(beachName)) {
            beachGroups.set(beachName, []);
          }
          beachGroups.get(beachName).push(place);
        });

        // Procesar playas y obtener fotos adicionales
        const processedBeaches = await Promise.all(
          Array.from(beachGroups.entries()).map(async ([name, places]) => {
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
              rating: mainPlace.rating,
              vicinity: mainPlace.vicinity,
            };
          })
        );

        setBeaches(processedBeaches);
        setApiStatus(`Encontradas ${processedBeaches.length} playas`);
        setLoading(false);
      } catch (error) {
        if (!cancelled) {
          console.error("Error searching beaches:", error);
          setApiStatus(
            "Error: Necesitas permitir la ubicación para buscar playas cercanas"
          );
          setBeaches([]);
          setLoading(false);
        }
      }
    }

    searchBeaches();

    return () => {
      cancelled = true;
    };
  }, []);

  return { beaches, loading, apiStatus };
};
