import { useState, useEffect } from 'react';

interface UseSplashOptions {
  duration?: number; // Duration in milliseconds
  onComplete?: () => void; // Callback when splash is complete
}

interface UseSplashReturn {
  isVisible: boolean;
  isAnimating: boolean;
}

export const useSplash = ({ 
  duration = 3000, 
  onComplete 
}: UseSplashOptions = {}): UseSplashReturn => {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    // Start fade-out animation before hiding
    const fadeOutTimer = setTimeout(() => {
      setIsAnimating(false);
    }, duration - 500); // Start fade-out 500ms before complete duration

    // Hide splash screen completely
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, duration);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(hideTimer);
    };
  }, [duration, onComplete]);

  return {
    isVisible,
    isAnimating
  };
};
