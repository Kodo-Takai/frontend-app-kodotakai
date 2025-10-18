import { useState } from "react";
import { FaStar, FaMapMarkerAlt, FaHeart } from "react-icons/fa";
import { usePlaces, type Place, type EnrichedPlace } from "../../../hooks/places";
import PlaceModal from "../../ui/placeModal";
import "./index.scss";

// --- 1. IMPORTACIONES PARA NAVEGACIÓN Y AGENDA ---
import { useNavigate } from "react-router-dom";
import { useNavigationContext } from "../../../context/navigationContext";

interface Restaurant extends EnrichedPlace {}

export default function RestaurantMenuCard() {
  const { places: restaurants, loading } = usePlaces({
    category: "restaurants",
    enableEnrichment: true,
    maxResults: 6,
  });

  // --- 2. ESTADO Y HOOKS EN EL COMPONENTE PADRE ---
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
    const [imageErrors, setImageErrors] = useState<boolean[]>([false, false, false]);
    const [menuOpen, setMenuOpen] = useState(false);

    const handleImageError = (index: number) => {
      setImageErrors((prev) => {
        const newErrors = [...prev];
        newErrors[index] = true;
        return newErrors;
      });
    };

    const getImages = () => {
        if (restaurant.photos && Array.isArray(restaurant.photos)) {
            const photoUrls = restaurant.photos.map((photo: any) => ({
              photo_url: photo.getUrl ? photo.getUrl({maxWidth: 400}) : photo.photo_url || photo
            }));
            if (photoUrls.length >= 3) return photoUrls.slice(0, 3);
        }
        const images = [];
        if ((restaurant as any).mainPhoto) images.push((restaurant as any).mainPhoto);
        while (images.length < 3) {
            images.push({ photo_url: `https://picsum.photos/400/200?random=restaurant-${images.length}` });
        }
        return images.slice(0, 3);
    };
    
    const images = getImages();
    
    return (
      // Clic en toda la tarjeta abre el modal
      <div 
        className="restaurant-menu-card-width shadow-sm" 
        onClick={() => handleOpenModal(restaurant)}
      >
        <div className="restaurant-menu-card-container">
          <div className="restaurant-menu-card-header">
            <div className="restaurant-menu-card-icon-column">
              <img src="/icons/food_icon.svg" alt="Food" className="restaurant-menu-card-food-icon" />
            </div>
            <div className="restaurant-menu-card-info-column">
              <div className="restaurant-menu-card-name">{restaurant.name}</div>
              <div className="restaurant-menu-card-location">{restaurant.vicinity || "Ubicación no disponible"}</div>
            </div>
            <div className="restaurant-menu-card-rating-column">
              <div className="restaurant-menu-card-rating-container">
                <div className="restaurant-menu-card-star-row">
                  <FaStar className="restaurant-menu-card-star-icon" />
                </div>
                <div className="restaurant-menu-card-rating-text">{restaurant.rating?.toFixed(1) || "N/A"}</div>
              </div>
            </div>
          </div>

          <div className="restaurant-menu-card-images-section">
            <div className="restaurant-menu-card-main-image">
              <img
                src={imageErrors[0] ? "https://picsum.photos/400/200?random=1" : images[0]?.photo_url}
                alt={restaurant.name}
                className="restaurant-menu-card-image"
                loading="lazy"
                onError={() => handleImageError(0)}
              />

              <div className="restaurant-menu-card-overlay">
                <h3 className="restaurant-menu-card-overlay-title">PLATOS</h3>
                <p className="restaurant-menu-card-overlay-text">Desde</p>
                <p className="restaurant-menu-card-overlay-price">$30.000 COP</p>
              </div>
            </div>

            <div className="restaurant-menu-card-secondary-images">
              <div className="restaurant-menu-card-secondary-image">
                <img src={imageErrors[1] ? "https://picsum.photos/200/100?random=2" : images[1]?.photo_url} alt={restaurant.name} className="restaurant-menu-card-image" loading="lazy" onError={() => handleImageError(1)} />
              </div>
              <div className="restaurant-menu-card-secondary-image">
                <img src={imageErrors[2] ? "https://picsum.photos/200/100?random=3" : images[2]?.photo_url} alt={restaurant.name} className="restaurant-menu-card-image" loading="lazy" onError={() => handleImageError(2)} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="restaurant-menu-scroll">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={`restaurant-menu-skeleton-${i}`} className="restaurant-menu-card-width-skeleton">
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
        <div className="restaurant-menu-card-width">
          {/* ... Tu JSX de 'no hay restaurantes' ... */}
        </div>
      );
    }
    return (
      <div className="restaurant-menu-scroll">
        {displayedRestaurants.map((restaurant) => (
          <RestaurantCard key={(restaurant as EnrichedPlace).place_id} restaurant={restaurant as Restaurant} />
        ))}
      </div>
    );
  };

  return (
    <div className="w-full">
      <h2 className="text-lg font-extrabold mb-2 text-[var(--color-text-primary)]">
        Y donde comeremos hoy?
      </h2>
      {renderContent()}

      {/* El Modal vive aquí, una sola vez */}
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