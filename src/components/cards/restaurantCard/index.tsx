import { useState } from "react";
import { FaStar, FaMapMarkerAlt, FaHeart } from "react-icons/fa";
import { MdPlace } from "react-icons/md";
import { TbLocationFilled } from "react-icons/tb";
import { usePlaces } from "../../../hooks/places";
import type { Place } from "../../../hooks/places";
import "./index.scss";

interface Restaurant extends Place {
  // Restaurant extends Place interface
}

export default function RestaurantCards() {
  const { places: restaurants, loading } = usePlaces({
    category: "restaurants",
    enableEnrichment: true,
    maxResults: 6
  });

  const displayedRestaurants = restaurants.slice(0, 6);

  const RestaurantCard = ({ restaurant }: { restaurant: Restaurant }) => {
    const [imageError, setImageError] = useState(false);

    const handleImageError = () => {
      setImageError(true);
    };

    const renderStars = (rating?: number) => {
      if (!rating) return null;

      const fullStars = Math.floor(rating);
      const stars = Array.from({ length: 5 }, (_, i) => (
        <FaStar
          key={`restaurant-star-${i}`}
          className={`w-3 h-3 ${
            i < fullStars ? "text-red-600" : "text-gray-300"
          }`}
          style={{ color: i < fullStars ? "#DC1217" : "#D1D5DB" }}
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
      <div className="restaurant-card-width">
        <div className="restaurant-card-container">
          <div className="restaurant-card-header">
            <div className="restaurant-card-title-section">
              <div className="restaurant-card-experience-text">
                <img
                  src="/icons/red-compass.svg"
                  alt="Compass"
                  width="30"
                  height="30"
                  className="restaurant-card-compass-icon"
                />
              </div>

              <div className="restaurant-card-name-section">
                <div className="restaurant-card-experience-label">
                  EXPERIMENTA NUEVOS SABORES
                </div>

                <h3 className="restaurant-card-restaurant-name">
                  {restaurant.name}
                </h3>
              </div>
            </div>

            <div className="restaurant-card-description-row">
              <MdPlace className="w-3 h-3 text-gray-400 flex-shrink-0" />
              <span className="line-clamp-2">
                {restaurant.vicinity ||
                  "Descubre este increíble restaurante y vive una experiencia culinaria única"}
              </span>
            </div>
          </div>

          <div className="restaurant-card-image-section">
            <div className="restaurant-card-image-container">
              <img
                src={
                  imageError
                    ? "https://picsum.photos/400/200?random=restaurant-error"
                    : restaurant.photo_url
                }
                alt={restaurant.name}
                className="restaurant-card-image"
                loading="lazy"
                onError={handleImageError}
              />

              <div className="restaurant-card-rating-overlay">
                {renderStars(restaurant.rating)}
              </div>

              <div className="restaurant-card-type-overlay">
                <img
                  src="/icons/food_icon.svg"
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
            <div className="restaurant-card-location-center">
              <TbLocationFilled className="w-4 h-4 text-white" />
              <span className="text-white text-sm font-medium">
                Visítalo ahora
              </span>
            </div>

            <button className="restaurant-card-red-button">
              <FaHeart className="w-4 h-4" />
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
            <div key={`restaurant-skeleton-${i}`} className="restaurant-card-width">
              <div className="rounded-xl overflow-hidden shadow-lg animate-pulse">
                <div className="h-72 bg-gray-200" />
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
        Restaurantes mejor valorados
      </h2>
      {renderContent()}
    </div>
  );
}
