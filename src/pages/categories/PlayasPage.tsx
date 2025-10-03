import BeachCards from "../../components/cards/beachCard";
import HeaderNavigationExplore from "../../components/ui/headerNavigationExplore";
import Search from "../../components/ui/search/search";
import SegmentedControl from "../../components/ui/segmentedControl";
import BadgeWithIcon from "../../components/ui/badgeWithIcon";
import { useState } from "react";
import { useNavigationAnimation } from "../../hooks/useNavigationAnimation";

export default function PlayasPage() {
  const [selectedOption, setSelectedOption] = useState("Mostrar Todo");
  const animationClass = useNavigationAnimation();

  // Función para manejar la búsqueda
  const handleSearch = (query: string) => {
    console.log("Buscando:", query);
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
          <h1 className="text-6xl font-black pb-1 text-[#00324A] leading-none">
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
              icon={<span className="text-lg">🏖️</span>}
              label="Todo"
            />
            <BadgeWithIcon
              icon={<span className="text-lg">🌊</span>}
              label="Surf"
            />
            <BadgeWithIcon
              icon={<span className="text-lg">🏄‍♂️</span>}
              label="Pesca"
            />
            <BadgeWithIcon
              icon={<span className="text-lg">🏊‍♀️</span>}
              label="Petfriendly"
            />
            <BadgeWithIcon
              icon={<span className="text-lg">🏖️</span>}
              label="Camping"
            />
            <BadgeWithIcon
              icon={<span className="text-lg">🌅</span>}
              label="Populares"
            />
          </div>
        </div>

        {/* Content */}
        <BeachCards />
      </div>
    </div>
  );
}
