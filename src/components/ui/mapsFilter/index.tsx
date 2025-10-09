import React from 'react';
import { FaListUl, FaStar, FaMapMarkerAlt } from 'react-icons/fa';

// Definimos los tipos para las props
type SecondaryFilterType = 'all' | 'featured' | 'nearby';

interface MapFiltersProps {
  activeFilter: SecondaryFilterType;
  onFilterChange: (filter: SecondaryFilterType) => void;
}

const MapFilters: React.FC<MapFiltersProps> = ({ activeFilter, onFilterChange }) => {
  return (
    <div className="flex w-full justify-center space-x-2 rounded-full bg-gray-100 p-1">
      {FILTERS.map((filter) => {
        const isSelected = activeFilter === filter.id;
        return (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id as SecondaryFilterType)}
            className={`
              flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2 
              text-sm font-semibold transition-all duration-300 ease-in-out
              ${
                isSelected
                  // --- LÍNEA MODIFICADA ---
                  ? 'bg-[#073247] text-white shadow-md' 
                  : 'bg-transparent text-gray-500 hover:bg-gray-200'
              }
            `}
          >
            {filter.icon}
            <span>{filter.label}</span>
          </button>
        );
      })}
    </div>
  );
};

// Se definen los filtros aquí para que no se redeclaren en cada render
const FILTERS = [
  { id: 'all', label: 'Todo', icon: <FaListUl /> },
  { id: 'featured', label: 'Destacados', icon: <FaStar /> },
  { id: 'nearby', label: 'Cercanos', icon: <FaMapMarkerAlt /> },
];

export default MapFilters;