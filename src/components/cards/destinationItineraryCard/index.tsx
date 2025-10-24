import React, { useState } from "react";
import {
  useMapImageByCoords,
  usePlacePhotoByQuery,
} from "../../../hooks/places";

interface DestinationItineraryCardProps {
  destination: {
    id: number;
    name: string;
    type: string;
    duration: string;
    description: string;
    image: string;
    latitude?: number;
    longitude?: number;
  };
  onRegenerate: (id: number) => void;
  loading?: boolean;
}

const DestinationItineraryCard: React.FC<DestinationItineraryCardProps> = ({
  destination,
  onRegenerate,
  loading = false,
}) => {
  const [isRegenerating, setIsRegenerating] = useState(false);

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    try {
      await onRegenerate(destination.id);
    } finally {
      // Delay para mostrar el cambio de manera más fluida
      setTimeout(() => {
        setIsRegenerating(false);
      }, 500);
    }
  };

  // Skeleton loading state
  if (loading) {
    return (
      <div
        className="rounded-2xl overflow-hidden p-4 animate-pulse mb-4"
        style={{ backgroundColor: "var(--color-bone)" }}
      >
        <div
          className="w-full h-80 rounded-lg"
          style={{ backgroundColor: "var(--color-green-dark)" }}
        />
      </div>
    );
  }
  return (
    <div
      key={`${destination.id}-${destination.name}`}
      className={`rounded-2xl overflow-hidden p-4 hover:scale-101 transition-all duration-300 ease-out mb-4 ${
        isRegenerating ? 'opacity-50 scale-95' : 'animate-bubble-in'
      }`}
      style={{ backgroundColor: "var(--color-bone)" }}
    >
      {/* Sección Superior - Imagen con burbuja de tipo/duración */}
      <div
        className="relative h-22 rounded-lg"
        style={{ backgroundColor: "var(--color-beige-dark)" }}
      >
        <CardHeroImage destination={destination} />

        {/* Burbuja de tipo/duración */}
        <div
          className="absolute top-2 left-2 rounded-xl px-3.5 py-1 flex items-center gap-2 shadow-md"
          style={{ backgroundColor: "var(--color-green-dark)" }}
        >
          {/* Icono de tiempo */}
          <svg
            className="w-4 h-4"
            style={{ color: "var(--color-bone)" }}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
              clipRule="evenodd"
            />
          </svg>

          {/* Texto de duración */}
          <span
            className="text-sm font-medium"
            style={{ color: "var(--color-bone)" }}
          >
            {destination.duration}
          </span>
        </div>

        {/* Burbuja de tipo */}
        <div
          className="absolute top-2 right-2 rounded-xl px-3.5 py-1 shadow-md"
          style={{ backgroundColor: "var(--color-green)" }}
        >
          <span
            className="text-sm font-medium"
            style={{ color: "var(--color-blue-dark)" }}
          >
            {translateCategory(destination.type)}
          </span>
        </div>
      </div>

      {/* Sección Central - Información del destino */}
      <div className="py-1">
        <h3
          className="font-extrabold text-lg uppercase truncate"
          style={{ color: "var(--color-text-primary)" }}
        >
          {destination.name}
        </h3>
        <p
          className="text-sm font-medium mb-2"
          style={{ color: "var(--color-text-primary)" }}
        >
          {destination.description}
        </p>
      </div>

      {/* Sección Inferior - Botones horizontales */}
      <div className="flex gap-5 pt-0">
        {/* Botón Agregar a Agenda */}
        <button
          className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl font-normal transition-all duration-200 hover:scale-105"
          style={{
            backgroundColor: "var(--color-blue-dark)",
            color: "var(--color-bone)",
          }}
        >
          <span>Agregar a Agenda</span>
          {/* Icono de calendario */}
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* Botón Generar otro */}
        <button
          onClick={handleRegenerate}
          disabled={isRegenerating}
          className="flex-1 font-bold flex items-center justify-center gap-2 py-2 px-4 rounded-xl transition-all duration-200 hover:scale-105 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: "var(--color-green)",
            color: "var(--color-blue-dark)",
          }}
        >
          <span>{isRegenerating ? 'Generando...' : 'Generar otro'}</span>
          {/* Icono de refresh */}
          <svg 
            className={`w-4 h-4 ${isRegenerating ? 'animate-spin' : ''}`} 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default DestinationItineraryCard;

// Sub-componente para la imagen principal, decide entre imagen del destino o mapa por coordenadas
function CardHeroImage({
  destination,
}: {
  destination: DestinationItineraryCardProps["destination"];
}) {
  // Construir una consulta más específica para Google Places
  // Priorizar el nombre del lugar
  const query = destination.name;

  const { url: placePhotoUrl, loading: photoLoading } = usePlacePhotoByQuery(
    query,
    {
      maxWidth: 800,
      maxHeight: 320,
    }
  );

  const hasCoords =
    typeof destination.latitude === "number" &&
    typeof destination.longitude === "number" &&
    !Number.isNaN(destination.latitude) &&
    !Number.isNaN(destination.longitude);

  const { imageUrl } = useMapImageByCoords(
    hasCoords ? destination.latitude! : null,
    hasCoords ? destination.longitude! : null,
    { size: "800x320", zoom: 15, markerColor: "green", preferStreetView: true }
  );

  // Prioridad: foto de Google Places > imagen del destino > mapa por coordenadas
  const src =
    placePhotoUrl ||
    destination.image ||
    imageUrl ||
    "https://picsum.photos/800/320?random=1";

  // Mostrar un placeholder mientras carga
  if (photoLoading && !placePhotoUrl && !destination.image) {
    return (
      <div
        className="w-full h-full rounded-lg animate-pulse"
        style={{ backgroundColor: "var(--color-beige-dark)" }}
      />
    );
  }

  return (
    <img
      src={src}
      alt={destination.name}
      className="w-full h-full object-cover rounded-lg brightness-60"
      onError={(e) => {
        // Si la imagen falla, intentar con el mapa o placeholder
        const target = e.target as HTMLImageElement;
        if (target.src !== imageUrl && imageUrl) {
          target.src = imageUrl;
        } else if (target.src !== "https://picsum.photos/800/320?random=1") {
          target.src = "https://picsum.photos/800/320?random=1";
        }
      }}
    />
  );
}

// Traducción simple de categorías al español
function translateCategory(cat: string): string {
  const map: Record<string, string> = {
    restaurant: "Restaurante",
    restaurants: "Restaurante",
    hotel: "Hotel",
    hotels: "Hotel",
    beach: "Playa",
    beaches: "Playa",
    park: "Parque",
    parks: "Parque",
    nightclub: "Discoteca",
    bar: "Bar",
    museum: "Museo",
    archaeological: "Arqueológico",
    adventure: "Aventura",
  };
  const key = (cat || "").toLowerCase();
  return map[key] || cat;
}
