import { useState } from "react";
import { FaStar } from "react-icons/fa";
import { FiMoreVertical } from "react-icons/fi";
import { usePlaces, type Place, type EnrichedPlace } from "../../../hooks/places";
import PlaceModal from "../../ui/placeModal";
import "./index.scss";

// --- IMPORTACIONES AÑADIDAS PARA LA NUEVA LÓGICA ---
import { useNavigate } from "react-router-dom";
import { useNavigationContext } from "../../../context/navigationContext";
import { useAgenda } from "../../../hooks/useAgenda";

interface HotelsCardProps {
  places?: EnrichedPlace[];
  loading?: boolean;
  error?: string | null;
}

const HotelCard = ({ 
  hotel, 
  onOpenModal,
  onNavigate,
  onAgenda
}: { 
  hotel: EnrichedPlace,
  onOpenModal: (hotel: EnrichedPlace) => void,
  onNavigate: (hotel: EnrichedPlace) => void,
  onAgenda: (hotel: EnrichedPlace) => void,
}) => {
  const [imageError, setImageError] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const handleImageError = () => setImageError(true);

  const handleVisitFromMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    onNavigate(hotel);
  };

  const handleAgendarFromMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    onAgenda(hotel);
  };

  return (
    <div
      className="hotel-card-width shadow-sm"
      onClick={() => onOpenModal(hotel)}
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
        
        {/* --- MENÚ DESPLEGABLE AÑADIDO --- */}
        <button
          className="absolute top-2 right-2 z-20 p-1.5 bg-white/80 rounded-full shadow"
          onClick={(e) => { e.stopPropagation(); setMenuOpen(v => !v); }}
        >
          <FiMoreVertical size={16} />
        </button>
        {menuOpen && (
          <div className="absolute right-2 top-10 z-30 w-40 rounded-lg bg-white shadow-xl border" onClick={e => e.stopPropagation()}>
            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={handleVisitFromMenu}>
              Visitar en Mapa
            </button>
            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={handleAgendarFromMenu}>
              Agendar
            </button>
          </div>
        )}

        <div className="absolute top-2 left-2 flex gap-1">
          <div className="flex items-center gap-3 bg-[var(--color-primary-light)] rounded-xl px-3 py-1 text-lg font-medium text-[var(--color-primary-dark)]">
            <FaStar className="text-[var(--color-primary-dark)]" />
            {hotel.rating ?? "-"}
          </div>
        </div>

        <div className="absolute bottom-3 right-2 text-[var(--color-primary-light)] rounded-md px-3 py-1 text-xs font-semibold flex flex-col items-end">
          <span className="text-2xl font-extrabold text-[var(--color-primary-accent)] leading-none">
            {(() => {
              const businessStatus = hotel.business_status;
              const isOpenNow = hotel.opening_hours?.open_now;

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
                  return "Consulta aquí"; // Si no hay info de open_now
                }
              }
              // Fallback si no hay business_status
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
          {hotel.formatted_address || hotel.vicinity || "Ubicación no disponible"}
        </p>
      </div>
    </div>
  );
};

export default function HotelCards({
  places: propPlaces,
  loading: propLoading,
  error: propError,
}: HotelsCardProps = {}) {
  // --- LÓGICA DE NAVEGACIÓN Y ESTADO CENTRALIZADO ---
  const { places: hookPlaces, loading: hookLoading } = usePlaces({
    category: "hotels",
    enableEnrichment: true,
    maxResults: 6,
  });

  const { setInitialDestination } = useNavigationContext();
  const navigate = useNavigate();
  const { addItem } = useAgenda();

  const [selectedPlace, setSelectedPlace] = useState<EnrichedPlace | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const displayedHotels = (propPlaces || hookPlaces).slice(0, 5);
  const loading = propLoading !== undefined ? propLoading : hookLoading;
  const error = propError;

  const handleOpenModal = (hotel: EnrichedPlace) => {
    setSelectedPlace(hotel);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPlace(null);
  };
  
  const handleNavigation = (hotel: EnrichedPlace) => {
    setInitialDestination(hotel);
    navigate('/maps');
  };

  const handleAgenda = (hotel: EnrichedPlace) => {
    const agendaItem = {
        destinationId: hotel.place_id || hotel.id || `place_${Date.now()}`,
        destinationName: hotel.name,
        location: hotel.formatted_address || hotel.vicinity || "Ubicación no disponible",
        scheduledDate: new Date().toISOString(),
        scheduledTime: new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
        status: "pending" as const,
        category: "hotel" as const, // Categoría ajustada
        image: hotel.photo_url || "https://picsum.photos/400/300?random=hotel",
        description: hotel.editorial_summary?.overview || `Visita a ${hotel.name}`,
        placeData: hotel,
    };
    addItem(agendaItem);
    alert(`${hotel.name} ha sido agregado a tu agenda.`);
  };

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
        {displayedHotels.map((hotel) => (
          <HotelCard 
            key={hotel.place_id} 
            hotel={hotel}
            onOpenModal={handleOpenModal}
            onNavigate={handleNavigation}
            onAgenda={handleAgenda}
          />
        ))}
      </div>

      {/* --- MODAL ÚNICO Y CENTRALIZADO --- */}
      {selectedPlace && (
        <PlaceModal 
          isOpen={isModalOpen} 
          onClose={handleCloseModal} 
          place={selectedPlace} 
          onVisit={() => handleNavigation(selectedPlace)}
        />
      )}
    </div>
  );
}