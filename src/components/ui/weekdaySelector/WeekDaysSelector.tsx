import React from "react";
import { type DayInfo } from "../daySelector/DaySelector";

interface WeekDaysSelectorProps {
  weekDays: DayInfo[];
  onDaySelect: (date: Date) => void;
}

const WeekDaysSelector: React.FC<WeekDaysSelectorProps> = ({
  weekDays,
  onDaySelect,
}) => {
  return (
    <div className="w-full flex justify-between gap-2">
      {weekDays.map((day, index) => (
        <button
          key={index}
          onClick={() => onDaySelect(day.date)}
          className={`flex-1 text-sm flex flex-col items-center justify-center py-5 px-2 rounded-xl transition-all duration-200 hover:scale-105 animate-bubble-in ${
            day.isSelected
              ? "bg-[var(--color-green)] text-[var(--color-blue)] border-3 border-[var(--color-green-dark)]"
              : day.isToday
              ? "bg-[var(--color-beige)] text-[var(--color-blue)] border-3 border-[var(--color-blue)]"
              : "bg-[var(--color-beige)] text-[var(--color-blue)] hover:bg-[var(--color-beige)] border-3 border-[var(--color-beige)]"
          }`}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <span className="text-xs font-normal mb-1">
            {day.dayName.charAt(0).toUpperCase() +
              day.dayName.slice(1, 3).toLowerCase()}
          </span>
          <span
            className={`text-xl ${
              day.isSelected ? "font-extrabold text-[var(--color-blue)]" : "font-semibold"
            }`}
          >
            {day.dayNumber}
          </span>
        </button>
      ))}
    </div>
  );
};

export default WeekDaysSelector;
