import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useAI } from '../../context/aiContext';
import { useNavigate } from 'react-router-dom';
import { useItineraryGeneration } from '../../hooks/useItineraryGeneration';
import { useAgenda } from '../../hooks/useAgenda';
import LoadingState from './AIOverlay/LoadingState';
import ItineraryGenerated from './AIOverlay/ItineraryGenerated';
import InitialContent from './AIOverlay/InitialContent';

interface AIOverlayProps {
  children: React.ReactNode;
}

const AIOverlay: React.FC<AIOverlayProps> = ({ children }) => {
  const { isAIActive, buttonPosition, hideAIOverlay } = useAI();
  const navigate = useNavigate();
  const overlayRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isAnimatingRef = useRef(false);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const accordionRef = useRef<HTMLDivElement>(null);
  
  // Hook personalizado para manejar la generación de itinerario
  const {
    isGenerating,
    currentMessage,
    itineraryGenerated,
    destinations,
    generateItinerary,
    resetToLobby,
    regenerateDestination
  } = useItineraryGeneration();

  // Hook de agenda para agregar destinos
  const { addItem } = useAgenda();

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

  const toggleAccordion = () => {
    const accordion = accordionRef.current;
    if (!accordion) return;

    if (isAccordionOpen) {
      // Cerrar acordeón
      gsap.to(accordion, {
        height: 0,
        duration: 0.4,
        ease: "power2.inOut",
        onComplete: () => {
          accordion.style.display = 'none';
        }
      });
    } else {
      // Abrir acordeón
      accordion.style.display = 'block';
      gsap.fromTo(accordion, 
        { height: 0 },
        {
          height: 'auto',
          duration: 0.4,
          ease: "power2.inOut"
        }
      );
    }
    setIsAccordionOpen(!isAccordionOpen);
  };

  const handleShowInAgenda = async () => {
    // Agregar todos los destinos a la agenda antes de navegar
    try {
      await Promise.all(
        destinations.map(async (destination) => {
          const category = ['restaurant', 'hotel', 'beach', 'park', 'disco', 'study'].includes(destination.type?.toLowerCase())
            ? (destination.type.toLowerCase() as 'restaurant' | 'hotel' | 'beach' | 'park' | 'disco' | 'study')
            : 'restaurant';
          
          await addItem({
            destinationId: String(destination.id),
            destinationName: destination.name,
            location: destination.description || 'Ubicación no disponible',
            scheduledDate: new Date().toISOString(), // Fecha actual
            scheduledTime: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
            status: 'pending',
            category,
            image: destination.image || 'https://picsum.photos/400/300?random=agenda',
            description: destination.description || '',
            placeData: {
              name: destination.name,
              latitude: destination.latitude,
              longitude: destination.longitude,
            },
          });
        })
      );
      
      // Navegar a Agenda.tsx en la sección de agendados
      navigate('/agenda?section=agendados');
      hideAIOverlay();
    } catch (error) {
      console.error('Error agregando destinos a la agenda:', error);
    }
  };

  const handleAddToAgenda = async (destination: { id: number; name: string; type: string; description: string; image: string; latitude?: number; longitude?: number }) => {
    try {
      const category = ['restaurant', 'hotel', 'beach', 'park', 'disco', 'study'].includes(destination.type?.toLowerCase())
        ? (destination.type.toLowerCase() as 'restaurant' | 'hotel' | 'beach' | 'park' | 'disco' | 'study')
        : 'restaurant';
      
      await addItem({
        destinationId: String(destination.id),
        destinationName: destination.name,
        location: destination.description || 'Ubicación no disponible',
        scheduledDate: new Date().toISOString(), // Fecha actual
        scheduledTime: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        status: 'pending',
        category,
        image: destination.image || 'https://picsum.photos/400/300?random=agenda',
        description: destination.description || '',
        placeData: {
          name: destination.name,
          latitude: destination.latitude,
          longitude: destination.longitude,
        },
      });
      
      console.log('Destino agregado a la agenda:', destination.name);
    } catch (error) {
      console.error('Error agregando destino a la agenda:', error);
      throw error;
    }
  };

  const handleGoToLobby = () => {
    resetToLobby();
  };

  useEffect(() => {
    if (isAIActive && buttonPosition && overlayRef.current && circleRef.current && contentRef.current) {
      // Desactivar scroll del body
      document.body.style.overflow = 'hidden';
      
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
        scale: 50, // Escala muy grande para cubrir toda la pantalla
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
    } else if (!isAIActive) {
      // Reactivar scroll del body cuando se cierra
      document.body.style.overflow = 'auto';
    }
  }, [isAIActive, buttonPosition]);

  if (!isAIActive) return <>{children}</>;

  return (
    <>
      {children}
      
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[9996] pointer-events-auto"
        style={{ backgroundColor: 'transparent' }}
      >
        {/* Círculo animado - detrás del botón */}
        <div
          ref={circleRef}
          className="absolute w-12 h-12 rounded-full"
          style={{ 
            backgroundColor: 'var(--color-green)',
            border: '2px solid var(--color-green-darker)',
            left: '0px',
            top: '0px'
          }}
        />
        
        {/* Botón de regreso en esquina superior izquierda */}
        <button
          data-close-button
          onClick={(event) => {
            const button = event.currentTarget;
            
            // Efecto de bounce/encogimiento del botón
            button.style.transform = 'scale(0.9)';
            button.style.transition = 'transform 0.1s ease-out';
            
            // Después del bounce, restaurar y activar close
            setTimeout(() => {
              button.style.transform = 'scale(1)';
              button.style.transition = 'transform 0.2s ease-out';
              
              // Activar close después del bounce
              setTimeout(() => {
                handleClose();
              }, 100);
            }, 100);
          }}
          className="absolute top-15 left-5 w-12 h-12 rounded-xl flex items-center justify-center hover:scale-90 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer z-[9999] opacity-0 scale-75"
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

        {/* Contenido de IA - Scrolleable */}
        <div
          ref={contentRef}
          className="absolute inset-0 z-[9998] overflow-y-auto"
          style={{ backgroundColor: 'var(--color-green)' }}
        >
          <div className="min-h-full flex flex-col items-center justify-center p-8">
            <div className="text-center text-[var(--color-blue-dark)] max-w-4xl">
              
              {/* Estado de generación */}
              {isGenerating && (
                <LoadingState message={currentMessage} />
              )}

              {/* Estado de itinerario generado */}
              {itineraryGenerated && destinations.length > 0 && (
                <ItineraryGenerated
                  destinations={destinations}
                  onRegenerateDestination={regenerateDestination}
                  onAddToAgenda={handleAddToAgenda}
                  onShowInAgenda={handleShowInAgenda}
                  onGoToLobby={handleGoToLobby}
                />
              )}

              {/* Contenido inicial (solo si no está generando ni generado) */}
              {!isGenerating && !itineraryGenerated && (
                <InitialContent
                  isAccordionOpen={isAccordionOpen}
                  onToggleAccordion={toggleAccordion}
                  onGenerateItinerary={generateItinerary}
                  accordionRef={accordionRef as React.RefObject<HTMLDivElement>}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AIOverlay;