import React from 'react';
import { type DayInfo } from './DaySelector';

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
          className={`flex-1 flex flex-col items-center justify-center py-3 px-2 rounded-xl transition-all duration-200 hover:scale-105 ${
            day.isSelected
              ? 'bg-black text-white'
              : day.isToday
              ? 'bg-gray-100 text-black border-2 border-gray-300'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          <span className="text-xs font-medium mb-1">{day.dayName}</span>
          <span className={`text-lg font-bold ${
            day.isSelected ? 'text-[#B8F261]' : ''
          }`}>
            {day.dayNumber}
          </span>
        </button>
      ))}
    </div>
  );
};

export default WeekDaysSelector;
