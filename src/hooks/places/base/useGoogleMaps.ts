import { useState, useEffect } from "react";

const API_KEY = import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY;
const SCRIPT_ID = "gmaps-sdk";
const GOOGLE_MAPS_URL = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places&v=weekly`;

let gmapsLoader: Promise<void> | null = null;

export function loadGoogleMaps(): Promise<void> {
  if (window.google?.maps?.places) return Promise.resolve();
  if (gmapsLoader) return gmapsLoader;

  gmapsLoader = new Promise<void>((resolve, reject) => {
    const existing = document.getElementById(SCRIPT_ID);
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Failed to load Google Maps")));
      return;
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.async = true;
    script.defer = true;
    script.src = GOOGLE_MAPS_URL;

    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google Maps"));
    document.head.appendChild(script);
  });

  return gmapsLoader;
}

export function useGoogleMaps() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadGoogleMaps()
      .then(() => setIsLoaded(true))
      .catch((err) => setError(err.message));
  }, []);

  return { isLoaded, error };
}
