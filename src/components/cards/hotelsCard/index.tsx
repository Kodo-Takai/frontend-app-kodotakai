import { useState } from "react";
import { FaStar } from "react-icons/fa";
import { usePlaces } from "../../../hooks/places";
import type { Place, EnrichedPlace } from "../../../hooks/places";
import "./index.scss";

// Interface para props del componente
interface HotelsCardProps {
  places?: EnrichedPlace[];
  loading?: boolean;
  error?: string | null;
}

// Componente HotelCard extraído para evitar recreación
const HotelCard = ({ hotel }: { hotel: Place }) => {
  const [imageError, setImageError] = useState(false);
  const handleImageError = () => setImageError(true);

  return (
    <div className="hotel-card-width shadow-sm">
      <div className="hotel-card-image-container">
        <img
          src={
            imageError
              ? "https://picsum.photos/400/200?random=hotel-error"
              : hotel.photo_url || "https://picsum.photos/400/200?random=hotel-default"
          }
          alt={hotel.name}
          onError={handleImageError}
          onLoad={() => {}}
        />

        <div className="absolute bottom-0 left-0 w-full h-28 bg-gradient-to-t from-black to-transparent " />

        <div className="absolute top-2 left-2 flex gap-1">
          <div className="flex items-center gap-0.5 bg-white rounded-lg px-1 py-0.5 text-sm font-medium text-[#00324A]">
            <FaStar className="text-[#00324A]" />
            {hotel.rating ?? "-"}
          </div>
        </div>

        <div className="absolute bottom-3 right-2 text-white rounded-md px-3 py-1 text-xs font-semibold flex flex-col items-end">
            <span className="text-2xl font-extrabold text-[#FF0007] leading-none">
              {(() => {
                const businessStatus = (hotel as any).business_status;
                const isOpenNow = (hotel as any).is_open_now;
                
                // Si el negocio está cerrado permanentemente
                if (businessStatus === 'CLOSED_PERMANENTLY') {
                  return "Cerrado permanentemente";
                }
                
                // Si el negocio está cerrado temporalmente
                if (businessStatus === 'CLOSED_TEMPORARILY') {
                  return "Cerrado temporalmente";
                }
                
                // Si está operacional, usar el estado de apertura actual
                if (businessStatus === 'OPERATIONAL') {
                  if (isOpenNow === true) {
                    return "Abierto ahora";
                  } else if (isOpenNow === false) {
                    return "Cerrado ahora";
                  } else {
                    return "Abierto ahora";
                  }
                }
                
                // Si no hay información del estado del negocio
                if (isOpenNow === true) {
                  return "Abierto ahora";
                } else if (isOpenNow === false) {
                  return "Cerrado ahora";
                }
                
                // Estado por defecto
                return "Consulta aquí";
              })()}
            </span>
        </div>
      </div>

      <div className="p-3">
        <h3 className="text-xl font-extrabold text-[#00324A] line-clamp-1 uppercase">
          {hotel.name}
        </h3>
        <p className="text-sm text-black mt-1 line-clamp-2 overflow-hidden text-ellipsis">
          {(hotel as any).formatted_address || hotel.vicinity || "Ubicación no disponible"}
        </p>
      </div>
    </div>
  );
};

export default function HotelCards({ places: propPlaces, loading: propLoading, error: propError }: HotelsCardProps = {}) {
  // Usar hook principal como fallback si no se proporcionan props
  const { places: hookPlaces, loading: hookLoading } = usePlaces({
    category: "hotels",
    enableEnrichment: true,
    maxResults: 6
  });
  
  // Usar props si están disponibles, sino usar hook interno
  const displayedHotels = (propPlaces || hookPlaces).slice(0, 5);
  const loading = propLoading !== undefined ? propLoading : hookLoading;
  const error = propError;

  if (loading) {
    return (
      <div className="w-full">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          A descansar un momento
        </h2>
        <div className="hotel-scroll shadow-sm">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={`hotel-skeleton-${i}`} className="hotel-card-width">
              <div className="rounded-xl overflow-hidden animate-pulse">
                <div className="h-60 bg-gray-200" />
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-3/4" />
                  <div className="h-3 bg-gray-300 rounded w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          A descansar un momento
        </h2>
        <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center mx-6">
          <h3 className="text-lg font-semibold text-red-900 mb-2">
            Error al cargar hoteles
          </h3>
          <p className="text-red-600 text-sm">
            {error}
          </p>
        </div>
      </div>
    );
  }

  if (!displayedHotels.length) {
    return (
      <div className="w-full">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          A descansar un momento
        </h2>
        <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center mx-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No hay hoteles disponibles
          </h3>
          <p className="text-gray-600 text-sm">
            No encontramos hoteles cercanos en este momento.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        A descansar un momento
      </h2>
      <div className="hotel-scroll">
        {displayedHotels.map((hotel, index) => (
          <HotelCard key={hotel.place_id || `hotel-${index}`} hotel={hotel} />
        ))}
      </div>
    </div>
  );
}