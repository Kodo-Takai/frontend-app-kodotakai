// src/components/cards/WeatherPill.tsx
import { useEffect, useState } from "react";
import {
  WiDaySunny,
  WiHot,
  WiCloud,
  WiCloudy,
  WiThermometer,
  WiSnowflakeCold,
} from "react-icons/wi";

type CurrentWeather = {
  temperature: number;   // °C
  windspeed: number;     // km/h
  winddirection: number; // °
  time: string;
  weathercode?: number;  
};

type LatLng = { lat: number; lng: number };

function dirToCompass(deg: number) {
  const dirs = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];
  return dirs[Math.round(((deg % 360) / 22.5)) % 16];
}

function iconByTemp(t?: number) {
  if (typeof t !== "number") return <WiThermometer className="h-9 w-9" aria-label="Temperatura" />;
  if (t >= 30) return <WiHot className="h-9 w-9" aria-label="Caluroso" />;
  if (t >= 22) return <WiDaySunny className="h-9 w-9" aria-label="Soleado" />;
  if (t >= 14) return <WiCloud className="h-9 w-9" aria-label="Templado" />;
  if (t >= 5)  return <WiCloudy className="h-9 w-9" aria-label="Fresco" />;
  return <WiSnowflakeCold className="h-9 w-9" aria-label="Frío" />;
}

export default function WeatherPill({ className = "w-44" }: { className?: string }) {
  const [data, setData] = useState<CurrentWeather | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locationStatus, setLocationStatus] =
    useState<'getting'|'granted'|'denied'|'unavailable'>('getting');

  useEffect(() => {
    const controller = new AbortController();

    const getCoords = (): Promise<LatLng | null> =>
      new Promise((resolve) => {
        if (!("geolocation" in navigator)) {
          setLocationStatus('unavailable');
          return resolve(null);
        }
        navigator.geolocation.getCurrentPosition(
          ({ coords }) => {
            setLocationStatus('granted');
            resolve({ lat: coords.latitude, lng: coords.longitude });
          },
          () => {
            setLocationStatus('denied');
            resolve(null);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
        );
      });

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const coords = await getCoords();
        if (!coords) {
          setError('Permite la ubicación para ver el clima');
          return;
        }

        const qs = new URLSearchParams({
          latitude: String(coords.lat),
          longitude: String(coords.lng),
          current_weather: "true",
          timezone: "auto",
        }).toString();

        const res = await fetch(`https://api.open-meteo.com/v1/forecast?${qs}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json = await res.json();
        setData(json.current_weather as CurrentWeather);
      } catch (e) {
        if (!(e instanceof DOMException && e.name === "AbortError")) {
          setError('No se pudo cargar el clima');
        }
        setData(null);
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, []);

  const temp = data ? Math.round(data.temperature) : null;
  const windStr = data
    ? `Viento ${Math.round(data.windspeed)} km/h ${dirToCompass(data.winddirection)}`
    : "—";

  return (
  <div
    className={`relative h-16 rounded-2xl overflow-hidden w-full max-w-xs sm:max-w-sm mx-auto ${className}`}
    aria-label="Clima actual"
    role="group"
  >
    <div className="absolute inset-0 rounded-2xl bg-[#073247]" />
    <div className="absolute inset-0 rounded-2xl ring-1 ring-white/10" />
    
    <div className="relative h-full  flex items-center justify-center">
      <div className="flex flex-col">
        <div className="text-white leading-none select-none shrink-0 flex items-center gap-1.5">
          {loading ? (
            <div className="h-6 w-14 rounded bg-white/20 animate-pulse" />
          ) : error ? (
            <span className="text-sm font-bold text-yellow-300" title={error}>⚠️</span>
          ) : (
            <>
              <span className="text-2xl font-extrabold">{temp ?? "–"}</span>
              <span className="text-xl font-semibold">°C</span>
   
                {iconByTemp(temp ?? undefined)}
    
            </>
          )}
        </div>

        <span className="text-[10px] text-white/80 truncate max-w-[12rem]">
          {loading ? "Cargando…" : error ? (locationStatus === 'denied' ? "Activa el GPS" : "Reintenta") : windStr}
        </span>
      </div>
    </div>
  </div>
);
}