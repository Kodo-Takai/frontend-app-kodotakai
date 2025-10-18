import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useAI } from '../../context/aiContext';
import { useNavigate } from 'react-router-dom';
import DestinationItineraryCard from '../cards/destinationItineraryCard';
import Confetti from 'react-confetti';

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
  
  // Estados para el flujo de generación de itinerario
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [itineraryGenerated, setItineraryGenerated] = useState(false);
  const [destinations, setDestinations] = useState<any[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiPieces, setConfettiPieces] = useState(0);

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

  const handleGenerateItinerary = async () => {
    setIsGenerating(true);
    setItineraryGenerated(false);
    setDestinations([]);

    // Mensajes de carga que cambian cada segundo
    const loadingMessages = [
      "Leyendo tus gustos...",
      "Anotando tus preferencias...",
      "Analizando destinos...",
      "Optimizando rutas...",
      "Generando recomendaciones...",
      "Finalizando itinerario..."
    ];

    let messageIndex = 0;
    const messageInterval = setInterval(() => {
      setCurrentMessage(loadingMessages[messageIndex]);
      messageIndex++;
      if (messageIndex >= loadingMessages.length) {
        clearInterval(messageInterval);
      }
    }, 1000);

    // Simular tiempo de generación (3-5 segundos)
    setTimeout(() => {
      clearInterval(messageInterval);
      setIsGenerating(false);
      setItineraryGenerated(true);
      
      // Activar confetti inmediatamente con explosión inicial
      setShowConfetti(true);
      setConfettiPieces(500); // Explosión inicial
      
      // Reducir gradualmente las piezas para efecto realista
      const reducePieces = () => {
        setConfettiPieces(prev => {
          if (prev <= 0) {
            setShowConfetti(false);
            return 0;
          }
          return Math.max(0, prev - 100); // Reducir 50 piezas cada 200ms
        });
      };
      
      // Iniciar reducción gradual después de 0.5 segundos
      setTimeout(() => {
        const interval = setInterval(() => {
          reducePieces();
          if (confettiPieces <= 0) {
            clearInterval(interval);
          }
        }, 100); // Cambiado de 200ms a 100ms para reducción más rápida
      }, 500); // Cambiado de 1000ms a 500ms para empezar antes
      
      // Datos de ejemplo para las cards (esto será reemplazado por datos reales de la API)
      setDestinations([
        {
          id: 1,
          name: "Playa del Carmen",
          type: "Playa",
          duration: "2 días",
          description: "Hermosa playa con aguas cristalinas",
          image: "/playa-image.svg"
        },
        {
          id: 2,
          name: "Tulum",
          type: "Arqueológico",
          duration: "1 día",
          description: "Ruinas mayas junto al mar",
          image: "/tulum-image.svg"
        },
        {
          id: 3,
          name: "Cenote Dos Ojos",
          type: "Aventura",
          duration: "Medio día",
          description: "Cenote para bucear y explorar",
          image: "/cenote-image.svg"
        }
      ]);
    }, 5000);
  };

  const handleRegenerateDestination = (destinationId: number) => {
    // Aquí se implementará la lógica para regenerar un destino específico
    console.log('Regenerando destino:', destinationId);
    // TODO: Implementar llamada a API para regenerar destino específico
  };

  const handleShowInAgenda = () => {
    // Navegar a Agenda.tsx en la sección de itinerarios
    navigate('/agenda?section=itinerarios');
    hideAIOverlay();
  };

  const handleGoToLobby = () => {
    // Regresar al estado inicial del overlay
    setItineraryGenerated(false);
    setDestinations([]);
    setIsGenerating(false);
    setCurrentMessage('');
    setShowConfetti(false);
    setConfettiPieces(0);
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
        className="fixed inset-0 z-[9997] pointer-events-auto"
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
          className="absolute top-15 left-5 w-12 h-12 rounded-xl flex items-center justify-center hover:scale-90 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer z-[10001] opacity-0 scale-75"
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
          className="absolute inset-0 z-[10000] overflow-y-auto"
          style={{ backgroundColor: 'var(--color-green)' }}
        >
          <div className="min-h-full flex flex-col items-center justify-center p-8">
            <div className="text-center text-[var(--color-blue-dark)] max-w-4xl">
              
              {/* Estado de generación */}
              {isGenerating && (
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
                    {currentMessage}
                  </p>
                </div>
              )}

              {/* Estado de itinerario generado */}
              {itineraryGenerated && destinations.length > 0 && (
                <div className="w-full">
                  <div className="text-center mb-8">
                    {/* Imagen de KODI */}
                    <div className="flex justify-center mb-2 mt-15">
                      <img
                        src="/check-kodi.png"
                        alt="KODI"
                        className="w-20 h-20 object-contain"
                      />
                    </div>
                    
                    <h2 
                      className="text-3xl font-extrabold mb-2"
                      style={{ color: 'var(--color-blue-dark)' }}
                    >
                      ¡Itinerario creado!
                    </h2>
                    <p 
                      className="text-lg font-bold"
                      style={{ color: 'var(--color-blue)' }}
                    >
                      Tu itinerario personalizado está listo
                    </p>
                  </div>

                  {/* Cards de destinos */}
                  <div className="space-y-4 mb-8">
                    {destinations.map((destination) => (
                      <DestinationItineraryCard
                        key={destination.id}
                        destination={destination}
                        onRegenerate={handleRegenerateDestination}
                      />
                    ))}
                  </div>

                  {/* Botones de acción */}
                  <div className="text-center space-y-4">
                    <button
                      onClick={handleShowInAgenda}
                      className="w-70 px-8 py-3 rounded-2xl font-bold text-lg hover:scale-105 transition-all duration-200 shadow-lg"
                      style={{
                        backgroundColor: 'var(--color-blue-dark)',
                        color: 'var(--color-green)'
                      }}
                    >
                      Mostrar en agenda
                    </button>
                    
                    <button
                      onClick={handleGoToLobby}
                      className="w-70 px-8 py-3 rounded-2xl font-bold text-lg hover:scale-105 transition-all duration-200 shadow-lg"
                      style={{
                        backgroundColor: 'var(--color-beige)',
                        color: 'var(--color-blue-dark)'
                      }}
                    >
                      Ir al lobby IA
                    </button>
                  </div>
                </div>
              )}

              {/* Contenido inicial (solo si no está generando ni generado) */}
              {!isGenerating && !itineraryGenerated && (
                <>
                  {/* Imagen de Kodi */}
                  <div className="flex justify-center mb-6 mt-10">
                    <img
                      src="/kodi.png"
                      alt="Kodi"
                      className="w-25 h-25 object-contain"
                    />
                  </div>
                  
                  <h1 className="text-4xl font-extrabold mb-4 tracking-tighter">Hola! soy KODI</h1>
                  <p className="text-xl mb-8 font-bold text-[var(--color-blue)]">
                    Tu asistente inteligente está listo para ayudarte
                  </p>
              
              {/* Botón del acordeón */}
              <button
                onClick={toggleAccordion}
                className="w-70 px-8 justify-between py-3 rounded-2xl font-bold text-lg transition-all duration-300 mb-6 flex items-center gap-3 mx-auto hover:scale-105"
                style={{
                  backgroundColor: 'var(--color-beige)',
                  color: 'var(--color-blue)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-bone)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-beige)';
                }}
              >
                <span>Conóceme</span>
                <svg
                  className={`w-5 h-5 transition-transform duration-300 ${isAccordionOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Acordeón con contenido */}
              <div
                ref={accordionRef}
                className="overflow-hidden"
                style={{ display: 'none', height: 0 }}
              >
                <div className="space-y-6 mb-8">
                  <div 
                    className="rounded-2xl p-6 border-6 border-[var(--color-blue-dark)]"
                    style={{ backgroundColor: 'var(--color-blue)' }}
                  >
                    <h3 
                      className="text-2xl font-bold mb-4"
                      style={{ color: 'var(--color-beige)' }}
                    >
                      ¿Qué puedo hacer por ti?
                    </h3>
                    <ul className="space-y-3 text-left">
                      <li className="flex items-center gap-3">
                        <span 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: 'var(--color-beige)' }}
                        ></span>
                        <span style={{ color: 'var(--color-blue-darker)', fontWeight: 'bold' }}>
                          Crear itinerarios personalizados
                        </span>
                      </li>
                      <li className="flex items-center gap-3">
                        <span 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: 'var(--color-beige)' }}
                        ></span>
                        <span style={{ color: 'var(--color-blue-darker)', fontWeight: 'bold' }}>
                          Sugerir lugares según tus preferencias
                        </span>
                      </li>
                      <li className="flex items-center gap-3">
                        <span 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: 'var(--color-beige)' }}
                        ></span>
                        <span style={{ color: 'var(--color-blue-darker)', fontWeight: 'bold' }}>
                          Optimizar rutas de viaje
                        </span>
                      </li>
                      <li className="flex items-center gap-3">
                        <span 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: 'var(--color-beige)' }}
                        ></span>
                        <span style={{ color: 'var(--color-blue-darker)', fontWeight: 'bold' }}>
                          Recomendar restaurantes y actividades
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div 
                    className="rounded-2xl p-6 border-6 border-[var(--color-blue-dark)]"
                    style={{ backgroundColor: 'var(--color-blue)' }}
                  >
                    <h3 
                      className="text-2xl font-bold mb-4"
                      style={{ color: 'var(--color-beige)' }}
                    >
                      Características
                    </h3>
                    <p 
                      className="text-lg font-bold"
                      style={{ color: 'var(--color-blue-darker)' }}
                    >
                      Utilizo inteligencia artificial avanzada para crear experiencias de viaje únicas y personalizadas. 
                      Analizo tus preferencias, el clima, eventos locales y mucho más para ofrecerte las mejores recomendaciones.
                    </p>
                  </div>

                  <div 
                    className="rounded-2xl p-6"
                    style={{ backgroundColor: 'var(--color-bone)' }}
                  >
                    <h3 
                      className="text-2xl font-bold mb-4"
                      style={{ color: 'var(--color-blue-dark)' }}
                    >
                      ¿Cómo funciona?
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div 
                          className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                          style={{ backgroundColor: 'var(--color-green)' }}
                        >
                          <span 
                            className="font-bold text-2xl"
                            style={{ color: 'var(--color-blue)' }}
                          >
                            1
                          </span>
                        </div>
                        <p 
                          className="font-semibold"
                          style={{ color: 'var(--color-blue-dark)' }}
                        >
                          Cuéntame tus planes
                        </p>
                      </div>
                      <div className="text-center">
                        <div 
                          className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                          style={{ backgroundColor: 'var(--color-green)' }}
                        >
                          <span 
                            className="font-bold text-2xl"
                            style={{ color: 'var(--color-blue)' }}
                          >
                            2
                          </span>
                        </div>
                        <p 
                          className="font-semibold"
                          style={{ color: 'var(--color-blue-dark)' }}
                        >
                          Analizo opciones
                        </p>
                      </div>
                      <div className="text-center">
                        <div 
                          className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                          style={{ backgroundColor: 'var(--color-blue)' }}
                        >
                          <span 
                            className="font-bold  text-xl"
                            style={{ color: 'var(--color-bone)' }}
                          >
                            3
                          </span>
                        </div>
                        <p 
                          className="font-semibold"
                          style={{ color: 'var(--color-blue-dark)' }}
                        >
                          Te doy recomendaciones
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
                  {/* Botón Armar tu itinerario */}
                  <button
                    onClick={handleGenerateItinerary}
                    className="w-70 bg-[var(--color-blue-dark)] text-[var(--color-green)] px-8 py-3 rounded-2xl font-bold text-lg hover:scale-105 transition-all duration-200 shadow-lg"
                  >
                    Generar itinerario con IA
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Confetti de celebración - Fuera del overlay para que aparezca encima de todo */}
      {showConfetti && (
        <div className="fixed inset-0 z-[10002] pointer-events-none">
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={confettiPieces}
            gravity={0.2}
            initialVelocityY={7}
            initialVelocityX={1}
            colors={[
              '#295b72', // color-blue
              '#d1dc5a', // color-green
              '#fde7c2', // color-beige
              '#1e3f4f', // color-blue-dark
              '#9baa3b', // color-green-dark
              '#dfbe8b', // color-beige-dark
              '#fffff0', // color-bone
              '#0e222c'  // color-blue-darker
            ]}
          />
        </div>
      )}
    </>
  );
};

export default AIOverlay;