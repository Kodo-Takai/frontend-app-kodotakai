import React from 'react';
import { type AgendaItem } from '../../../redux/slice/agendaSlice';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface AgendaCardProps {
  item: AgendaItem;
  onMarkAsVisited: (id: string) => void;
  onMoveItem: (id: string) => void;
}

const AgendaCard: React.FC<AgendaCardProps> = ({
  item,
  onMarkAsVisited,
  onMoveItem,
}) => {
  const formatTimeAndDate = (date: Date, time: string) => {
    const dayName = format(date, 'EEEE', { locale: es });
    const dayNumber = format(date, 'dd');
    const monthName = format(date, 'MMMM', { locale: es });
    
    return `${time} - ${dayName} ${dayNumber} de ${monthName}`;
  };

  return (
    <div className="rounded-xl flex items-center gap-4 ">
      {/* Imagen del destino */}
      <div className="flex-shrink-0 relative">
        <img
          src={item.image}
          alt={item.destinationName}
          className="w-18 h-18 rounded-lg object-cover brightness-70"
        />
      </div>

      {/* Información del destino */}
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-black text-md uppercase truncate">
          {item.destinationName}
        </h3>
        <p className="text-gray-600 text-sm mt-1 truncate">
          {item.location}
        </p>
        <p className="text-[#B8F261] text-sm mt-1 font-medium">
          {formatTimeAndDate(new Date(item.scheduledDate), item.scheduledTime)}
        </p>
      </div>

      {/* Botones de acción */}
      <div className="flex flex-col gap-2">
        {/* Botón Me Gusta/Visitado */}
        <button
          onClick={() => onMarkAsVisited(item.id)}
          className={`w-12 h-8 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105 ${
            item.status === 'completed'
              ? 'bg-[#B8F261]'
              : 'bg-[#B8F261] hover:bg-[#A8E251]'
          }`}
          title={item.status === 'completed' ? 'Visitado' : 'Marcar como visitado'}
        >
          <svg
            className="w-4 h-4 text-black"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.818a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
          </svg>
        </button>

        {/* Botón Mover */}
        <button
          onClick={() => onMoveItem(item.id)}
          className="w-12 h-8 bg-black rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105 hover:bg-gray-800"
          title="Mover a otra fecha"
        >
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 8h16M4 16h16"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default AgendaCard;
