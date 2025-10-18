import React, { createContext, useContext, useState, useRef } from 'react';
import type { ReactNode } from 'react';

interface ConfettiContextType {
  showConfetti: boolean;
  triggerConfetti: () => void;
  hideConfetti: () => void;
}

const ConfettiContext = createContext<ConfettiContextType | undefined>(undefined);

export const useConfetti = () => {
  const context = useContext(ConfettiContext);
  if (context === undefined) {
    throw new Error('useConfetti must be used within a ConfettiProvider');
  }
  return context;
};

interface ConfettiProviderProps {
  children: ReactNode;
}

export const ConfettiProvider: React.FC<ConfettiProviderProps> = ({ children }) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const triggerConfetti = () => {
    // Limpiar timeout anterior si existe
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    setShowConfetti(true);
    // Auto-hide después de 3 segundos
    timeoutRef.current = setTimeout(() => {
      setShowConfetti(false);
    }, 3000);
  };

  const hideConfetti = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setShowConfetti(false);
  };

  return (
    <ConfettiContext.Provider value={{ showConfetti, triggerConfetti, hideConfetti }}>
      {children}
    </ConfettiContext.Provider>
  );
};
