import { useState } from "react";
import { FaStar } from "react-icons/fa";
import { usePlaces } from "../../../hooks/places";
import type { Place, EnrichedPlace } from "../../../hooks/places";
import PlaceModal from "../../ui/placeModal";
import "./index.scss";

interface HotelsCardProps {
  places?: EnrichedPlace[];
  loading?: boolean;
  error?: string | null;
}

const HotelCard = ({ hotel }: { hotel: Place }) => {
  const [imageError, setImageError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleImageError = () => setImageError(true);


  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div
        className="hotel-card-width shadow-sm"
        onClick={handleOpenModal}
      >
        <div className="hotel-card-image-container">
          <img
            src={
              imageError
                ? "https://picsum.photos/400/200?random=hotel-error"
                : hotel.photo_url ||
                  "https://picsum.photos/400/200?random=hotel-default"
            }
            alt={hotel.name}
            onError={handleImageError}
          />

          <div className="absolute bottom-0 left-0 w-full h-28 bg-gradient-to-t from-[var(--color-blue)] to-transparent" />

          <div className="absolute top-2 left-2 flex gap-1">
            <div className="flex items-center gap-3 bg-[var(--color-primary-light)] rounded-xl px-3 py-1 text-lg font-medium text-[var(--color-primary-dark)]">
              <FaStar className="text-[var(--color-primary-dark)]" />
              {hotel.rating ?? "-"}
            </div>
          </div>

          <div className="absolute bottom-3 right-2 text-[var(--color-primary-light)] rounded-md px-3 py-1 text-xs font-semibold flex flex-col items-end">
            <span className="text-2xl font-extrabold text-[var(--color-primary-accent)] leading-none">
              {(() => {
                const businessStatus = (hotel as any).business_status;
                const isOpenNow = (hotel as any).is_open_now;

                if (businessStatus === "CLOSED_PERMANENTLY") {
                  return "Cerrado permanentemente";
                }

                if (businessStatus === "CLOSED_TEMPORARILY") {
                  return "Cerrado temporalmente";
                }

                if (businessStatus === "OPERATIONAL") {
                  if (isOpenNow === true) {
                    return "Abierto ahora";
                  } else if (isOpenNow === false) {
                    return "Cerrado ahora";
                  } else {
                    return "Abierto ahora";
                  }
                }

                if (isOpenNow === true) {
                  return "Abierto ahora";
                } else if (isOpenNow === false) {
                  return "Cerrado ahora";
                }

                return "Consulta aquí";
              })()}
            </span>
          </div>
        </div>

        <div className="px-3 py-4">
          <h3 className="text-xl font-extrabold text-[var(--color-primary-beige)] line-clamp-1 uppercase">
            {hotel.name}
          </h3>
          <p className="text-sm text-[var(--color-primary-beige)] mt-1 pb- hotel-location-text">
            {(hotel as any).formatted_address ||
              hotel.vicinity ||
              "Ubicación no disponible"}
          </p>
        </div>
      </div>

      {/* Modal para mostrar detalles del hotel */}
      <PlaceModal isOpen={isModalOpen} onClose={handleCloseModal} place={hotel} />
    </>
  );
};

export default function HotelCards({
  places: propPlaces,
  loading: propLoading,
  error: propError,
}: HotelsCardProps = {}) {
  const { places: hookPlaces, loading: hookLoading } = usePlaces({
    category: "hotels",
    enableEnrichment: true,
    maxResults: 6,
  });

  const displayedHotels = (propPlaces || hookPlaces).slice(0, 5);
  const loading = propLoading !== undefined ? propLoading : hookLoading;
  const error = propError;

  if (loading) {
    return (
      <div className="w-full">
        <h2 className="text-xl font-bold text-[var(--color-primary-dark)] mb-4">
          A descansar un momento
        </h2>
        <div className="hotel-scroll shadow-sm">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={`hotel-skeleton-${i}`} className="hotel-card-width">
              <div className="rounded-xl overflow-hidden animate-pulse">
                <div className="h-60 bg-[var(--color-primary-beige)]" />
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-[var(--color-primary-beige)] rounded w-3/4" />
                  <div className="h-3 bg-[var(--color-primary-beige)] rounded w-full" />
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
          <p className="text-red-600 text-sm">{error}</p>
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
      <h2 className="text-xl font-bold text-[var(--color-primary-dark)] mb-4">
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
