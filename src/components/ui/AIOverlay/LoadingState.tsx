import React from 'react';

interface LoadingStateProps {
  message: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ message }) => {
  return (
    <div className="text-center">
      <div className="flex justify-center mb-6">
        <div 
          className="w-16 h-16 rounded-full animate-spin border-4 border-t-transparent"
          style={{ borderColor: 'var(--color-blue) var(--color-blue-light) var(--color-blue-light) var(--color-blue-light)' }}
        ></div>
      </div>
      <h2 
        className="text-3xl font-extrabold mb-2"
        style={{ color: 'var(--color-blue-dark)' }}
      >
        Generando itinerario...
      </h2>
      <p 
        className="text-xl font-medium"
        style={{ color: 'var(--color-blue)' }}
      >
        {message}
      </p>
    </div>
  );
};

export default LoadingState;
