import { useState, useEffect } from "react";
import RestaurantMenuCard from "../../components/cards/restaurantMenuCard";
import HeaderNavigationExplore from "../../components/ui/headerNavigationExplore";
import Search from "../../components/ui/search/search";
import SegmentedControl from "../../components/ui/segmentedControl";
// import BadgeWithIcon from "../../components/ui/badgeWithIcon";
import { usePlaces } from "../../hooks/places";
import { TopRatedSection } from "../../components/cards/topRatedCard";
import { LocationMultiGrid } from "../../components/cards/locationMultiCard";
// import { useIntelligentFiltering } from "../../hooks/useIntelligentFiltering";
import FilterableContent from "../../components/ui/filtering/FilterableContent";
// import FilteredResults from "../../components/ui/filtering/FilteredResults";
import PlaceCards from "../../components/cards/placeCard";
import CategoryWrapper from "../../components/layout/SmoothCategoryWrapper";

const CAROUSEL_CONFIG = {
  interval: 4000,
  slides: [
    {
      image: "/icons/restaurants/restaurant-news-1.svg",
      titleFirst: "DESCUBRE",
      titleRest: "LOS MEJORES RESTAURANTES",
      subtitle: "Sabores auténticos y experiencias gastronómicas únicas",
    },
    {
      image: "/icons/restaurants/restaurant-news-2.svg",
      titleFirst: "DEGUSTA",
      titleRest: "PLATOS EXQUISITOS",
      subtitle: "Desde comida local hasta especialidades internacionales",
    },
  ],
};

// const BADGE_CONFIG = [
//   {
//     id: "todo",
//     icon: "r-cat_todo_icon.svg",
//     hoverIcon: "hover-r-cat_todo_icon.svg",
//     label: "Todo",
//   },
//   {
//     id: "italiana",
//     icon: "r-cat_italiana_icon.svg",
//     hoverIcon: "hover-r-cat_italiana_icon.svg",
//     label: "Italiana",
//   },
//   {
//     id: "asiatica",
//     icon: "r-cat_asiatica_icon.svg",
//     hoverIcon: "hover-r-cat_asiatica_icon.svg",
//     label: "Asiática",
//   },
//   {
//     id: "mexicana",
//     icon: "r-cat_mexicana_icon.svg",
//     hoverIcon: "hover-r-cat_mexicana_icon.svg",
//     label: "Mexicana",
//   },
//   {
//     id: "mariscos",
//     icon: "r-cat_mariscos_icon.svg",
//     hoverIcon: "hover-r-cat_mariscos_icon.svg",
//     label: "Mariscos",
//   },
//   {
//     id: "vegetariana",
//     icon: "r-cat_vegetariana_icon.svg",
//     hoverIcon: "hover-r-cat_vegetariana_icon.svg",
//     label: "Vegetariana",
//   },
// ];

