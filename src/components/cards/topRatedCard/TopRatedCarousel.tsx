import { useState } from "react";
import TopRatedCard from "./index.tsx";
import "./index.scss";

interface TopRatedCarouselProps {
  places: any[];
  category: "hotels" | "beaches" | "restaurants" | "destinations";
  title: string;
  loading?: boolean;
  error?: string | null;
}

export default function TopRatedCarousel({ 
  places, 
  category, 
  title, 
  loading = false, 
  error = null 
}: TopRatedCarouselProps) {
  const [, setSelectedPlace] = useState<any>(null);

  const handlePlaceSelect = (place: any) => {
    setSelectedPlace(place);
    console.log('Lugar seleccionado desde TopRatedCarousel:', place);
  };

  const filteredPlaces = places.filter(place => {
    const hasDescription = !!(
      place.editorial_summary?.overview && 
      place.editorial_summary.overview.length > 20
    );
    
    const hasPrice = !!(
      place.price_info?.level !== null && 
      place.price_info?.level !== undefined &&
      place.price_info.level > 0
    );
    
    const hasBasicData = !!(place.name && place.rating && place.rating >= 3.0);
    
    return hasDescription && hasPrice && hasBasicData;
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
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-700">
            No se encontraron destinos con descripción y precio completos.
          </p>
          <p className="text-yellow-600 text-sm mt-1">
            Total de destinos encontrados: {places.length}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold text-gray-800 mb-4 ">{title}</h2>
      
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