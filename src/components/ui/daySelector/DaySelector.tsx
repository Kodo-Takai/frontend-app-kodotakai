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
    <div className="bg-[#D9D9D9] w-full h-[40px] flex items-center justify-between p-2 text-[#727272] text-[14px] rounded-lg">
      {/* Botón flecha izquierda */}
      <button
        onClick={onPreviousWeek}
        className="w-7 h-7 bg-white rounded-lg flex items-center justify-center hover:scale-105 transition-all duration-200"
      >
        <img
          src="./icons/Arrow-Left-Black.svg"
          alt="semana anterior"
          className="w-4 h-4"
        />
      </button>

      {/* Texto de la semana actual */}
      <span className="font-normal">{currentWeekText}</span>

      {/* Botón flecha derecha */}
      <button
        onClick={onNextWeek}
        className="w-7 h-7 bg-white rounded-lg flex items-center justify-center hover:scale-105 transition-all duration-200"
      >
        <img
          src="./icons/Arrow-Right-Black.svg"
          alt="semana siguiente"
          className="w-4 h-4"
        />
      </button>
    </div>
  );
};

export default DaySelector;
