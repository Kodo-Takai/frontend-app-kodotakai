import { useState, useEffect } from "react";

export default function CalendarCard() {
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    // Actualizar cada segundo para mantener la fecha actual
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const dayName = currentDate.toLocaleDateString("es-ES", { weekday: "long" });
  const monthName = currentDate.toLocaleDateString("es-ES", { month: "long" });
  const dayNumber = currentDate.getDate();

  // Capitalizar primera letra
  const capitalizedDay = dayName.charAt(0).toUpperCase() + dayName.slice(1);
  const capitalizedMonth =
    monthName.charAt(0).toUpperCase() + monthName.slice(1);

  return (
    <div className="w-full relative">
        {/* Espirales del calendario superpuestas */}
        <div className="absolute -top-[6px] left-0 right-0 flex justify-between items-center px-4 z-30">
          <div className="w-3 h-5 bg-[var(--color-blue)] rounded-full"></div>
          <div className="w-3 h-5 bg-[var(--color-blue)] rounded-full"></div>
        </div>
      {/* Calendario */}
        <div className="rounded-2xl overflow-hidden h-full flex flex-col bg-[var(--color-beige-dark)]/20 border-3 border-[var(--color-beige-dark)]/40 relative" style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}>
        {/* Header con día de la semana */}
        <div className="flex-shrink-0">
          <p className="text-xs py-1 font-medium text-[var(--color-blue)] text-center tracking-wide">
            {capitalizedMonth}
          </p>
        </div>

        {/* Contenido principal */}
        <div className="flex flex-col justify-center items-center ">
             <p className="text-lg py-1 font-extrabold leading-0 text-[var(--color-blue)] text-center ">
              {capitalizedDay}
            </p>
            <span className="text-6xl py-1 font-extrabold text-[var(--color-green)] leading-none">
              {dayNumber}
            </span>
        
        </div>
      </div>
    </div>
  );
}
