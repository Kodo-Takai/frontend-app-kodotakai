import { useState } from "react";
import CategoryWrapper from "../components/layout/SmoothCategoryWrapper";
import DaySelector from "../components/ui/daySelector/DaySelector";
import WeekDaysSelector from "../components/ui/weekdaySelector/WeekDaysSelector";
import CalendarModal from "../components/ui/calendarModal/CalendarModal";
import AgendaCard from "../components/cards/agendaCard/AgendaCard";
import { useDateNavigation } from "../hooks/useDateNavigation";
import { useAgenda } from "../hooks/useAgenda";
import { isToday } from "date-fns";

export default function Agenda() {
  const [selectedSection, setSelectedSection] = useState<
    "agendados" | "itinerarios"
  >("agendados");
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);

  const {
    selectedDate,
    weekDays,
    currentWeekText,
    goToPreviousWeek,
    goToNextWeek,
    selectDay,
  } = useDateNavigation();

  const { selectDate, itemsForSelectedDate, updateItem } = useAgenda();

  // Filtrar items por sección (Ahora vs Más Tarde)
  const ahoraItems = itemsForSelectedDate.filter((item) => {
    const itemDate = new Date(item.scheduledDate);
    return isToday(itemDate);
  });

  const masTardeItems = itemsForSelectedDate.filter((item) => {
    const itemDate = new Date(item.scheduledDate);
    return !isToday(itemDate);
  });

  // Funciones para manejar acciones
  const handleMarkAsVisited = (id: string) => {
    updateItem(id, { status: "completed" });
  };

  const handleMoveItem = (_id: string) => {
    // Por ahora solo mostramos un alert, después implementaremos el modal de mover
    alert("Función de mover destino - próximamente");
  };
  return (
    <div className="min-h-screen bg-[#EDEDE0]">
      <CategoryWrapper
        backgroundImage="/default-background-light.svg"
        backgroundSize="100%"
        backgroundPosition="top center"
      >
      <div className="flex justify-between items-center mt-5">
        <div className="flex flex-col gap-2.5">
          <h1 className="text-[#151A00] text-[40px] font-extrabold leading-[26px] tracking-[-2px]">
            AGENDA
          </h1>
          <p className="text-[#151A00] text-[15px] font-medium leading-[22px]">
            Qué tenemos planeado hoy?
          </p>
        </div>

        <button
          onClick={() => setIsCalendarModalOpen(true)}
          className="w-10 h-10 bg-[#151A00] rounded-lg flex items-center justify-center hover:scale-105 hover:shadow-lg transition-all duration-300 ease-out cursor-pointer"
        >
          <img
            src="./icons/calendar-icon.svg"
            alt="Calendar"
            className="w-5 h-5"
          />
        </button>
      </div>

      <DaySelector
        weekDays={weekDays}
        onDaySelect={selectDay}
        onPreviousWeek={goToPreviousWeek}
        onNextWeek={goToNextWeek}
        currentWeekText={currentWeekText}
      />

      <WeekDaysSelector weekDays={weekDays} onDaySelect={selectDay} />

      <div className="w-full flex flex-col gap-3 mt-2">
        <div className="flex justify-between items-center">
          <h2 className="text-[#151A00] text-md font-bold">
            Elige tu sección
          </h2>
          <svg
            className="w-5 h-5 text-[#151A00]"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
          </svg>
        </div>
        <div className="flex justify-between w-full">
          <button
            id="agendados-btn"
            onClick={() => setSelectedSection("agendados")}
            className={`group flex items-center gap-2 text-[#151A00] px-6 py-2.5 rounded-2xl font-medium transition-all duration-200 hover:scale-105 ${
              selectedSection === "agendados"
                ? "bg-[#151A00] text-[#BACB2C]"
                : "bg-[#D3E5D5]"
            }`}
          >
            <img
              src={selectedSection === "agendados" 
                ? "./icons/agendados-icon-hover.svg" 
                : "./icons/agendados-icon.svg"
              }
              alt="calendar"
              className="w-7 h-7"
            />
            Agendados
          </button>
          <button
            id="itinerarios-btn"
            onClick={() => setSelectedSection("itinerarios")}
            className={`group flex items-center gap-2 text-[#151A00] px-6 py-2.5 rounded-2xl font-medium transition-all duration-200 hover:scale-105 ${
              selectedSection === "itinerarios"
                ? "bg-[#151A00] text-[#BACB2C]"
                : "bg-[#D3E5D5]"
            }`}
          >
            <img
              src={selectedSection === "itinerarios" 
                ? "./icons/itinerarios-icon-hover.svg" 
                : "./icons/itinerarios-icon.svg"
              }
              alt="document"
              className="w-7 h-7"
            />
            Itinerarios
          </button>
        </div>
      </div>

      {/* Sección de Destinos Agendados */}
      <div className="w-full flex flex-col gap-6">
        {/* Sección "Ahora" */}
        {ahoraItems.length > 0 && (
          <div className="flex flex-col gap-3">
            <h3 className="text-black text-md font-bold">Ahora</h3>
            <div className="flex flex-col gap-4">
              {ahoraItems.map((item) => (
                <AgendaCard
                  key={item.id}
                  item={item}
                  onMarkAsVisited={handleMarkAsVisited}
                  onMoveItem={handleMoveItem}
                />
              ))}
            </div>
          </div>
        )}

        {/* Sección "Más Tarde" */}
        {masTardeItems.length > 0 && (
          <div className="flex flex-col gap-3">
            <h3 className="text-black text-lg font-bold">Más Tarde</h3>
            <div className="flex flex-col gap-3">
              {masTardeItems.map((item) => (
                <AgendaCard
                  key={item.id}
                  item={item}
                  onMarkAsVisited={handleMarkAsVisited}
                  onMoveItem={handleMoveItem}
                />
              ))}
            </div>
          </div>
        )}

        {/* Mensaje cuando no hay items */}
        {itemsForSelectedDate.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm">
              No tienes destinos agendados para este día
            </p>
            <p className="text-gray-400 text-xs mt-2">
              Ve a Explorar y agrega algunos destinos a tu agenda
            </p>
          </div>
        )}
      </div>

      <CalendarModal
        isOpen={isCalendarModalOpen}
        onClose={() => setIsCalendarModalOpen(false)}
        selectedDate={selectedDate}
        onDateSelect={(date) => {
          selectDate(date);
          selectDay(date);
        }}
      />
      </CategoryWrapper>
    </div>
  );
}
