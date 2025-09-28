import React, { useState } from "react";
import Search from "../components/ui/search/search";
import MapsCard from "../components/cards/mapsCard";
import CategoryFilter from "../components/ui/categoryFilter";
import WeatherPill from "../components/cards/weatherCard";
import { FaSlidersH } from "react-icons/fa";
import { IoNavigate, IoReload } from "react-icons/io5";

const Maps = () => {
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const toggleFilters = () => {
    setIsFilterVisible(!isFilterVisible);
  };
  const closeFilters = () => {
    setIsFilterVisible(false);
  };

  return (
    <div className="relative h-screen overflow-hidden bg-gray-200">
   
      <div id="map" className="absolute inset-0 z-0">
        <MapsCard className="w-full" height="h-120" />
      </div>


      <div className="absolute top-4 left-0 right-0 z-40 mx-auto w-11/12 md:w-3/4">
        <div className="flex items-center gap-2">
          <div className="flex-grow">
            <Search placeholder="Buscar lugares cercanos..." />
          </div>
          <button
            onClick={toggleFilters}
            className="flex-shrink-0 rounded-lg bg-white p-3 text-gray-700 shadow-md"
            aria-label="Filtros"
          >
            <FaSlidersH size={20} />
          </button>
        </div>
      </div>
      

      <div
        onClick={closeFilters}
        className={`
          absolute inset-0 z-30
          transition-opacity duration-700
          ${isFilterVisible ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={`
            transform rounded-b-2xl bg-white p-4 pt-24 shadow-xl
            transition-transform duration-700 ease-in-out
            ${isFilterVisible ? "translate-y-0" : "-translate-y-full"}
          `}
        >
          <CategoryFilter />
        </div>
      </div>
      

      <div className="absolute top-20 left-0 right-0 z-20 mx-auto w-11/12 md:w-3/4">
          <div className="w-fit">
            <WeatherPill className="h-10 w-32" />
          </div>
      </div>


      <button
        className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white p-3 text-gray-800 shadow-lg"
        aria-label="Volver a mi ubicación"
      >
        <IoNavigate size={22} />
      </button>

      {/* --- TARJETA DE UBICACIÓN --- */}
      {/* 👇 CAMBIO AQUÍ: de bottom-24 a bottom-20 para alinear con la barra de navegación */}
      <div className="absolute bottom-50 z-10 mx-auto left-0 right-0 flex w-11/12 items-center justify-between rounded-xl bg-[#073247] p-3 text-white shadow-lg">
        <div>
          <p className="font-bold">Tu Ubicación Actual</p>
          <p className="text-sm text-white/80">UBICACIÓN, Ubicación 001</p>
        </div>
        <button
          className="rounded-full bg-white/10 p-2 ring-1 ring-white/20"
          aria-label="Refrescar ubicación"
        >
          <IoReload size={20} />
        </button>
      </div>
    </div>
  );
};

export default Maps;