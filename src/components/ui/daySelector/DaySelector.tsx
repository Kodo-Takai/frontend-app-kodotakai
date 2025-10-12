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
    <div className="bg-[#151A00] w-full h-[40px] flex items-center justify-between p-2 text-white text-[14px] rounded-xl mb-1">
      {/* Botón flecha izquierda */}
      <button
        onClick={onPreviousWeek}
        className="w-8 h-8 rounded-lg flex items-center justify-center hover:scale-105 transition-all duration-200"
      >
        <img
          src="./icons/white-arrow-left.svg"
          alt="semana anterior"
          className="w-5 h-5"
        />
      </button>

      {/* Texto de la semana actual */}
      <span className="font-normal">{currentWeekText}</span>

      {/* Botón flecha derecha */}
      <button
        onClick={onNextWeek}
        className="w-8 h-8 rounded-lg flex items-center justify-center hover:scale-105 transition-all duration-200"
      >
        <img
          src="./icons/white-arrow-right.svg"
          alt="semana siguiente"
          className="w-5 h-5"
        />
      </button>
    </div>
  );
};

export default DaySelector;
