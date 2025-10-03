import HotelsCard from "../../components/cards/hotelsCard";
import HeaderNavigationExplore from "../../components/ui/headerNavigationExplore";

export default function HotelesPage() {

  return (
    <div className="flex flex-col gap-3 max-w-md mx-auto p-6 bg-white min-h-screen animate-slide-in-right">
      {/* Header Navigation */}
      <HeaderNavigationExplore />

      {/* Content */}
      <HotelsCard />
    </div>
  );
}
