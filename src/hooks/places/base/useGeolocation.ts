// src/hooks/places/base/useGeolocation.ts
import { useState, useEffect } from "react";
import type { LatLng } from "../types";

const FALLBACK_LOCATION: LatLng = { lat: -12.0464, lng: -77.0428 }; // Lima, Perú

export function useGeolocation(fallbackLocation?: LatLng) {
  const [location, setLocation] = useState<LatLng | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setLocation(fallbackLocation || FALLBACK_LOCATION);
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocation({ lat: coords.latitude, lng: coords.longitude });
        setLoading(false);
      },
      (err) => {
        console.warn("Geolocation error:", err);
        setLocation(fallbackLocation || FALLBACK_LOCATION);
        setError(err.message);
        setLoading(false);
      },
      { 
        enableHighAccuracy: true, 
        timeout: 10000, 
        maximumAge: 300000 
      }
    );
  }, [fallbackLocation]);

  return { location, loading, error };
}
