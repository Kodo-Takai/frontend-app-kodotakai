// src/components/cards/DestinationCard.tsx
import { useState } from "react";
import { TbLocationFilled } from "react-icons/tb";
import { FaStar, FaMapMarkerAlt } from "react-icons/fa";
import { MdPlace } from "react-icons/md";
import { usePlacesWithIA } from "../../../hooks/places";
import type { EnrichedPlace } from "../../../hooks/places/types";
import PlaceModal from "../../ui/placeModal";
import "./index.scss";

export default function DestinationCards() {
  const { places, loading } = usePlacesWithIA({
    category: "destinations",
    requestedFilters: [],
    enableEnrichment: true,
    enableAI: false,
    maxPlaces: 20,
  });

  const [selectedPlace, setSelectedPlace] = useState<EnrichedPlace | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleVisit = (place: EnrichedPlace) => {
    // Los datos ya vienen enriquecidos del hook usePlacesWithIA
    setSelectedPlace(place);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedPlace(null), 300); // Delay para animación
  };

  // Limitar a máximo 6 lugares
  const displayedPlaces = places.slice(0, 6);

  // Componente interno para cada card
  const DestinationCard = ({ place }: { place: EnrichedPlace }) => {
    const [imageError, setImageError] = useState(false);

    const handleImageError = () => {
      setImageError(true);
    };

    const handleVisitClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      handleVisit(place);
    };

    // Generar estrellas basadas en el rating
    const renderStars = (rating?: number) => {
      if (!rating) return null;

      const fullStars = Math.floor(rating);
      const stars = Array.from({ length: 5 }, (_, i) => (
        <FaStar
          key={`star-${i}`}
          className={`w-3 h-3 ${
            i < fullStars ? "text-[#FF0C12]" : "text-gray-300"
          }`}
        />
      ));

      return (
        <div className="flex items-center gap-1 mb-2">
          {stars}
          <span className="text-white text-xs font-semibold ml-1">
            {rating.toFixed(1)}
          </span>
        </div>
      );
    };

    return (
      <div className="relative rounded-2xl overflow-hidden shadow-lg group cursor-pointer destination-card-width border-4 border-white">
        {/* Imagen de fondo */}
        <div className="relative h-72 w-full overflow-hidden">
          <img
            src={
              imageError
                ? "https://picsum.photos/280/288?random=destination-error"
                : place.photo_url
            }
            alt={place.name}
            className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700 ease-out"
            loading="lazy"
            onError={handleImageError}
          />

          {/* Gradiente overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/80 to-transparent group-hover:from-black/85 group-hover:via-black/65 transition-all duration-1500 ease-in-out" />

          {/* Badge de rating en esquina superior izquierda */}
          {typeof place.rating === "number" && (
            <div className="absolute top-3 left-3 z-10">
              <div className="flex items-center gap-1 bg-[#00324A] px-2 py-1 rounded-full ">
                <FaStar className="w-3 h-3 text-[#FF0C12]" />
                <span className="text-xs font-bold text-yellow-100">
                  {place.rating.toFixed(1)}
                </span>
              </div>
            </div>
          )}

          {/* Badge de estado abierto/cerrado */}
          {place.is_open_now !== undefined && (
            <div className="absolute top-3 right-3 z-10">
              <div
                className={`flex items-center gap-1 px-2 py-1 rounded-full ${
                  place.is_open_now
                    ? "bg-green-500"
                    : "bg-red-500"
                }`}
              >
                <span className="text-xs font-bold text-white">
                  {place.is_open_now ? "● Abierto" : "● Cerrado"}
                </span>
              </div>
            </div>
          )}

          {/* Contenido superpuesto */}
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            {/* Rating con estrellas */}
            {renderStars(place.rating)}

            {/* Nombre del lugar */}
            <h3 className="text-lg font-bold mb-2 line-clamp-2 leading-tight">
              {place.name}
            </h3>

            {/* Descripción/ubicación */}
            <div className="flex items-center gap-1 mb-3">
              <MdPlace className="w-4 h-4 text-gray-300 flex-shrink-0" />
              <p className="text-xs text-gray-200 line-clamp-1">
                {place.vicinity || place.formatted_address || "Ubicación no disponible"}
              </p>
            </div>

            {/* Badge de precio si está disponible */}
            {place.price_info && (
              <div className="mb-3">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${place.price_info.color}`}>
                  {place.price_info.symbol}
                </span>
              </div>
            )}

            {/* Botón de visitar */}
            <button
              onClick={handleVisitClick}
              className="w-full bg-white/90 border-4 border-gray-300 hover:bg-white text-gray-800 font-semibold py-1 px-4 rounded-xl transition-all duration-300 backdrop-blur-sm flex items-center justify-center gap-2 text-lg"
            >
              Visitar <TbLocationFilled className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Renderizar contenido según el estado
  const renderContent = () => {
    if (loading) {
      return (
        <div className="destination-scroll">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={`skeleton-${i}`} className="destination-card-width">
              <div className="rounded-xl overflow-hidden shadow-lg animate-pulse">
                <div className="h-72 bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (!displayedPlaces.length) {
      return (
        <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center mx-6">
          <div className="text-gray-400 mb-3">
            <FaMapMarkerAlt className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No hay lugares disponibles
          </h3>
          <p className="text-gray-600 text-sm">
            No encontramos lugares cercanos en este momento.
          </p>
        </div>
      );
    }

    return (
      <div className="destination-scroll">
        {displayedPlaces.map((place, index) => (
          <DestinationCard
            key={place.place_id || `destination-${index}`}
            place={place}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="w-full ">
        <h2 className="text-xl font-bold text-gray-900 mb-4 ">
          Lugares que debes visitar
        </h2>
        {renderContent()}
      </div>

      {/* Modal reutilizable */}
      <PlaceModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        place={selectedPlace}
      />
    </>
  );
}