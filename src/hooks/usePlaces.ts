// src/hooks/usePlaces.ts
import { useEffect, useState } from "react";

declare global {
  interface Window {
    google: any;
  }
}

type LatLng = { lat: number; lng: number };

const API_KEY = import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY ;


// ---- Loader singleton (evita cargar el script más de una vez) ----
let gmapsLoader: Promise<void> | null = null;

function loadGoogleMaps(): Promise<void> {
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

// ---- Hook compartido ----
export function usePlaces(opts?: {
  type?: string; // p.ej. "tourist_attraction"
  radius?: number; // metros
  fallback?: LatLng; // centro si no hay geolocalización
}) {
  const [places, setPlaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState("Inicializando...");

  const type = opts?.type ?? "tourist_attraction";
  const radius = opts?.radius ?? 5000;
  const fallback = opts?.fallback ?? { lat: 19.4326, lng: -99.1332 }; // CDMX de ejemplo

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        setApiStatus("Cargando Google Maps...");
        await loadGoogleMaps();
        if (cancelled) return;

        // 1) Ubicación del usuario (con fallback)
        const userPosition = await new Promise<LatLng>((resolve) => {
          if (!("geolocation" in navigator)) return resolve(fallback);
          navigator.geolocation.getCurrentPosition(
            ({ coords }) =>
              resolve({ lat: coords.latitude, lng: coords.longitude }),
            () => resolve(fallback),
            { enableHighAccuracy: true, timeout: 8000, maximumAge: 300000 }
          );
        });

        if (cancelled) return;

        setApiStatus("Probando Places API...");
      
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

        service.nearbySearch(
          { location: userPosition, radius, type },
          (results: any[], status: string) => {
            document.body.removeChild(phantom);

            if (cancelled) return;

            if (
              status === window.google.maps.places.PlacesServiceStatus.OK &&
              results?.length
            ) {
              const top = results
                .filter((p) => (p.rating ?? 0) >= 4)
                .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
                .slice(0, 5)
                .map((p) => ({
                  name: p.name ?? "Sin nombre",
                  rating: p.rating,
                  vicinity: p.vicinity,
                  place_id: p.place_id,
                  photo_url:
                    p.photos?.[0]?.getUrl({ maxWidth: 400, maxHeight: 200 }) ??
                    "https://via.placeholder.com/400x200/3B82F6/ffffff?text=📍+Sin+Imagen",
                  location: p.geometry?.location?.toJSON?.(),
                }));

              setPlaces(top);
              setApiStatus(`API funcional - ${top.length} lugares`);
            } else {
              setApiStatus("Sin resultados");
            }

            setLoading(false);
          }
        );
      } catch (e) {
        if (!cancelled) {
          setApiStatus("Error al cargar Google Maps/Places");
          setLoading(false);
        }
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [type, radius, fallback.lat, fallback.lng]);

  return { places, loading, apiStatus };
}
