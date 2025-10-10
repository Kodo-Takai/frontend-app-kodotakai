import { NavLink, useLocation } from "react-router-dom";
import { useMemo } from "react";

type NavItem = {
  id: string;
  label: string;
  to: string;
  icon?: React.ReactNode;
};

type BottomNavProps = {
  items: NavItem[];
  className?: string;
};

/** Iconos simples (reemplaza por los tuyos si quieres) */
const HomeIcon = ({ active = false }: { active?: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    className={`h-6 w-6 ${active ? "" : "opacity-70"}`}
    fill="currentColor"
  >
    <path d="M12 3 2 12h2v8a1 1 0 0 0 1 1h5v-6h3v6h5a1 1 0 0 0 1-1v-8h2L12 3z" />
  </svg>
);
const CalendarIcon = ({ active = false }: { active?: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    className={`h-6 w-6 ${active ? "" : "opacity-70"}`}
    fill="currentColor"
  >
    <path d="M7 2h2v2h6V2h2v2h3a1 1 0 0 1 1 1v3H3V5a1 1 0 0 1 1-1h3V2zM3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9zm4 3h3v3H7v-3z" />
  </svg>
);
const PinIcon = ({ active = false }: { active?: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    className={`h-6 w-6 ${active ? "" : "opacity-70"}`}
    fill="currentColor"
  >
    <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z" />
  </svg>
);
const CompassIcon = ({ active = false }: { active?: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    className={`h-6 w-6 ${active ? "" : "opacity-70"}`}
    fill="currentColor"
  >
    <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm4.24 6.34-2.12 6.01-6.01 2.12 2.12-6.01 6.01-2.12z" />
  </svg>
);
const SmileIcon = ({ active = false }: { active?: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    className={`h-6 w-6 ${active ? "" : "opacity-70"}`}
    fill="currentColor"
  >
    <path d="M12 22A10 10 0 1 1 12 2a10 10 0 0 1 0 20zm-4-9a4 4 0 0 0 8 0H8zm-1-5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm10 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z" />
  </svg>
);

export function BottomNav({ items, className = "" }: BottomNavProps) {
  const { pathname } = useLocation();

  /** Rutas donde NO se muestra la barra */
  // OJO: quité "/" para que sí se vea en Inicio. Si quieres ocultarla en Home, vuelve a añadir "/".
  const HIDE_ON: string[] = [
    "/",
    "/login",
    "/register",
    "/onboarding",
    "/terms",
  ];

  const hide = useMemo(
    () => HIDE_ON.some((p) => pathname === p || pathname.startsWith(p + "/")),
    [pathname]
  );

  if (hide) return null;

  return (
    <>
      <nav
        aria-label="Navegación inferior"
        className={`fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur border-t border-gray-200 md:hidden ${className}`}
      >
        <ul
          role="tablist"
          className="flex items-stretch justify-around h-[64px] px-1 pb-[max(env(safe-area-inset-bottom),0px)]"
        >
          {items.map((item) => {
            const active =
              pathname === item.to || pathname.startsWith(item.to + "/");
            return (
              <li key={item.id} role="presentation" className="min-w-0 flex-1">
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `group w-full h-full flex flex-col items-center justify-center gap-1 px-2 select-none
                     ${
                       active || isActive
                         ? "text-blue-600"
                         : "text-gray-600 hover:text-gray-800"
                     }`
                  }
                  aria-current={active ? "page" : undefined}
                >
                  <span
                    aria-hidden
                    className={`transition-transform ${
                      active ? "scale-110" : "scale-100"
                    }`}
                  >
                    {item.icon ?? <HomeIcon active={active} />}
                  </span>
                  <span className="text-[11px] font-medium leading-none truncate max-[360px]:text-[10px] p-0.5">
                    {item.label}
                  </span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Espaciador solo en mobile para que el contenido no quede oculto */}
      <div className="h-[64px] md:hidden" aria-hidden />
    </>
  );
}

// Items por defecto
export const defaultItems: NavItem[] = [
  { id: "home", label: "Inicio", to: "/home", icon: <HomeIcon /> },
  { id: "agenda", label: "Agenda", to: "/agenda", icon: <CalendarIcon /> },
  { id: "maps", label: "Mapas", to: "/maps", icon: <PinIcon /> },
  { id: "explore", label: "Explorar", to: "/explorar", icon: <CompassIcon /> },
  { id: "profile", label: "Mi Perfil", to: "/profile", icon: <SmileIcon /> },
];