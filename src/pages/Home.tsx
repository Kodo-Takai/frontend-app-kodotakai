import Search from "../components/ui/search/search";
import WhatsNewCards from "../components/cards/whatsNewCard";
import SummaryCard from "../components/cards/summaryCard";
import DestinationCards from "../components/cards/destinationsCard";
import BeachCards from "../components/cards/beachCard";
import RestaurantCards from "../components/cards/restaurantCard";

interface HomeProps {
  user: {
    name: string;
  };
}

const user: HomeProps["user"] = {
  name: "",
};
export default function Home() {
  const userName = user?.name?.trim() || "Nombre y apellido";

  return (
    <div className="flex flex-col gap-4 max-w-md mx-auto p-6 justify-center items-center pb-25" style={{ backgroundColor: 'var(--color-bone)' }}>
      <div className="flex flex-row justify-between w-full">
        <div className="flex flex-col items-start w-full">
          <h1 className="font-semibold text-md text-left" style={{ color: 'var(--color-blue)' }}>Hola,</h1>
          <span className="font-extrabold text-xl" style={{ color: 'var(--color-blue)' }}>
            {userName}
          </span>
        </div>
        <button
          className="w-10 h-10 border-[2px] rounded-xl flex items-center justify-center hover:scale-105 hover:shadow-lg transition-all duration-300 ease-out cursor-pointer"
          style={{ 
            backgroundColor: 'var(--color-blue)', 
            borderColor: 'var(--color-blue-dark)'
          }}
        >
          <img
            src="./icons/notification-bell.svg"
            alt="Notificaciones"
            className="w-6 h-6"
          />
        </button>
      </div>
      <Search/>
      <WhatsNewCards />
      <SummaryCard />
      <DestinationCards />
      <BeachCards />
      <RestaurantCards />
    </div>
  );
}
