// src/components/cards/WhatsNewCards.tsx
import { useEffect, useMemo, useState } from "react";
import { usePlaces } from "../../../hooks/usePlaces";

export default function WhatsNewCards() {
  const { places, loading, apiStatus } = usePlaces({
    type: "tourist_attraction",
    radius: 3000,
  });

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (places.length === 0) return;
    setCurrentIndex((i) => (i >= places.length ? 0 : i));
  }, [places.length]);

  const currentPlace = useMemo(() => places[currentIndex], [places, currentIndex]);

  const prevSlide = () => {
    if (!places.length) return;
    setCurrentIndex((i) => (i - 1 + places.length) % places.length);
  };

  const nextSlide = () => {
    if (!places.length) return;
    setCurrentIndex((i) => (i + 1) % places.length);
  };

  // Loading skeleton con el mismo layout
  if (loading) {
    return (
      <div className="w-full">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Novedades</h2>
        <div className="relative rounded-xl overflow-hidden shadow-lg">
          <div className="h-48 w-full bg-gray-200 animate-pulse" />
        </div>
        <p className="text-xs text-gray-500 mt-2">{apiStatus}</p>
      </div>
    );
  }

  // Estado vacío amigable
  if (!places.length || !currentPlace) {
    return (
      <div className="w-full">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Novedades</h2>
        <div className="rounded-xl border border-dashed p-6 text-center text-sm text-gray-600">
          No encontramos lugares cercanos en este momento.
        </div>
        <p className="text-xs text-gray-500 mt-2">{apiStatus}</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Novedades</h2>

      <div className="relative rounded-xl overflow-hidden shadow-lg group cursor-pointer">
        <div className="h-48 relative overflow-hidden">
          <img
            src={currentPlace.photo_url}
            alt={currentPlace.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />

          {/* Gradiente */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Etiqueta superior derecha */}
          <div className="absolute top-3 right-3">
            <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-2">
              <svg className="w-3 h-3 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-xs text-gray-700 font-medium">Prepara tu nuevo viaje</span>
            </div>
          </div>

          {/* Badge de rating */}
          {typeof currentPlace.rating === "number" && (
            <div className="absolute top-3 left-3">
              <div className="flex items-center gap-1 bg-yellow-500/20 backdrop-blur-md px-2 py-1 rounded-full border border-yellow-400/30">
                <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-xs font-bold text-yellow-100">{currentPlace.rating.toFixed(1)}</span>
              </div>
            </div>
          )}

          {/* Flecha izquierda */}
          <button
            onClick={prevSlide}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 rounded-full transition-all"
            aria-label="Anterior"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Flecha derecha */}
          <button
            onClick={nextSlide}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 rounded-full transition-all"
            aria-label="Siguiente"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Texto inferior sobre la imagen */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="text-lg font-bold mb-1">VISITA LOS MEJORES LUGARES CERCA TUYO</h3>
          <p className="text-xs text-gray-200 mb-1">{currentPlace.name}</p>
          <p className="text-xs text-gray-300">{currentPlace.vicinity || "Ciudad de México"}</p>
        </div>
      </div>

      {/* Bullets de navegación */}
      <div className="flex justify-center gap-2 mt-4">
        {places.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Ir al slide ${index + 1}`}
            className={`w-2 h-2 rounded-full transition-all duration-200 ${
              index === currentIndex ? "bg-blue-500 w-6" : "bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>

      {/* Estado API */}
{/*       <p className="text-xs text-gray-500 mt-2">{apiStatus}</p> */}
    </div>
  );
}
