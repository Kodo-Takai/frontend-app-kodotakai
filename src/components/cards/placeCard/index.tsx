import { useState } from "react";
import { FaStar } from "react-icons/fa";
import { TbLocationFilled } from "react-icons/tb";
import { FiMoreVertical } from "react-icons/fi";
import { usePlaces, type EnrichedPlace } from "../../../hooks/places";
import PlaceModal from "../../ui/placeModal";
import { useAgenda } from "../../../hooks/useAgenda";
import "./index.scss";

interface PlaceCardProps {
  places?: EnrichedPlace[];
  category: string;
  title?: string;
  loading?: boolean;
  error?: string | null;
  onPlaceClick?: (place: EnrichedPlace) => void;
  onVisit?: (place: EnrichedPlace) => void; // handler que Maps va a pasar
  itemsPerPage?: number;
}

export default function PlaceCards({
  places: externalPlaces,
  category,
  title,
  loading: externalLoading,
  error: externalError,
  itemsPerPage = 6,
  onPlaceClick,
  onVisit,
}: PlaceCardProps) {
  const [selectedPlace, setSelectedPlace] = useState<EnrichedPlace | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { addItem } = useAgenda();

  const { places: hookPlaces, loading: hookLoading, error: hookError } = usePlaces({
    category: category as any,
    enableEnrichment: true,
    maxResults: 20,
  });

  const places = externalPlaces || hookPlaces;
  const loading = externalLoading !== undefined ? externalLoading : hookLoading;
  const error = externalError !== undefined ? externalError : hookError;

  const displayedPlaces = places.slice(0, itemsPerPage);

  const renderStars = (rating?: number) => {
    if (!rating) return null;
    const fullStars = Math.floor(rating);
    const stars = Array.from({ length: 5 }, (_, i) => (
      <FaStar
        key={`star-${i}`}
        className="place-card-star"
        style={{ color: i < fullStars ? "#DC1217" : "#D1D5DB" }}
      />
    ));
    return (
      <div className="place-card-rating">
        {stars}
        <span className="place-card-rating-number">{rating.toFixed(1)}</span>
      </div>
    );
  };

  const getDefaultImage = () => {
    const categoryImages = {
      beaches: "https://picsum.photos/280/200?random=beach",
      hotels: "https://picsum.photos/280/200?random=hotel",
      restaurants: "https://picsum.photos/280/200?random=restaurant",
      destinations: "https://picsum.photos/280/200?random=destination",
    };
    return (categoryImages as any)[category] || "https://picsum.photos/280/200?random=place";
  };

  // Componente por tarjeta (estado de imagen y menu local)
  const PlaceCard = ({ place }: { place: EnrichedPlace }) => {
    const [imageError, setImageError] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    const handleImageError = () => setImageError(true);

    // Abrir modal al clicar la tarjeta (flujo clásico). Si pasas onPlaceClick, lo respetamos.
    const handleCardClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (onPlaceClick) {
        onPlaceClick(place);
        return;
      }
      setSelectedPlace(place);
      setIsModalOpen(true);
    };

    // Handler cuando el usuario elige "Visitar" en el desplegable
    const handleVisitFromMenu = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setMenuOpen(false);
      if (onVisit) {
        onVisit(place);
      } else {
        // si no hay onVisit, abrimos el modal (fallback)
        setSelectedPlace(place);
        setIsModalOpen(true);
      }
    };

    // Handler cuando el usuario elige "Agendar" en el desplegable
    const handleAgendarFromMenu = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setMenuOpen(false);

      // Construir el item de agenda (mismo esquema que en PlaceModal)
      const agendaItem = {
        destinationId: place.place_id || place.id || `place_${Date.now()}`,
        destinationName: place.name,
        location: (place as any).formatted_address || place.vicinity || "Ubicación no disponible",
        scheduledDate: new Date().toISOString(),
        scheduledTime: new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
        status: "pending" as const,
        category: "restaurant" as const,
        image: place.photo_url || getDefaultImage(),
        description: (place as any).editorial_summary?.overview || `Visita a ${place.name}`,
        placeData: place as EnrichedPlace,
      };

      addItem(agendaItem);
      alert(`¡${place.name} ha sido agregado a tu agenda!`);
    };

    return (
      <div className="place-card-container">
        <div className="place-card" onClick={handleCardClick}>
          <div className="place-card-image-container relative">
            <img
              src={imageError ? getDefaultImage() : place.photo_url || getDefaultImage()}
              alt={place.name}
              className="place-card-image"
              loading="lazy"
              onError={handleImageError}
            />

            {/* Botón del desplegable en la esquina superior derecha de la imagen */}
            <button
              className="absolute top-2 right-2 z-20 inline-flex items-center justify-center rounded-full bg-white/90 p-1 shadow"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setMenuOpen((v) => !v);
              }}
              aria-label="Abrir acciones"
            >
              <FiMoreVertical />
            </button>

            {/* Desplegable */}
            {menuOpen && (
              <div
                className="absolute right-2 top-10 z-30 w-40 rounded-lg bg-white shadow-md border border-gray-100 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-2"
                  onClick={handleVisitFromMenu}
                >
                  Visitar
                </button>
                <button
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-2"
                  onClick={handleAgendarFromMenu}
                >
                  Agendar
                </button>
              </div>
            )}
          </div>

          <div className="place-card-content">
            {renderStars(place.rating)}
            <h3 className="place-card-title">{place.name}</h3>
            <p className="place-card-location">
              {place.vicinity || place.formatted_address || "Ubicación no disponible"}
            </p>

            {/* Mantengo botón 'Visitar' visible para usuarios que prefieran hacer click ahí.
                Este botón abre el modal si no hay onVisit, o llama onVisit si se pasó. */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                // preferimos abrir menú si se necesita, pero aquí dejamos la acción directa:
                if (onVisit) {
                  onVisit(place);
                } else {
                  setSelectedPlace(place);
                  setIsModalOpen(true);
                }
              }}
              className="place-card-visit-button"
            >
              Visitar <TbLocationFilled className="place-card-visit-icon" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPlace(null);
  };

  if (loading) {
    return (
      <div className="w-full">
        {title && <h2 className="text-xl font-bold text-gray-800 mb-4 px-4">{title}</h2>}
        <div className="place-card-list">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={`skeleton-${i}`} className="place-card-skeleton" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-4">
        {title && <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!displayedPlaces.length) {
    return (
      <div className="w-full p-4">
        {title && <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-700">No se encontraron lugares en esta categoría.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {title && <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>}

      <div className="place-card-list">
        {displayedPlaces.map((place, index) => (
          <PlaceCard key={place.place_id || `${category}-${index}`} place={place} />
        ))}
      </div>

      {/* Modal: se le pasa onVisit para que el botón "Visitar" dentro del modal también use la misma acción */}
      {selectedPlace && (
        <PlaceModal isOpen={isModalOpen} onClose={handleCloseModal} place={selectedPlace} onVisit={onVisit} />
      )}
    </div>
  );
}
