import { FaBell } from "react-icons/fa";
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
    <div className="flex flex-col gap-4 max-w-md mx-auto p-6 bg-white justify-center items-center">
      <div className="flex flex-row justify-between w-full">
        <div className="flex flex-col items-start w-full">
          <h1 className="font-semibold text-md text-left">Hola,</h1>
          <span className="font-extrabold text-xl text-red-600">
            {userName}
          </span>
        </div>
        <div className="bg-white relative mt-6 border border-gray-600 rounded-lg p-2 shadow-sm">
          <FaBell className="text-gray-600" size={15} />
        </div>
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
