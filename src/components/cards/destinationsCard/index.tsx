import { useState } from "react";
import { TbLocationFilled } from "react-icons/tb";
import { FaStar } from "react-icons/fa";
import { MdPlace } from "react-icons/md";
import { FiMoreVertical } from "react-icons/fi";
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
    const [menuOpen, setMenuOpen] = useState(false);
    const handleImageError = () => setImageError(true);

    const handleVisitFromMenu = (e: React.MouseEvent) => {
      e.stopPropagation();
      setMenuOpen(false);
      handleNavigation(place); // Esta es la navegación directa
    };

    const handleAgendarFromMenu = (e: React.MouseEvent) => {
      e.stopPropagation();
      setMenuOpen(false);
      // Tu lógica de agendar aquí
      console.log("Agendar:", place.name);
    };
    
    const renderStars = (rating?: number) => {
      // Tu lógica de estrellas aquí
      return null;
    };

    return (
      <div
        className="relative rounded-2xl overflow-hidden shadow-lg group cursor-pointer destination-card-width"
        onClick={() => handleOpenModal(place)} // Clic general abre el modal
      >
        <div className="relative h-72 w-full overflow-hidden">
          <img
            src={imageError ? "..." : place.photo_url || "..."}
            alt={place.name}
            className="w-full h-full object-cover group-hover:scale-125"
            onError={handleImageError}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />

          <button
            className="absolute top-2 right-2 z-20 p-1 bg-white/90 rounded-full shadow-md"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(v => !v);
            }}
          >
            <FiMoreVertical />
          </button>

          {menuOpen && (
            <div 
              className="absolute right-2 top-10 z-30 w-40 rounded-lg bg-white shadow-xl border" 
              onClick={e => e.stopPropagation()}
            >
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={handleVisitFromMenu}>
                Visitar en Mapa
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={handleAgendarFromMenu}>
                Agendar
              </button>
            </div>
          )}
          
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            {renderStars(place.rating)}
            <h3 className="text-lg font-bold ...">{place.name}</h3>
            <div className="flex items-center gap-1 mb-3">
              <MdPlace className="w-4 h-4 text-gray-300" />
              <p className="text-xs text-gray-200 ...">{place.vicinity || "Ubicación destacada"}</p>
            </div>
            
            {/* --- CAMBIO PRINCIPAL: Este botón ahora abre el modal --- */}
            
            <button
              className="className= w-full bg-[var(--color-primary-accent)] border-4 border-[var(--color-primary-dark-accent)] hover:bg-[var(--color-primary-dark-accent)] text-[var(--color-primary-dark)] font-semibold py-1 px-4 rounded-2xl transition-all duration-200 backdrop-blur-sm flex items-center justify-center gap-2 text-lg"
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
    // ... tu lógica de loading y 'no hay lugares' ...
    return (
      <div className="destination-scroll">
        {displayedPlaces.map((place) => (
          <DestinationCard key={place.place_id} place={place} />
        ))}
      </div>
    );
  };

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold ...">
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