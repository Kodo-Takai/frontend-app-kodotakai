import { useState } from "react";
import { FaStar, FaMapMarkerAlt } from "react-icons/fa";
import { useRestaurants } from "../../../hooks/places";
import "./index.scss";

interface Restaurant {
  name: string;
  photos?: Array<{
    photo_url: string;
    rating?: number;
    vicinity?: string;
  }>;
  mainPhoto?: {
    photo_url: string;
    rating?: number;
    vicinity?: string;
  };
  rating?: number;
  vicinity?: string;
}

export default function RestaurantMenuCard() {
  const { places: restaurants, loading } = useRestaurants({
    searchMethod: "both",
    limit: 6,
    enableMultiplePhotos: true,
  });

  const displayedRestaurants = restaurants.slice(0, 6);

  const RestaurantCard = ({ restaurant }: { restaurant: Restaurant }) => {
    const [imageErrors, setImageErrors] = useState<boolean[]>([
      false,
      false,
      false,
    ]);

    const handleImageError = (index: number) => {
      setImageErrors((prev) => {
        const newErrors = [...prev];
        newErrors[index] = true;
        return newErrors;
      });
    };

    // Obtener las 3 imágenes del restaurante
    const getImages = () => {
      if (restaurant.photos && restaurant.photos.length >= 3) {
        return restaurant.photos.slice(0, 3);
      }

      // Si no hay suficientes fotos, usar placeholders
      const images = [];
      if (restaurant.mainPhoto) {
        images.push(restaurant.mainPhoto);
      }

      // Completar con placeholders si es necesario
      while (images.length < 3) {
        images.push({
          photo_url: `https://picsum.photos/400/200?random=restaurant-${images.length}`,
          rating: restaurant.rating,
          vicinity: restaurant.vicinity,
        });
      }

      return images.slice(0, 3);
    };

    const images = getImages();

    return (
      <div className="restaurant-menu-card-width">
        <div className="restaurant-menu-card-container">
          <div className="restaurant-menu-card-header">
            <div className="restaurant-menu-card-icon-column">
              <img
                src="/icons/food_icon.svg"
                alt="Food"
                className="restaurant-menu-card-food-icon"
              />
            </div>

            <div className="restaurant-menu-card-info-column">
              <div className="restaurant-menu-card-name">{restaurant.name}</div>
              <div className="restaurant-menu-card-location">
                {restaurant.vicinity || "Ubicación no disponible"}
              </div>
            </div>

            <div className="restaurant-menu-card-rating-column">
              <div className="restaurant-menu-card-rating-container">
                <div className="restaurant-menu-card-star-row">
                  <FaStar className="restaurant-menu-card-star-icon" />
                </div>
                <div className="restaurant-menu-card-rating-text">
                  {restaurant.rating?.toFixed(1) || "4.0"}
                </div>
              </div>
            </div>
          </div>

          <div className="restaurant-menu-card-images-section">
            <div className="restaurant-menu-card-main-image">
              <img
                src={
                  imageErrors[0]
                    ? "https://picsum.photos/400/200?random=restaurant-error"
                    : images[0]?.photo_url
                }
                alt={restaurant.name}
                className="restaurant-menu-card-image"
                loading="lazy"
                onError={() => handleImageError(0)}
              />
              <div className="restaurant-menu-card-overlay">
                <h3 className="restaurant-menu-card-overlay-title">PLATOS</h3>
                <p className="restaurant-menu-card-overlay-text">Desde</p>
                <p className="restaurant-menu-card-overlay-price">
                  $30.000 COP
                </p>
              </div>
            </div>

            <div className="restaurant-menu-card-secondary-images">
              <div className="restaurant-menu-card-secondary-image">
                <img
                  src={
                    imageErrors[1]
                      ? "https://picsum.photos/400/200?random=restaurant-error"
                      : images[1]?.photo_url
                  }
                  alt={restaurant.name}
                  className="restaurant-menu-card-image"
                  loading="lazy"
                  onError={() => handleImageError(1)}
                />
              </div>
              <div className="restaurant-menu-card-secondary-image">
                <img
                  src={
                    imageErrors[2]
                      ? "https://picsum.photos/400/200?random=restaurant-error"
                      : images[2]?.photo_url
                  }
                  alt={restaurant.name}
                  className="restaurant-menu-card-image"
                  loading="lazy"
                  onError={() => handleImageError(2)}
                />
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
            <div key={`restaurant-menu-skeleton-${i}`} className="restaurant-menu-card-width">
              <div className="restaurant-menu-card-container animate-pulse">
                {/* HEADER */}
                <div className="restaurant-menu-card-header flex items-center justify-between">
                  {/* Icono */}
                  <div className="restaurant-menu-card-icon w-8 h-8 bg-gray-300 rounded"></div>

                  {/* Nombre + dirección */}
                  <div className="flex flex-col flex-grow mx-3">
                    <div className="h-5 bg-gray-300 rounded mb-2 w-3/4"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                  </div>

                  {/* Rating */}
                  <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                </div>

                {/* IMÁGENES */}
                <div className="restaurant-menu-card-images-section bg-gray-300 mt-3 rounded-xl"></div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (!displayedRestaurants.length) {
      return (
        <div className="restaurant-menu-card-width">
          <div className="restaurant-menu-card-container">
            <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center">
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
          </div>
        </div>
      );
    }

    return (
      <div className="restaurant-menu-scroll">
        {displayedRestaurants.map((restaurant, index) => (
          <RestaurantCard
            key={`${restaurant.name}-${index}`}
            restaurant={restaurant}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Y donde comeremos hoy?
      </h2>
      {renderContent()}
    </div>
  );
}
