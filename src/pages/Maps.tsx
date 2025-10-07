import { useState, useEffect } from "react";
import Search from "../components/ui/search/search";
import CategoryFilter from "../components/ui/categoryFilter";
import WeatherPill from "../components/cards/weatherCard";
import MapFilters from "../components/ui/mapsFilter";
import { FaSlidersH } from "react-icons/fa";
import { IoLocationOutline, IoSync } from "react-icons/io5";
import { MapDisplay } from "../components/cards/mapDisplay";
import { usePlaces } from "../hooks/places";

const Maps = () => {
  // --- Estados ---
  const [isApiReady, setIsApiReady] = useState(false);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  
  // Estados para la lógica de búsqueda y filtros
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategories, setActiveCategories] = useState<'all' | 'beaches' | 'restaurants' | 'hotels' | 'destinations'>('all');
  const [zoom, setZoom] = useState(12);


  // --- Hook unificado ---
  const { places, loading, error } = usePlaces({
    category: activeCategories as any,
    searchQuery,
    enableEnrichment: false, // Para Maps, solo datos básicos
    maxResults: 20
  });
  
  // Mapear datos para compatibilidad
  const mapCenter = places.length > 0 ? places[0].location || { lat: -12.0464, lng: -77.0428 } : { lat: -12.0464, lng: -77.0428 };
  const status = loading ? "Cargando..." : error ? "Error" : `${places.length} lugares encontrados`;
  
  const placesToShow = places;


  const handleCategoryChange = (newCategory: string) => {
    setActiveCategories(newCategory as 'all' | 'beaches' | 'restaurants' | 'hotels' | 'destinations');
    setSearchQuery(''); 
  };

  // --- Efectos ---
  useEffect(() => {
    const checkApiReady = () => {
      if (window.google?.maps) {
        setIsApiReady(true);
      } else {
        // Reintentar en 100ms
        setTimeout(checkApiReady, 100);
      }
    };
    checkApiReady();
  }, []);

  // Obtener ubicación del usuario

  useEffect(() => {
    if (searchQuery && placesToShow.length === 1) {
      setZoom(17);
    } else if (placesToShow.length > 0) {
      setZoom(14);
    } else {
      setZoom(12);
    }
  }, [searchQuery, placesToShow]);

  // --- Handlers de la UI ---
  const toggleFilters = () => {
    setIsFilterVisible(!isFilterVisible);
  };
  const closeFilters = () => {
    setIsFilterVisible(false);
  };

  // Lógica para el texto dinámico ---
  let displayTitle = "Tu Ubicación Actual";
  let displaySubtitle = "Lugares cercanos a ti";

  if (searchQuery) {
    if (loading) {
      displayTitle = "Buscando...";
      displaySubtitle = searchQuery;
    } else if (placesToShow.length > 0) {
      displayTitle = "Resultado de la búsqueda";
      displaySubtitle = placesToShow[0].name;
    } else {
      displayTitle = "Sin resultados";
      displaySubtitle = "Intenta con otra búsqueda";
    }
  }

  return (
    <div className="relative h-screen overflow-hidden bg-gray-200">
      
      {/* Mapa de fondo (ocupa toda la altura) */}
      <div id="map" className="absolute inset-0 z-0">
        {isApiReady ? (
          <MapDisplay 
            markers={placesToShow} 
            center={mapCenter} 
            zoom={zoom} 
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-300">
            <p className="font-semibold text-gray-600">Cargando mapa...</p>
          </div>
        )}
      </div>

      {/* Barra de búsqueda y botón de filtros */}
      <div className="absolute top-4 left-0 right-0 z-40 mx-auto w-11/12 md:w-3/4">
        <div className="flex items-center gap-2">
          <div className="flex-grow">
            <Search placeholder="Buscar lugares cercanos..." onSearch={setSearchQuery} 
            onChange={setSearchQuery} value={searchQuery}/>
          </div>
          <button
            onClick={toggleFilters}
            className="flex-shrink-0 rounded-lg bg-white p-3 text-gray-700 shadow-md"
            aria-label="Filtros"
          >
            <FaSlidersH size={20} />
          </button>
        </div>
        
        {status && (
          <div className="mt-2 text-center bg-white p-2 rounded-lg text-sm font-semibold">
            <p>{loading ? 'Cargando...' : status}</p>
          </div>
        )}
      </div>
      
      {/* PANEL DESLIZABLE */}
      <div
        onClick={closeFilters}
        className={`
          absolute inset-1 z-30
          transition-opacity duration-700
          ${isFilterVisible ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={`
            transform rounded-b-2xl bg-white p-4 pt-24 z-50 shadow-xl
            transition-transform duration-700 ease-in-out
            ${isFilterVisible ? "translate-y-0" : "-translate-y-full"}
          `}
        >
          <CategoryFilter 
            selectedCategory={activeCategories}
            onSelectionChange={handleCategoryChange} 
          />
        </div>
      </div>
      
      {/* Weather Pill */}
      <div className="absolute top-20 left-0 right-0 z-20 mx-auto w-11/12 md:w-3/4">
        <div className="w-fit">
          <WeatherPill className="w-20 h-6" textContainerClassName="text-xs" showWindInfo={false}/>
        </div>
      </div>

     {/* --- INICIO: SECCIÓN INFERIOR (FOOTER ANCLADO AL FONDO) --- */}
      <div className="absolute bottom-31 left-0 right-0 z-10 w-full p-4 pb-6 flex flex-col items-center gap-4">

          {/* 1. PÍLDORA DE UBICACIÓN COMPLETA (Arriba) */}
          <div className="flex w-full max-w-sm items-center justify-between rounded-full bg-[#073247] p-2 pl-5 text-white shadow-lg">
              {/* Lado izquierdo: Ícono y Texto */}
              <div className="flex items-center gap-4">
                  <IoLocationOutline size={28} className="flex-shrink-0 opacity-90" />
                  <div>
                      <p className="font-bold text-sm">{displayTitle}</p>
                      <p className="text-xs text-white/80">{displaySubtitle}</p>
                  </div>
              </div>

              {/* Lado derecho: Botón de refrescar */}
              <div className="pr-1">
                  <button
                      className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-white text-gray-800 shadow transition-colors hover:bg-gray-200"
                      aria-label="Refrescar ubicación"
                  >
                      <IoSync size={20} />
                  </button>
              </div>
          </div>

          {/* 2. FILTROS (Debajo de la píldora y con el mismo ancho) */}
          <div className="w-full max-w-sm flex justify-center">
              <MapFilters />
          </div>
          
      </div>      
    </div>
  );
};

export default Maps;