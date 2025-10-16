// src/components/cards/WhatsNewCards.tsx
import { useEffect, useMemo, useState, useCallback } from "react";
import { usePlaces } from "../../../hooks/places";

export default function WhatsNewCards() {
  const { places, loading } = usePlaces({
    category: "destinations",
    enableEnrichment: true,
    maxResults: 5
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Resetear índice cuando cambien los lugares
  useEffect(() => {
    if (places.length === 0) return;
    if (currentIndex >= places.length) {
      setCurrentIndex(0);
    }
  }, [places.length, currentIndex]);

  const currentPlace = useMemo(() => places[currentIndex], [places, currentIndex]);

  // Funciones de navegación con useCallback para evitar re-renders
  const prevSlide = useCallback((e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!places.length) return;
    
    setCurrentIndex((prevIndex) => {
      const newIndex = (prevIndex - 1 + places.length) % places.length;
      return newIndex;
    });
  }, [places.length]);

  const nextSlide = useCallback((e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!places.length) return;
    
    setCurrentIndex((prevIndex) => {
      const newIndex = (prevIndex + 1) % places.length;
      return newIndex;
    });
  }, [places.length]);

  const goToSlide = useCallback((index: number) => {
    if (index >= 0 && index < places.length) {
      setCurrentIndex(index);
    }
  }, [places.length]);

  // Auto-play cada 5 segundos
  useEffect(() => {
    if (!places.length || isPaused) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 3000);

    return () => clearInterval(interval);
  }, [places.length, isPaused, nextSlide]);

  // Pausar auto-play en hover
  const handleMouseEnter = useCallback(() => {
    setIsPaused(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsPaused(false);
  }, []);

  // Loading skeleton con el mismo layout
  if (loading) {
    return (
      <div className="w-full ">
        <h2 className="text-lg font-extrabold mb-2" style={{ color: 'var(--color-text-primary)' }}>Novedades</h2>
        <div className="relative rounded-3xl overflow-hidden">
          <div className="h-35 w-full animate-pulse" style={{ backgroundColor: 'var(--color-blue-light)' }} />
        </div>
      </div>
    );
  }

  // Estado vacío amigable
  if (!places.length || !currentPlace) {
    return (
      <div className="w-full">
        <h2 className="text-lg font-extrabold mb-4" style={{ color: 'var(--color-text-primary)' }}>Novedades</h2>
        <div className="rounded-2xl border border-dashed p-6 text-center text-sm" style={{ borderColor: 'var(--color-text-muted)', color: 'var(--color-text-secondary)' }}>
          No encontramos lugares cercanos en este momento
        </div>
        <p className="text-xs mt-2" style={{ color: 'var(--color-text-muted)' }}>Cargando lugares...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-lg font-extrabold mb-2" style={{ color: 'var(--color-text-primary)' }}>Novedades</h2>

      <div 
        className="relative rounded-3xl overflow-hidden group cursor-pointer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="h-35 relative overflow-hidden ">
          <img
            src={currentPlace.photo_url}
            alt={currentPlace.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={(e) => {
              // Fallback si la imagen no carga
              const target = e.target as HTMLImageElement;
              target.src = "https://picsum.photos/400/200?random=whatsnew-error";
            }}
          />

          {/* Gradiente */}
          <div 
            className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-blue-600/20 to-transparent"
            style={{
              background: 'linear-gradient(to top, var(--color-blue-darker) 10%, var(--color-blue-darker) 20%, transparent)'
            }}
          />

          {/* Etiqueta superior derecha */}
          <div className="absolute top-3 right-3">
            <div className="rounded-full px-3 py-1 flex items-center gap-2" style={{ backgroundColor: 'var(--color-bone)' }}>
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" style={{ color: 'var(--color-blue)' }}>
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-xs font-normal" style={{ color: 'var(--color-blue)' }}>Prepara tu nuevo viaje</span>
            </div>
          </div>

          {/* Badge de rating */}
          {typeof currentPlace.rating === "number" && (
            <div className="absolute top-3 left-3">
              <div className="flex items-center gap-1 px-2 py-1 rounded-full" style={{ backgroundColor: 'var(--color-beige)' }}>
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" style={{ color: 'var(--color-blue)' }}>
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-xs font-bold" style={{ color: 'var(--color-blue)' }}>{currentPlace.rating.toFixed(1)}</span>
              </div>
            </div>
          )}

          {/* Flecha izquierda */}
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all z-10 opacity-0 group-hover:opacity-100"
            style={{ 
              backgroundColor: 'var(--color-green)',
              color: 'var(--color-blue)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-green)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-green)';
            }}
            aria-label="Anterior"
            type="button"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Flecha derecha */}
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 backdrop-blur-sm p-2 rounded-full transition-all z-10 opacity-0 group-hover:opacity-100"
            style={{ 
              backgroundColor: 'var(--color-green)',
              color: 'var(--color-blue)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-green)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-green)';
            }}
            aria-label="Siguiente"
            type="button"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

           {/* Texto inferior sobre la imagen */}
           <div className="absolute bottom-0 left-0 right-0 p-4" style={{ color: 'var(--color-text-white)' }}>
            <p 
              className="text-xl font-bold mb-1 leading-4" 
              style={{ 
                height: "20px",
                color: 'var(--color-text-white)',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis'
              }}
            >
              {currentPlace.name}
            </p>
            <p 
              className="text-xs" 
              style={{ 
                color: 'var(--color-text-white)', 
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis'
              }}
            >
              {currentPlace.vicinity || "Ubicación no disponible"}
            </p>
            
            {/* Bullets de navegación dentro de la card */}
            {places.length > 1 && (
              <div className="flex justify-center gap-2 mt-3">
                {places.map((_, index) => (
                  <button
                    key={`bullet-${index}`}
                    onClick={() => goToSlide(index)}
                    aria-label={`Ir al slide ${index + 1}`}
                    className={`transition-all duration-300 rounded-full ${
                      index === currentIndex 
                        ? "w-10 h-2" 
                        : "w-4 h-2"
                    }`}
                    style={{
                      backgroundColor: index === currentIndex 
                        ? 'var(--color-green)' 
                        : 'var(--color-text-muted)'
                    }}
                    onMouseEnter={(e) => {
                      if (index !== currentIndex) {
                        e.currentTarget.style.backgroundColor = 'var(--color-bone)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (index !== currentIndex) {
                        e.currentTarget.style.backgroundColor = 'var(--color-text-muted)';
                      }
                    }}
                  />
                ))}
              </div>
            )}
           </div>
       </div>
    </div>
  );
}