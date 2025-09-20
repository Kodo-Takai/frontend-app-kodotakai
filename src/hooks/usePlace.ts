import { useState, useEffect } from "react";

declare global {
  interface Window {
    initMap: () => void;
    google: any;
  }
}

// API Key - REEMPLAZA CON LA TUYA
const apiKey = "AIzaSyBSqL5uk0L3Q08rI8BxjB5-WfADJHFuLs0";

export const usePlaces = () => {
  const [places, setPlaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState("Inicializando...");

  useEffect(() => {
    window.initMap = () => {
      setApiStatus("Google Maps cargado - Probando API key...");
      testApiKey();
    };

    // Crear script de Google Maps
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initMap`;
    script.async = true;
    script.defer = true;

    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const testApiKey = () => {
    try {
      const mapDiv = document.createElement("div");
      document.body.appendChild(mapDiv);

      // Crear mapa simple
      const map = new window.google.maps.Map(mapDiv, {
        center: { lat: 19.4326, lng: -99.1332 },
        zoom: 12,
      });

      const service = new window.google.maps.places.PlacesService(map);
      setApiStatus("Probando Places API...");

      service.nearbySearch(
        {
          location: { lat: 19.4326, lng: -99.1332 },
          radius: 5000,
          type: "tourist_attraction",
        },
        (results: any, status: string) => {
          document.body.removeChild(mapDiv); // Limpiar

          if (status === "OK" && results && results.length > 0) {
            setApiStatus(`✅ API funcional - ${results.length} lugares encontrados`);

            // Filtrar y ordenar los lugares por su calificación
            const sortedPlaces = results
              .filter((place: any) => place.rating >= 4) // Filtrar solo lugares con rating mayor o igual a 4
              .slice(0, 5) // Limitar a 5 lugares con mejor rating
              .map((place: any) => ({
                name: place.name || "Sin nombre",
                rating: place.rating,
                vicinity: place.vicinity,
                place_id: place.place_id,
                photo_url:
                  place.photos && place.photos[0]
                    ? place.photos[0].getUrl({ maxWidth: 400, maxHeight: 200 })
                    : "https://via.placeholder.com/400x200/3B82F6/ffffff?text=📍+Sin+Imagen",
              }));

            setPlaces(sortedPlaces);
            setLoading(false);
          } else {
            setLoading(false);
            setApiStatus("❌ No se encontraron lugares");
          }
        }
      );
    } catch (err) {
      setApiStatus("❌ Error técnico");
      setLoading(false);
    }
  };

  return {
    places,
    loading,
    setPlaces,
  };
};
