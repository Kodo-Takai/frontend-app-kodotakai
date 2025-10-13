import React from "react";

export interface DayInfo {
  date: Date;
  dayName: string;
  dayNumber: string;
  isToday: boolean;
  isSelected: boolean;
}

interface DaySelectorProps {
  weekDays: DayInfo[];
  onDaySelect: (date: Date) => void;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
  currentWeekText: string;
}

const DaySelector: React.FC<DaySelectorProps> = ({
  weekDays,
  onDaySelect,
  onPreviousWeek,
  onNextWeek,
  currentWeekText,
}) => {
  return (
    <div className="bg-[#D7D7CA] w-full h-[37px] flex items-center justify-between px-2 text-[#151A00] text-[14px] rounded-lg">
      {/* Botón flecha izquierda */}
      <button
        onClick={onPreviousWeek}
        className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#151A00] hover:scale-105 transition-all duration-200"
      >
        <img
          src="./icons/white-arrow-left.svg"
          alt="semana anterior"
          className="w-4 h-4"
        />
      </button>

      {/* Texto de la semana actual */}
      <span className="font-normal">{currentWeekText}</span>

      {/* Botón flecha derecha */}
      <button
        onClick={onNextWeek}
        className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#151A00] hover:scale-105 transition-all duration-200"
      >
        <img
          src="./icons/white-arrow-right.svg"
          alt="semana siguiente"
          className="w-4 h-4"
        />
      </button>
    </div>
  );
};

export default DaySelector;
