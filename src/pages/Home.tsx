import WhatsNewCards from "../components/cards/whatsNewCard";
import SummaryCard from "../components/cards/summaryCard";
import DestinationCards from "../components/cards/destinationsCard";
import BeachCards from "../components/cards/beachCard";
import RestaurantCards from "../components/cards/restaurantCard";
import PageWrapper from "../components/layout/SmoothPageWrapper";
import { useProfile } from "../hooks/useProfile";
import { useAI } from "../context/aiContext";

export default function Home() {
  const { currentProfile, isFetching } = useProfile();
  const { showAIOverlay, isAIActive } = useAI();

  // Función para truncar texto si es muy largo
  const truncateText = (text: string, maxLength: number = 20) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Nombre de usuario
  const getFullName = () => {
    if (isFetching) return "Cargando...";
    if (!currentProfile) return "Usuario";

    const name = currentProfile.name || "";
    const lastName = currentProfile.lastName || "";
    const fullName = `${name} ${lastName}`.trim();

    return fullName || "Usuario";
  };

  const userName = truncateText(getFullName());

  const handleAIClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    // Prevenir click si el overlay ya está activo
    if (isAIActive) return;
    
    const button = event.currentTarget;
    
    // Efecto de bounce/encogimiento del botón
    button.style.transform = 'scale(0.9)';
    button.style.transition = 'transform 0.1s ease-out';
    
    // Después del bounce, restaurar y activar overlay
    setTimeout(() => {
      button.style.transform = 'scale(1)';
      button.style.transition = 'transform 0.2s ease-out';
      
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
        <div className="flex items-center mt-7">
          <div className="flex flex-col w-[85%] gap-1">
            <h1
              style={{
                color: "var(--color-primary-dark)",
                fontSize: "15px",
                fontStyle: "normal",
                fontWeight: "700",
                lineHeight: "22px",
              }}
            >
              Bienvenido de nuevo,
            </h1>
            <p
              style={{
                color: "var(--color-primary-dark)",
                height: "40px",
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                maxWidth: "100%",
                fontSize: "40px",
                fontStyle: "normal",
                fontWeight: "800",
                lineHeight: "26px",
                letterSpacing: "-0.9px",
              }}
            >
              {userName}
            </p>
          </div>

          <div className="w-[15%] flex justify-end">
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
        </div>

        <WhatsNewCards />
        <SummaryCard />
        <DestinationCards />
        <BeachCards />
        <RestaurantCards />
      </PageWrapper>
    </div>
  );
}
