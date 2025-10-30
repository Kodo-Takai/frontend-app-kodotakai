import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SegmentedControl from "../components/ui/segmentedControl";
import HotelsCard from "../components/cards/hotelsCard";
import Search from "../components/ui/search/search";
import BeachCards from "../components/cards/beachCard";
import DestinationCards from "../components/cards/destinationsCard";
import RestaurantMenuCard from "../components/cards/restaurantMenuCard";
import PageWrapper from "../components/layout/SmoothPageWrapper";
import { useAI } from "../context/aiContext";

export default function Explorar() {
  const [selectedOption, setSelectedOption] = useState("Todo");
  const navigate = useNavigate();
  const { showAIOverlay, isAIActive } = useAI();

  // Función para navegar a categorías
  const handleCategoryClick = (category: string) => {
    navigate(`/explorar/${category}`);
  };

  const handleAIClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    // Prevenir click si el overlay ya está activo
    if (isAIActive) return;

    const button = event.currentTarget;

    // Efecto de bounce/encogimiento del botón
    button.style.transform = "scale(0.9)";
    button.style.transition = "transform 0.1s ease-out";

    // Después del bounce, restaurar y activar overlay
    setTimeout(() => {
      button.style.transform = "scale(1)";
      button.style.transition = "transform 0.2s ease-out";

      // Activar overlay después del bounce
      setTimeout(() => {
        const rect = button.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        showAIOverlay({ x: centerX, y: centerY });
      }, 100);
    }, 100);
  };

  return (
    <div
      className="min-h-screen relative pb-20"
      style={{ backgroundColor: "var(--color-bg-primary)" }}
    >
      <PageWrapper>
        {/* Header */}
        <div className="flex justify-between items-center mt-7">
          <div className="flex flex-col gap-1">
            <h1
              style={{
                color: "var(--color-primary-dark)",
                fontSize: "40px",
                fontStyle: "normal",
                height: "40px",
                fontWeight: "800",
                lineHeight: "26px",
              }}
            >
              Explorar
            </h1>
            <p
              style={{
                color: "var(--color-primary-dark)",
                fontSize: "15px",
                fontStyle: "normal",
                fontWeight: "700",
                lineHeight: "22px",
              }}
            >
              A donde iremos hoy?
            </p>
          </div>

          <button
            onClick={handleAIClick}
            className="w-12 h-12 rounded-xl flex items-center justify-center hover:scale-90 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer animate-bubble-in relative z-[9998]"
            style={{
              backgroundColor: "var(--color-green)",
              border: "3px solid var(--color-green-dark)",
            }}
          >
            <img
              src="./icons/ai-function-icon-2.svg"
              alt="IA Assistant"
              className="w-8 h-8 opacity-85 hover:scale-80 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
            />
          </button>
        </div>

        <SegmentedControl
          options={["Todo", "Sugerencias IA"]}
          selected={selectedOption}
          onChange={setSelectedOption}
        />

        {/* Categorías de exploración */}
        <div className="relative w-full h-[250px] overflow-hidden">
          {/* Restaurants */}
          <div
            onClick={() => handleCategoryClick("restaurants")}
            className="absolute rounded-full overflow-hidden cursor-pointer group w-28 h-28 top-[8%] left-[1.3%] animate-bubble-in hover:scale-105 transition-transform duration-300 ease-out"
          >
            <img
              src="./restaurants-image.svg"
              className="object-cover w-full h-full"
              alt="Restaurants"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/95 transition-all duration-300 group-hover:from-black/10 group-hover:to-black/70"></div>
            <div
              className="absolute inset-0 flex flex-col items-center justify-end pb-3 font-semibold"
              style={{ color: "var(--color-bone)" }}
            >
              <p className="text-sm">Restaurants</p>
              <p className="text-xs">+24</p>
            </div>
          </div>

          {/* Playas */}
          <div
            onClick={() => handleCategoryClick("playas")}
            className="absolute rounded-full overflow-hidden cursor-pointer group w-20 h-20 top-[3%] right-[39%] animate-bubble-in hover:scale-105 transition-transform duration-300 ease-out"
            style={{ animationDelay: "0.1s" }}
          >
            <img
              src="./playas-image.svg"
              className="object-cover w-full h-full"
              alt="Playas"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/95 transition-all duration-300 group-hover:from-black/10 group-hover:to-black/70"></div>
            <div
              className="absolute inset-0 flex flex-col items-center justify-end pb-3 font-semibold"
              style={{ color: "var(--color-bone)" }}
            >
              <p className="text-xs">Playas</p>
              <p className="text-xs">+12</p>
            </div>
          </div>

          {/* Hoteles */}
          <div
            onClick={() => handleCategoryClick("hoteles")}
            className="absolute rounded-full overflow-hidden cursor-pointer group w-28 h-28 top-[3%] right-[2%] animate-bubble-in hover:scale-105 transition-transform duration-300 ease-out"
            style={{ animationDelay: "0.2s" }}
          >
            <img
              src="./hotels-image.svg"
              className="object-cover w-full h-full"
              alt="Hoteles"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/95 transition-all duration-300 group-hover:from-black/10 group-hover:to-black/70"></div>
            <div
              className="absolute inset-0 flex flex-col items-center justify-end pb-3 font-semibold"
              style={{ color: "var(--color-bone)" }}
            >
              <p className="text-sm">Hoteles</p>
              <p className="text-xs">+18</p>
            </div>
          </div>

          {/* Discos */}
          <div
            onClick={() => handleCategoryClick("discos")}
            className="absolute rounded-full overflow-hidden cursor-pointer group w-22 h-22 top-[60%] left-[1%] animate-bubble-in hover:scale-105 transition-transform duration-300 ease-out"
            style={{ animationDelay: "0.3s" }}
          >
            <img
              src="./discos-image.svg"
              className="object-cover w-full h-full"
              alt="A bailar"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/95 transition-all duration-300 group-hover:from-black/10 group-hover:to-black/70"></div>
            <div
              className="absolute inset-0 flex flex-col items-center justify-end pb-3 font-semibold"
              style={{ color: "var(--color-bone)" }}
            >
              <p className="text-xs">Discos</p>
              <p className="text-xs">+8</p>
            </div>
          </div>

          {/* Estudiar*/}
          <div
            onClick={() => handleCategoryClick("estudiar")}
            className="absolute rounded-full overflow-hidden cursor-pointer group w-34 h-34 top-[40%] left-[31%] animate-bubble-in hover:scale-105 transition-transform duration-300 ease-out"
            style={{ animationDelay: "0.4s" }}
          >
            <img
              src="./estudiar-image.svg"
              className="object-cover w-full h-full"
              alt="Eventos"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/95 transition-all duration-300 group-hover:from-black/10 group-hover:to-black/70"></div>
            <div
              className="absolute inset-0 flex flex-col items-center justify-end pb-3 font-semibold"
              style={{ color: "var(--color-bone)" }}
            >
              <p className="text-sm">Estudiar</p>
              <p className="text-xs">+15</p>
            </div>
          </div>

          {/* Más */}
          <div
            onClick={() => handleCategoryClick("parques")}
            className="absolute rounded-full overflow-hidden cursor-pointer group w-19 h-19 top-[55%] right-[3%] animate-bubble-in hover:scale-105 transition-transform duration-300 ease-out"
            style={{ animationDelay: "0.5s" }}
          >
            <img
              src="./parques-image.svg"
              className="object-cover w-full h-full"
              alt="Más"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/95 transition-all duration-300 group-hover:from-black/10 group-hover:to-black/70"></div>
            <div
              className="absolute inset-0 flex flex-col items-center justify-end pb-3 font-semibold"
              style={{ color: "var(--color-bone)" }}
            >
              <p className="text-xs">Parques</p>
              <p className="text-xs">+6</p>
            </div>
          </div>
        </div>

        <DestinationCards />
        <RestaurantMenuCard />
        <HotelsCard />
        <BeachCards />
      </PageWrapper>
    </div>
  );
}
