import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import type { EnrichedPlace } from "../../../hooks/places";
import { FaStar, FaPhoneAlt, FaMapMarkerAlt, FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useAgenda } from "../../../hooks/useAgenda";

export type PlaceModalProps = {
  isOpen: boolean;
  onClose: () => void;
  place: EnrichedPlace | null;
  maxImages?: number;
  onVisit: (place: EnrichedPlace) => void;
};

export default function PlaceModal({ isOpen, onClose, place, maxImages = 5, onVisit }: PlaceModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { addItem } = useAgenda();

  useEffect(() => {
    if (!isOpen) return;
    setCurrentImageIndex(0);
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrevImage();
      if (e.key === "ArrowRight") handleNextImage();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const images = useMemo(() => {
    if (!place) return [];
    const imageList: string[] = [];
    const enriched = place as any;
    if (enriched.photos && Array.isArray(enriched.photos)) {
      enriched.photos.forEach((photo: any) => {
        const url = photo.getUrl ? photo.getUrl() : photo.photo_url || photo;
        if (url) imageList.push(url);
      });
    }
    if (place.photo_url && !imageList.includes(place.photo_url)) {
      imageList.unshift(place.photo_url);
    }
    if (imageList.length === 0) {
      imageList.push("https://picsum.photos/800/450?random=place-modal-fallback");
    }
    return imageList.slice(0, maxImages);
  }, [place, maxImages]);
  
  const phone = useMemo(() => {
    if (!place) return undefined;
    const enriched = place as EnrichedPlace;
    return enriched.formatted_phone_number;
  }, [place]);

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };
  
  const handleAgendar = () => {
    if (!place) return;
    const agendaItem = {
      destinationId: place.place_id || place.id || `place_${Date.now()}`,
      destinationName: place.name,
      location: (place as EnrichedPlace).formatted_address || place.vicinity || 'Ubicación no disponible',
      scheduledDate: new Date().toISOString(),
      scheduledTime: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      status: 'pending' as const,
      category: 'restaurant' as const,
      image: place.photo_url || images[0] || 'https://picsum.photos/400/300?random=agenda',
      description: (place as EnrichedPlace).editorial_summary?.overview || `Visita a ${place.name}`,
      placeData: place as EnrichedPlace,
    };
    addItem(agendaItem);
    onClose();
    alert(`¡${place.name} ha sido agregado a tu agenda!`);
  };

  const handleVisit = () => {
    if (place) {
      onVisit(place);
    }
    onClose(); 
  };

  if (!isOpen || !place) return null;

  const description = (place as EnrichedPlace).editorial_summary?.overview;
  const address = (place as EnrichedPlace).formatted_address || place.vicinity;
  const stop = (e: React.MouseEvent) => e.stopPropagation();

  const modalContent = (
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-sm overflow-y-auto"
        style={{ backgroundColor: "rgba(41, 91, 114, 0.6)" }}
        onClick={onClose}
        aria-modal
        role="dialog"
      >
        <div
          className="relative w-[95vw] max-w-2xl max-h-[100vh] overflow-y-auto rounded-2xl shadow-xl my-8"
          style={{ backgroundColor: "var(--color-bone)" }}
          onClick={stop}
        >
        <button 
          onClick={onClose} 
          aria-label="Cerrar" 
          className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full shadow transition-all duration-200 hover:scale-110"
          style={{ 
            backgroundColor: "var(--color-bone)", 
            color: "var(--color-blue)" 
          }}
        >
          <FaTimes className="h-5 w-5" />
        </button>
        
        <div className="relative h-56 w-full overflow-hidden sm:h-64 group">
            <img src={images[currentImageIndex]} alt={`${place.name} - Imagen ${currentImageIndex + 1}`} className="h-full w-full object-cover transition-opacity duration-300" loading="lazy" />
            {typeof place.rating === "number" && (
              <div 
                className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full px-3 py-1"
                style={{ 
                  backgroundColor: "var(--color-blue-dark)", 
                  color: "var(--color-bone)" 
                }}
              >
                <FaStar className="h-4 w-4" style={{ color: "var(--color-green)" }} />
                <span className="text-sm font-semibold">{place.rating.toFixed(1)}</span>
              </div>
            )}
            {images.length > 1 && (
              <>
                <button 
                  onClick={handlePrevImage} 
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center animate-bubble-in hover:scale-110" 
                  style={{ 
                    backgroundColor: "var(--color-bone)", 
                    color: "var(--color-blue)" 
                  }}
                  aria-label="Imagen anterior"
                >
                  <FaChevronLeft className="h-4 w-4" />
                </button>
                <button 
                  onClick={handleNextImage} 
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center animate-bubble-in hover:scale-110" 
                  style={{ 
                    backgroundColor: "var(--color-bone)", 
                    color: "var(--color-blue)" 
                  }}
                  aria-label="Imagen siguiente"
                >
                  <FaChevronRight className="h-4 w-4" />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {images.map((_, index) => (
                    <button 
                      key={index} 
                      onClick={() => setCurrentImageIndex(index)} 
                      className="h-1.5 rounded-full transition-all duration-300 hover:scale-125"
                      style={{
                        width: index === currentImageIndex ? "1.5rem" : "0.375rem",
                        backgroundColor: index === currentImageIndex ? "var(--color-bone)" : "rgba(255, 255, 240, 0.6)"
                      }}
                      aria-label={`Ir a imagen ${index + 1}`} 
                    />
                  ))}
                </div>
                <div 
                  className="absolute bottom-3 right-3 text-xs px-2 py-1 rounded-full"
                  style={{ 
                    backgroundColor: "var(--color-blue-dark)", 
                    color: "var(--color-bone)" 
                  }}
                >
                  {currentImageIndex + 1} / {images.length}
                </div>
              </>
            )}
        </div>
        
        {images.length > 1 && (
          <div className="px-4 pt-3 pb-2 flex gap-2 overflow-x-auto scrollbar-hide">
            {images.map((img, index) => (
              <button 
                key={index} 
                onClick={() => setCurrentImageIndex(index)} 
                className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-3 transition-all duration-200 hover:scale-110 animate-bubble-in"
                style={{
                  borderColor: index === currentImageIndex ? "var(--color-green)" : "transparent",
                  borderWidth: index === currentImageIndex ? "3px" : "2px",
                  transform: index === currentImageIndex ? "scale(1.05)" : "scale(1)",
                  opacity: index === currentImageIndex ? "1" : "0.6"
                }}
              >
                <img src={img} alt={`Miniatura ${index + 1}`} className="w-full h-full object-cover" loading="lazy" />
              </button>
            ))}
          </div>
        )}

        <div className="p-4 sm:p-6">
          <h3 
            className="mb-1 text-xl font-bold sm:text-2xl"
            style={{ color: "var(--color-blue)" }}
          >
            {place.name}
          </h3>
          
          {address && (
            <div className="mb-3 flex items-start gap-2">
              <FaMapMarkerAlt 
                className="mt-1 h-4 w-4 flex-shrink-0" 
                style={{ color: "var(--color-blue-light)" }} 
              />
              <span 
                className="text-sm sm:text-base"
                style={{ color: "var(--color-blue)" }}
              >
                {address}
              </span>
            </div>
          )}
          {description && (
            <p 
              className="mb-4 whitespace-pre-line text-sm leading-relaxed sm:text-base"
              style={{ color: "var(--color-blue)" }}
            >
              {description}
            </p>
          )}
          {phone && (
            <div className="mt-4 flex items-center gap-2">
              <FaPhoneAlt 
                className="h-4 w-4" 
                style={{ color: "var(--color-blue-light)" }} 
              />
              <span 
                className="text-sm sm:text-base font-medium select-text"
                style={{ color: "var(--color-blue)" }}
              >
                {phone}
              </span>
            </div>
          )}
          
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 font-semibold shadow animate-bubble-in transition-all duration-200 hover:scale-102"
              style={{ 
                backgroundColor: "var(--color-blue)", 
                color: "var(--color-bone)" 
              }}
              onClick={handleAgendar}
            >
              Agendar
            </button>
            <button
              type="button"
              onClick={handleVisit}
              className="inline-flex items-center justify-center gap-2 rounded-xl border-3 px-4 py-2 font-semibold shadow-sm transition-all duration-200 animate-bubble-in hover:scale-102"
              style={{ 
                borderColor: "var(--color-green-dark)", 
                backgroundColor: "var(--color-green)", 
                color: "var(--color-blue-dark)" 
              }}
            >
              <FaMapMarkerAlt className="h-4 w-4" />
              <span>Visitar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}