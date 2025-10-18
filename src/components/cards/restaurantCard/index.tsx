import { useState } from "react";
import { FaStar, FaMapMarkerAlt, FaHeart } from "react-icons/fa";
import { MdPlace } from "react-icons/md";
import { TbLocationFilled } from "react-icons/tb";
import { usePlaces, type EnrichedPlace } from "../../../hooks/places";
import PlaceModal from "../../ui/placeModal";
import "./index.scss";

// --- IMPORTACIONES PARA NAVEGACIÓN Y AGENDA ---
import { useNavigate } from "react-router-dom";
import { useNavigationContext } from "../../../context/navigationContext";

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

    const renderStars = (rating?: number) => {
        if (!rating) return null;
        const fullStars = Math.floor(rating);
        const stars = Array.from({ length: 5 }, (_, i) => (
          <FaStar
            key={`restaurant-star-${i}`}
            className="w-3 h-3"
            color={i < fullStars ? "var(--color-green)" : "var(--color-bone)"}
          />
        ));
        return (
          <div className="flex items-center gap-1">
            {stars}
            <span className="text-[var(--color-bone)] text-xs font-semibold ml-1">
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
                <img src="/icons/rest_icon3.svg" alt="Compass" width="30" height="30" className="restaurant-card-compass-icon" />
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
              
              <div className="restaurant-card-rating-overlay">{renderStars(restaurant.rating)}</div>
              <div className="restaurant-card-type-overlay">
                <img
                  src="/icons/rest_icon3.svg"
                  alt="Food"
                  width="16"
                  height="16"
                  className="restaurant-card-food-icon"
                />
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
              <FaHeart className="w-4 h-4 text-[var(--color-blue)]" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="restaurant-scroll">
          {Array.from({ length: 6 }, (_, i) => (
            <div
              key={`restaurant-skeleton-${i}`}
              className="restaurant-card-width-skeleton"
            >
              <div className="rounded-xl overflow-hidden shadow-lg animate-pulse">
                <div className="h-72 bg-[var(--color-blue-light)]" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (!displayedRestaurants.length) {
      return (
        <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center mx-6">
          <div className="text-gray-400 mb-3">
            <FaMapMarkerAlt className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No hay restaurantes disponibles
          </h3>
          <p className="text-gray-600 text-sm">
            No encontramos restaurantes cercanos en este momento.
          </p>
        </div>
      );
    }

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
      <h2 className="text-lg font-extrabold mb-2 text-[var(--color-text-primary)]">
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