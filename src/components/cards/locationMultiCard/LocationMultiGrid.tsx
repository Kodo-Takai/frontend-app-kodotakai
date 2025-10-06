import React, { useState } from 'react';
import LocationMultiCard from './LocationMultiCard';
import type { Place } from '../../../hooks/places/types';
import './index.scss';

interface LocationMultiGridProps {
  places: Place[];
  loading?: boolean;
  error?: string | null;
  onPlaceClick?: (place: Place) => void;
  itemsPerPage?: number;
}

const LocationMultiGrid: React.FC<LocationMultiGridProps> = ({ 
  places, 
  loading, 
  error, 
  onPlaceClick,
  itemsPerPage = 4 
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const displayedPlaces = places.slice(0, currentPage * itemsPerPage);
  const hasMorePlaces = displayedPlaces.length < places.length;

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setCurrentPage(prev => prev + 1);
      setIsLoadingMore(false);
    }, 300);
  };

  if (loading) {
    return (
      <div className="location-multi-grid">
        <div className="location-multi-grid-container">
          {Array.from({ length: 4 }).map((_, index) => (
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
              `Mostrar más (${places.length - displayedPlaces.length} restantes)`
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default LocationMultiGrid;
