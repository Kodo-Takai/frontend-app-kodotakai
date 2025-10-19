import React from 'react';

interface DestinationItineraryCardProps {
  destination: {
    id: number;
    name: string;
    type: string;
    duration: string;
    description: string;
    image: string;
  };
  onRegenerate: (id: number) => void;
  loading?: boolean;
}

const DestinationItineraryCard: React.FC<DestinationItineraryCardProps> = ({ 
  destination, 
  onRegenerate,
  loading = false
}) => {
  // Skeleton loading state
  if (loading) {
    return (
      <div 
        className="rounded-2xl overflow-hidden p-4 animate-pulse mb-4"
        style={{ backgroundColor: 'var(--color-bone)' }}
      >
        <div 
          className="w-full h-80 rounded-lg"
          style={{ backgroundColor: 'var(--color-green-dark)' }}
        />
      </div>
    );
  }
  return (
    <div 
      className="rounded-2xl overflow-hidden p-4 animate-bubble-in hover:scale-101 transition-transform duration-300 ease-out mb-4"
      style={{ backgroundColor: 'var(--color-bone)' }}
    >
      {/* Sección Superior - Imagen con burbuja de tipo/duración */}
      <div 
        className="relative h-22 rounded-lg"
        style={{ backgroundColor: 'var(--color-beige-dark)' }}
      >
        <img
          src={destination.image}
          alt={destination.name}
          className="w-full h-full object-cover rounded-lg brightness-60"
        />
        
        {/* Burbuja de tipo/duración */}
        <div 
          className="absolute top-2 left-2 rounded-xl px-3.5 py-1 flex items-center gap-2 shadow-md"
          style={{ backgroundColor: 'var(--color-green-dark)' }}
        >
          {/* Icono de tiempo */}
          <svg
            className="w-4 h-4"
            style={{ color: 'var(--color-bone)' }}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          
          {/* Texto de duración */}
          <span 
            className="text-sm font-medium"
            style={{ color: 'var(--color-bone)' }}
          >
            {destination.duration}
          </span>
        </div>

        {/* Burbuja de tipo */}
        <div 
          className="absolute top-2 right-2 rounded-xl px-3.5 py-1 shadow-md"
          style={{ backgroundColor: 'var(--color-green)' }}
        >
          <span 
            className="text-sm font-medium"
            style={{ color: 'var(--color-blue-dark)' }}
          >
            {destination.type}
          </span>
        </div>
      </div>

      {/* Sección Central - Información del destino */}
      <div className="py-1">
        <h3 
          className="font-extrabold text-lg uppercase truncate"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {destination.name}
        </h3>
        <p 
          className="text-sm font-medium mb-2"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {destination.description}
        </p>
      </div>

      {/* Sección Inferior - Botones horizontales */}
      <div className="flex gap-5 pt-0">
        {/* Botón Agregar a Agenda */}
        <button
          className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl font-normal transition-all duration-200 hover:scale-105"
          style={{ 
            backgroundColor: 'var(--color-blue-dark)',
            color: 'var(--color-bone)'
          }}
        >
          <span>Agregar a Agenda</span>
          {/* Icono de calendario */}
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
        </button>

        {/* Botón Generar otro */}
        <button
          onClick={() => onRegenerate(destination.id)}
          className="flex-1 font-bold flex items-center justify-center gap-2 py-2 px-4 rounded-xl transition-all duration-200 hover:scale-105 hover:opacity-90"
          style={{ 
            backgroundColor: 'var(--color-green)',
            color: 'var(--color-blue-dark)'
          }}
        >
          <span>Generar otro</span>
          {/* Icono de refresh */}
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default DestinationItineraryCard;
