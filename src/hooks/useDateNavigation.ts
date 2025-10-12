import { useState, useMemo } from 'react';
import { format, startOfWeek, addDays, subDays, isSameDay, isToday } from 'date-fns';
import { es } from 'date-fns/locale';
import { type DayInfo } from '../components/ui/daySelector/DaySelector';

export const useDateNavigation = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => 
    startOfWeek(new Date(), { weekStartsOn: 1 }) // Lunes como primer día
  );

  // Generar los 7 días de la semana actual
  const weekDays = useMemo((): DayInfo[] => {
    return Array.from({ length: 7 }, (_, index) => {
      const dayDate = addDays(currentWeekStart, index);
      return {
        date: dayDate,
        dayName: format(dayDate, 'EEE', { locale: es }).toUpperCase(),
        dayNumber: format(dayDate, 'dd'),
        isToday: isToday(dayDate),
        isSelected: isSameDay(dayDate, selectedDate),
      };
    });
  }, [currentWeekStart, selectedDate]);

  // Navegar a la semana anterior
  const goToPreviousWeek = () => {
    setCurrentWeekStart(prev => subDays(prev, 7));
  };

  // Navegar a la semana siguiente
  const goToNextWeek = () => {
    setCurrentWeekStart(prev => addDays(prev, 7));
  };

  // Seleccionar un día específico
  const selectDay = (date: Date) => {
    setSelectedDate(date);
  };

  // Formatear la fecha actual para mostrar en el header
  const getCurrentWeekText = () => {
    const startDate = currentWeekStart;
    const endDate = addDays(startDate, 6);
    
    if (isSameDay(startDate, endDate)) {
      return format(startDate, "dd 'de' MMM yyyy", { locale: es });
    }
    
    return `${format(startDate, 'dd MMM', { locale: es })} - ${format(endDate, 'dd MMM yyyy', { locale: es })}`;
  };

  // Ir a la semana actual
  const goToCurrentWeek = () => {
    const today = new Date();
    setCurrentWeekStart(startOfWeek(today, { weekStartsOn: 1 }));
    setSelectedDate(today);
  };

  return {
    selectedDate,
    weekDays,
    currentWeekText: getCurrentWeekText(),
    goToPreviousWeek,
    goToNextWeek,
    selectDay,
    goToCurrentWeek,
  };
};
