import { useState } from "react";
import { FaStar, FaMapMarkerAlt, FaHeart } from "react-icons/fa";
import { MdPlace } from "react-icons/md";
import { TbLocationFilled } from "react-icons/tb";
import { FiMoreVertical } from "react-icons/fi"; // Ícono para el menú
import { usePlaces, type Place, type EnrichedPlace } from "../../../hooks/places";
import PlaceModal from "../../ui/placeModal";
import "./index.scss";

// --- IMPORTACIONES PARA NAVEGACIÓN Y AGENDA ---
import { useNavigate } from "react-router-dom";
import { useNavigationContext } from "../../../context/navigationContext";
import { useAgenda } from "../../../hooks/useAgenda";

interface Restaurant extends EnrichedPlace {}

export default function RestaurantCards() {
  const { places: restaurants, loading } = usePlaces({
    category: "restaurants",
    enableEnrichment: true,
    maxResults: 6,
  });

  // --- ESTADO Y HOOKS EN EL COMPONENTE PADRE ---
  const { setInitialDestination } = useNavigationContext();
  const navigate = useNavigate();
  const { addItem } = useAgenda();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<Restaurant | null>(null);

  const handleOpenModal = (restaurant: Restaurant) => {
    setSelectedPlace(restaurant);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPlace(null);
  };

  const handleNavigation = (restaurant: Restaurant) => {
    setInitialDestination(restaurant);
    navigate('/maps');
  };

  const displayedRestaurants = restaurants.slice(0, 6);

  const RestaurantCard = ({ restaurant }: { restaurant: Restaurant }) => {
    const [imageError, setImageError] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const handleImageError = () => setImageError(true);

    const handleVisitFromMenu = (e: React.MouseEvent) => {
      e.stopPropagation();
      setMenuOpen(false);
      handleNavigation(restaurant);
    };

    const handleAgendarFromMenu = (e: React.MouseEvent) => {
      e.stopPropagation();
      setMenuOpen(false);
      const agendaItem = { /* tu lógica de agendaItem */ };
      addItem(agendaItem);
      alert(`${restaurant.name} ha sido agregado a tu agenda.`);
    };

    const renderStars = (rating?: number) => {
        if (!rating) return null;
        const fullStars = Math.floor(rating);
        const stars = Array.from({ length: 5 }, (_, i) => (
          <FaStar
            key={`restaurant-star-${i}`}
            className="w-3 h-3"
            color={i < fullStars ? "var(--color-green)" : "#D1D5DB"}
          />
        ));
        return (
          <div className="flex items-center gap-1">
            {stars}
            <span className="text-white text-xs font-semibold ml-1">
              {rating.toFixed(1)}
            </span>
          </div>
        );
    };

    return (
      <div className="restaurant-card-width" onClick={() => handleOpenModal(restaurant)}>
        <div className="restaurant-card-container">
          <div className="restaurant-card-header">
            <div className="restaurant-card-title-section">
              <div className="restaurant-card-experience-text">
                <img src="/icons/red-compass.svg" alt="Compass" width="30" height="30" className="restaurant-card-compass-icon" />
              </div>
              <div className="restaurant-card-name-section">
                <div className="restaurant-card-experience-label">EXPERIMENTA NUEVOS SABORES</div>
                <h3 className="restaurant-card-restaurant-name">{restaurant.name}</h3>
              </div>
            </div>
            <div className="restaurant-card-description-row">
              <MdPlace className="w-3 h-3 text-gray-400 flex-shrink-0" />
              <span className="line-clamp-2">{restaurant.vicinity || "Descubre este increíble restaurante"}</span>
            </div>
          </div>

          <div className="restaurant-card-image-section">
            <div className="restaurant-card-image-container">
              <img
                src={imageError ? "https://picsum.photos/400/200?random=restaurant-error" : restaurant.photo_url}
                alt={restaurant.name}
                className="restaurant-card-image"
                loading="lazy"
                onError={handleImageError}
              />
              {/* Botón de Menú */}
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
              <div className="restaurant-card-rating-overlay">{renderStars(restaurant.rating)}</div>
              <div className="restaurant-card-type-overlay">
                <img src="/icons/food_icon.svg" alt="Food" width="16" height="16" className="restaurant-card-food-icon" />
                Restaurant
              </div>
            </div>
          </div>

          <div className="restaurant-card-footer">
            <button
              className="restaurant-card-location-center"
              onClick={(e) => {
                e.stopPropagation();
                handleOpenModal(restaurant);
              }}
            >
              <TbLocationFilled className="w-4 h-4 text-white" />
              <span className="text-white text-sm font-medium">Visítalo ahora</span>
            </button>
            <button className="restaurant-card-red-button" onClick={(e) => e.stopPropagation()}>
              <FaHeart className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (loading) { /* ... tu JSX de loading ... */ }
    if (!displayedRestaurants.length) { /* ... tu JSX de 'no hay restaurantes' ... */ }

    return (
      <div className="restaurant-scroll">
        {displayedRestaurants.map((restaurant) => (
          <RestaurantCard key={restaurant.place_id || restaurant.id} restaurant={restaurant as Restaurant} />
        ))}
      </div>
    );
  };

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Restaurantes mejor valorados
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