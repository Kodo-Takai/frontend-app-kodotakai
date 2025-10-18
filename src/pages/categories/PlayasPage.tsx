import { useState, useEffect } from "react";
import HeaderNavigationExplore from "../../components/ui/headerNavigationExplore";
import Search from "../../components/ui/search/search";
import SegmentedControl from "../../components/ui/segmentedControl";
import BadgeWithIcon from "../../components/ui/badgeWithIcon";
import { usePlaces } from "../../hooks/places";
import { useIntelligentFiltering } from "../../hooks/useIntelligentFiltering";
import FilterableContent from "../../components/ui/filtering/FilterableContent";
import FilteredResults from "../../components/ui/filtering/FilteredResults";
import { LocationMultiGrid } from "../../components/cards/locationMultiCard";
import PlaceCards from "../../components/cards/placeCard";
import BeachCards from "../../components/cards/beachCard";
import CategoryWrapper from "../../components/layout/SmoothCategoryWrapper";

const BEACH_CAROUSEL_CONFIG = {
  interval: 4000,
  slides: [
    {
      image: "/beach-news (1).jpg",
      titleFirst: "DESCUBRE",
      titleRest: "LAS MEJORES PLAYAS",
      subtitle: "Encuentra playas paradisíacas y vive experiencias únicas",
    },
    {
      image: "/beach-news (2).jpg",
      titleFirst: "DIVIÉRTETE",
      titleRest: "EN LA COSTA",
      subtitle: "Desde playas tranquilas hasta olas perfectas para surf",
    },
  ],
};

const BEACH_BADGE_CONFIG = [
  {
    id: "todo",
    icon: "p-cat_todo_icon.svg",
    hoverIcon: "hover-p-cat_todo_icon.svg",
    label: "Todo",
  },
  {
    id: "surf",
    icon: "p-cat_surf_icon.svg",
    hoverIcon: "hover-p-cat_surf_icon.svg",
    label: "Surf",
  },
  {
    id: "pesca",
    icon: "p-cat_pesca_icon.svg",
    hoverIcon: "hover-p-cat_pesca_icon.svg",
    label: "Pesca",
  },
  {
    id: "camping",
    icon: "p-cat_camp_icon.svg",
    hoverIcon: "hover-p-cat_camp_icon.svg",
    label: "Camping",
  },
  {
    id: "tranquilo",
    icon: "p-cat_relaxed_icon.svg",
    hoverIcon: "hover-p-cat_relaxed_icon.svg",
    label: "Tranquilo",
  },
];

