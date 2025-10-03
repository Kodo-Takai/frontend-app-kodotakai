import BeachCards from "../../components/cards/beachCard";
import HeaderNavigationExplore from "../../components/ui/headerNavigationExplore";
import Search from "../../components/ui/search/search";
import SegmentedControl from "../../components/ui/segmentedControl";
import BadgeWithIcon from "../../components/ui/badgeWithIcon";
import { useState } from "react";
import { useNavigationAnimation } from "../../hooks/useNavigationAnimation";

export default function PlayasPage() {
  const [selectedOption, setSelectedOption] = useState("Mostrar Todo");
  const [selectedBadge, setSelectedBadge] = useState<string | null>(null);
  const animationClass = useNavigationAnimation();

  // Función para manejar la búsqueda
  const handleSearch = (query: string) => {
    console.log("Buscando:", query);
  };

  // Función para manejar el click en badges
  const handleBadgeClick = (badgeId: string) => {
    setSelectedBadge(selectedBadge === badgeId ? null : badgeId);
    console.log("Badge seleccionado:", badgeId);
  };

  return (
    <div
      className={`relative flex flex-col max-w-md mx-auto min-h-screen ${animationClass}`}
    >
      {/* Imagen de fondo pegada al techo */}
      <div
        className="absolute top-0 left-0 w-full h-140 sm:h-40 md:h-48 lg:h-56 bg-center bg-no-repeat"
        style={{
          backgroundImage: "url(/beach-background-section-explore.svg)",
          backgroundSize: "165%",
          backgroundPosition: "top center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Contenido principal */}
      <div className="relative z-10 flex flex-col gap-3 p-6">
        {/* Header Navigation */}
        <HeaderNavigationExplore />

        <div className="justify-center items-center text-center">
          <h1 className="text-[65px] font-black pb-1 text-[#00324A] leading-none">
            PLAYAS
          </h1>
          <p className="text-xl font-extrabold text-[#ffffff]">CERCA DE TI</p>
        </div>

        <SegmentedControl
          options={["Mostrar Todo", "Sugerencias IA"]}
          selected={selectedOption}
          onChange={setSelectedOption}
        />

        <Search
          onSearch={handleSearch}
          placeholder="Buscar playas cerca de ti..."
        />

        <div className="w-full">
          <div className="flex flex-wrap gap-2">
            <BadgeWithIcon
              id="todo"
              icon={
                <img
                  src="/icons/playas_icons/p-cat_todo_icon.svg"
                  alt="Todo"
                  className="w-5 h-5"
                />
              }
              hoverIcon={
                <img
                  src="/icons/playas_icons/hover-p-cat_todo_icon.svg"
                  alt="Todo"
                  className="w-5 h-5"
                />
              }
              label="Todo"
              isActive={selectedBadge === "todo"}
              onClick={handleBadgeClick}
            />
            <BadgeWithIcon
              id="surf"
              icon={
                <img
                  src="/icons/playas_icons/p-cat_surf_icon.svg"
                  alt="Surf"
                  className="w-5 h-5"
                />
              }
              hoverIcon={
                <img
                  src="/icons/playas_icons/hover-p-cat_surf_icon.svg"
                  alt="Surf"
                  className="w-5 h-5"
                />
              }
              label="Surf"
              isActive={selectedBadge === "surf"}
              onClick={handleBadgeClick}
            />
            <BadgeWithIcon
              id="pesca"
              icon={
                <img
                  src="/icons/playas_icons/p-cat_pesca_icon.svg"
                  alt="Pesca"
                  className="w-5 h-5"
                />
              }
              hoverIcon={
                <img
                  src="/icons/playas_icons/hover-p-cat_pesca_icon.svg"
                  alt="Pesca"
                  className="w-5 h-5"
                />
              }
              label="Pesca"
              isActive={selectedBadge === "pesca"}
              onClick={handleBadgeClick}
            />
            <BadgeWithIcon
              id="petfriendly"
              icon={
                <img
                  src="/icons/playas_icons/p-cat_pet_icon.svg"
                  alt="Petfriendly"
                  className="w-5 h-5"
                />
              }
              hoverIcon={
                <img
                  src="/icons/playas_icons/hover-p-cat_pet_icon.svg"
                  alt="Petfriendly"
                  className="w-5 h-5"
                />
              }
              label="Petfriendly"
              isActive={selectedBadge === "petfriendly"}
              onClick={handleBadgeClick}
            />
            <BadgeWithIcon
              id="populares"
              icon={
                <img
                  src="/icons/playas_icons/p-cat_fav_icon.svg"
                  alt="Populares"
                  className="w-5 h-5"
                />
              }
              hoverIcon={
                <img
                  src="/icons/playas_icons/hover-p-cat_fav_icon.svg"
                  alt="Populares"
                  className="w-5 h-5"
                />
              }
              label="Populares"
              isActive={selectedBadge === "populares"}
              onClick={handleBadgeClick}
            />
          </div>
        </div>

        {/* Content */}
        <BeachCards />
      </div>
    </div>
  );
}
