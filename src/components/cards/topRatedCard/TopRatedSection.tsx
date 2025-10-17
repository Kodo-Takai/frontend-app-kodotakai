import { useState } from "react";
import TopRatedCarousel from "./TopRatedCarousel";
import PlaceModal from "../../ui/placeModal";
import { useTopRatedPlaces } from "../../../hooks/places/topRated";
import type { EnrichedPlace } from "../../../hooks/places"; // Importar tipo para mayor seguridad

// --- 1. IMPORTACIONES PARA NAVEGACIÓN ---
import { useNavigate } from "react-router-dom";
import { useNavigationContext } from "../../../context/navigationContext";

interface TopRatedSectionProps {
  category: "hotels" | "beaches" | "restaurants" | "destinations" | "discos" | "estudiar" | "parques";
  title?: string;
  limit?: number;
  minRating?: number;
}

export default function TopRatedSection({
  category,
  title,
  limit = 15,
  minRating = 4.0,
}: TopRatedSectionProps) {
  const { places, loading, error } = useTopRatedPlaces({
    category,
    limit,
    minRating,
  });

  // --- 2. HOOKS DE NAVEGACIÓN ---
  const { setInitialDestination } = useNavigationContext();
  const navigate = useNavigate();

  const [selectedPlace, setSelectedPlace] = useState<EnrichedPlace | null>(null); // Tipado corregido
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePlaceSelect = (place: EnrichedPlace) => { // Tipado corregido
    setSelectedPlace(place);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPlace(null);
  };

  // --- 3. FUNCIÓN DE NAVEGACIÓN ---
  const handleNavigation = (place: EnrichedPlace) => {
    setInitialDestination(place);
    navigate('/maps');
  };

  const getTitle = () => {
    if (title) return title;

    const titles = {
      hotels: "Top Hoteles mejor valorados",
      beaches: "Top Playas mejor valoradas",
      restaurants: "Top Restaurantes mejor valorados",
      destinations: "Top Destinos mejor valorados",
      discos: "Top Discotecas mejor valoradas",
      estudiar: "Top Lugares para estudiar mejor valorados",
      parques: "Top Parques mejor valorados",
    };

    return titles[category];
  };

  return (
    <div className="w-full">
      <TopRatedCarousel
        places={places}
        category={category}
        title={getTitle()}
        loading={loading}
        error={error}
        onSelect={handlePlaceSelect}
      />

      {/* Modal para mostrar detalles del lugar */}
      {selectedPlace && (
        <PlaceModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          place={selectedPlace}
          // --- 4. SE CONECTA LA NAVEGACIÓN AL MODAL ---
          onVisit={() => handleNavigation(selectedPlace)}
        />
      )}
    </div>
  );
}