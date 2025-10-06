import { useState, useEffect } from "react";
import HotelsCard from "../../components/cards/hotelsCard";
import HeaderNavigationExplore from "../../components/ui/headerNavigationExplore";
import Search from "../../components/ui/search/search";
import SegmentedControl from "../../components/ui/segmentedControl";
import { useNavigationAnimation } from "../../hooks/useNavigationAnimation";
import BadgeWithIcon from "../../components/ui/badgeWithIcon";
import { usePlacesWithIA } from "../../hooks/places";
import { TopRatedSection } from "../../components/cards/topRatedCard";
import { LocationMultiGrid } from "../../components/cards/locationMultiCard";

export default function HotelesPage() {
  const [selectedOption, setSelectedOption] = useState("Mostrar Todo");
  const [selectedBadge, setSelectedBadge] = useState<string | null>("todo");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const animationClass = useNavigationAnimation();

  // Hook con datos detallados SIN IA
  const { places, loading, error } = usePlacesWithIA({
    category: "hotels",
    searchQuery: searchQuery,
    enableEnrichment: true, // ← ACTIVAR para datos detallados
    enableAI: false, // ← Mantener false hasta que IA esté lista
    requestedFilters: selectedBadge ? [selectedBadge] : [],
  });

  // Funciones básicas de filtrado
  const getPlacesByFilter = (filter: string) => {
    if (filter === "todo" || !filter) return places;

    return places.filter((place) => {
      const lowerName = place.name.toLowerCase();
      const lowerVicinity = place.vicinity?.toLowerCase() || "";

      switch (filter) {
        case "spa":
          return lowerName.includes("spa") || lowerVicinity.includes("spa");
        case "sauna":
          return lowerName.includes("sauna") || lowerVicinity.includes("sauna");
        case "cocina":
          return (
            lowerName.includes("cocina") ||
            lowerName.includes("kitchen") ||
            lowerVicinity.includes("cocina") ||
            lowerVicinity.includes("kitchen")
          );
        case "gym":
          return (
            lowerName.includes("gym") ||
            lowerName.includes("gimnasio") ||
            lowerVicinity.includes("gym") ||
            lowerVicinity.includes("gimnasio")
          );
        case "rest":
          return (
            lowerName.includes("restaurante") ||
            lowerName.includes("restaurant") ||
            lowerVicinity.includes("restaurante") ||
            lowerVicinity.includes("restaurant")
          );
        default:
          return true;
      }
    });
  };

  // Variables para compatibilidad futura con IA
  // const getFilterStatistics = () => ({});
  // const activeFilters = selectedBadge ? [selectedBadge] : [];
  // const updateActiveFilters = () => {};

  const carouselData = [
    {
      image: "/hotels-news-1.svg",
      titleFirst: "ENCUENTRA",
      titleRest: "LOS MEJORES HOTELES",
      subtitle: "Descubre experiencias únicas y encuentra tu lugar perfecto",
    },
    {
      image: "/hotels-news-2.svg",
      titleFirst: "RESERVA",
      titleRest: "TU ESTANCIA IDEAL",
      subtitle: "Hoteles de lujo y económicos a tu preferencia y originalidad",
    },
    {
      image: "/hotels-news-3.svg",
      titleFirst: "VIVE",
      titleRest: "EXPERIENCIAS ÚNICAS",
      subtitle: "Desde playas paradisíacas hasta montañas majestuosas",
    },
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleBadgeClick = (badgeId: string) => {
    const newSelectedBadge = selectedBadge === badgeId ? null : badgeId;
    setSelectedBadge(newSelectedBadge);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselData.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [carouselData.length]);

  return (
    <div
      className={`relative flex flex-col max-w-md mx-auto min-h-screen ${animationClass}`}
    >
      <div
        className="absolute top-0 left-0 w-full h-140 sm:h-40 md:h-48 lg:h-56 bg-center bg-no-repeat"
        style={{
          backgroundImage: "url(/hotels-background-section-explore.svg)",
          backgroundSize: "130%",
          backgroundPosition: "top center",
          backgroundRepeat: "no-repeat",
        }}
      />

      <div className="relative z-10 flex flex-col gap-3 p-6">
        <HeaderNavigationExplore />

        <div className="justify-center items-center text-center">
          <h1 className="text-[65px] font-black pb-1 text-[#FF0A10] leading-none">
            HOTELES
          </h1>
          <p className="text-xl font-extrabold text-[#ffffff]">CERCA DE TI</p>
        </div>

        <SegmentedControl
          options={["Mostrar Todo", "Sugerencias IA"]}
          selected={selectedOption}
          onChange={setSelectedOption}
        />

        <div className="w-full h-50 rounded-3xl mt-2 border-white border-4 relative overflow-hidden mb-1">
          <img
            src={carouselData[currentSlide].image}
            className="w-full h-full object-cover rounded-3xl transition-opacity duration-500"
            alt="HOTELS NEWS"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent rounded-3xl"></div>

          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-2 flex items-center gap-2">
            <img
              src="/icons/red-compass.svg"
              alt="Location"
              className="w-4 h-4"
            />
            <span className="text-xs font-semibold text-gray-800">
              Usamos tu ubicación!
            </span>
          </div>

          <div className="absolute bottom-7 left-4 text-left">
            <h2 className="text-white text-2xl font-extrabold mb-1 leading-none">
              {carouselData[currentSlide].titleFirst} <br />
              {carouselData[currentSlide].titleRest}
            </h2>
            <p className="text-white/80 text-sm">
              {carouselData[currentSlide].subtitle}
            </p>
          </div>

          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2">
            {carouselData.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "bg-white scale-125"
                    : "bg-white/50 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        </div>

        <Search
          onSearch={handleSearch}
          placeholder="Buscar hoteles cerca de ti..."
        />

        <div className="w-full mb-3">
          <div className="flex flex-wrap gap-2">
            <BadgeWithIcon
              id="todo"
              icon={
                <img
                  src="/icons/hotels_icons/h-cat_todo_icon.svg"
                  alt="Todo"
                  className="w-5 h-5"
                />
              }
              hoverIcon={
                <img
                  src="/icons/hotels_icons/hover-h-cat_todo_icon.svg"
                  alt="Todo"
                  className="w-5 h-5"
                />
              }
              label="Todo"
              isActive={selectedBadge === "todo"}
              onClick={handleBadgeClick}
              activeColor="#DC1217"
              activeBorderColor="#e1e1e1"
            />

            <BadgeWithIcon
              id="spa"
              icon={
                <img
                  src="/icons/hotels_icons/h-cat_spa_icon.svg"
                  alt="Spa"
                  className="w-5 h-5"
                />
              }
              hoverIcon={
                <img
                  src="/icons/hotels_icons/hover-h-cat_spa_icon.svg"
                  alt="Spa"
                  className="w-5 h-5"
                />
              }
              label="Spa"
              isActive={selectedBadge === "spa"}
              onClick={handleBadgeClick}
              activeColor="#DC1217"
              activeBorderColor="#F3F3F3"
            />

            <BadgeWithIcon
              id="rest"
              icon={
                <img
                  src="/icons/hotels_icons/h-cat_rest_icon.svg"
                  alt="Restaurante"
                  className="w-5 h-5"
                />
              }
              hoverIcon={
                <img
                  src="/icons/hotels_icons/hover-h-cat_rest_icon.svg"
                  alt="Restaurante"
                  className="w-5 h-5"
                />
              }
              label="Restaurante"
              isActive={selectedBadge === "rest"}
              onClick={handleBadgeClick}
              activeColor="#DC1217"
              activeBorderColor="#F3F3F3"
            />

            <BadgeWithIcon
              id="sauna"
              icon={
                <img
                  src="/icons/hotels_icons/h-cat_sauna_icon.svg"
                  alt="Sauna"
                  className="w-5 h-5"
                />
              }
              hoverIcon={
                <img
                  src="/icons/hotels_icons/hover-h-cat_sauna_icon.svg"
                  alt="Sauna"
                  className="w-5 h-5"
                />
              }
              label="Sauna"
              isActive={selectedBadge === "sauna"}
              onClick={handleBadgeClick}
              activeColor="#DC1217"
              activeBorderColor="#F3F3F3"
            />

            <BadgeWithIcon
              id="cocina"
              icon={
                <img
                  src="/icons/hotels_icons/h-cat_cocina_icon.svg"
                  alt="Cocina"
                  className="w-5 h-5"
                />
              }
              hoverIcon={
                <img
                  src="/icons/hotels_icons/hover-h-cat_cocina_icon.svg"
                  alt="Cocina"
                  className="w-5 h-5"
                />
              }
              label="Cocina"
              isActive={selectedBadge === "cocina"}
              onClick={handleBadgeClick}
              activeColor="#DC1217"
              activeBorderColor="#F3F3F3"
            />

            <BadgeWithIcon
              id="gym"
              icon={
                <img
                  src="/icons/hotels_icons/h-cat_gym_icon.svg"
                  alt="Gym"
                  className="w-5 h-5"
                />
              }
              hoverIcon={
                <img
                  src="/icons/hotels_icons/hover-h-cat_gym_icon.svg"
                  alt="Gym"
                  className="w-5 h-5"
                />
              }
              label="Gym"
              isActive={selectedBadge === "gym"}
              onClick={handleBadgeClick}
              activeColor="#DC1217"
              activeBorderColor="#F3F3F3"
            />
          </div>
        </div>

        <TopRatedSection 
          category="hotels"
          title="Top Hoteles mejor valorados"
          limit={10}
          minRating={4.0}
        />

        <HotelsCard
          places={
            selectedBadge && selectedBadge !== "todo"
              ? getPlacesByFilter(selectedBadge)
              : places
          }
          loading={loading}
          error={error}
        />

        <div className="mt-4">
          <h2 className="text-2xl font-bold text-[#00324A] mb-4 text-center">
            Explora más hoteles
          </h2>
          <LocationMultiGrid
            places={places}
            loading={loading}
            error={error}
            onPlaceClick={(place) => {
              console.log('Hotel seleccionado:', place.name);
            }}
            itemsPerPage={4}
          />
        </div>
      </div>
    </div>
  );
}
