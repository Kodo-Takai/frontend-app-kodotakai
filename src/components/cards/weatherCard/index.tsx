// src/components/cards/WeatherPill.tsx
import { useEffect, useState } from "react";

type CurrentWeather = {
  temperature: number;   // °C
  windspeed: number;     // km/h
  winddirection: number; // grados
  time: string;
};

type LatLng = { lat: number; lng: number };

// Fallback neutro (ecuador) solo para no romper si niegan permisos
const FALLBACK: LatLng = { lat: 0, lng: 0 };

function dirToCompass(deg: number) {
  const dirs = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];
  return dirs[Math.round(((deg % 360) / 22.5)) % 16];
}

export default function WeatherPill({ className = "w-44" }: { className?: string }) {
  const [data, setData] = useState<CurrentWeather | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const getCoords = (): Promise<LatLng> =>
      new Promise((resolve) => {
        if (!("geolocation" in navigator)) return resolve(FALLBACK);
        navigator.geolocation.getCurrentPosition(
          ({ coords }) => resolve({ lat: coords.latitude, lng: coords.longitude }),
          () => resolve(FALLBACK),
          { enableHighAccuracy: true, timeout: 8000, maximumAge: 300000 }
        );
      });

    async function load() {
      setLoading(true);
      try {
        const { lat, lng } = await getCoords();
        const qs = new URLSearchParams({
          latitude: String(lat),
          longitude: String(lng),
          current_weather: "true",
          timezone: "auto",
        }).toString();

        const res = await fetch(`https://api.open-meteo.com/v1/forecast?${qs}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setData(json.current_weather as CurrentWeather);
      } catch {
        setData(null);
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, []);

  const temp = data ? Math.round(data.temperature) : null;
  const windStr =
    data ? `Viento ${Math.round(data.windspeed)} km/h .${dirToCompass(data.winddirection)}` : "—";

  return (
    <div
      className={`relative h-16 rounded-2xl overflow-hidden w-full max-w-xs sm:max-w-sm mx-auto ${className}`}
      aria-label="Clima actual"
    >
      <div className="absolute inset-0 rounded-2xl bg-[#073247]" />
      <div className="absolute inset-0 rounded-2xl ring-1 ring-white/10" />
      <div className="relative h-full px-4 flex items-center justify-between ">
        <div className="flex flex-col items-start">
          <div className="text-white leading-none select-none shrink-0">
            {loading ? (
              <div className="h-6 w-14 rounded bg-white/20 animate-pulse" />
            ) : (
              <>
                <span className="text-2xl font-extrabold">{temp ?? "–"}</span>
                <span className="text-xl font-semibold align-top pl-1">°C</span>
              </>
            )}
          </div>
          <span className="text-[10px] text-white truncate max-w-[7.5rem]">
            {loading ? "Cargando…" : windStr}
          </span>
        </div>
        <div className="flex flex-col items-end text-white">
          <span className="text-[10px] font-medium  max-w-[7.5rem]">
            Ubicación actual
          </span>
        </div>
      </div>
    </div>
  );
}
