import { useState, useEffect } from "react";
import type { Place, EnrichedPlace, PlaceCategory, LatLng } from "./types";
import { GoogleMapsService } from "./services/GoogleMapsService";
import { EnrichmentService } from "./services/EnrichmentService";
import { SmartSearchService } from "./services/SmartSearchService";

const FALLBACK_LOCATION: LatLng = { lat: -12.0464, lng: -77.0428 };

// Hook optimizado para búsqueda de lugares
export const usePlaces = (options: {
  category: PlaceCategory;
  searchQuery?: string;
  enableEnrichment?: boolean;
  maxResults?: number;
}) => {
  const { category, searchQuery, enableEnrichment = true, maxResults = 20 } = options;

  const [places, setPlaces] = useState<EnrichedPlace[]>([]);
  const [mapCenter, setMapCenter] = useState<LatLng>(FALLBACK_LOCATION);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("Inicializando...");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlaces = async () => {
      setLoading(true);
      setError(null);
      setStatus("Cargando Google Maps API...");

      try {
        await GoogleMapsService.loadApi();
        let formattedPlaces: Place[] = [];

        if (searchQuery) {
          setStatus(`Buscando "${searchQuery}"...`);
          const service = GoogleMapsService.createService();
          const results = await GoogleMapsService.searchByText(service, searchQuery);
          formattedPlaces = results
            .map((p) => GoogleMapsService.formatPlaceResult(p, category))
            .filter((p): p is Place => p !== null)
            .slice(0, maxResults) as Place[];
        } else {
          setStatus(`Buscando ${category}...`);
          const userLocation = await GoogleMapsService.getUserLocation();
          setMapCenter(userLocation);

          const isRealLocation = GoogleMapsService.isUsingRealLocation(userLocation);
          setStatus(isRealLocation ? `Buscando ${category} cerca de ti...` : `Buscando ${category} en ubicación por defecto...`);

          formattedPlaces = await SmartSearchService.searchPlaces(category, userLocation, maxResults);
        }

        if (enableEnrichment && formattedPlaces.length > 0) {
          setStatus("Enriqueciendo datos...");
          const enrichedPlaces = await EnrichmentService.enrichPlaces(formattedPlaces, category);
          setPlaces(enrichedPlaces);
          setStatus(`${enrichedPlaces.length} lugares encontrados`);
        } else {
          setPlaces(formattedPlaces as EnrichedPlace[]);
          setStatus(`${formattedPlaces.length} lugares encontrados`);
        }
      } catch (error) {
        console.error("Error en usePlaces:", error);
        setPlaces([]);

        const errorMessage = error instanceof Error 
          ? error.message.includes("Google Maps API") 
            ? "Error de conexión con Google Maps"
            : error.message.includes("geolocation")
            ? "Error al obtener ubicación"
            : error.message
          : "Error al cargar lugares";

        setError(errorMessage);
        setStatus("Error al cargar lugares");
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, [category, searchQuery, enableEnrichment, maxResults]);

  return { places, mapCenter, loading, status, error };
};
