import HotelsCard from "../../components/cards/hotelsCard";
import HeaderNavigationExplore from "../../components/ui/headerNavigationExplore";
import { useNavigationAnimation } from "../../hooks/useNavigationAnimation";

export default function HotelesPage() {
  const animationClass = useNavigationAnimation();

  return (
    <div className={`flex flex-col gap-3 max-w-md mx-auto p-6 bg-white min-h-screen ${animationClass}`}>
      {/* Header Navigation */}
      <HeaderNavigationExplore />

      {/* Content */}
      <HotelsCard />
    </div>
  );
}
