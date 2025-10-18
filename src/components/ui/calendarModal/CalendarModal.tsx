import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import './CalendarModal.css';

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  // Nuevas props opcionales para el modo de postergar
  mode?: 'select' | 'postpone';
  onConfirm?: (date: Date, time?: string) => void;
  currentTime?: string;
}

const CalendarModal: React.FC<CalendarModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
  onDateSelect,
  mode = 'select',
  onConfirm,
  currentTime,
}) => {
  const [currentMonth, setCurrentMonth] = useState(selectedDate);
  const [selectedTime, setSelectedTime] = useState<string>(
    currentTime || '09:00'
  );

  // Prevenir scroll del fondo cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup: restaurar scroll cuando el componente se desmonta
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDateChange = (date: Date) => {
    if (mode === 'select') {
      onDateSelect(date);
      onClose();
    } else {
      // En modo postpone, solo actualizar la fecha seleccionada
      onDateSelect(date);
    }
  };

  const handleConfirm = () => {
    if (mode === 'postpone' && onConfirm) {
      onConfirm(selectedDate, selectedTime);
      onClose();
    } else {
      onDateSelect(selectedDate);
      onClose();
    }
  };

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  // Generar las fechas del calendario
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Lunes como primer día
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const dateFormat = "d";
  const rows = [];
  let days = [];
  let day = startDate;

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      const cloneDay = day;
      const isCurrentMonth = isSameMonth(day, monthStart);
      const isSelected = isSameDay(day, selectedDate);
      const isToday = isSameDay(day, new Date());
      const isWeekend = day.getDay() === 0 || day.getDay() === 6;
      
      // Solo en modo postpone validar fechas pasadas
      let isPastDate = false;
      if (mode === 'postpone') {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        isPastDate = day < today;
      }

      days.push(
        <div
          key={day.toString()}
          className={`calendar-day ${!isCurrentMonth ? 'other-month' : ''} ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''} ${isWeekend ? 'weekend' : ''} ${isPastDate ? 'past-date' : ''}`}
          onClick={() => !isPastDate && handleDateChange(cloneDay)}
          style={{ 
            cursor: isPastDate ? 'not-allowed' : 'pointer',
            opacity: isPastDate ? 0.4 : 1
          }}
        >
          <span className="day-number">{format(day, dateFormat)}</span>
        </div>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div key={day.toString()} className="calendar-week">
        {days}
      </div>
    );
    days = [];
  }

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-[60] overflow-hidden">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-black">
            {mode === 'postpone' ? 'Postergar Actividad' : 'Seleccionar Fecha'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <span className="text-gray-600 text-lg">×</span>
          </button>
        </div>


        <div className="flex justify-between items-center mb-4">
          <button
            onClick={handlePrevMonth}
            className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <span className="text-gray-600">‹</span>
          </button>
          <h3 className="text-lg font-semibold text-black">
            {format(currentMonth, "MMMM 'de' yyyy", { locale: es })}
          </h3>
          <button
            onClick={handleNextMonth}
            className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <span className="text-gray-600">›</span>
          </button>
        </div>


        <div className="calendar-weekdays">
          <div className="weekday">LUN</div>
          <div className="weekday">MAR</div>
          <div className="weekday">MIÉ</div>
          <div className="weekday">JUE</div>
          <div className="weekday">VIE</div>
          <div className="weekday">SÁB</div>
          <div className="weekday">DOM</div>
        </div>


        <div className="calendar-container mb-6">
          {rows}
        </div>

        {/* Selector de Hora - Solo en modo postpone */}
        {mode === 'postpone' && (
          <div className="mb-6">
            <label 
              className="block text-sm font-medium mb-2 text-black"
            >
              Nueva Hora
            </label>
            <input
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full p-3 rounded-xl border-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-colors"
              style={{ 
                backgroundColor: '#f9fafb',
                borderColor: '#BACB2C',
                color: '#000'
              }}
            />
          </div>
        )}

        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">Fecha seleccionada:</p>
          <p className="text-lg font-semibold text-black">
            {format(selectedDate, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: es })}
          </p>
        </div>


        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-3 px-4 bg-[#BACB2C] text-black rounded-xl font-medium hover:bg-[#A8E251] transition-colors"
          >
            {mode === 'postpone' ? 'Confirmar' : 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalendarModal;
