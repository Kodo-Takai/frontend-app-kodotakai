// src/components/cards/WhatsNewCards.tsx
import { useEffect, useMemo, useState, useCallback } from "react";
import { usePlaces } from "../../../hooks/places";

export default function WhatsNewCards() {
  const { places, loading } = usePlaces({
    category: "destinations",
    enableEnrichment: true,
    maxResults: 10
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
    }, 5000);

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
      <div className="w-full">
        <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>Novedades</h2>
        <div className="relative rounded-xl overflow-hidden shadow-lg">
          <div className="h-48 w-full animate-pulse" style={{ backgroundColor: 'var(--color-bg-muted)' }} />
        </div>
        <p className="text-xs mt-2" style={{ color: 'var(--color-text-muted)' }}>Cargando lugares...</p>
      </div>
    );
  }

  // Estado vacío amigable
  if (!places.length || !currentPlace) {
    return (
      <div className="w-full">
        <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>Novedades</h2>
        <div className="rounded-xl border border-dashed p-6 text-center text-sm" style={{ borderColor: 'var(--color-text-muted)', color: 'var(--color-text-secondary)' }}>
          No encontramos lugares cercanos en este momento.
        </div>
        <p className="text-xs mt-2" style={{ color: 'var(--color-text-muted)' }}>Cargando lugares...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>Novedades</h2>

      <div 
        className="relative rounded-xl overflow-hidden shadow-lg group cursor-pointer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="h-48 relative overflow-hidden">
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Etiqueta superior derecha */}
          <div className="absolute top-3 right-3">
            <div className="rounded-full px-3 py-1 flex items-center gap-2" style={{ backgroundColor: 'var(--color-blue)' }}>
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" style={{ color: 'var(--color-text-white)' }}>
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-xs font-medium" style={{ color: 'var(--color-text-white)' }}>Prepara tu nuevo viaje</span>
            </div>
          </div>

          {/* Badge de rating */}
          {typeof currentPlace.rating === "number" && (
            <div className="absolute top-3 left-3">
              <div className="flex items-center gap-1 backdrop-blur-md px-2 py-1 rounded-full" style={{ backgroundColor: 'var(--color-green)' + '33', borderColor: 'var(--color-green)' + '4D' }}>
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" style={{ color: 'var(--color-green)' }}>
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-xs font-bold" style={{ color: 'var(--color-text-white)' }}>{currentPlace.rating.toFixed(1)}</span>
              </div>
            </div>
          )}

          {/* Flecha izquierda */}
          <button
            onClick={prevSlide}
            className="absolute left-3 top-1/2 -translate-y-1/2 backdrop-blur-sm p-2 rounded-full transition-all z-10 opacity-0 group-hover:opacity-100"
            style={{ 
              backgroundColor: 'var(--color-bone)' + '33',
              color: 'var(--color-text-white)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-bone)' + '4D';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-bone)' + '33';
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
            className="absolute right-3 top-1/2 -translate-y-1/2 backdrop-blur-sm p-2 rounded-full transition-all z-10 opacity-0 group-hover:opacity-100"
            style={{ 
              backgroundColor: 'var(--color-bone)' + '33',
              color: 'var(--color-text-white)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-bone)' + '4D';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-bone)' + '33';
            }}
            aria-label="Siguiente"
            type="button"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Indicador de pausa */}
          {isPaused && (
            <div className="absolute bottom-3 left-3">
              <div className="backdrop-blur-sm px-2 py-1 rounded-full" style={{ backgroundColor: 'var(--color-blue)' + '80' }}>
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" style={{ color: 'var(--color-text-white)' }}>
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* Texto inferior sobre la imagen */}
        <div className="absolute bottom-0 left-0 right-0 p-4" style={{ color: 'var(--color-text-white)' }}>
          <h3 className="text-lg font-bold mb-1">VISITA LOS MEJORES LUGARES CERCA TUYO</h3>
          <p className="text-xs mb-1" style={{ color: 'var(--color-text-white)' }}>{currentPlace.name}</p>
          <p className="text-xs" style={{ color: 'var(--color-text-white)', opacity: 0.8 }}>{currentPlace.vicinity || "Ciudad de México"}</p>
        </div>
      </div>

      {/* Bullets de navegación */}
      {places.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {places.map((_, index) => (
            <button
              key={`bullet-${index}`}
              onClick={() => goToSlide(index)}
              aria-label={`Ir al slide ${index + 1}`}
              className={`transition-all duration-300 rounded-full ${
                index === currentIndex 
                  ? "w-6 h-2" 
                  : "w-2 h-2"
              }`}
              style={{
                backgroundColor: index === currentIndex 
                  ? 'var(--color-blue)' 
                  : 'var(--color-text-muted)'
              }}
              onMouseEnter={(e) => {
                if (index !== currentIndex) {
                  e.currentTarget.style.backgroundColor = 'var(--color-blue-light)';
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
  );
}