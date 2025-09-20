// src/components/cards/MapsCard.tsx
import { useEffect, useRef } from "react";
import { usePlaces } from "../../../hooks/usePlaces";

type Props = {
  className?: string; // p.ej. "w-full sm:w-1/2"
};

const FALLBACK = { lat: 10.3910, lng: -75.4796 }; // Cartagena

export default function MapsCard({ className = "w-1/2" }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const { places } = usePlaces({
    fallback: FALLBACK,
    type: "tourist_attraction",
    radius: 3000,
  });

  useEffect(() => {
    if (!mapRef.current || !window.google?.maps) return;

    const center = places[0]?.location ?? FALLBACK;

    const map = new window.google.maps.Map(mapRef.current, {
      center,
      zoom: 16,
      disableDefaultUI: true,
      clickableIcons: false,
      gestureHandling: "none", // mini widget sin interacción
      styles: [
        { featureType: "poi", stylers: [{ visibility: "off" }] },
        { featureType: "transit", stylers: [{ visibility: "off" }] },
        { featureType: "road", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
      ],
    });

    // marcador simple en el centro (opcional)
    new window.google.maps.Marker({ position: center, map });
  }, [places]);

  return (
    <div className={`relative ${className} min-w-[160px]`} aria-label="Mapa mini">
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div ref={mapRef} className="h-32 w-full" /> {/* altura más compacta */}
      </div>
    </div>
  );
}
