import { useState } from "react";
import CategoryWrapper from "../components/layout/SmoothCategoryWrapper";
import PageWrapper from "../components/layout/SmoothPageWrapper";
import DaySelector from "../components/ui/daySelector/DaySelector";
import WeekDaysSelector from "../components/ui/weekdaySelector/WeekDaysSelector";
import CalendarModal from "../components/ui/calendarModal/CalendarModal";
import MoveDestinationModal from "../components/ui/moveDestinationModal/MoveDestinationModal";
import AgendaCard from "../components/cards/agendaCard/AgendaCard";
import { useDateNavigation } from "../hooks/useDateNavigation";
import { useAgenda } from "../hooks/useAgenda";
import { isToday } from "date-fns";
import type { AgendaItem } from "../redux/slice/agendaSlice";

export default function Agenda() {
  const [selectedSection, setSelectedSection] = useState<
    "agendados" | "itinerarios"
  >("agendados");
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [selectedItemToMove, setSelectedItemToMove] =
    useState<AgendaItem | null>(null);

  const {
    selectedDate,
    weekDays,
    currentWeekText,
    goToPreviousWeek,
    goToNextWeek,
    selectDay,
  } = useDateNavigation();

  const { selectDate, itemsForSelectedDate, updateItem, moveItem } =
    useAgenda();

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

  const handleMoveItem = (id: string) => {
    const item = itemsForSelectedDate.find((item) => item.id === id);
    if (item) {
      setSelectedItemToMove(item);
      setIsMoveModalOpen(true);
    }
  };

  const handleMoveDestination = (
    id: string,
    newDate: Date,
    newTime: string
  ) => {
    moveItem(id, newDate, newTime);
    setIsMoveModalOpen(false);
    setSelectedItemToMove(null);
  };
  return (
    <div 
      className="min-h-screen relative"
      style={{ backgroundColor: 'var(--color-bg-primary)' }}
    >
      <PageWrapper
        backgroundColor="bg-transparent"
        minHeight="min-h-full"
        className="relative"
      >
          <div className="flex justify-between items-center mt-5">
          <div className="flex flex-col gap-2.5">
            <h1
              className="text-[40px] font-bold leading-[26px] tracking-[-2px]"
              style={{ 
                color: 'var(--color-text-primary)'
              }}
            >
              AGENDA
            </h1>
            <p 
              className="text-[15px] font-normal leading-[22px]"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Qué tenemos planeado hoy?
            </p>
          </div>

          <button
            onClick={() => setIsCalendarModalOpen(true)}
            style={{ 
              animationDelay: "0.3s",
              backgroundColor: 'var(--color-primary-dark)'
            }}
            className="w-10 h-10 rounded-lg flex items-center justify-center hover:shadow-lg cursor-pointer"
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

        <div className="w-full flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <h2 
              className="text-[14px] font-semibold"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Elige tu sección
            </h2>
            <svg
              className="w-5 h-5"
              style={{ color: 'var(--color-text-primary)' }}
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" />
            </svg>
          </div>
          <div className="flex justify-between w-full">
            <button
              id="agendados-btn"
              onClick={() => setSelectedSection("agendados")}
              className="group flex items-center gap-2 px-6 py-3 rounded-[20px] font-medium animate-bubble-in hover:scale-105 transition-transform duration-300 ease-out"
              style={{
                animationDelay: "0.1s",
                color: selectedSection === "agendados" 
                  ? 'var(--color-primary-dark)' 
                  : 'var(--color-primary-light)',
                backgroundColor: selectedSection === "agendados" 
                  ? 'var(--color-primary-accent)' 
                  : 'var(--color-primary-dark)'
              }}
            >
              <img
                src={
                  selectedSection === "agendados"
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
              style={{ 
                animationDelay: "0.3s",
                color: selectedSection === "itinerarios" 
                  ? 'var(--color-primary-dark)' 
                  : 'var(--color-primary-light)',
                backgroundColor: selectedSection === "itinerarios" 
                  ? 'var(--color-primary-accent)' 
                  : 'var(--color-primary-dark)'
              }}
              onClick={() => setSelectedSection("itinerarios")}
              className="group flex items-center gap-2 px-6 py-2.5 rounded-[20px] font-medium animate-bubble-in hover:scale-105 transition-transform duration-300 ease-out"
            >
              <img
                src={
                  selectedSection === "itinerarios"
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
              <h3 
                className="text-[14px] font-semibold"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Ahora
              </h3>
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
              <h3 
                className="text-lg font-bold"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Más Tarde
              </h3>
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
              <p 
                className="text-sm"
                style={{ color: 'var(--color-text-muted)' }}
              >
                No tienes destinos agendados para este día
              </p>
              <p 
                className="text-xs mt-2"
                style={{ color: 'var(--color-gray-400)' }}
              >
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

        {selectedItemToMove && (
          <MoveDestinationModal
            isOpen={isMoveModalOpen}
            onClose={() => {
              setIsMoveModalOpen(false);
              setSelectedItemToMove(null);
            }}
            item={selectedItemToMove}
            onMoveDestination={handleMoveDestination}
          />
        )}
      </PageWrapper>
    </div>
  );
}
