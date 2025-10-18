import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useAI } from '../../context/aiContext';

interface AIOverlayProps {
  children: React.ReactNode;
}

const AIOverlay: React.FC<AIOverlayProps> = ({ children }) => {
  const { isAIActive, buttonPosition, hideAIOverlay } = useAI();
  const overlayRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isAnimatingRef = useRef(false);

  const handleClose = () => {
    if (isAnimatingRef.current) return; // Prevenir múltiples clicks
    
    isAnimatingRef.current = true;
    const circle = circleRef.current;
    const content = contentRef.current;
    const closeButton = document.querySelector('[data-close-button]') as HTMLElement;

    if (circle && content) {
      gsap.timeline({
        onComplete: () => {
          hideAIOverlay();
          isAnimatingRef.current = false;
        }
      })
      .to([content, closeButton], {
        opacity: 0,
        scale: 0.8,
        duration: 0.2,
        ease: "power2.inOut"
      })
      .to(circle, {
        scale: 0,
        duration: 0.4,
        ease: "power2.inOut"
      }, "-=0.05");
    }
  };

  useEffect(() => {
    if (isAIActive && buttonPosition && overlayRef.current && circleRef.current && contentRef.current) {
      const circle = circleRef.current;
      const content = contentRef.current;

      // Configurar posición inicial del círculo (detrás del botón)
      gsap.set(circle, {
        x: buttonPosition.x - 24, // Centrar respecto al botón
        y: buttonPosition.y - 24,
        scale: 0,
        transformOrigin: 'center center'
      });

      // Configurar contenido inicial
      gsap.set(content, {
        opacity: 0,
        scale: 0.8
      });

      // Animación de expansión del círculo
      const tl = gsap.timeline();

      tl.to(circle, {
        scale: 40, // Escala muy grande para cubrir toda la pantalla
        duration: 0.8,
        ease: "power2.out"
      })
      .to([content], {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        ease: "power2.out"
      }, "-=0.2")
      .call(() => {
        const closeButton = document.querySelector('[data-close-button]') as HTMLElement;
        if (closeButton) {
          gsap.to(closeButton, {
            opacity: 1,
            scale: 1,
            duration: 0.4,
            ease: "power2.out"
          });
        }
      });
    }
  }, [isAIActive, buttonPosition]);

  if (!isAIActive) return <>{children}</>;

  return (
    <>
      {children}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[9997] pointer-events-auto"
        style={{ backgroundColor: 'transparent' }}
      >
        {/* Círculo animado - detrás del botón */}
        <div
          ref={circleRef}
          className="absolute w-12 h-12 rounded-full"
          style={{ 
            backgroundColor: 'var(--color-green)',
            border: '4px solid var(--color-green-darker)',
            left: '0px',
            top: '0px'
          }}
        />
        
        {/* Botón de regreso en esquina superior izquierda */}
        <button
          data-close-button
          onClick={handleClose}
          className="absolute top-15 left-5 w-12 h-12 rounded-xl flex items-center justify-center hover:scale-95 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer z-[10001] opacity-0 scale-75"
          style={{
            backgroundColor: "var(--color-blue-dark)",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M19 12H5M12 19l-7-7 7-7"
              stroke="var(--color-green)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Contenido de IA */}
        <div
          ref={contentRef}
          className="absolute inset-0 flex flex-col items-center justify-center p-8 z-[10000]"
          style={{ backgroundColor: 'var(--color-green)' }}
        >
          <div className="text-center text-[var(--color-blue-dark)]">
            {/* Imagen de Kodi */}
            <div className="flex justify-center mb-6">
              <img
                src="/kodi.png"
                alt="Kodi"
                className="w-25 h-25 object-contain"
              />
            </div>
            
            <h1 className="text-4xl font-extrabold mb-4 tracking-tighter">Hola! soy KODI</h1>
            <p className="text-xl mb-8 font-bold text-[var(--color-blue)] opacity-90">
              Tu asistente inteligente está listo para ayudarte
            </p>
            
            {/* Botón Armar tu itinerario */}
            <button
              className="bg-[var(--color-blue)] text-[var(--color-green)] px-8 py-3 rounded-2xl font-bold text-lg hover:scale-105 transition-all duration-200 "
            >
              Generar itinerario con IA
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AIOverlay;