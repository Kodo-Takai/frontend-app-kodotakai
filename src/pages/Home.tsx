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
              className="w-12 h-12 border-3 border-[var(--color-green-dark)]/30 rounded-xl flex items-center justify-center hover:scale-105 hover:bg-[var(--color-green-dark)] transition-all shadow-sm duration-300 ease-out cursor-pointer animate-bubble-in"
              style={{
                backgroundColor: "var(--color-green)",
              }}
            >
              <img
                src="./icons/ai-function-icon-2.svg"
                alt="Notificaciones"
                className="w-8 h-8 opacity-85"
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
