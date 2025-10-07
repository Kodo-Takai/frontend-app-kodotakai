import React, { useState, useMemo } from "react";
import LocationMultiCard from "./LocationMultiCard";
import type { Place } from "../../../hooks/places";
import "./index.scss";

const EARTH_RADIUS_KM = 6371;
const DEFAULT_ITEMS_PER_PAGE = 4;
const LOAD_MORE_DELAY = 300;

const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
};

interface LocationMultiGridProps {
  places: Place[];
  loading?: boolean;
  error?: string | null;
  onPlaceClick?: (place: Place) => void;
  itemsPerPage?: number;
  userLocation?: { lat: number; lng: number };
}

const LocationMultiGrid: React.FC<LocationMultiGridProps> = ({
  places,
  loading,
  error,
  onPlaceClick,
  itemsPerPage = DEFAULT_ITEMS_PER_PAGE,
  userLocation,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const sortedPlaces = useMemo(() => {
    if (!userLocation || places.length === 0) {
      return places;
    }

    return [...places].sort((a, b) => {
      const distanceA = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        a.location.lat,
        a.location.lng
      );
      const distanceB = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        b.location.lat,
        b.location.lng
      );
      return distanceA - distanceB;
    });
  }, [places, userLocation]);

  const displayedPlaces = sortedPlaces.slice(0, currentPage * itemsPerPage);
  const hasMorePlaces = displayedPlaces.length < sortedPlaces.length;

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setCurrentPage((prev) => prev + 1);
      setIsLoadingMore(false);
    }, LOAD_MORE_DELAY);
  };

  if (loading) {
    return (
      <div className="location-multi-grid">
        <div className="location-multi-grid-container">
          {Array.from({ length: DEFAULT_ITEMS_PER_PAGE }).map((_, index) => (
            <div key={index} className="location-multi-skeleton">
              <div className="location-multi-skeleton-image"></div>
              <div className="location-multi-skeleton-content">
                <div className="location-multi-skeleton-title"></div>
                <div className="location-multi-skeleton-location"></div>
                <div className="location-multi-skeleton-rating"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="location-multi-grid">
        <div className="location-multi-error">
          <p>Error al cargar los destinos: {error}</p>
        </div>
      </div>
    );
  }

  if (places.length === 0) {
    return (
      <div className="location-multi-grid">
        <div className="location-multi-empty">
          <p>No se encontraron destinos</p>
        </div>
      </div>
    );
  }

  return (
    <div className="location-multi-grid">
      <div className="location-multi-grid-container">
        {displayedPlaces.map((place, index) => (
          <LocationMultiCard
            key={`${place.place_id}-${index}`}
            place={place}
            onClick={onPlaceClick}
          />
        ))}
      </div>

      {hasMorePlaces && (
        <div className="location-multi-grid-actions">
          <button
            className="location-multi-load-more-btn"
            onClick={handleLoadMore}
            disabled={isLoadingMore}
          >
            {isLoadingMore ? (
              <>
                <div className="location-multi-spinner"></div>
                Cargando...
              </>
            ) : (
              `Mostrar más (${
                sortedPlaces.length - displayedPlaces.length
              } restantes)`
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default LocationMultiGrid;
