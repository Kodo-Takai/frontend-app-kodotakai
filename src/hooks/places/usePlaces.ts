import { useState, useEffect } from "react";
import type { Place, EnrichedPlace, PlaceCategory, LatLng } from "./types";
import { GoogleMapsService } from "./services/GoogleMapsService";
import { EnrichmentService } from "./services/EnrichmentService";
import { SmartSearchService } from "./services/SmartSearchService";

export const usePlaces = (options: {
  category: PlaceCategory;
  searchQuery?: string;
  enableEnrichment?: boolean;
  maxResults?: number;
  fallbackLocation?: LatLng;
}) => {
  const { category, searchQuery, enableEnrichment = true, maxResults = 20, fallbackLocation } = options;
  
  const [places, setPlaces] = useState<EnrichedPlace[]>([]);
  const [mapCenter, setMapCenter] = useState<LatLng | null>(null);
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
            .map(GoogleMapsService.formatPlaceResult)
            .filter((p): p is Place => p !== null)
            .slice(0, maxResults) as Place[];
        } else {
          setStatus(`Buscando ${category}...`);
          const userLocation = await GoogleMapsService.getUserLocation();
          setMapCenter(userLocation);
          
          const isRealLocation = GoogleMapsService.isUsingRealLocation(userLocation);
          if (isRealLocation) {
            setStatus(`Buscando ${category} cerca de ti...`);
          } else {
            if (fallbackLocation) {
              setStatus(`Buscando ${category} en ubicación especificada...`);
              setMapCenter(fallbackLocation);
              formattedPlaces = await SmartSearchService.searchPlaces(
                category, 
                fallbackLocation, 
                maxResults
              );
            } else {
              setStatus(`No se pudo obtener tu ubicación. Por favor, permite el acceso a la ubicación o proporciona una ubicación específica.`);
              setError("Ubicación no disponible");
              setLoading(false);
              return;
            }
          }
          
          if (isRealLocation || !fallbackLocation) {
            formattedPlaces = await SmartSearchService.searchPlaces(
              category, 
              userLocation, 
              maxResults
            );
          }
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

        if (formattedPlaces.length > 0 && formattedPlaces[0]) {
          setMapCenter(formattedPlaces[0].location);
        }

      } catch (error) {
        console.error("Error en usePlaces:", error);
        setPlaces([]);
        
        let errorMessage = "Error al cargar lugares";
        if (error instanceof Error) {
          if (error.message.includes("Google Maps API")) {
            errorMessage = "Error de conexión con Google Maps";
          } else if (error.message.includes("geolocation")) {
            errorMessage = "Error al obtener ubicación";
          } else {
            errorMessage = error.message;
          }
        }
        
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