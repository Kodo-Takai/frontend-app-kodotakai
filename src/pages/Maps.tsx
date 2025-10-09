import { useState, useEffect, useMemo, useRef } from "react";
import Search from "../components/ui/search/search";
import CategoryFilter from "../components/ui/categoryFilter";
import WeatherPill from "../components/cards/weatherCard";
import MapFilters from "../components/ui/mapsFilter/index.tsx";
import { FaSlidersH } from "react-icons/fa";
import { IoLocationOutline, IoSync, IoNavigate } from "react-icons/io5";
import { MapDisplay } from "../components/cards/mapDisplay";
import { usePlacesSimple } from "../hooks/places/usePlacesSimple";
import { DestinyCard } from "../components/cards/DestinyCard/index.tsx";

// --- FUNCIONES Y CONSTANTES AUXILIARES ---
const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; const dLat = (lat2 - lat1) * (Math.PI / 180); const dLon = (lon2 - lon1) * (Math.PI / 180); const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2); const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); return R * c;
};
const MINIMUM_RATING_FOR_FEATURED = 4.5;
const NEARBY_RADIUS_KM = 1.5;


// --- COMPONENTE PRINCIPAL ---
const Maps = () => {
  // --- Estados ---
  const [isApiReady, setIsApiReady] = useState(false);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [zoom, setZoom] = useState(12);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategories, setActiveCategories] = useState('all');
  const [secondaryFilter, setSecondaryFilter] = useState('all');
  const [userAddress, setUserAddress] = useState('Buscando tu ubicación...');
  const [userPosition, setUserPosition] = useState(null);
  
  // Estados de Navegación
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [navigationDestination, setNavigationDestination] = useState(null);
  const [currentDistance, setCurrentDistance] = useState(null);
  const [initialDistance, setInitialDistance] = useState(null); // Estado para la distancia inicial
  const watchIdRef = useRef(null);

  // --- Hook de Datos ---
  const { places, mapCenter, loading } = usePlacesSimple(activeCategories, searchQuery);
  
  // --- Lógica de Filtros ---
  const placesToShow = useMemo(() => {
    const placesToProcess = [...places];
    if (secondaryFilter === 'featured') {
      const highlyRated = placesToProcess.filter(p => p.rating && p.rating >= MINIMUM_RATING_FOR_FEATURED);
      return highlyRated.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (secondaryFilter === 'nearby' && userPosition) {
      const nearbyPlaces = placesToProcess.filter(p => {
        if (!p.location) return false;
        const distance = getDistance(userPosition.lat, userPosition.lng, p.location.lat, p.location.lng);
        return distance <= NEARBY_RADIUS_KM;
      });
      return nearbyPlaces.sort((a, b) => {
        const distA = getDistance(userPosition.lat, userPosition.lng, a.location.lat, a.location.lng);
        const distB = getDistance(userPosition.lat, userPosition.lng, b.location.lat, b.location.lng);
        return distA - distB;
      });
    }
    return placesToProcess;
  }, [places, secondaryFilter, userPosition]);

  // --- EFECTOS ---
  useEffect(() => {
    setIsApiReady(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserPosition({ lat: latitude, lng: longitude });
          
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ location: { lat: latitude, lng: longitude } }, (results, status) => {
            if (status === 'OK' && results && results[0]) {
              setUserAddress(results[0].formatted_address);
            } else {
              setUserAddress('Dirección no encontrada');
            }
          });
        },
        () => {
          setUserAddress('No se pudo acceder a la ubicación');
        }
      );
    } else {
      setUserAddress('Geolocalización no soportada');
    }
  }, []); 

  useEffect(() => {
    if (searchQuery && placesToShow.length === 1) {
      setZoom(17);
    } else if (placesToShow.length > 0) {
      setZoom(14);
    } else {
      setZoom(12);
    }
  }, [searchQuery, placesToShow]);

  useEffect(() => {
    if (!navigationDestination) {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      return;
    }
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const destinationCoords = navigationDestination.location;
        const newDistance = getDistance(latitude, longitude, destinationCoords.lat, destinationCoords.lng);
        setCurrentDistance(newDistance);
        setUserPosition({ lat: latitude, lng: longitude });
      },
      (error) => {
        console.error("Error en el seguimiento de ubicación:", error);
        setCurrentDistance(null);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [navigationDestination]);

  // --- HANDLERS (Manejadores de eventos) ---
  const handleStartNavigation = () => {
    if (selectedPlace && userPosition) {
      const initialDist = getDistance(
        userPosition.lat, userPosition.lng,
        selectedPlace.location.lat, selectedPlace.location.lng
      );
      setInitialDistance(initialDist);
      setCurrentDistance(initialDist);
      setNavigationDestination(selectedPlace);
    }
  };

  const handleStopNavigation = () => {
    setNavigationDestination(null);
    setSelectedPlace(null);
    setCurrentDistance(null);
    setInitialDistance(null);
  };

  const handleCategoryChange = (newCategory) => {
    setActiveCategories(newCategory); 
    setSearchQuery(''); 
    setSecondaryFilter('all');
    setNavigationDestination(null);
  };
  
  const handleResetLocation = () => {
    setSearchQuery('');
    setSelectedPlace(null);
    setNavigationDestination(null);
    setSecondaryFilter('all');
  };

  const toggleFilters = () => setIsFilterVisible(!isFilterVisible);
  const closeFilters = () => setIsFilterVisible(false);

  // --- Lógica para textos dinámicos en la Píldora ---
  let displayTitle = "Ubicación";
  let displaySubtitle = "Lugares cercanos";
  if (navigationDestination) {
    displayTitle = `Navegando a ${navigationDestination.name}`;
    displaySubtitle = `Faltan ${currentDistance !== null ? (currentDistance < 1 ? `${Math.round(currentDistance * 1000)} m` : `${currentDistance.toFixed(1)} km`) : '...'}`;
  } else if (searchQuery) {
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
  } else if (selectedPlace) {
    displayTitle = `Seleccionado: ${selectedPlace.name}`;
    displaySubtitle = 'Presiona el botón para navegar';
  } else {
    displayTitle = userAddress;
    displaySubtitle = "Ubicación actual";
  }

  // --- RENDERIZADO DEL COMPONENTE ---
  return (
    <div className="flex flex-col bg-gray-200">
      <div className="relative h-[70vh]">
        <div id="map" className="h-full w-full">
          {isApiReady ? ( 
            <MapDisplay 
              markers={placesToShow} 
              center={mapCenter} 
              zoom={zoom} 
              userLocation={userPosition}
              onMarkerClick={setSelectedPlace}
            /> 
          ) : ( 
            <div className="flex h-full w-full items-center justify-center bg-gray-300"><p className="font-semibold text-gray-600">Cargando mapa...</p></div> 
          )}
        </div>
        
        <div className="absolute top-4 left-0 right-0 z-40 mx-auto w-11/12 md:w-3/4">
          <div className="flex items-center gap-2">
            <div className="flex-grow"><Search placeholder="Buscar lugares cercanos..." onSearch={setSearchQuery} onChange={setSearchQuery} value={searchQuery}/></div>
            <button onClick={toggleFilters} className="flex-shrink-0 rounded-lg bg-white p-3 text-gray-700 shadow-md" aria-label="Filtros"><FaSlidersH size={20} /></button>
          </div>
        </div>

        <div onClick={closeFilters} className={`absolute inset-1 z-30 transition-opacity duration-700 ${isFilterVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
          <div onClick={(e) => e.stopPropagation()} className={`transform rounded-b-2xl bg-white p-4 pt-24 z-50 shadow-xl transition-transform duration-700 ease-in-out ${isFilterVisible ? "translate-y-0" : "-translate-y-full"}`}>
            <CategoryFilter selectedCategory={activeCategories} onSelectionChange={handleCategoryChange} />
          </div>
        </div>

        <div className="absolute top-20 left-4 z-20 md:left-auto"><WeatherPill className="w-20 h-6" textContainerClassName="text-xs" showWindInfo={false}/></div>
      </div>

      <div className="p-4 bg-white border-t border-gray-200">
        <div className="max-w-sm mx-auto flex flex-col gap-4">
            
            <div className="w-full flex items-center gap-2">
                <div className="flex-grow flex items-center justify-between rounded-full bg-[#073247] p-2 pl-5 text-white shadow-lg">
                    <div className="flex items-center gap-4">
                        <IoLocationOutline size={28} className="flex-shrink-0 opacity-90" />
                        <div>
                            <p className="font-bold text-sm">{displayTitle}</p>
                            <p className="text-xs text-white/80">{displaySubtitle}</p>
                        </div>
                    </div>
                    <div className="pr-1">
                      <button 
                        onClick={handleResetLocation} 
                        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-white text-gray-800 shadow transition-colors hover:bg-gray-200" 
                        aria-label="Refrescar ubicación"
                      >
                        <IoSync size={20} />
                      </button>
                    </div>
                </div>
                
                {navigationDestination ? (
                  <button 
                    onClick={handleStopNavigation}
                    className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-full bg-red-500 text-white shadow-lg text-xl font-bold"
                    aria-label="Finalizar Navegación"
                  >
                    X
                  </button>
                ) : (
                  <button 
                    onClick={handleStartNavigation}
                    disabled={!selectedPlace}
                    className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#073247] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed" 
                    aria-label="Ir al lugar"
                  >
                      <IoNavigate size={24} />
                  </button>
                )}
            </div>
            
            {!navigationDestination && (
              <div className="w-full flex justify-center">
                <MapFilters activeFilter={secondaryFilter} onFilterChange={setSecondaryFilter} />
              </div>
            )}

            <DestinyCard 
              destination={navigationDestination}
              currentDistance={currentDistance}
              initialDistance={initialDistance}
            />
        </div>
      </div>
    </div>
  );
};

export default Maps;