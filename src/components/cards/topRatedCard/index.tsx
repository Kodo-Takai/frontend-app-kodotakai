import { useState, memo } from "react";
import { FaStar } from "react-icons/fa";

interface TopRatedCardProps {
  place: {
    name: string;
    rating?: number;
    vicinity?: string;
    formatted_address?: string;
    photo_url?: string;
    editorial_summary?: {
      overview?: string;
    };
    price_info?: {
      level: number | null;
      description: string;
      symbol: string;
      color: string;
      isInferred?: boolean;
    };
    place_id: string;
  };
  category: "hotels" | "beaches" | "restaurants" | "destinations" | "discos" | "estudiar" | "parques";
  onSelect?: (place: any) => void;
  index?: number;
}

const TopRatedCard = memo(function TopRatedCard({
  place,
  onSelect,
  index,
}: TopRatedCardProps) {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => setImageError(true);

  const handleClick = () => {
    onSelect ? onSelect(place) : console.log("Lugar seleccionado:", place);
  };

  const hasDescription = place.editorial_summary?.overview && place.editorial_summary.overview.length > 10;
  const description = hasDescription
    ? place.editorial_summary!.overview!.length > 100
      ? place.editorial_summary!.overview!.substring(0, 100) + "..."
      : place.editorial_summary!.overview!
    : null;

  const address =
    place.formatted_address || place.vicinity || "Dirección no disponible";

  const renderStars = (rating?: number) => {
    if (!rating) return null;

    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <FaStar
          key={`full-${i}`}
          className="w-4 h-4"
          style={{ color: "#FF0007" }}
        />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <FaStar
          key="half"
          className="w-4 h-4"
          style={{ color: "#FF0007", opacity: 0.5 }}
        />
      );
    }

    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} className="w-4 h-4 text-white" />);
    }

    return (
      <div className="flex items-center gap-1">
        {stars}
        <span className="text-white text-sm font-semibold ml-1">
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };

  return (
    <div className="top-rated-card-width" onClick={handleClick}>
      <img
        src={
          imageError
            ? "https://picsum.photos/320/256?random=destination-error"
            : place.photo_url ||
              "https://picsum.photos/320/256?random=destination-default"
        }
        alt={place.name}
        className="top-rated-card-image"
        onError={handleImageError}
      />

      <div className="top-rated-card-gradient" />

      {index !== undefined && (
        <div className="top-rated-card-indicator">{index + 1}</div>
      )}

      <div className="top-rated-card-content">
        <div className="mb-2">{renderStars(place.rating)}</div>

        <h3 className="text-lg font-extrabold mb-2 line-clamp-1 uppercase">
          {place.name}
        </h3>

        {description && (
          <p className="text-sm text-white/90 mb-2 line-clamp-2">{description}</p>
        )}

        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-1">
            {place.price_info ? (
              <span
                className="font-extrabold uppercase text-lg"
                style={{ color: "#FF0007" }}
              >
                {place.price_info.description}
              </span>
            ) : (
              <span className="text-red-500 font-bold text-lg">
                Precio no disponible
              </span>
            )}
          </div>

          <p className="text-xs text-white/80 line-clamp-1 text-right">
            {address}
          </p>
        </div>
      </div>
    </div>
  );
});

export default TopRatedCard;
