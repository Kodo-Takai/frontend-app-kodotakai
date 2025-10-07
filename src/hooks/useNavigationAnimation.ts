import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export function useNavigationAnimation() {
  const location = useLocation();
  const [animationClass, setAnimationClass] = useState(
    "animate-slide-in-right"
  );

  useEffect(() => {
    const currentPath = location.pathname;

    // Determinar la dirección de la animación basada en la ruta actual
    if (currentPath === "/explorar") {
      // Si estamos en explorar, probablemente venimos de una subcategoría
      // Usar animación de izquierda a derecha
      setAnimationClass("animate-slide-in-left");
    } else if (currentPath.startsWith("/explorar/")) {
      // Si estamos en una subcategoría, probablemente venimos de explorar
      // Usar animación de derecha a izquierda
      setAnimationClass("animate-slide-in-right");
    } else {
      // Otras rutas - animación por defecto
      setAnimationClass("animate-slide-in-right");
    }
  }, [location.pathname]);

  return animationClass;
}
