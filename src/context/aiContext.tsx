/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

interface AIContextType {
  isAIActive: boolean;
  showAIOverlay: (buttonPosition: { x: number; y: number }) => void;
  hideAIOverlay: () => void;
  buttonPosition: { x: number; y: number } | null;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export const useAI = () => {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error("useAI must be used within an AIProvider");
  }
  return context;
};

interface AIProviderProps {
  children: ReactNode;
}

export function AIProvider({ children }: AIProviderProps) {
  const [isAIActive, setIsAIActive] = useState(false);
  const [buttonPosition, setButtonPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const showAIOverlay = (position: { x: number; y: number }) => {
    setButtonPosition(position);
    setIsAIActive(true);
  };

  const hideAIOverlay = () => {
    setIsAIActive(false);
    // Limpiar la posición después de un delay para permitir la animación de salida
    setTimeout(() => {
      setButtonPosition(null);
    }, 500);
  };

  return (
    <AIContext.Provider
      value={{
        isAIActive,
        showAIOverlay,
        hideAIOverlay,
        buttonPosition,
      }}
    >
      {children}
    </AIContext.Provider>
  );
}
