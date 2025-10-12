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
    <div className="rounded-xl flex items-center gap-3 bg-[#f1f1e9] p-3">
      {/* Imagen del destino */}
      <div className="flex-shrink-0 relative h-20">
        <img
          src={item.image}
          alt={item.destinationName}
          className="w-15 h-20 rounded-lg object-cover brightness-60"
        />
      </div>

      {/* Información del destino */}
      <div className="flex-1 min-w-0 pr-2">
        <h3 className="font-bold text-[#151A00] text-md uppercase truncate">
          {item.destinationName}
        </h3>
        <p className="text-[#151A00] text-sm font-medium truncate">
          {item.location}
        </p>
        <p className="text-[#151A00] text-sm mt-1 font-medium leading-4">
          {formatTimeAndDate(new Date(item.scheduledDate), item.scheduledTime)}
        </p>
      </div>

      {/* Botones de acción */}
      <div className="flex flex-col gap-2 h-20 justify-center">
        {/* Botón Me Gusta/Visitado */}
        <button
          onClick={() => onMarkAsVisited(item.id)}
          className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105 ${
            item.status === 'completed'
              ? 'bg-[#BACB2C]'
              : 'bg-[#BACB2C] hover:bg-[#A8E251]'
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
          className="w-10 h-10 bg-black rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105 hover:bg-gray-800"
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
