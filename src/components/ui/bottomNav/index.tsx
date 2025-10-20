import { NavLink, useLocation } from "react-router-dom";
import { useMemo } from "react";
import {
  IoHome,
  IoCalendar,
  IoLocationSharp,
  IoCompass,
  IoPerson,
} from "react-icons/io5";

type NavItem = {
  id: string;
  label: string;
  to: string;
  icon: React.ElementType;
};

type BottomNavProps = {
  items: NavItem[];
  className?: string;
};

const HIDDEN_ROUTES = ["/", "/login", "/register", "/onboarding", "/terms"];

// --- ESTILOS MODIFICADOS ---
const NAV_STYLES = {
  // Ahora es 'sticky' para que se quede abajo, y ocupa todo el ancho (w-full).
  container: "sticky bottom-0 w-full z-50 md:hidden",
  // Se eliminó 'rounded-full' y se usa 'justify-around' para distribuir los iconos.
  // Se cambió el borde a solo un borde superior para un look más limpio.
  list: "flex items-center justify-around h-18 bg-[var(--color-blue-dark)] border-t-2 border-[var(--color-beige)]/80",
  link: {
    // El 'flex-grow' ayuda a que cada item ocupe el espacio disponible.
    base: "group flex flex-grow items-center justify-center select-none transition-all duration-200 h-full relative z-10",
    active: "text-[var(--color-green)]", // El color del icono activo ahora es el verde.
    inactive: "text-[var(--color-beige)]/80 hover:text-[var(--color-green)]",
  },
} as const;

export function BottomNav({ items, className = "" }: BottomNavProps) {
  const { pathname } = useLocation();

  const isHidden = useMemo(
    () =>
      HIDDEN_ROUTES.some(
        (route) => pathname === route || pathname.startsWith(`${route}/`)
      ),
    [pathname]
  );

  if (isHidden) return null;

  return (
    <>
      <nav
        aria-label="Navegación inferior"
        className={`${NAV_STYLES.container} ${className}`}
      >
        <ul role="tablist" className={NAV_STYLES.list}>
          {/* SE ELIMINÓ EL INDICADOR DESLIZANTE */}
          {items.map((item) => {
            const isActive =
              pathname === item.to || pathname.startsWith(`${item.to}/`);
            const Icon = item.icon;

            return (
              <li key={item.id} role="presentation" className="flex-grow">
                <NavLink
                  to={item.to}
                  className={`${NAV_STYLES.link.base} ${
                    isActive ? NAV_STYLES.link.active : NAV_STYLES.link.inactive
                  }`}
                  aria-current={isActive ? "page" : undefined}
                  aria-label={item.label}
                >
                  <Icon
                    size={28} // Ligeramente más grande para mejor visibilidad
                    className={`transition-transform duration-200 group-hover:scale-110 ${
                      isActive ? "scale-125" : "scale-100"
                    }`}
                  />
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}

// Items por defecto (sin cambios)
export const defaultItems: NavItem[] = [
  { id: "home", label: "Inicio", to: "/home", icon: IoHome },
  { id: "agenda", label: "Agenda", to: "/agenda", icon: IoCalendar },
  { id: "maps", label: "Mapas", to: "/maps", icon: IoLocationSharp },
  { id: "explore", label: "Explorar", to: "/explorar", icon: IoCompass },
  { id: "profile", label: "Mi Perfil", to: "/profile", icon: IoPerson },
];