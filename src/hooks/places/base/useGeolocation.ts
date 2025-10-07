import { useState, useEffect } from "react";
import type { LatLng } from "../types";

const FALLBACK_LOCATION: LatLng = { lat: -12.0464, lng: -77.0428 };
const GEOLOCATION_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 300000
};

export function useGeolocation(fallbackLocation?: LatLng) {
  const [location, setLocation] = useState<LatLng | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleGeolocationSuccess = ({ coords }: GeolocationPosition) => {
    setLocation({ lat: coords.latitude, lng: coords.longitude });
    setLoading(false);
  };

  const handleGeolocationError = (err: GeolocationPositionError) => {
    setLocation(fallbackLocation || FALLBACK_LOCATION);
    setError(err.message);
    setLoading(false);
  };

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setLocation(fallbackLocation || FALLBACK_LOCATION);
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      handleGeolocationSuccess,
      handleGeolocationError,
      GEOLOCATION_OPTIONS
    );
  }, [fallbackLocation]);

  return { location, loading, error };
}