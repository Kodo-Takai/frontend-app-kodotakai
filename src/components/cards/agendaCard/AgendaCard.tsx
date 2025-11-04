import React from 'react';
import { type AgendaItem } from '../../../redux/slice/agendaSlice';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { FaTrash, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';

interface AgendaCardProps {
  item: AgendaItem;
  onPostpone: (id: string) => void;
  onDelete: (id: string) => void;
}

const AgendaCard: React.FC<AgendaCardProps> = ({
  item,
  onPostpone,
  onDelete,
}) => {
  const formatTimeAndDate = (date: Date, time: string) => {
    const dayName = format(date, 'EEEE', { locale: es });
    const dayNumber = format(date, 'dd');
    const monthName = format(date, 'MMMM', { locale: es });
    
    return `${time} - ${dayName} ${dayNumber} de ${monthName}`;
  };

  const handleDelete = () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este elemento de tu agenda?')) {
      onDelete(item.id);
    }
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
          className="absolute top-2 left-2 rounded-xl px-3.5 py-1 flex items-center gap-2 shadow-md"
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
            className="text-sm font-medium"
            style={{ color: 'var(--color-blue)' }}
          >
            {formatTimeAndDate(new Date(item.scheduledDate), item.scheduledTime)}
          </span>
        </div>
      </div>

      {/* Sección Central - Información del destino */}
      <div className="py-1">
        <h3 
          className="font-extrabold text-lg uppercase truncate mb-1"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {item.destinationName}
        </h3>
        <div className="flex items-center gap-2 mb-2">
          <FaMapMarkerAlt className="w-3 h-3 text-gray-600" />
          <p 
            className="text-sm font-medium truncate"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {item.location}
          </p>
        </div>
        {item.description && (
          <p 
            className="text-xs text-gray-600 line-clamp-2"
          >
            {item.description}
          </p>
        )}
      </div>

      {/* Sección Inferior - Botones horizontales */}
      <div className="flex gap-3 pt-0">
        {/* Botón Postergar */}
        <button
          onClick={() => onPostpone(item.id)}
          className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl font-medium transition-all duration-200 hover:scale-105"
          style={{ 
            backgroundColor: 'var(--color-blue-dark)',
            color: 'var(--color-bone)'
          }}
        >
          <FaCalendarAlt className="w-4 h-4" />
          <span>Postergar</span>
        </button>

        {/* Botón Eliminar */}
        <button
          onClick={handleDelete}
          className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl font-medium transition-all duration-200 hover:scale-105 hover:opacity-90"
          style={{ 
            backgroundColor: 'var(--color-green)',
            color: 'var(--color-blue)'
          }}
        >
          <FaTrash className="w-4 h-4" />
          <span>Eliminar</span>
        </button>
      </div>
    </div>
  );
};

export default AgendaCard;
