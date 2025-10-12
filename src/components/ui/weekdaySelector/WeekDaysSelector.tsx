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
          className={`flex-1 text-sm flex flex-col items-center justify-center py-2 px-2 rounded-xl transition-all duration-200 hover:scale-105 animate-bubble-in ${
            day.isSelected
              ? "bg-[#BACB2C] text-[#151A00]"
              : day.isToday
              ? "bg-gray-100 text-[#151A00] border-2 border-gray-400"
              : "bg-white/50 text-[#] hover:bg-gray-50 border-2 border-white/50"
          }`}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <span className="text-xs font-normal mb-1">
            {day.dayName.charAt(0).toUpperCase() +
              day.dayName.slice(1, 3).toLowerCase()}
          </span>
          <span
            className={`text-lg ${
              day.isSelected ? "font-black text-[#151A00]" : "font-medium"
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
