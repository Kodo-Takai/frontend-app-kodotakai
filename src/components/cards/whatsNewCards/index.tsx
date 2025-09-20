import { useState, useEffect } from "react";
import { usePlaces } from "../../../hooks/usePlace"; 

const WhatsNewCards = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { places, loading } = usePlaces();
  

  // Auto-advance carousel
  useEffect(() => {
    if (places.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % places.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [places.length]);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % places.length);
  const prevSlide = () =>
    setCurrentIndex((prev) => (prev === 0 ? places.length - 1 : prev - 1));

  if (loading) {
    return (
      <div className="w-full">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Novedades</h2>
        <div className="animate-pulse">
          <div className="bg-gray-300 h-48 rounded-xl mb-2"></div>
          <div className="flex gap-2 justify-center mt-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-2 h-2 bg-gray-300 rounded-full"></div>
            ))}
          </div>
        </div>
        <div className="mt-4 text-center">
          <div className="text-xs text-gray-500">
            Probando conexión con Google Places API...
          </div>
        </div>
      </div>
    );
  }

  if (places.length === 0) {
    return (
      <div className="w-full">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Novedades</h2>
        <div className="text-gray-500 text-center py-8 bg-gray-50 rounded-xl">
          No se encontraron lugares disponibles
        </div>
      </div>
    );
  }

  const currentPlace = places[currentIndex];

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Novedades</h2>

      <div className="relative rounded-xl overflow-hidden shadow-lg group cursor-pointer">
        <div className="h-48 relative overflow-hidden">
          <img
            src={currentPlace.photo_url}
            alt={currentPlace.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

          <div className="absolute top-3 right-3">
            <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-2">
              <svg
                className="w-3 h-3 text-gray-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-xs text-gray-700 font-medium">
                Prepara tu nuevo viaje
              </span>
            </div>
          </div>

          {currentPlace.rating && (
            <div className="absolute top-3 left-3">
              <div className="flex items-center gap-1 bg-yellow-500/20 backdrop-blur-md px-2 py-1 rounded-full border border-yellow-400/30">
                <svg
                  className="w-3 h-3 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-xs font-bold text-yellow-100">
                  {currentPlace.rating.toFixed(1)}
                </span>
              </div>
            </div>
          )}

          <button
            onClick={prevSlide}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 rounded-full transition-all duration-200"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 rounded-full transition-all duration-200"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="text-lg font-bold mb-1">VISITA LOS MEJORES LUGARES CERCA TUYO</h3>
          <p className="text-xs text-gray-300 mb-1">{currentPlace.name}</p>
          <p className="text-xs text-gray-400">
            {currentPlace.vicinity || "Ciudad de México"}
          </p>
        </div>
      </div>

      <div className="flex justify-center gap-2 mt-4">
        {places.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-200 ${
              index === currentIndex
                ? "bg-blue-500 w-6"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default WhatsNewCards;
