import React from "react";
// Importando los iconos necesarios de react-icons
import {
  IoLocationSharp,
  IoHome,
  IoRestaurant,
  IoWater,
  IoMusicalNotes,
  IoBook,
  IoLeaf,
} from "react-icons/io5";

// Categorías que coinciden con el sistema @places/
const CATEGORIES = [
  { id: "all", label: "Todo", icon: <IoLocationSharp size={22} /> },
  { id: "hotels", label: "Hoteles", icon: <IoHome size={22} /> },
  { id: "restaurants", label: "Comida", icon: <IoRestaurant size={22} /> },
  { id: "beaches", label: "Playas", icon: <IoWater size={22} /> },
  { id: "discos", label: "Discos", icon: <IoMusicalNotes size={22} /> },
  { id: "estudiar", label: "Estudiar", icon: <IoBook size={22} /> },
  { id: "parques", label: "Parques", icon: <IoLeaf size={22} /> },
];

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectionChange: (newSelection: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectionChange,
}) => {
  const handleSelect = (categoryId: string) => {
    onSelectionChange(categoryId);
  };

  return (
    <div className="flex w-full space-x-3 p-2 overflow-x-auto whitespace-nowrap">
      {CATEGORIES.map((category) => {
        const isSelected = category.id === selectedCategory;

        return (
          <button
            key={category.id}
            onClick={() => handleSelect(category.id)}
            className={`
              flex flex-col items-center justify-center 
              min-w-[70px] h-[60px] px-4 py-2 rounded-xl 
              font-medium
              transform transition-all duration-200 ease-in-out
              ${
                isSelected
                  ? "bg-blue-950 text-white shadow-lg active:scale-95"
                  : "bg-gray-100 text-gray-500 active:scale-95"
              }
            `}
          >
            {category.icon}
            <span className="text-xs mt-1">{category.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default CategoryFilter;
