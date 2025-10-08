import { useState, useEffect } from "react";
import Search from "../components/ui/search/search";
import CategoryFilter from "../components/ui/categoryFilter";
import WeatherPill from "../components/cards/weatherCard";
import MapFilters from "../components/ui/mapsFilter";
import { FaSlidersH } from "react-icons/fa";
import { IoLocationOutline, IoSync } from "react-icons/io5";
import { MapDisplay } from "../components/cards/mapDisplay";
import { usePlaces, type PlaceCategory } from "../hooks/places";

const Maps = () => {
  const [isApiReady, setIsApiReady] = useState(false);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategories, setActiveCategories] = useState<PlaceCategory>('all');
  const [zoom, setZoom] = useState(12);

  const { places, mapCenter, loading, status } = usePlaces({
    category: activeCategories,
    searchQuery,
    enableEnrichment: false,
    maxResults: activeCategories === 'all' ? 30 : 20
  });
  
  const placesToShow = places;


  const handleCategoryChange = (newCategory: string) => {
    // Validar que la categoría sea válida
    const validCategories: PlaceCategory[] = ['all', 'beaches', 'restaurants', 'hotels', 'destinations', 'tourist_attraction', 'discos', 'estudiar', 'parques'];
    const category = validCategories.includes(newCategory as PlaceCategory) ? newCategory as PlaceCategory : 'all';
    setActiveCategories(category);
    setSearchQuery(''); 
  };


  useEffect(() => {
    const checkApiReady = () => {
      if (window.google?.maps) {
        setIsApiReady(true);
      } else {
        setTimeout(checkApiReady, 100);
      }
    };
    checkApiReady();
  }, []);

  useEffect(() => {
    if (searchQuery && placesToShow.length === 1) {
      setZoom(18);
    } else if (placesToShow.length > 0) {
      setZoom(15);
    } else {
      setZoom(15);
    }
  }, [searchQuery, placesToShow]);

  const toggleFilters = () => setIsFilterVisible(!isFilterVisible);
  const closeFilters = () => setIsFilterVisible(false);

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
  } else if (activeCategories !== 'all') {
    const categoryNames: Record<PlaceCategory, string> = {
      'all': 'Todos',
      'beaches': 'Playas',
      'restaurants': 'Restaurantes', 
      'hotels': 'Hoteles',
      'destinations': 'Destinos',
      'tourist_attraction': 'Atracciones',
      'discos': 'Discos',
      'estudiar': 'Lugares para Estudiar',
      'parques': 'Parques'
    };
    displayTitle = categoryNames[activeCategories] || 'Lugares';
    displaySubtitle = `${placesToShow.length} lugares encontrados`;
  } else if (placesToShow.length > 0) {
    displayTitle = "Lugares Cercanos";
    displaySubtitle = `${placesToShow.length} lugares cerca de ti`;
  }

  return (
    <div className="relative h-screen overflow-hidden bg-gray-200">
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
      
      <div className="absolute top-20 left-0 right-0 z-20 mx-auto w-11/12 md:w-3/4">
        <div className="w-fit">
          <WeatherPill className="w-20 h-6" textContainerClassName="text-xs" showWindInfo={false}/>
        </div>
      </div>

      <div className="absolute bottom-31 left-0 right-0 z-10 w-full p-4 pb-6 flex flex-col items-center gap-4">
        <div className="flex w-full max-w-sm items-center justify-between rounded-full bg-[#073247] p-2 pl-5 text-white shadow-lg">
          <div className="flex items-center gap-4">
            <IoLocationOutline size={28} className="flex-shrink-0 opacity-90" />
            <div>
              <p className="font-bold text-sm">{displayTitle}</p>
              <p className="text-xs text-white/80">{displaySubtitle}</p>
            </div>
          </div>
          <div className="pr-1">
            <button
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-white text-gray-800 shadow transition-colors hover:bg-gray-200"
              aria-label="Refrescar ubicación"
            >
              <IoSync size={20} />
            </button>
          </div>
        </div>
        <div className="w-full max-w-sm flex justify-center">
          <MapFilters />
        </div>
      </div>      
    </div>
  );
};

export default Maps;