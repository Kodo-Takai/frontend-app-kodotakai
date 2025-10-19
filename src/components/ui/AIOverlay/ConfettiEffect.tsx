import React, { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

interface ConfettiEffectProps {
  show: boolean;
}

const ConfettiEffect: React.FC<ConfettiEffectProps> = ({ show }) => {
  const hasTriggered = useRef(false);
  const confettiInstance = useRef<any>(null);

  useEffect(() => {
    if (!show) {
      hasTriggered.current = false;
      return;
    }

    // Prevenir múltiples ejecuciones
    if (hasTriggered.current) return;
    hasTriggered.current = true;

    // Obtener el canvas específico
    const canvas = document.getElementById('confetti-canvas') as HTMLCanvasElement;
    if (!canvas) return;

    // Crear instancia de confetti solo una vez
    if (!confettiInstance.current) {
      confettiInstance.current = confetti.create(canvas, {
        resize: true,
        useWorker: true
      });
    }

    // Explosión única y dramática desde arriba
    confettiInstance.current({
      particleCount: 150,
      spread: 60,
      origin: { y: 0.5 }, // Desde arriba
      startVelocity: 50,
      gravity: 0.8,
      drift: 0.1,
      colors: [
        '#295b72', // color-blue
        '#d1dc5a', // color-green
        '#fde7c2', // color-beige
        '#1e3f4f', // color-blue-dark
        '#9baa3b', // color-green-dark
        '#dfbe8b', // color-beige-dark
        '#fffff0', // color-bone
        '#0e222c'  // color-blue-darker
      ]
    });

  }, [show]);

  return (
    <div className="fixed inset-0 z-[10002] pointer-events-none">
      <canvas 
        id="confetti-canvas"
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 10003 }}
      />
    </div>
  );
};

export default ConfettiEffect;
