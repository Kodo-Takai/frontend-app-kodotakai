import TopRatedCarousel from "./TopRatedCarousel";
import { useTopRatedPlaces } from "../../../hooks/places";

interface TopRatedSectionProps {
  category: "hotels" | "beaches" | "restaurants" | "destinations";
  title?: string;
  limit?: number;
  minRating?: number;
}

export default function TopRatedSection({ 
  category, 
  title,
  limit = 15,
  minRating = 4.0
}: TopRatedSectionProps) {
  const { places, loading, error } = useTopRatedPlaces({
    category,
    limit,
    minRating,
    requireDescription: true,
    requirePrice: true
  });

  const getTitle = () => {
    if (title) return title;
    
    const titles = {
      hotels: " Top Hoteles mejor valorados",
      beaches: " Top Playas mejor valoradas", 
      restaurants: " Top Restaurantes mejor valorados",
      destinations: " Top Destinos mejor valorados"
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
      />
      
    </div>
  );
}
