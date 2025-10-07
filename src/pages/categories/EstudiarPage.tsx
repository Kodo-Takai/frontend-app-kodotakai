import HeaderNavigationExplore from "../../components/ui/headerNavigationExplore";
import { useNavigationAnimation } from "../../hooks/useNavigationAnimation";

export default function EstudiarPage() {
  const animationClass = useNavigationAnimation();

  return (
    <div
      className={`flex flex-col gap-3 max-w-md mx-auto p-6 bg-white min-h-screen ${animationClass}`}
    >
      <HeaderNavigationExplore />

      <div className="flex items-center justify-center h-64 bg-gray-100 rounded-xl">
        <div className="text-center">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Próximamente
          </h3>
          <p className="text-gray-600 text-sm">
            Estamos trabajando en esta sección
          </p>
        </div>
      </div>
    </div>
  );
}
