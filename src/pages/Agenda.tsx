import { useState } from "react";
import CategoryWrapper from "../components/layout/SmoothCategoryWrapper";
import DaySelector from "../components/ui/daySelector/DaySelector";
import WeekDaysSelector from "../components/ui/weekdaySelector/WeekDaysSelector";
import CalendarModal from "../components/ui/calendarModal/CalendarModal";
import AgendaCard from "../components/ui/agendaCard/AgendaCard";
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

  const { 
    selectDate, 
    itemsForSelectedDate, 
    updateItem
  } = useAgenda();

  // Filtrar items por sección (Ahora vs Más Tarde)
  const ahoraItems = itemsForSelectedDate.filter(item => {
    const itemDate = new Date(item.scheduledDate);
    return isToday(itemDate);
  });

  const masTardeItems = itemsForSelectedDate.filter(item => {
    const itemDate = new Date(item.scheduledDate);
    return !isToday(itemDate);
  });

  // Funciones para manejar acciones
  const handleMarkAsVisited = (id: string) => {
    updateItem(id, { status: 'completed' });
  };

  const handleMoveItem = (_id: string) => {
    // Por ahora solo mostramos un alert, después implementaremos el modal de mover
    alert('Función de mover destino - próximamente');
  };
  return (
    <CategoryWrapper
      backgroundImage="/default-background-light.svg"
      backgroundSize="100%"
      backgroundPosition="top center"
    >
      <div className="flex justify-between items-center mt-5">
        <div className="flex flex-col gap-2.5">
          <h1 className="text-black text-[40px] font-extrabold leading-[26px] tracking-[-1px]">
            AGENDA
          </h1>
          <p className="text-black text-[15px] font-medium leading-[22px]">
            Qué tenemos planeado hoy?
          </p>
        </div>

        <button
          onClick={() => setIsCalendarModalOpen(true)}
          className="w-10 h-10 bg-[#090909] rounded-lg flex items-center justify-center hover:scale-105 hover:shadow-lg transition-all duration-300 ease-out cursor-pointer"
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

      <div className="w-full flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-black text-md font-medium">
            Elige tu sección
          </h2>
          <img
            src="./icons/notification-bell.svg"
            alt="signo de pregunta"
            className="w-6 h-6"
          />
        </div>
        <div className="flex justify-between w-full">
          <button
            id="agendados-btn"
            onClick={() => setSelectedSection("agendados")}
            className={`flex items-center gap-2 text-black px-6 py-3 rounded-3xl font-medium transition-all duration-200 hover:scale-105 ${
              selectedSection === "agendados" ? "bg-[#B8F261]" : "bg-white"
            }`}
          >
            <img
              src="./icons/agendados-icon.svg"
              alt="calendar"
              className="w-7 h-7"
            />
            Agendados
          </button>
          <button
            id="itinerarios-btn"
            onClick={() => setSelectedSection("itinerarios")}
            className={`flex items-center gap-2 text-black px-6 py-3 rounded-3xl font-medium transition-all duration-200 hover:scale-105 ${
              selectedSection === "itinerarios" ? "bg-[#B8F261]" : "bg-white"
            }`}
          >
            <img
              src="./icons/itinerarios-icon.svg"
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
            <h3 className="text-black text-md font-medium">Ahora</h3>
            <div className="flex flex-col gap-7">
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
  );
}
