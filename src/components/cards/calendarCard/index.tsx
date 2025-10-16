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
    <div className="w-full flex flex-col gap-1">
        {/* Espirales del calendario */}
      <div className="flex justify-between items-center -mb-2 px-4">
        <div className="w-3 h-4.5 bg-gray-800 rounded-full"></div>
        <div className="w-3 h-4.5 bg-gray-800 rounded-full"></div>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden h-full flex flex-col">
        {/* Header con día de la semana */}
        <div className="px-2 py-1 border-b border-gray-200 flex-shrink-0" style={{ backgroundColor: 'var(--color-blue-dark)' }}>
          <p className="text-xs font-medium text-white text-center uppercase tracking-wide">
            {capitalizedMonth}
          </p>
        </div>

        {/* Contenido principal */}
        <div className=" bg-white flex flex-col py-1 justify-center items-center ">
             <p className="text-md font-bold text-blue-900 text-center ">
              {capitalizedDay}
            </p>
            <span className="text-4xl font-extrabold text-red-500 leading-none">
              {dayNumber}
            </span>
        
        </div>
      </div>
    </div>
  );
}