export default function RestaurantsPage() {
  const [selectedOption, setSelectedOption] = useState("Mostrar Todo");
  // const [selectedBadge, setSelectedBadge] = useState<string | null>("todo");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const { places, loading, error, mapCenter } = usePlaces({
    category: "restaurants",
    searchQuery: searchQuery,
    enableEnrichment: true,
    maxResults: 20,
  });

  // const {
  //   places: filteredPlaces,
  //   totalMatches,
  //   activeFilter,
  //   applyFilter,
  //   clearFilter,
  //   isFilterActive,
  //   analyzeContentMatch,
  // } = useIntelligentFiltering(places, "restaurants");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // const handleBadgeClick = (badgeId: string) => {
  //   const newSelectedBadge = selectedBadge === badgeId ? null : badgeId;
  //   setSelectedBadge(newSelectedBadge);

  //   if (newSelectedBadge && newSelectedBadge !== "todo") {
  //     applyFilter(newSelectedBadge);
  //   } else {
  //     clearFilter();
  //   }
  // };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % CAROUSEL_CONFIG.slides.length);
    }, CAROUSEL_CONFIG.interval);

    return () => clearInterval(interval);
  }, []);

  return (
    <CategoryWrapper
      backgroundImage="/icons/restaurants/restaurant-background-section-explore.svg"
      backgroundSize="110%"
      backgroundPosition="top center"
    >
        <HeaderNavigationExplore />

        <div className="justify-center items-center text-center mt-3 mb-5">
          <h1 className="text-[42px] font-black pb-1 text-[#FF0A10] leading-none tracking-[-0.03em]">
            RESTAURANTES
          </h1>
          <p className="text-xl font-bold text-[#ffffff]">CERCA DE TI</p>
        </div>

        <SegmentedControl
          options={["Mostrar Todo", "Sugerencias IA"]}
          selected={selectedOption}
          onChange={setSelectedOption}
        />

        <div className="w-full h-50 rounded-3xl mt-2 border-white border-4 relative overflow-hidden mb-1">
          <img
            src={CAROUSEL_CONFIG.slides[currentSlide].image}
            className="w-full h-full object-cover rounded-3xl transition-opacity duration-500"
            alt="RESTAURANTS NEWS"
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
              {CAROUSEL_CONFIG.slides[currentSlide].titleFirst} <br />
              {CAROUSEL_CONFIG.slides[currentSlide].titleRest}
            </h2>
            <p className="text-white/80 text-sm">
              {CAROUSEL_CONFIG.slides[currentSlide].subtitle}
            </p>
          </div>

          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2">
            {CAROUSEL_CONFIG.slides.map((_, index) => (
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
          placeholder="Buscar restaurantes cerca de ti..."
        />

        {/* <div className="w-full mb-3">
          <div className="flex flex-wrap gap-2">
            {BADGE_CONFIG.map((badge) => (
              <BadgeWithIcon
                key={badge.id}
                id={badge.id}
                icon={
                  <img
                    src={`/icons/restaurants_icons/${badge.icon}`}
                    alt={badge.label}
                    className="w-5 h-5"
                  />
                }
                hoverIcon={
                  <img
                    src={`/icons/restaurants_icons/${badge.hoverIcon}`}
                    alt={badge.label}
                    className="w-5 h-5"
                  />
                }
                label={badge.label}
                isActive={selectedBadge === badge.id}
                onClick={handleBadgeClick}
                activeColor="#DC1217"
                activeBorderColor={badge.id === "todo" ? "#e1e1e1" : "#F3F3F3"}
              />
            ))}
          </div>
        </div> */}

        <FilterableContent isVisible={true}>
          <TopRatedSection
            category="restaurants"
            title="Top Restaurantes mejor valorados"
            limit={5}
            minRating={4.0}
          />

          <RestaurantMenuCard />

          <PlaceCards
            places={places}
            category="restaurants"
            title="Restaurantes recomendados"
            loading={loading}
            error={error}
            onPlaceClick={(place) => {
              console.log("Restaurante seleccionado:", place);
            }}
            itemsPerPage={6}
          />

          <div className="mt-4">
            <h2 className="text-2xl font-bold text-[#00324A] mb-4 text-center">
              Explora más restaurantes
            </h2>
            <LocationMultiGrid
              places={places}
              loading={loading}
              error={error}
              onPlaceClick={(place) => {
                console.log("Restaurante seleccionado:", place);
              }}
              itemsPerPage={4}
              userLocation={mapCenter || undefined}
            />
          </div>
        </FilterableContent>

        {/* <FilterableContent isVisible={isFilterActive}>
          <FilteredResults
            places={filteredPlaces}
            loading={loading}
            error={error}
            filterName={
              BADGE_CONFIG.find((b) => b.id === activeFilter)?.label || "filtro"
            }
            totalMatches={totalMatches}
            onPlaceClick={(place) => {
              console.log("Restaurante filtrado seleccionado:", place);
              if (activeFilter) {
                const contentAnalysis = analyzeContentMatch(
                  place,
                  activeFilter
                );
                console.log("Análisis de contenido:", contentAnalysis);
              }
            }}
            userLocation={mapCenter || undefined}
          />
        </FilterableContent> */}
    </CategoryWrapper>
  );
}
