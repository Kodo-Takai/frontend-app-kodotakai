import { useState } from "react";
import { FaStar } from "react-icons/fa";
import { TbLocationFilled } from "react-icons/tb";
import { FiMoreVertical } from "react-icons/fi";
import { usePlaces, type EnrichedPlace } from "../../../hooks/places";
import PlaceModal from "../../ui/placeModal";
import { useAgenda } from "../../../hooks/useAgenda";
import "./index.scss";

// 1. RESTAURAMOS LA LÓGICA DE NAVEGACIÓN CON CONTEXT
import { useNavigate } from "react-router-dom";
import { useNavigationContext } from "../../../context/navigationContext";

interface PlaceCardProps {
  places?: EnrichedPlace[];
  category: string;
  title?: string;
  loading?: boolean;
  error?: string | null;
  onPlaceClick?: (place: EnrichedPlace) => void;
  onVisit?: (place: EnrichedPlace) => void; // Prop opcional
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
  
  // 1. (cont.) Usamos los hooks para Context y Navegación
  const { setInitialDestination } = useNavigationContext();
  const navigate = useNavigate();

  const { places: hookPlaces, loading: hookLoading, error: hookError } = usePlaces({
    category: category as any,
    enableEnrichment: true,
    maxResults: 20,
  });

  const places = externalPlaces || hookPlaces;
  const loading = externalLoading !== undefined ? externalLoading : hookLoading;
  const error = externalError !== undefined ? externalError : hookError;
  const displayedPlaces = places.slice(0, itemsPerPage);
  
  // 2. CREAMOS UN MANEJADOR LOCAL PARA NAVEGAR USANDO CONTEXT
  const handleLocalNavigation = (place: EnrichedPlace) => {
    setInitialDestination(place);
    navigate('/maps');
  };

  // 3. DECIDIMOS QUÉ FUNCIÓN USAR
  // Si el padre pasó 'onVisit', la usamos. Si no, usamos nuestra navegación local.
  const visitHandler = onVisit || handleLocalNavigation;

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPlace(null);
  };
  
    const renderStars = (rating?: number) => {
    if (!rating) return null;

    const fullStars = Math.floor(rating);
    const stars = Array.from({ length: 5 }, (_, i) => (
      <FaStar
        key={`star-${i}`}
        className="place-card-star"
        style={{ color: i < fullStars ? "var(--color-green)" : "var(--color-blue)" }}
      />
    ));

    return (
      <div className="place-card-rating">
        {stars}
        <span className="place-card-rating-number">{rating.toFixed(1)}</span>
      </div>
    );
  };

const getDefaultImage = (): string => { // <-- Se añade ': string'
   const categoryImages = {
    beaches: "https://picsum.photos/280/200?random=beach",
    hotels: "https://picsum.photos/280/200?random=hotel",
    restaurants: "https://picsum.photos/280/200?random=restaurant",
    destinations: "https://picsum.photos/280/200?random=destination",
 };
   return (categoryImages as any)[category] || "https://picsum.photos/280/200?random=place";
};

  const PlaceCard = ({ place }: { place: EnrichedPlace }) => {
    const [imageError, setImageError] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const handleImageError = () => setImageError(true);

    const handleCardClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onPlaceClick) {
        onPlaceClick(place);
        return;
      }
      setSelectedPlace(place);
      setIsModalOpen(true);
    };
    
    const handleVisitFromMenu = (e: React.MouseEvent) => {
      e.stopPropagation();
      setMenuOpen(false);
      visitHandler(place); // Llama a la función correcta (con Context)
    };
    
    const handleAgendarFromMenu = (e: React.MouseEvent) => {
      // ... (tu lógica para agendar se mantiene igual)
    };

    return (
      <div className="place-card-container">
        <div className="place-card" onClick={handleCardClick}>
          <div className="place-card-image-container relative">
            <img src={imageError ? getDefaultImage() : place.photo_url || getDefaultImage()} alt={place.name} className="place-card-image" loading="lazy" onError={handleImageError} />

            <button
              className="absolute top-2 right-2 z-20 ..."
              onClick={(e) => { e.stopPropagation(); setMenuOpen((v) => !v); }}
            >
              <FiMoreVertical />
            </button>

            {menuOpen && (
              <div className="absolute right-2 top-10 z-30 ..." onClick={(e) => e.stopPropagation()}>
                <button className="w-full ..." onClick={handleVisitFromMenu}>
                  Visitar
                </button>
                <button className="w-full ..." onClick={handleAgendarFromMenu}>
                  Agendar
                </button>
              </div>
            )}
          </div>

          <div className="place-card-content">
            {renderStars(place.rating)}
            <h3 className="place-card-title">{place.name}</h3>
            <p className="place-card-location">{place.vicinity || place.formatted_address || "Ubicación no disponible"}</p>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                visitHandler(place);
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
  
  if (loading) { /* ... Tu código de loading ... */ }
  if (error) { /* ... Tu código de error ... */ }
  if (!displayedPlaces.length) { /* ... Tu código de 'no hay lugares' ... */ }

  return (
    <div className="w-full">
      {title && <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>}
      <div className="place-card-list">
        {displayedPlaces.map((place) => (
          <PlaceCard key={place.place_id || place.id} place={place} />
        ))}
      </div>
      
      {selectedPlace && (
        <PlaceModal isOpen={isModalOpen} onClose={handleCloseModal} place={selectedPlace} onVisit={visitHandler} />
      )}
    </div>
  );
}