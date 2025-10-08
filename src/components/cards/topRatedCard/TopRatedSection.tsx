import TopRatedCarousel from "./TopRatedCarousel";
import { useTopRatedPlaces } from "../../../hooks/places/topRated";

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

  const getTitle = () => {
    if (title) return title;

    const titles = {
      hotels: " Top Hoteles mejor valorados",
      beaches: " Top Playas mejor valoradas",
      restaurants: " Top Restaurantes mejor valorados",
      destinations: " Top Destinos mejor valorados",
      discos: " Top Discotecas mejor valoradas",
      estudiar: " Top Lugares para estudiar mejor valorados",
      parques: " Top Parques mejor valorados",
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
