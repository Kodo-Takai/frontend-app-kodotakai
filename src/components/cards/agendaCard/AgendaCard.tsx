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
    <div 
      className="rounded-2xl overflow-hidden p-4 animate-bubble-in hover:scale-101 transition-transform duration-300 ease-out"
      style={{ backgroundColor: 'var(--color-beige)' }}
    >
      {/* Sección Superior - Imagen con burbuja de fecha/hora */}
      <div className="relative h-22">
        <img
          src={item.image}
          alt={item.destinationName}
          className="w-full h-full object-cover rounded-lg brightness-60"
        />
        
        {/* Burbuja de fecha/hora */}
        <div 
          className="absolute top-2 left-2 rounded-xl px-3 py-1.5 flex items-center gap-2 shadow-md"
          style={{ backgroundColor: 'var(--color-bone)' }}
        >
          {/* Icono de reloj */}
          <svg
            className="w-4 h-4"
            style={{ color: 'var(--color-text-primary)' }}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          
          {/* Texto de fecha/hora */}
          <span 
            className="text-sm font-regular"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {formatTimeAndDate(new Date(item.scheduledDate), item.scheduledTime)}
          </span>
        </div>
      </div>

      {/* Sección Central - Información del destino */}
      <div className="py-1">
        <h3 
          className="font-medium text-lg uppercase truncate"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {item.destinationName}
        </h3>
        <p 
          className="text-sm mb-2"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {item.location}
        </p>
      </div>

      {/* Sección Inferior - Botones horizontales */}
      <div className="flex gap-5 pt-0">
        {/* Botón Postergar */}
        <button
          onClick={() => onMoveItem(item.id)}
          className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl font-normal transition-all duration-200 hover:scale-105"
          style={{ 
            backgroundColor: 'var(--color-blue)',
            color: 'var(--color-bone)'
          }}
        >
          <span>Postergar</span>
          {/* Icono de postergar */}
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
        </button>

        {/* Botón Visitado */}
        <button
          onClick={() => onMarkAsVisited(item.id)}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-all duration-200 hover:scale-105 ${
            item.status === 'completed' 
              ? 'opacity-75' 
              : 'hover:opacity-90'
          }`}
          style={{ 
            backgroundColor: 'var(--color-green)',
            color: 'var(--color-blue)'
          }}
        >
          <span>Visitado</span>
          {/* Icono de pulgar arriba */}
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.818a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default AgendaCard;
