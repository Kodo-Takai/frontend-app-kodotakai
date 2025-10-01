import React, { useState } from 'react';
import { IoLocate, IoStarOutline, IoTimerOutline } from 'react-icons/io5';

// Datos para los botones de filtro
const filterCategories = [
  { name: 'Todo',       icon: <IoLocate /> },
  { name: 'Destacados', icon: <IoStarOutline /> },
  { name: 'Cercanos',   icon: <IoTimerOutline /> },
];

const MapFilters = () => {
  const [activeFilter, setActiveFilter] = useState('Todo');

  return (
    <div className="flex items-center space-x-2">
      {filterCategories.map((category) => (
        <button
          key={category.name}
          onClick={() => setActiveFilter(category.name)}
          className={`
            flex items-center gap-0.5 rounded-full px-1 py-2 text-sm font-semibold
            transition-colors duration-300 ease-in-out focus:outline-none w-28
            ${
              activeFilter === category.name
                ? 'bg-[#073247] text-white shadow-lg'
                : 'bg-white text-gray-500 shadow-sm'
            }
          `}
        >
          <span className="text-xl">{category.icon}</span>
          <span>{category.name}</span>
        </button>
      ))}
    </div>
  );
};

export default MapFilters;