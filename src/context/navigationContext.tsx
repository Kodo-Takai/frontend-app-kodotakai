// src/context/navigationContext.tsx
import React, { createContext, useState, useContext} from 'react';
import type { ReactNode } from 'react';
import type { Place } from '../hooks/places/usePlacesSimple'; // Ajusta la ruta si es necesario

interface NavigationContextType {
  initialDestination: Place | null;
  setInitialDestination: (place: Place | null) => void;
  clearInitialDestination: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider = ({ children }: { children: ReactNode }) => {
  const [initialDestination, setInitialDestination] = useState<Place | null>(null);

  const clearInitialDestination = () => {
    setInitialDestination(null);
  };

  const value = {
    initialDestination,
    setInitialDestination,
    clearInitialDestination,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigationContext = () => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigationContext debe ser usado dentro de un NavigationProvider');
  }
  return context;
};