import React, { useEffect } from 'react';
import { useNearbyPlaces } from '../../hooks/places';
import type { LatLng } from '../../hooks/places/types';

interface NearbyPlacesCardProps {
  destination: {
    name: string;
    latitude?: number;
    longitude?: number;
  };
  type?: string; // restaurant, lodging, tourist_attraction, etc.
  radius?: number;
  limit?: number;
}

const NearbyPlacesCard: React.FC<NearbyPlacesCardProps> = ({
  destination,
  type = 'restaurant',
  radius = 2000,
  limit = 5,
}) => {
  const { places, loading, error, fetchNearbyPlaces } = useNearbyPlaces({
    radius,
    type,
    limit,
    minRating: 3.5,
  });

  useEffect(() => {
    // Buscar lugares cercanos cuando el destino tenga coordenadas válidas
    if (
      destination.latitude &&
      destination.longitude &&
      !isNaN(destination.latitude) &&
      !isNaN(destination.longitude)
    ) {
      const location: LatLng = {
        lat: destination.latitude,
        lng: destination.longitude,
      };
      fetchNearbyPlaces(location);
    }
  }, [destination.latitude, destination.longitude, fetchNearbyPlaces]);

  // No mostrar si no hay coordenadas válidas
  if (
    !destination.latitude ||
    !destination.longitude ||
    isNaN(destination.latitude) ||
    isNaN(destination.longitude)
  ) {
    return null;
  }

  const getTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      restaurant: 'Restaurantes',
      lodging: 'Hoteles',
      tourist_attraction: 'Atracciones',
      cafe: 'Cafés',
      bar: 'Bares',
      museum: 'Museos',
      park: 'Parques',
    };
    return labels[type] || 'Lugares';
  };

  const formatDistance = (meters?: number): string => {
    if (!meters) return '';
    if (meters < 1000) {
      return `${Math.round(meters)}m`;
    }
    return `${(meters / 1000).toFixed(1)}km`;
  };

  return (
    <div
      className="rounded-2xl p-4 mb-4"
      style={{ backgroundColor: 'var(--color-bone)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3
          className="text-lg font-bold"
          style={{ color: 'var(--color-blue-dark)' }}
        >
          {getTypeLabel(type)} cerca de {destination.name}
        </h3>
        <span
          className="text-sm font-medium px-3 py-1 rounded-lg"
          style={{
            backgroundColor: 'var(--color-green)',
            color: 'var(--color-blue-dark)',
          }}
        >
          {radius < 1000 ? `${radius}m` : `${radius / 1000}km`} de radio
        </span>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="animate-pulse rounded-xl p-3"
              style={{ backgroundColor: 'var(--color-beige-dark)' }}
            >
              <div
                className="h-4 rounded w-3/4 mb-2"
                style={{ backgroundColor: 'var(--color-green-dark)' }}
              />
              <div
                className="h-3 rounded w-1/2"
                style={{ backgroundColor: 'var(--color-green-dark)' }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div
          className="rounded-xl p-3 text-center"
          style={{
            backgroundColor: 'var(--color-beige-dark)',
            color: 'var(--color-blue-dark)',
          }}
        >
          <p className="text-sm">No se pudieron cargar los lugares cercanos</p>
        </div>
      )}

      {/* Places List */}
      {!loading && !error && places.length > 0 && (
        <div className="space-y-2">
          {places.map((place) => (
            <div
              key={place.id}
              className="rounded-xl p-3 flex items-start gap-3 transition-all duration-200 hover:scale-102"
              style={{ backgroundColor: 'var(--color-beige-dark)' }}
            >
              {/* Photo */}
              {place.photo_url && (
                <img
                  src={place.photo_url}
                  alt={place.name}
                  className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                />
              )}

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h4
                  className="font-bold text-sm truncate"
                  style={{ color: 'var(--color-blue-dark)' }}
                >
                  {place.name}
                </h4>

                {/* Rating and Distance */}
                <div className="flex items-center gap-2 mt-1">
                  {place.rating && (
                    <div className="flex items-center gap-1">
                      <svg
                        className="w-4 h-4"
                        style={{ color: 'var(--color-green)' }}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span
                        className="text-xs font-medium"
                        style={{ color: 'var(--color-blue)' }}
                      >
                        {place.rating.toFixed(1)}
                      </span>
                    </div>
                  )}

                  {place.distance && (
                    <>
                      <span style={{ color: 'var(--color-blue)' }}>•</span>
                      <span
                        className="text-xs"
                        style={{ color: 'var(--color-blue)' }}
                      >
                        {formatDistance(place.distance)}
                      </span>
                    </>
                  )}
                </div>

                {/* Vicinity */}
                {place.vicinity && (
                  <p
                    className="text-xs mt-1 truncate"
                    style={{ color: 'var(--color-blue)' }}
                  >
                    {place.vicinity}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && places.length === 0 && (
        <div
          className="rounded-xl p-4 text-center"
          style={{
            backgroundColor: 'var(--color-beige-dark)',
            color: 'var(--color-blue)',
          }}
        >
          <p className="text-sm">
            No se encontraron {getTypeLabel(type).toLowerCase()} cercanos
          </p>
        </div>
      )}
    </div>
  );
};

export default NearbyPlacesCard;
