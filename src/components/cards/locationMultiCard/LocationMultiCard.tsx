import React from 'react';
import { FaStar } from 'react-icons/fa';
import type { Place } from '../../../hooks/places/types';
import './index.scss';

interface LocationMultiCardProps {
  place: Place;
  onClick?: (place: Place) => void;
}

const LocationMultiCard: React.FC<LocationMultiCardProps> = ({ place, onClick }) => {
  return (
    <div className="location-multi-card" onClick={() => onClick?.(place)}>
      <div className="location-multi-card-image-container">
        <img
          src={place.photo_url || "https://picsum.photos/300/200?random=location"}
          alt={place.name}
        />
      </div>

      <div className="location-multi-card-content">
        <h3 className="location-multi-card-title">
          {place.name}
        </h3>
        
        <p className="location-multi-card-location">
          {(place as any).formatted_address || place.vicinity || "Ubicación no disponible"}
        </p>

        <div className="location-multi-card-rating">
          <FaStar className="location-multi-card-star" />
          <span className="location-multi-card-rating-text">
            {place.rating?.toFixed(1) || "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LocationMultiCard;