export default function PlayasPage() {
  const [selectedOption, setSelectedOption] = useState("Mostrar Todo");
  const [selectedBadge, setSelectedBadge] = useState<string | null>("todo");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const { places, loading, error, mapCenter } = usePlaces({
    category: "beaches",
    searchQuery: searchQuery,
    enableEnrichment: true,
    maxResults: 20,
  });

  const {
    places: filteredPlaces,
    totalMatches,
    activeFilter,
    applyFilter,
    clearFilter,
    isFilterActive,
    analyzeContentMatch,
  } = useIntelligentFiltering(places, "beaches");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleBadgeClick = (badgeId: string) => {
    const newSelectedBadge = selectedBadge === badgeId ? null : badgeId;
    setSelectedBadge(newSelectedBadge);

    if (newSelectedBadge && newSelectedBadge !== "todo") {
      applyFilter(newSelectedBadge);
    } else {
      clearFilter();
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(
        (prev) => (prev + 1) % BEACH_CAROUSEL_CONFIG.slides.length
      );
    }, BEACH_CAROUSEL_CONFIG.interval);

    return () => clearInterval(interval);
  }, []);

  return (
    <CategoryWrapper
      backgroundImage="/beach-background-section-explore.svg"
      backgroundSize="170%"
      backgroundPosition="top center"
    >
        <HeaderNavigationExplore />

        <div className="justify-center items-center text-center">
          <h1 className="text-[65px] font-black pb-1 leading-none" style={{ color: 'var(--color-blue)' }}>
            PLAYAS
          </h1>
          <p className="text-xl font-extrabold" style={{ color: 'var(--color-bone)' }}>CERCA DE TI</p>
        </div>

        <SegmentedControl
          options={["Mostrar Todo", "Sugerencias IA"]}
          selected={selectedOption}
          onChange={setSelectedOption}
        />

        <div className="w-full h-50 rounded-2xl mt-2 border-white border-4 relative overflow-hidden mb-1">
          <img
            src={BEACH_CAROUSEL_CONFIG.slides[currentSlide].image}
            className="w-full h-full object-cover rounded-2xl transition-opacity duration-500"
            alt="PLAYAS NEWS"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent rounded-2xl"></div>

          <div className="absolute top-3 right-3 backdrop-blur-sm rounded-full px-3 py-2 flex items-center gap-2" style={{ backgroundColor: 'var(--color-bone)' }}>
            <img
              src="/icons/red-compass.svg"
              alt="Location"
              className="w-4 h-4"
            />
            <span className="text-xs font-semibold" style={{ color: 'var(--color-blue)' }}>
              Usamos tu ubicación!
            </span>
          </div>

          <div className="absolute bottom-7 left-4 text-left">
            <h2 className="text-2xl font-extrabold mb-1 leading-none" style={{ color: 'var(--color-bone)' }}>
              {BEACH_CAROUSEL_CONFIG.slides[currentSlide].titleFirst} <br />
              {BEACH_CAROUSEL_CONFIG.slides[currentSlide].titleRest}
            </h2>
            <p className="text-sm" style={{ color: 'var(--color-beige-light)' }}>
              {BEACH_CAROUSEL_CONFIG.slides[currentSlide].subtitle}
            </p>
          </div>

          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2">
            {BEACH_CAROUSEL_CONFIG.slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "scale-125"
                    : "hover:opacity-70"
                }`}
                style={{ 
                  backgroundColor: currentSlide === index ? 'var(--color-bone)' : 'var(--color-beige-light)'
                }}
              />
            ))}
          </div>
        </div>

        <Search
          onSearch={handleSearch}
          placeholder="Buscar playas cerca de ti..."
        />

        <div className="w-full mb-3">
          <div className="flex flex-wrap gap-2">
            {BEACH_BADGE_CONFIG.map((badge) => (
              <BadgeWithIcon
                key={badge.id}
                id={badge.id}
                icon={
                  <img
                    src={`/icons/playas_icons/${badge.icon}`}
                    alt={badge.label}
                    className="w-5 h-5"
                  />
                }
                hoverIcon={
                  <img
                    src={`/icons/playas_icons/${badge.hoverIcon}`}
                    alt={badge.label}
                    className="w-5 h-5"
                  />
                }
                label={badge.label}
                isActive={selectedBadge === badge.id}
                onClick={handleBadgeClick}
                activeColor="var(--color-blue)"
                activeBorderColor={badge.id === "todo" ? "var(--color-beige-dark)" : "var(--color-beige-light)"}
              />
            ))}
          </div>
        </div>

        <FilterableContent isVisible={!isFilterActive}>
          <PlaceCards
            places={places}
            category="beaches"
            title="Playas mejor valoradas"
            loading={loading}
            error={error}
            onPlaceClick={(place) => {
              console.log("Playa seleccionada:", place);
            }}
            itemsPerPage={6}
          />
          <BeachCards />

          <div className="mt-10">
            <h2 className="text-2xl font-extrabold mb-2 text-[var(--color-text-primary)] text-center" style={{ color: 'var(--color-blue)' }}>
              Explora más playas
            </h2>
            <LocationMultiGrid
              places={places}
              loading={loading}
              error={error}
              onPlaceClick={(place) => {
                console.log("Playa seleccionada:", place);
              }}
              itemsPerPage={4}
              userLocation={mapCenter || undefined}
            />
          </div>
        </FilterableContent>

        <FilterableContent isVisible={isFilterActive}>
          <FilteredResults
            places={filteredPlaces}
            loading={loading}
            error={error}
            filterName={
              BEACH_BADGE_CONFIG.find((b) => b.id === activeFilter)?.label ||
              "filtro"
            }
            totalMatches={totalMatches}
            onPlaceClick={(place) => {
              console.log("Playa filtrada seleccionada:", place);
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
        </FilterableContent>
    </CategoryWrapper>
  );
}
