import { useState, useEffect } from "react";
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
      image: "/icons/parques/parques-news-1.svg",
      titleFirst: "DISFRUTA",
      titleRest: "DE LA NATURALEZA",
      subtitle: "Parques, jardines y espacios verdes para relajarte",
    },
    {
      image: "/icons/parques/parques-news-2.svg",
      titleFirst: "CONECTA",
      titleRest: "CON EL AIRE LIBRE",
      subtitle: "Áreas recreativas y pulmones verdes de la ciudad",
    },
  ],
};

// const BADGE_CONFIG = [
//   {
//     id: "todo",
//     icon: "p-cat_todo_icon.svg",
//     hoverIcon: "hover-p-cat_todo_icon.svg",
//     label: "Todo",
//   },
//   {
//     id: "recreacion",
//     icon: "p-cat_recreacion_icon.svg",
//     hoverIcon: "hover-p-cat_recreacion_icon.svg",
//     label: "Recreación",
//   },
//   {
//     id: "deportes",
//     icon: "p-cat_deportes_icon.svg",
//     hoverIcon: "hover-p-cat_deportes_icon.svg",
//     label: "Deportes",
//   },
//   {
//     id: "jardin",
//     icon: "p-cat_jardin_icon.svg",
//     hoverIcon: "hover-p-cat_jardin_icon.svg",
//     label: "Jardín",
//   },
//   {
//     id: "plaza",
//     icon: "p-cat_plaza_icon.svg",
//     hoverIcon: "hover-p-cat_plaza_icon.svg",
//     label: "Plaza",
//   },
//   {
//     id: "naturaleza",
//     icon: "p-cat_naturaleza_icon.svg",
//     hoverIcon: "hover-p-cat_naturaleza_icon.svg",
//     label: "Naturaleza",
//   },
// ];

export default function ParquesPage() {
  const [selectedOption, setSelectedOption] = useState("Mostrar Todo");
  // const [selectedBadge, setSelectedBadge] = useState<string | null>("todo");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const { places, loading, error, mapCenter } = usePlaces({
    category: "parques",
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
  // } = useIntelligentFiltering(places, "parques");

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
      backgroundImage="/icons/parques/parques-background-section-explore.svg"
      backgroundSize="150%"
      backgroundPosition="top center"
    >
      <HeaderNavigationExplore />

      <div className="justify-center items-center text-center mt-3 mb-5">
        <h1
          className="text-[60px] font-black pb-1 leading-none tracking-[-0.03em]"
          style={{ color: "var(--color-green)" }}
        >
          PARQUES
        </h1>
        <p className="text-xl font-bold" style={{ color: "var(--color-bone)" }}>
          CERCA DE TI
        </p>
      </div>

      <div className="w-full h-50 rounded-3xl mt-2 border-white border-4 relative overflow-hidden mb-1">
        <img
          src={CAROUSEL_CONFIG.slides[currentSlide].image}
          className="w-full h-full object-cover rounded-3xl transition-opacity duration-500"
          alt="PARQUES NEWS"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent rounded-3xl"></div>

        <div
          className="absolute top-3 right-3 backdrop-blur-sm rounded-full px-3 py-2 flex items-center gap-2"
          style={{ backgroundColor: "var(--color-bone)" }}
        >
          <img
            src="/icons/red-compass.svg"
            alt="Location"
            className="w-4 h-4"
          />
          <span
            className="text-xs font-semibold"
            style={{ color: "var(--color-blue)" }}
          >
            Usamos tu ubicación!
          </span>
        </div>

        <div className="absolute bottom-7 left-4 text-left">
          <h2
            className="text-2xl font-extrabold mb-1 leading-none"
            style={{ color: "var(--color-bone)" }}
          >
            {CAROUSEL_CONFIG.slides[currentSlide].titleFirst} <br />
            {CAROUSEL_CONFIG.slides[currentSlide].titleRest}
          </h2>
          <p className="text-sm" style={{ color: "var(--color-beige-light)" }}>
            {CAROUSEL_CONFIG.slides[currentSlide].subtitle}
          </p>
        </div>

        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2">
          {CAROUSEL_CONFIG.slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentSlide ? "scale-125" : "hover:opacity-70"
              }`}
              style={{
                backgroundColor:
                  currentSlide === index
                    ? "var(--color-bone)"
                    : "var(--color-beige-light)",
              }}
            />
          ))}
        </div>
      </div>

      {/* <div className="w-full mb-3">
          <div className="flex flex-wrap gap-2">
            {BADGE_CONFIG.map((badge) => (
              <BadgeWithIcon
                key={badge.id}
                id={badge.id}
                icon={
                  <img
                    src={`/icons/parques_icons/${badge.icon}`}
                    alt={badge.label}
                    className="w-5 h-5"
                  />
                }
                hoverIcon={
                  <img
                    src={`/icons/parques_icons/${badge.hoverIcon}`}
                    alt={badge.label}
                    className="w-5 h-5"
                  />
                }
                label={badge.label}
                isActive={selectedBadge === badge.id}
                onClick={handleBadgeClick}
                activeColor="var(--color-green)"
                activeBorderColor={badge.id === "todo" ? "var(--color-beige-dark)" : "var(--color-beige-light)"}
              />
            ))}
          </div>
        </div> */}

      <FilterableContent isVisible={true}>
        <TopRatedSection
          category="parques"
          title="Top Parques mejor valorados"
          limit={5}
          minRating={4.0}
        />

        <PlaceCards
          places={places}
          category="parques"
          title="Parques recomendados"
          loading={loading}
          error={error}
          onPlaceClick={(place) => {
            console.log("Parque seleccionado:", place);
          }}
          itemsPerPage={6}
        />

        <div className="mt-10">
          <h2
            className="text-2xl font-extrabold mb-2 text-[var(--color-text-primary)] text-center"
            style={{ color: "var(--color-blue)" }}
          >
            Explora más parques
          </h2>
          <LocationMultiGrid
            places={places}
            loading={loading}
            error={error}
            onPlaceClick={(place) => {
              console.log("Parque seleccionado:", place);
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
              console.log("Parque filtrado seleccionado:", place);
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
