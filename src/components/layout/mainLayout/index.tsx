import { Outlet } from "react-router-dom";
import { BottomNav, defaultItems } from "../bottomNav";
import { useCategoryImagePreload } from "../../../hooks/useImagePreload";

const MainLayout: React.FC = () => {
  // Preload de imágenes de categorías para carga instantánea
  useCategoryImagePreload();

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow bg-gray-100">
        <Outlet />
      </main>
      <BottomNav items={defaultItems} />
    </div>
  );
};

export default MainLayout;