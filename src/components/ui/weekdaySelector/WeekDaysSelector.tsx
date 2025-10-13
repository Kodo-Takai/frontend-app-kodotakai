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
          className={`flex-1 text-sm flex flex-col items-center justify-center py-3 px-2 rounded-lg transition-all duration-200 hover:scale-105 animate-bubble-in ${
            day.isSelected
              ? "bg-[#151A00] text-[#D7D7CA]"
              : day.isToday
              ? "bg-[#D7D7CA] text-[#151A00] border-2 border-[#BACB2C]"
              : "bg-[#D7D7CA] text-[#151A00] hover:bg-[#c1c1b6]"
          }`}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <span className="text-xs font-normal mb-1">
            {day.dayName.charAt(0).toUpperCase() +
              day.dayName.slice(1, 3).toLowerCase()}
          </span>
          <span
            className={`text-lg ${
              day.isSelected ? "font-medium text-[#BACB2C]" : "font-normal"
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
