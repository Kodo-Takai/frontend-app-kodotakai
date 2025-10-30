import React from "react";
import DestinationItineraryCard from "../../cards/destinationItineraryCard";

interface Destination {
  id: number;
  name: string;
  type: string;
  duration: string;
  description: string;
  image: string;
  latitude?: number;
  longitude?: number;
}

interface ItineraryGeneratedProps {
  destinations: Destination[];
  onRegenerateDestination: (id: number) => void;
  onShowInAgenda: () => void;
  onGoToLobby: () => void;
}

const ItineraryGenerated: React.FC<ItineraryGeneratedProps> = ({
  destinations,
  onRegenerateDestination,
  onShowInAgenda,
  onGoToLobby,
}) => {
  return (
    <div className="w-full">
      <div className="text-center mb-8">
        {/* Imagen de KODII */}
        <div className="flex justify-center mb-2 mt-18">
          <img
            src="/check-kodi.png"
            alt="KODI"
            className="w-20 h-20 object-contain"
          />
        </div>

        <h2
          className="text-3xl font-extrabold mb-2"
          style={{ color: "var(--color-blue-dark)" }}
        >
          ¡Itinerario creado!
        </h2>
        <p className="text-lg font-bold" style={{ color: "var(--color-blue)" }}>
          Tu itinerario personalizado está aquí
        </p>
      </div>

      {/* Cards de destinos */}
      <div className="space-y-4 mb-8">
        {destinations.map((destination) => (
          <DestinationItineraryCard
            key={destination.id}
            destination={destination}
            onRegenerate={onRegenerateDestination}
          />
        ))}
      </div>

      {/* Botones de acción */}
      <div className="text-center space-y-4">
        <button
          onClick={onShowInAgenda}
          className="w-70 px-8 py-3 rounded-2xl font-bold text-lg hover:scale-105 transition-all duration-200 shadow-lg"
          style={{
            backgroundColor: "var(--color-blue-dark)",
            color: "var(--color-green)",
          }}
        >
          Mostrar en agenda
        </button>

        <button
          onClick={onGoToLobby}
          className="w-70 px-8 py-3 rounded-2xl font-bold text-lg hover:scale-105 transition-all duration-200 shadow-lg"
          style={{
            backgroundColor: "var(--color-beige)",
            color: "var(--color-blue-dark)",
          }}
        >
          Ir al lobby IA
        </button>
      </div>
    </div>
  );
};

export default ItineraryGenerated;
