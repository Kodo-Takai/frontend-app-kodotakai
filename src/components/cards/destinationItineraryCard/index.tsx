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
}

const DestinationItineraryCard: React.FC<DestinationItineraryCardProps> = ({ 
  destination, 
  onRegenerate 
}) => {
  return (
    <div 
      className="rounded-2xl p-6 mb-4 shadow-lg"
      style={{ 
        backgroundColor: 'var(--color-beige-light)',
        border: '2px solid var(--color-blue-light)'
      }}
    >
      <div className="flex items-start gap-4">
        {/* Imagen del destino */}
        <div 
          className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0"
          style={{ backgroundColor: 'var(--color-blue-light)' }}
        >
          <img
            src={destination.image}
            alt={destination.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Contenido del destino */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 
              className="text-xl font-bold"
              style={{ color: 'var(--color-blue-dark)' }}
            >
              {destination.name}
            </h3>
            <span 
              className="px-3 py-1 rounded-full text-sm font-medium"
              style={{ 
                backgroundColor: 'var(--color-green-light)',
                color: 'var(--color-blue-dark)'
              }}
            >
              {destination.type}
            </span>
          </div>

          <p 
            className="text-sm mb-2"
            style={{ color: 'var(--color-blue)' }}
          >
            {destination.description}
          </p>

          <div className="flex items-center justify-between">
            <span 
              className="text-sm font-semibold"
              style={{ color: 'var(--color-blue-dark)' }}
            >
              Duración: {destination.duration}
            </span>

            <button
              onClick={() => onRegenerate(destination.id)}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105"
              style={{
                backgroundColor: 'var(--color-blue)',
                color: 'var(--color-bone)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-blue-dark)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-blue)';
              }}
            >
              Generar otro
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationItineraryCard;
