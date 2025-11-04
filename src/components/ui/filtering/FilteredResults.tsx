import React from "react";
import { LocationMultiGrid } from "../../cards/locationMultiCard";
import type { EnrichedPlace } from "../../../hooks/places";

interface FilteredResultsProps {
  places: EnrichedPlace[];
  loading?: boolean;
  error?: string | null;
  filterName: string;
  totalMatches: number;
  onPlaceClick?: (place: EnrichedPlace) => void;
  userLocation?: { lat: number; lng: number };
}

export const FilteredResults: React.FC<FilteredResultsProps> = ({
  places,
  loading,
  error,
  filterName,
  totalMatches,
  onPlaceClick,
  userLocation,
}) => {
  if (loading) {
    return (
      <div className="w-full">
        <h2 className="text-2xl font-bold text-[#00324A] mb-4 text-center">
          Filtrando lugares con {filterName}...
        </h2>
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
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <h2 className="text-2xl font-bold text-[#00324A] mb-4 text-center">
          Lugares con {filterName}
        </h2>
        <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center mx-6">
          <h3 className="text-lg font-semibold text-red-900 mb-2">
            Error al filtrar lugares
          </h3>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (places.length === 0) {
    return (
      <div className="w-full">
        <h2 className="text-2xl font-bold text-[#00324A] mb-4 text-center">
          Lugares con {filterName}
        </h2>
        <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center mx-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No se encontraron lugares
          </h3>
          <p className="text-gray-600 text-sm">
            No encontramos lugares que coincidan con "{filterName}" en este
            momento.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl font-black text-[#00324A] uppercase">
          {filterName}
        </h2>
        <div className="bg-[#DC1217] text-white px-4 py-2 rounded-xl font-semibold">
          Total Encontrado {totalMatches}
        </div>
      </div>

      <LocationMultiGrid
        places={places}
        loading={false}
        error={null}
        itemsPerPage={6}
        userLocation={userLocation}
      />
    </div>
  );
};

export default FilteredResults;
