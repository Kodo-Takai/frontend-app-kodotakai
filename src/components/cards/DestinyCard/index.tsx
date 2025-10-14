// src/components/cards/DestinyCard/index.tsx
import { FaStar } from "react-icons/fa";
import { IoWalk } from "react-icons/io5";

// Asegúrate que la importación del tipo 'Place' sea correcta
interface Place {
  name: string;
  location: { lat: number; lng: number };
  rating?: number;
  photo_url?: string;
}

interface DestinyCardProps {
  destination: Place | null;
  currentDistance: number | null; // Distancia restante en KM
  initialDistance: number | null; // Distancia inicial en KM
}

export const DestinyCard = ({ destination, currentDistance, initialDistance }: DestinyCardProps) => {
  if (!destination) {
    return null;
  }
  
  const formatDistance = (km: number | null) => {
    if (km === null) return 'Calculando...';
    if (km < 1) {
      return `${Math.round(km * 1000)} m`;
    }
    return `${km.toFixed(1)} km`;
  };

  // --- LÓGICA PARA LA BARRA DE PROGRESO ---
  let progressPercent = 0;
  if (initialDistance && currentDistance !== null && initialDistance > 0) {
      const distanceCovered = initialDistance - currentDistance;
      // Nos aseguramos que el progreso esté siempre entre 0 y 100
      progressPercent = Math.max(0, Math.min(100, (distanceCovered / initialDistance) * 100));
  }

  return (
    <div className="w-full max-w-sm rounded-xl bg-white shadow-lg overflow-hidden animate-slide-up">
      <div 
        className="relative text-white p-4 bg-cover bg-center h-24 flex flex-col justify-end" 
        style={{ backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.8), transparent), url(${destination.photo_url || ''})` }}
      >
        <div className="relative z-10">
          <h3 className="text-xl font-bold truncate">{destination.name}</h3>
        </div>
      </div>

      <div className="p-4 bg-white">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-blue-900 font-bold">
            <IoWalk size={20} />
            <span>Distancia Restante</span>
          </div>
          <span className="font-bold text-gray-700">{formatDistance(currentDistance)}</span>
        </div>
        
        {/* --- BARRA DE PROGRESO --- */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
          <div
            className="bg-blue-900 h-2.5 rounded-full transition-all duration-500 ease-linear"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Tu ubicación</span>
            <span>Destino</span>
        </div>
      </div>
    </div>
  );
};