import { useState, useEffect, useMemo, useCallback } from "react";
import Search from "../components/ui/search/search";
import CategoryFilter from "../components/ui/categoryFilter";
import MapFilters from "../components/ui/mapsFilter/index.tsx";
import { FaSlidersH } from "react-icons/fa";
import {
  IoLocationOutline,
  IoSync,
  IoNavigate,
  IoLocationSharp,
} from "react-icons/io5";
import { MapDisplay } from "../components/cards/mapDisplay";
import { usePlacesSimple } from "../hooks/places/usePlacesSimple";
import type { Place } from "../hooks/places/usePlacesSimple";
import { DestinyCard } from "../components/cards/DestinyCard/index.tsx";
import { useGeolocation } from "../hooks/places/useGeoLocation.ts";
import { useNavigation } from "../hooks/places/useNavigation.ts";
import PlaceCards from "../components/cards/placeCard/index.tsx";

// --- TIPOS Y CONSTANTES ---
type LatLng = { lat: number; lng: number };
const MINIMUM_RATING_FOR_FEATURED = 4.5;
const NEARBY_RADIUS_KM = 1.5;

const Maps = () => {
  // --- ESTADOS Y HOOKS ---
  const [isFilterVisible, setIsFilterVisible] = useState<boolean>(false);
  const [zoom, setZoom] = useState<number>(15);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeCategories, setActiveCategories] = useState<string>("all");
  const [secondaryFilter, setSecondaryFilter] = useState<string>("all");
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [navigationDestination, setNavigationDestination] =
    useState<Place | null>(null);
  const [directions, setDirections] = useState<
    google.maps.DirectionsResult | undefined
  >(undefined);

  const {
    position: userPosition,
    address: userAddress,
    setPosition: setUserPosition,
  } = useGeolocation();
  const { places, mapCenter, loading } = usePlacesSimple(
    activeCategories,
    searchQuery
  );
  const { currentDistance, initialDistance } = useNavigation(
    navigationDestination,
    userPosition,
    setUserPosition
  );

  const placesToShow = useMemo(() => {
    const getDistance = (
      lat1: number,
      lon1: number,
      lat2: number,
      lon2: number
    ): number => {
      const R = 6371;
      const dLat = (lat2 - lat1) * (Math.PI / 180);
      const dLon = (lon2 - lon1) * (Math.PI / 180);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) *
          Math.cos(lat2 * (Math.PI / 180)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };
    const placesToProcess = [...places];
    if (secondaryFilter === "featured") {
      return placesToProcess
        .filter((p) => p.rating && p.rating >= MINIMUM_RATING_FOR_FEATURED)
        .sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (secondaryFilter === "nearby" && userPosition) {
      return placesToProcess
        .filter(
          (p) =>
            p.location &&
            getDistance(
              userPosition.lat,
              userPosition.lng,
              p.location.lat,
              p.location.lng
            ) <= NEARBY_RADIUS_KM
        )
        .sort(
          (a, b) =>
            getDistance(
              userPosition.lat,
              userPosition.lng,
              a.location!.lat,
              a.location!.lng
            ) -
            getDistance(
              userPosition.lat,
              userPosition.lng,
              b.location!.lat,
              b.location!.lng
            )
        );
    }
    return placesToProcess;
  }, [places, secondaryFilter, userPosition]);

  // --- EFECTOS Y HANDLERS ---
  useEffect(() => {
    if (navigationDestination) return;
    if (searchQuery && placesToShow.length === 1) setZoom(17);
    else if (placesToShow.length > 0) setZoom(14);
    else setZoom(12);
  }, [searchQuery, placesToShow, navigationDestination]);
  useEffect(() => {
    if (!navigationDestination || !userPosition) {
      setDirections(undefined);
      return;
    }
    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: userPosition,
        destination: navigationDestination.location,
        travelMode: window.google.maps.TravelMode.WALKING,
      },
      (result, status) => {
        if (status === "OK" && result) setDirections(result);
      }
    );
  }, [navigationDestination, userPosition]);
  const handleStartNavigation = useCallback(() => {
    if (selectedPlace) setNavigationDestination(selectedPlace);
  }, [selectedPlace]);
  const handleStopNavigation = useCallback(() => {
    setNavigationDestination(null);
    setSelectedPlace(null);
    setDirections(undefined);
  }, []);
  const handleCategoryChange = useCallback((newCategory: string) => {
    setActiveCategories(newCategory);
    setSearchQuery("");
    setSecondaryFilter("all");
    setNavigationDestination(null);
  }, []);
  const handleResetLocation = useCallback(() => {
    setSearchQuery("");
    setSelectedPlace(null);
    setNavigationDestination(null);
    setSecondaryFilter("all");
  }, []);
  const toggleFilters = () => setIsFilterVisible((v) => !v);
  const closeFilters = () => setIsFilterVisible(false);

  // --- LÓGICA DE TEXTOS DINÁMICOS COMPLETA (RESTAURADA) ---
  const { displayTitle, displaySubtitle } = useMemo(() => {
    if (navigationDestination) {
      return {
        displayTitle: `Navegando a ${navigationDestination.name}`,
        displaySubtitle: `Faltan ${
          currentDistance !== null
            ? currentDistance < 1
              ? `${Math.round(currentDistance * 1000)} m`
              : `${currentDistance.toFixed(1)} km`
            : "..."
        }`,
      };
    }
    if (searchQuery) {
      if (loading)
        return { displayTitle: "Buscando...", displaySubtitle: searchQuery };
      if (placesToShow.length > 0)
        return {
          displayTitle: "Resultado",
          displaySubtitle: placesToShow[0].name,
        };
      return {
        displayTitle: "Sin resultados",
        displaySubtitle: "Intenta otra búsqueda",
      };
    }
    if (selectedPlace) {
      return {
        displayTitle: `Seleccionado: ${selectedPlace.name}`,
        displaySubtitle: "Presiona para navegar",
      };
    }
    return { displayTitle: userAddress, displaySubtitle: "Ubicación actual" };
  }, [
    navigationDestination,
    currentDistance,
    searchQuery,
    loading,
    placesToShow,
    selectedPlace,
    userAddress,
  ]);

  return (
    <div className="flex flex-col bg-gray-200">
      {/* --- SECCIÓN DEL MAPA --- */}
      <div className="relative h-[70vh]">
        <div id="map" className="h-full w-full">
          <MapDisplay
            markers={placesToShow}
            center={navigationDestination ? undefined : mapCenter}
            zoom={navigationDestination ? undefined : zoom}
            userLocation={userPosition}
            onMarkerClick={setSelectedPlace}
            destination={navigationDestination}
            directions={directions}
          />
        </div>

        <div className="absolute top-4 left-0 right-0 z-40 mx-auto w-11/12 md:w-3/4">
          <div className="flex items-center gap-2">
            <div className="flex-grow">
              <Search
                placeholder="Buscar lugares..."
                onSearch={setSearchQuery}
                onChange={setSearchQuery}
                value={searchQuery}
              />
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
          className={`absolute inset-1 z-30 transition-opacity duration-700 ${
            isFilterVisible ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`transform rounded-b-2xl bg-white p-4 pt-24 z-50 shadow-xl ${
              isFilterVisible ? "translate-y-0" : "-translate-y-full"
            }`}
          >
            <CategoryFilter
              selectedCategory={activeCategories}
              onSelectionChange={handleCategoryChange}
            />
          </div>
        </div>
      </div>

      {/* --- SECCIÓN INFERIOR CON DISEÑO Y ESTRUCTURA CORREGIDOS --- */}
      <div className="bg-white rounded-t-2xl shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.1)] pt-4 pb-8 flex-grow">
        <div className="w-full max-w-sm mx-auto px-4 flex flex-col gap-4">
          {/*-- Handle y Encabezado del Panel --*/}
          <div>
            <div className="w-10 h-1.5 bg-gray-300 rounded-full mx-auto mb-4"></div>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-3xl font-black tracking-wide text-gray-900">
                  MAPA
                </h3>
                <p className="text-gray-500">Busca lugares cerca de ti</p>
              </div>
              <button className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-red-500 rounded-xl text-white shadow-md">
                <IoLocationSharp size={24} />
              </button>
            </div>
          </div>

          {/*-- Píldora de estado y botones de navegación --*/}
          <div className="w-full flex items-center gap-2">
            <div className="flex-grow flex items-center justify-between rounded-full bg-[#073247] p-2 pl-5 text-white shadow-lg">
              <div className="flex items-center gap-4">
                <IoLocationOutline
                  size={28}
                  className="flex-shrink-0 opacity-90"
                />
                <div>
                  <p className="font-bold text-sm truncate max-w-[150px]">
                    {displayTitle}
                  </p>
                  <p className="text-xs text-white/80 truncate max-w-[150px]">
                    {displaySubtitle}
                  </p>
                </div>
              </div>
              <div className="pr-1">
                <button
                  onClick={handleResetLocation}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-800 shadow"
                >
                  <IoSync size={20} />
                </button>
              </div>
            </div>
            {navigationDestination ? (
              <button
                onClick={handleStopNavigation}
                className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-full bg-red-500 text-white shadow-lg text-xl font-bold"
              >
                X
              </button>
            ) : (
              <button
                onClick={handleStartNavigation}
                disabled={!selectedPlace || !userPosition}
                className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#073247] shadow-lg disabled:opacity-50"
              >
                <IoNavigate size={24} />
              </button>
            )}
          </div>

          {/*-- Contenido Condicional: Filtros y Tarjetas o Tarjeta de Destino --*/}
          <div className="mt-2">
            {navigationDestination ? (
              // Vista de navegación: solo Tarjeta de destino
              <DestinyCard
                destination={navigationDestination}
                currentDistance={currentDistance}
                initialDistance={initialDistance}
              />
            ) : (
              // Vista normal: Filtros y tarjetas
              <div className="flex flex-col gap-6">
                <div className="w-full flex justify-center">
                  <MapFilters
                    activeFilter={secondaryFilter}
                    onFilterChange={setSecondaryFilter}
                  />
                </div>
                <PlaceCards
                  places={placesToShow}
                  category={activeCategories}
                  loading={loading}
                  title="Lugares Recomendados"
                  onPlaceClick={(place) => {
                    console.log("Lugar seleccionado:", place);
                  }}
                  itemsPerPage={6}
                  onVisit={(place) => {
    // Importante: estos 2 estados disparan tu efecto que calcula las rutas
                  setSelectedPlace(place as Place);
                  setNavigationDestination(place as Place);}}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Maps;
