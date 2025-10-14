import { NavLink, useLocation } from "react-router-dom";
import { useMemo } from "react";
import { IoHome, IoCalendar, IoLocationSharp, IoCompass, IoPerson } from "react-icons/io5";

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

const NAV_STYLES = {
  container: "fixed bottom-4 left-1/2 -translate-x-1/2 z-50 md:hidden",
  list: "flex items-center gap-1 h-14 px-2 bg-black/70 backdrop-blur-2xl rounded-full shadow-2xl border border-white/10 relative",
  indicator: "absolute w-12 h-12 bg-[#BACB2C] rounded-full transition-all duration-300 ease-out",
  link: {
    base: "group flex items-center justify-center select-none transition-all duration-200 w-12 h-12 rounded-full",
    active: "text-black",
    inactive: "text-gray-400 hover:text-white"
  }
} as const;

export function BottomNav({ items, className = "" }: BottomNavProps) {
  const { pathname } = useLocation();

  const isHidden = useMemo(
    () => HIDDEN_ROUTES.some((route) => 
      pathname === route || pathname.startsWith(`${route}/`)
    ),
    [pathname]
  );

  const activeIndex = useMemo(
    () => items.findIndex((item) => 
      pathname === item.to || pathname.startsWith(`${item.to}/`)
    ),
    [pathname, items]
  );

  if (isHidden) return null;

  return (
    <>
      <nav
        aria-label="Navegación inferior"
        className={`${NAV_STYLES.container} ${className}`}
      >
        <ul
          role="tablist"
          className={NAV_STYLES.list}
          style={{
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.4), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)'
          }}
        >
          {activeIndex >= 0 && (
            <div
              className={NAV_STYLES.indicator}
              style={{
                left: `calc(0.5rem + ${activeIndex * 52}px)`,
                top: '0.2rem'
              }}
              aria-hidden="true"
            />
          )}
          
          {items.map((item) => {
            const isActive = pathname === item.to || pathname.startsWith(`${item.to}/`);
            const Icon = item.icon;
            
            return (
              <li key={item.id} role="presentation" className="relative z-10">
                <NavLink
                  to={item.to}
                  className={`${NAV_STYLES.link.base} ${
                    isActive ? NAV_STYLES.link.active : NAV_STYLES.link.inactive
                  }`}
                  aria-current={isActive ? "page" : undefined}
                  aria-label={item.label}
                >
                  <Icon 
                    size={24} 
                    className={`transition-transform duration-200 ${
                      isActive ? "scale-110" : "scale-100"
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

// Items por defecto usando react-icons (io5)
export const defaultItems: NavItem[] = [
  { id: "home", label: "Inicio", to: "/home", icon: IoHome },
  { id: "agenda", label: "Agenda", to: "/agenda", icon: IoCalendar },
  { id: "maps", label: "Mapas", to: "/maps", icon: IoLocationSharp },
  { id: "explore", label: "Explorar", to: "/explorar", icon: IoCompass },
  { id: "profile", label: "Mi Perfil", to: "/profile", icon: IoPerson },
];