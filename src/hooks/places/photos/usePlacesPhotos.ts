// src/hooks/places/photos/usePlacesPhotos.ts
import { useState, useEffect, useMemo, useCallback } from "react";

// Service para manejo de fotos
class PhotosService {
  async getPlacePhotos(placeId: string): Promise<any[]> {
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

  processPhotos(place: any, additionalPhotos: any[] = []): any {
    const allPhotos = [...(place.photos || []), ...additionalPhotos];
    
    if (allPhotos.length === 0) {
      return {
        photo_url: "https://picsum.photos/400/200?random=1",
        photos: [{
          photo_url: "https://picsum.photos/400/200?random=1",
          rating: place.rating,
          vicinity: place.vicinity,
        }]
      };
    }

    const photos = allPhotos.slice(0, 3).map((photo, index) => ({
      photo_url: photo?.getUrl?.({ maxWidth: 400, maxHeight: 200 }) || 
                `https://picsum.photos/400/200?random=${index + 1}`,
      rating: place.rating,
      vicinity: place.vicinity,
    }));

    return {
      photo_url: photos[0]?.photo_url || "https://picsum.photos/400/200?random=1",
      photos,
      mainPhoto: photos[0]
    };
  }
}

export function usePlacesPhotos(places: any[], enableMultiplePhotos: boolean = false) {
  const [processedPlaces, setProcessedPlaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Memoizar la clave única para evitar re-renders innecesarios
  const placesKey = useMemo(() => {
    return places.map(place => place.place_id || place.name).join(',');
  }, [places]);

  // Función memoizada para procesar lugares
  const processPlaces = useCallback(async (placesToProcess: any[], enableMultiple: boolean) => {
    if (!placesToProcess.length) {
      setProcessedPlaces([]);
      return;
    }

    if (!enableMultiple) {
      // Procesamiento simple sin fotos múltiples
      const simpleProcessed = placesToProcess.map(place => {
        // Debug: Verificar estructura del lugar
        console.log('Procesando lugar:', {
          name: place.name,
          geometry: place.geometry,
          hasGeometry: !!place.geometry,
          hasLocation: !!place.geometry?.location,
          locationType: typeof place.geometry?.location,
          locationMethods: place.geometry?.location ? Object.getOwnPropertyNames(place.geometry.location) : [],
          locationKeys: place.geometry?.location ? Object.keys(place.geometry.location) : []
        });
        
        // Extraer ubicación de manera más robusta
        let location = null;
        if (place.geometry?.location) {
          if (typeof place.geometry.location.toJSON === 'function') {
            location = place.geometry.location.toJSON();
          } else if (typeof place.geometry.location.lat === 'function' && typeof place.geometry.location.lng === 'function') {
            location = {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng()
            };
          } else if (place.geometry.location.lat && place.geometry.location.lng) {
            location = {
              lat: place.geometry.location.lat,
              lng: place.geometry.location.lng
            };
          }
        }
        
        console.log('Ubicación extraída:', {
          name: place.name,
          geometry: place.geometry,
          location: location,
          hasLocation: !!location
        });
        
        return {
          name: place.name,
          photo_url: place.photos?.[0]?.getUrl?.({ maxWidth: 400, maxHeight: 200 }) || 
                    `https://picsum.photos/400/200?random=${place.name}`,
          rating: place.rating,
          vicinity: place.vicinity || place.formatted_address || "Ubicación no disponible",
          place_id: place.place_id,
          location: location,
        };
      });
      setProcessedPlaces(simpleProcessed);
      return;
    }

    // Procesamiento con fotos múltiples
    setLoading(true);
    
    try {
      const photosService = new PhotosService();
      const placeGroups = new Map();

      // Agrupar lugares por place_id
      placesToProcess.forEach((place) => {
        const placeKey = place.place_id || place.name;
        if (!placeGroups.has(placeKey)) {
          placeGroups.set(placeKey, []);
        }
        placeGroups.get(placeKey).push(place);
      });

      const processedResults = await Promise.all(
        Array.from(placeGroups.entries()).map(async ([, places]) => {
          const mainPlace = places[0];
          const name = mainPlace.name;

          let additionalPhotos: any[] = [];
          if (mainPlace.place_id) {
            try {
              additionalPhotos = await photosService.getPlacePhotos(mainPlace.place_id);
            } catch (error) {
              console.warn(`Error getting additional photos for ${name}:`, error);
            }
          }

          const photoData = photosService.processPhotos(mainPlace, additionalPhotos);

          return {
            name,
            ...photoData,
            rating: mainPlace.rating,
            vicinity: mainPlace.vicinity || mainPlace.formatted_address || "Ubicación no disponible",
          };
        })
      );

      setProcessedPlaces(processedResults);
    } catch (error) {
      console.error('Error processing places:', error);
      setProcessedPlaces([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    processPlaces(places, enableMultiplePhotos);
  }, [placesKey, enableMultiplePhotos, processPlaces]);

  return { processedPlaces, loading };
}
