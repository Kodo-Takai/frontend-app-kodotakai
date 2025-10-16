import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import {
  WiDaySunny,
  WiHot,
  WiCloud,
  WiCloudy,
  WiThermometer,
  WiSnowflakeCold,
} from "react-icons/wi";

// --- Tipos de Datos ---
type CurrentWeather = {
  temperature: number;   // °C
  windspeed: number;     // km/h
  winddirection: number; // °
  time: string;
  weathercode?: number;
};

type LatLng = { lat: number; lng: number };

// --- Tipos para las Propiedades del Componente ---
type WeatherPillProps = {
  className?: string;
  textContainerClassName?: string;
  showWindInfo?: boolean;
};

// --- Funciones Auxiliares ---
function dirToCompass(deg: number) {
  const dirs = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];
  return dirs[Math.round(((deg % 360) / 22.5)) % 16];
}

function iconByTemp(t?: number) {
  // Se elimina el tamaño fijo para que el ícono lo herede del texto
  if (typeof t !== "number") return <WiThermometer aria-label="Temperatura" />;
  if (t >= 30) return <WiHot aria-label="Caluroso" />;
  if (t >= 22) return <WiDaySunny aria-label="Soleado" />;
  if (t >= 14) return <WiCloud aria-label="Templado" />;
  if (t >= 5)  return <WiCloudy aria-label="Fresco" />;
  return <WiSnowflakeCold aria-label="Frío" />;
}

// --- Componente Principal ---
export default function WeatherPill({
  className,
  textContainerClassName,
  showWindInfo = true
}: WeatherPillProps) {
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
    className={twMerge(
      "relative h-auto w-44 rounded-2xl overflow-hidden max-w-xs sm:max-w-sm mx-auto",
      className
    )}
    aria-label="Clima actual"
    role="group"
  >
    <div className="absolute inset-0 rounded-2xl" style={{ backgroundColor: 'var(--color-blue)' }} />
    <div className="absolute inset-0 rounded-2xl ring-1 ring-white/10" />
    
    <div className="relative h-full flex items-center px-3">
      {/* Contenido de texto - 70% */}
      <div className="w-[70%] flex flex-col justify-center">
        <div className={twMerge(
          "text-[var(--color-green)] text-3xl leading-none select-none shrink-0 flex items-center",
          textContainerClassName
        )}>
          {loading ? (
            <div className="h-5 w-12 rounded bg-white/20 animate-pulse" />
          ) : error ? (
            <span className="text-sm font-bold text-yellow-300" title={error}>⚠️</span>
          ) : (
            <>
              <span className="font-extrabold">{temp ?? "–"}</span>
              <span className="font-extrabold">°C</span>
            </>
          )}
        </div>

        {showWindInfo && (
          <span 
            className="text-[10px] text-[var(--color-bone)]"
            style={{
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              maxWidth: '100%'
            }}
          >
            {loading ? "Cargando…" : error ? (locationStatus === 'denied' ? "Activa el GPS" : "Reintenta") : windStr}
          </span>
        )}
      </div>

      {/* Icono - 30% */}
      <div className="w-[30%] flex justify-center items-center">
        {!loading && !error && (
          <div className="text-[var(--color-bone)]/90 text-4xl">
            {iconByTemp(temp ?? undefined)}
          </div>
        )}
      </div>
    </div>
  </div>
  );
}