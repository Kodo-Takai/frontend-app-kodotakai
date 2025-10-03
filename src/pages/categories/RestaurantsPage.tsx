import RestaurantMenuCard from "../../components/cards/restaurantMenuCard";
import HeaderNavigationExplore from "../../components/ui/headerNavigationExplore";

export default function RestaurantsPage() {

  return (
    <div className="flex flex-col gap-3 max-w-md mx-auto p-6 bg-white min-h-screen animate-slide-in-right">
      {/* Header Navigation */}
      <HeaderNavigationExplore />

      {/* Content */}
      <RestaurantMenuCard />
    </div>
  );
}
