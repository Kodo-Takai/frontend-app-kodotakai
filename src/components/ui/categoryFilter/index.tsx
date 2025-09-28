import React, { useState } from "react";
// Importando los iconos necesarios de react-icons
import { 
  IoLocationSharp, 
  IoHome, 
  IoPartlySunny, 
  IoFastFood, 
  IoCalendar, 
  IoFootball 
} from "react-icons/io5";

// Definimos los datos de los botones en un array para que sea más fácil de mantener
const categories = [
  { name: "Todo", icon: <IoLocationSharp size={22} /> },
  { name: "Hoteles", icon: <IoHome size={22} /> },
  { name: "Playas", icon: <IoPartlySunny size={22} /> },
  { name: "Comidas", icon: <IoFastFood size={22} /> },
  { name: "Eventos", icon: <IoCalendar size={22} /> },
  { name: "Estadios", icon: <IoFootball size={22} /> },
];

const CategoryFilter: React.FC = () => {
  // Estado para saber qué categoría está activa (la que se muestra en azul)
  const [activeCategory, setActiveCategory] = useState<string>("Todo");

  return (
    // Contenedor principal con scroll horizontal para móviles
    <div className="flex w-full space-x-3 p-2 overflow-x-auto whitespace-nowrap">
      {categories.map((category) => (
        <button
          key={category.name}
          onClick={() => setActiveCategory(category.name)}
          // Clases condicionales para el estilo del botón activo e inactivo
          className={`
            flex flex-col items-center justify-center 
            min-w-[70px] h-[60px] px-3 py-2 rounded-xl 
            transition-colors duration-300 ease-in-out
            ${
              activeCategory === category.name
                ? "bg-blue-950 text-white shadow-lg" // Estilo para el botón activo
                : "bg-gray-100 text-gray-500 hover:bg-gray-200" // Estilo para botones inactivos
            }
          `}
        >
          {/* El ícono del botón */}
          {category.icon}
          {/* El texto del botón */}
          <span className="text-xs font-medium mt-1">{category.name}</span>
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;