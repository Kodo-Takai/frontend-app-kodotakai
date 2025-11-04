import { useState } from "react";
import TopRatedCard from "./index.tsx";
import "./index.scss";

interface TopRatedCarouselProps {
  places: any[];
  category: "hotels" | "beaches" | "restaurants" | "destinations" | "discos" | "estudiar" | "parques";
  title: string;
  loading?: boolean;
  error?: string | null;
  onSelect?: (place: any) => void; 
}

export default function TopRatedCarousel({
  places,
  category,
  title,
  loading = false,
  error = null,
  onSelect,
}: TopRatedCarouselProps) {
  const [, setSelectedPlace] = useState<any>(null);

  const handlePlaceSelect = (place: any) => {
    setSelectedPlace(place);
    /* console.log("Lugar seleccionado desde TopRatedCarousel:", place); */

    if (onSelect) {
      onSelect(place);
    }
  };

  const filteredPlaces = places.filter((place) => {
    const hasBasicData = !!(place.name && place.rating && place.rating >= 3.0);

    if (!hasBasicData) return false;

    const hasDescription = !!(
      place.editorial_summary?.overview &&
      place.editorial_summary.overview.length > 10
    );

    const hasPrice = !!(
      place.price_info?.level !== null && place.price_info?.level !== undefined
    );

    const hasTypes = !!(place.types && place.types.length > 0);
    const hasVicinity = !!(place.vicinity && place.vicinity.length > 0);

    // Para restaurantes: aceptar si tiene descripción O precio O tipos/vicinity
    // Para hoteles: mantener el filtro estricto (descripción Y precio)
    // Para nuevas categorías: usar filtro más flexible
    if (category === 'restaurants') {
      return hasBasicData && (hasDescription || hasPrice || hasTypes || hasVicinity);
    } else if (category === 'hotels') {
      return hasBasicData && hasDescription && hasPrice;
    } else {
      // Para discos, estudiar, parques: filtro más flexible
      return hasBasicData && (hasDescription || hasPrice || hasTypes || hasVicinity);
    }
  });

  if (loading) {
    return (
      <div className="w-full">
        <h2 className="text-xl font-bold text-gray-800 mb-4 px-4">{title}</h2>
        <div className="top-rated-carousel">
          {[1, 2, 3].map((i) => (
            <div key={i} className="top-rated-skeleton" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (filteredPlaces.length === 0) {
    return (
      <div className="w-full p-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
        <div className="border rounded-lg p-4">
          <p className="text-yellow-700">
            No se encontraron destinos con datos completos suficientes.
          </p>
          <p className="text-yellow-600 text-sm mt-1">
            Total de destinos encontrados: {places.length}
          </p>
          <p className="text-yellow-600 text-sm">
            Filtros aplicados: rating ≥ 3.0, nombre válido, {category === 'restaurants' ? 'descripción, precio, tipos o ubicación' : 'descripción completa y precio'}.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-lg font-extrabold mb-2 text-[var(--color-text-primary)]">{title}</h2>

      <div className="top-rated-carousel">
        {filteredPlaces.map((place, index) => (
          <TopRatedCard
            key={place.place_id || index}
            place={place}
            category={category}
            onSelect={handlePlaceSelect} 
            index={index}
          />
        ))}
      </div>
    </div>
  );
}
