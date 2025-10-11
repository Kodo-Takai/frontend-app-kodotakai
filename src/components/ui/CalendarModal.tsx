import React from 'react';
import Calendar from 'react-calendar';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import 'react-calendar/dist/Calendar.css';

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

const CalendarModal: React.FC<CalendarModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
  onDateSelect,
}) => {
  if (!isOpen) return null;

  const handleDateChange = (date: Date | Date[]) => {
    if (date instanceof Date) {
      onDateSelect(date);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
        {/* Header del modal */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-black">Seleccionar Fecha</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <span className="text-gray-600 text-lg">×</span>
          </button>
        </div>

        {/* Calendario */}
        <div className="mb-6">
          <Calendar
            onChange={handleDateChange}
            value={selectedDate}
            locale="es"
            calendarType="ISO 8601"
            className="custom-calendar"
            tileClassName={({ date, view }) => {
              if (view === 'month') {
                const today = new Date();
                const isToday = date.toDateString() === today.toDateString();
                const isSelected = date.toDateString() === selectedDate.toDateString();
                
                return `custom-tile ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`;
              }
              return '';
            }}
          />
        </div>

        {/* Fecha seleccionada */}
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">Fecha seleccionada:</p>
          <p className="text-lg font-semibold text-black">
            {format(selectedDate, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: es })}
          </p>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              onDateSelect(selectedDate);
              onClose();
            }}
            className="flex-1 py-3 px-4 bg-[#B8F261] text-black rounded-xl font-medium hover:bg-[#A8E251] transition-colors"
          >
            Confirmar
          </button>
        </div>
      </div>

      <style jsx global>{`
        .custom-calendar {
          width: 100%;
          border: none;
          font-family: inherit;
        }
        
        .custom-calendar .react-calendar__tile {
          border-radius: 8px;
          margin: 2px;
          padding: 8px;
          font-weight: 500;
        }
        
        .custom-calendar .react-calendar__tile:hover {
          background-color: #f3f4f6;
        }
        
        .custom-calendar .react-calendar__tile.today {
          background-color: #000;
          color: #B8F261;
          font-weight: bold;
        }
        
        .custom-calendar .react-calendar__tile.selected {
          background-color: #B8F261;
          color: #000;
          font-weight: bold;
        }
        
        .custom-calendar .react-calendar__navigation {
          margin-bottom: 1rem;
        }
        
        .custom-calendar .react-calendar__navigation button {
          background-color: #f3f4f6;
          border: none;
          border-radius: 8px;
          padding: 8px 12px;
          font-weight: 600;
        }
        
        .custom-calendar .react-calendar__navigation button:hover {
          background-color: #e5e7eb;
        }
        
        .custom-calendar .react-calendar__month-view__weekdays {
          margin-bottom: 0.5rem;
        }
        
        .custom-calendar .react-calendar__month-view__weekdays__weekday {
          padding: 0.5rem;
          font-weight: 600;
          color: #6b7280;
        }
      `}</style>
    </div>
  );
};

export default CalendarModal;
