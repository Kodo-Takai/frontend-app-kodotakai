import React, { useState, useMemo } from "react";
import PlaceModal from "../../ui/placeModal";
import type { Place, EnrichedPlace } from "../../../hooks/places";
import "./index.scss";

// --- 1. IMPORTACIONES PARA NAVEGACIÓN Y ACCIONES ---
import { useNavigate } from "react-router-dom";
import { useNavigationContext } from "../../../context/navigationContext";
import { useAgenda } from "../../../hooks/useAgenda";
import { FiMoreVertical } from "react-icons/fi";
import { FaStar } from "react-icons/fa";

// --- Constantes y Utilidades ---
const DEFAULT_ITEMS_PER_PAGE = 4;

interface LocationMultiGridProps {
  places: Place[];
  loading?: boolean;
  error?: string | null;
  itemsPerPage?: number;
  userLocation?: { lat: number; lng: number };
}

const LocationMultiGrid: React.FC<LocationMultiGridProps> = ({
  places,
  loading,
  error,
  itemsPerPage = DEFAULT_ITEMS_PER_PAGE,
  userLocation,
}) => {
  // --- 2. ESTADO Y HOOKS PRINCIPALES ---
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { setInitialDestination } = useNavigationContext();
  const navigate = useNavigate();
  const { addItem } = useAgenda();

  const sortedPlaces = useMemo(() => {
    // ... tu lógica de ordenamiento ...
    return places;
  }, [places, userLocation]);

  const displayedPlaces = sortedPlaces.slice(0, currentPage * itemsPerPage);
  const hasMorePlaces = displayedPlaces.length < sortedPlaces.length;

  // --- 3. MANEJADORES DE ACCIONES ---
  const handleLoadMore = () => { /* ... */ };
  const handleOpenModal = (place: Place) => { setSelectedPlace(place); setIsModalOpen(true); };
  const handleCloseModal = () => { setIsModalOpen(false); setSelectedPlace(null); };
  const handleNavigation = (place: Place) => {
    setInitialDestination(place as EnrichedPlace);
    navigate('/maps');
  };

  // --- 4. SUB-COMPONENTE DE TARJETA CON NUEVO DISEÑO Y LÓGICA ---
  const LocationMultiCard = ({ place }: { place: Place }) => {
    const [menuOpen, setMenuOpen] = useState(false);

    const handleVisitFromMenu = (e: React.MouseEvent) => {
      e.stopPropagation();
      setMenuOpen(false);
      handleNavigation(place);
    };

    const handleAgendarFromMenu = (e: React.MouseEvent) => {
      e.stopPropagation();
      setMenuOpen(false);
      const agendaItem = { /* tu lógica de agendaItem */ };
      addItem(agendaItem);
      alert(`${place.name} agregado a la agenda.`);
    };

    return (
      // Contenedor principal con estilos de la imagen de ejemplo
      <div 
        className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transform hover:-translate-y-1 transition-transform duration-300" 
        onClick={() => handleOpenModal(place)}
      >
        <div className="relative">
          <img 
            className="w-full h-40 object-cover" 
            src={place.photo_url || 'https://picsum.photos/300/200'} 
            alt={place.name} 
          />
          {/* Botón de Menú */}
          <button
            className="absolute top-2 right-2 z-20 p-1.5 bg-white/80 backdrop-blur-sm rounded-full shadow"
            onClick={(e) => { e.stopPropagation(); setMenuOpen(v => !v); }}
          >
            <FiMoreVertical size={16} />
          </button>
          {/* Menú Desplegable */}
          {menuOpen && (
            <div className="absolute right-2 top-10 z-30 w-40 rounded-lg bg-white shadow-xl border" onClick={e => e.stopPropagation()}>
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={handleVisitFromMenu}>
                Visitar en Mapa
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={handleAgendarFromMenu}>
                Agendar
              </button>
            </div>
          )}
        </div>
        <div className="p-4">
          {/* Título del lugar */}
          <h3 className="font-bold text-lg text-gray-800 truncate">{place.name}</h3>
          {/* Ubicación */}
          <p className="text-sm text-gray-500 mt-1 truncate">{place.vicinity || 'Ubicación no disponible'}</p>
          {/* Rating */}
          {place.rating && (
            <div className="flex items-center mt-2">
              <FaStar className="text-red-500" />
              <span className="text-gray-700 font-semibold ml-1">{place.rating.toFixed(1)}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  // --- RENDERIZADO PRINCIPAL ---
  if (loading) { /* ... tu JSX de loading ... */ }
  if (error) { /* ... tu JSX de error ... */ }
  if (places.length === 0) { /* ... tu JSX de 'no hay lugares' ... */ }

  return (
    <div className="location-multi-grid mb-30">
      <div className="location-multi-grid-container">
        {displayedPlaces.map((place) => (
          <LocationMultiCard key={place.place_id} place={place} />
        ))}
      </div>

      {hasMorePlaces && (
        <div className="location-multi-grid-actions">
          <button className="location-multi-load-more-btn" onClick={handleLoadMore} disabled={isLoadingMore}>
            {isLoadingMore ? 'Cargando...' : `Mostrar más (${sortedPlaces.length - displayedPlaces.length} restantes)`}
          </button>
        </div>
      )}

      {selectedPlace && (
        <PlaceModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          place={selectedPlace}
          onVisit={handleNavigation} // <-- Se conecta la navegación al modal
        />
      )}
    </div>
  );
};

export default LocationMultiGrid;