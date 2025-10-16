import Search from "../components/ui/search/search";
import WhatsNewCards from "../components/cards/whatsNewCard";
import SummaryCard from "../components/cards/summaryCard";
import DestinationCards from "../components/cards/destinationsCard";
import BeachCards from "../components/cards/beachCard";
import RestaurantCards from "../components/cards/restaurantCard";
import PageWrapper from "../components/layout/SmoothPageWrapper";
import { useProfile } from "../hooks/useProfile";

export default function Home() {
  const { currentProfile, isFetching } = useProfile();
  
  // Función para truncar texto si es muy largo
  const truncateText = (text: string, maxLength: number = 20) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Obtener el nombre completo del usuario
  const getFullName = () => {
    if (isFetching) return "Cargando...";
    if (!currentProfile) return "Usuario";
    
    const name = currentProfile.name || "";
    const lastName = currentProfile.lastName || "";
    const fullName = `${name} ${lastName}`.trim();
    
    return fullName || "Usuario";
  };

  const userName = truncateText(getFullName());

  return (
    <div 
    className="min-h-screen relative pb-20"
    style={{ backgroundColor: 'var(--color-bg-primary)' }}
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
            Hola!,
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
              letterSpacing: "-0.5px",
            }}
          >
            {userName}
          </p>
        </div>

        <div className="w-[15%] flex justify-end">
          <button
            className="w-11 h-11 rounded-xl flex items-center justify-center hover:scale-105 transition-all shadow-sm duration-300 ease-out cursor-pointer"
            style={{ 
              backgroundColor: 'var(--color-blue-dark)', 
            }}
          >
            <img
              src="./icons/AI_Icon_2.svg"
              alt="Notificaciones"
              className="w-7 h-7"
            />
          </button>
        </div>
      </div>

      <Search/>
      <WhatsNewCards />
      <SummaryCard />
      <DestinationCards />
      <BeachCards />
      <RestaurantCards />
    </PageWrapper>
    </div>
  );
}
