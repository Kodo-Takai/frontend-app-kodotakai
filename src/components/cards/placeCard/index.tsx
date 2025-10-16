import { useState } from "react";
import { FaStar } from "react-icons/fa";
import { TbLocationFilled } from "react-icons/tb";
import { usePlaces, type EnrichedPlace } from "../../../hooks/places";
import PlaceModal from "../../ui/placeModal";
import "./index.scss";

interface PlaceCardProps {
  places?: EnrichedPlace[];
  category: string;
  title?: string;
  loading?: boolean;
  error?: string | null;
  onPlaceClick?: (place: EnrichedPlace) => void;
  itemsPerPage?: number;
}

export default function PlaceCards({
  places: externalPlaces,
  category,
  title,
  loading: externalLoading,
  error: externalError,
  itemsPerPage = 6,
}: PlaceCardProps) {
  const [imageError, setImageError] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<EnrichedPlace | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    places: hookPlaces,
    loading: hookLoading,
    error: hookError,
  } = usePlaces({
    category: category as any,
    enableEnrichment: true,
    maxResults: 20,
  });

  const places = externalPlaces || hookPlaces;
  const loading = externalLoading !== undefined ? externalLoading : hookLoading;
  const error = externalError !== undefined ? externalError : hookError;

  // Limitar a máximo 6 lugares como destinationsCard
  const displayedPlaces = places.slice(0, itemsPerPage);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleVisitClick = (e: React.MouseEvent, place: EnrichedPlace) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedPlace(place);
    setIsModalOpen(true);
  };

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
        style={{ color: i < fullStars ? "var(--color-green)" : "var(--color-beige-dark)" }}
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
    return (
      categoryImages[category as keyof typeof categoryImages] ||
      "https://picsum.photos/280/200?random=place"
    );
  };

  const PlaceCard = ({ place }: { place: EnrichedPlace }) => {
    return (
      <div className="place-card-container">
        <div className="place-card" onClick={(e) => handleVisitClick(e, place)}>
          <div className="place-card-image-container">
            <img
              src={
                imageError
                  ? getDefaultImage()
                  : place.photo_url || getDefaultImage()
              }
              alt={place.name}
              className="place-card-image"
              loading="lazy"
              onError={handleImageError}
            />
          </div>

          <div className="place-card-content">
            {renderStars(place.rating)}

            <h3 className="place-card-title">{place.name}</h3>

            <p className="place-card-location">
              {place.vicinity ||
                place.formatted_address ||
                "Ubicación no disponible"}
            </p>

            <button
              onClick={(e) => handleVisitClick(e, place)}
              className="place-card-visit-button"
            >
              Visitar <TbLocationFilled className="place-card-visit-icon" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="w-full">
        {title && (
          <h2 className="text-xl font-bold text-gray-800 mb-4 px-4">{title}</h2>
        )}
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
        {title && (
          <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
        )}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!displayedPlaces.length) {
    return (
      <div className="w-full p-4">
        {title && (
          <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
        )}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-700">
            No se encontraron lugares en esta categoría.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {title && (
        <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
      )}

      <div className="place-card-list">
        {displayedPlaces.map((place, index) => (
          <PlaceCard
            key={place.place_id || `${category}-${index}`}
            place={place}
          />
        ))}
      </div>

      {/* Modal para mostrar detalles del lugar */}
      {selectedPlace && (
        <PlaceModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          place={selectedPlace}
        />
      )}
    </div>
  );
}
