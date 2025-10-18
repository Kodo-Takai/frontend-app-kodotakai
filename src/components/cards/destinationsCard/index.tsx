import { useState } from "react";
import { TbLocationFilled } from "react-icons/tb";
import { FaMapMarkerAlt, FaStar } from "react-icons/fa";
import { MdPlace } from "react-icons/md";
import { usePlaces, type EnrichedPlace } from "../../../hooks/places";
import PlaceModal from "../../ui/placeModal";
import "./index.scss";

import { useNavigate } from "react-router-dom";
import { useNavigationContext } from "../../../context/navigationContext";

export default function DestinationCards() {
  const { places, loading } = usePlaces({
    category: "tourist_attraction",
    enableEnrichment: true,
    maxResults: 6,
  });

  const { setInitialDestination } = useNavigationContext();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<EnrichedPlace | null>(null);

  const handleOpenModal = (place: EnrichedPlace) => {
    setSelectedPlace(place);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPlace(null);
  };

  const handleNavigation = (place: EnrichedPlace) => {
    setInitialDestination(place);
    navigate('/maps');
  };

  const displayedPlaces = places.slice(0, 6);

  const DestinationCard = ({ place }: { place: EnrichedPlace }) => {
    const [imageError, setImageError] = useState(false);
    const handleImageError = () => setImageError(true);
    
    const renderStars = (rating?: number) => {
      if (!rating) return null;

      const fullStars = Math.floor(rating);
      const stars = Array.from({ length: 5 }, (_, i) => (
        <FaStar
          key={`star-${i}`}
          className={`w-3 h-3 ${
            i < fullStars
              ? "text-[var(--color-primary-accent)]"
              : "text-[var(--color-bone)]"
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
      <div
        className="relative rounded-2xl overflow-hidden shadow-lg group cursor-pointer destination-card-width border-1 border-[var(--color-primary-dark)]"
        onClick={() => handleOpenModal(place)} // Clic general abre el modal
      >
        <div className="relative h-72 w-full overflow-hidden">
          <img
            src={imageError ? "..." : place.photo_url || "..."}
            alt={place.name}
            className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700 ease-out"
            onError={handleImageError}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/80 to-transparent group-hover:from-black/85 group-hover:via-black/65 transition-all duration-1500 ease-in-out" />
          
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            {renderStars(place.rating)}
            <h3 className="text-lg font-bold ...">{place.name}</h3>
            <div className="flex items-center gap-1 mb-3">
              <MdPlace className="w-4 h-4 text-gray-300" />
              <p className="text-xs text-gray-200 ...">{place.vicinity || "Ubicación destacada"}</p>
            </div>
            
            {/* --- CAMBIO PRINCIPAL: Este botón ahora abre el modal --- */}
            
            <button
              className="w-full bg-[var(--color-primary-accent)] hover:bg-[var(--color-green-dark)] text-[var(--color-blue-dark)] font-semibold py-2 px-4 rounded-2xl transition-all duration-200 backdrop-blur-sm flex items-center justify-center gap-2 text-lg"
              onClick={(e) => {
                e.stopPropagation(); // Evita que el clic se propague al div padre
                handleOpenModal(place); // Abre el modal en lugar de navegar
              }}
            ><TbLocationFilled />
              Visitar 
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="destination-scroll">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={`skeleton-${i}`} className="destination-card-width">
              <div className="rounded-xl overflow-hidden animate-pulse">
                <div className="h-72 bg-[var(--color-blue-light)]" />
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
        {displayedPlaces.map((place) => (
          <DestinationCard key={place.place_id} place={place} />
        ))}
      </div>
    );
  };

  return (
    <div className="w-full ">
      <h2 className="text-lg font-extrabold mb-2 text-[var(--color-text-primary)]">
        Lugares que debes visitar
      </h2>
      {renderContent()}
      
      {selectedPlace && (
        <PlaceModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          place={selectedPlace}
          onVisit={handleNavigation}
        />
      )}
    </div>
  );
}
