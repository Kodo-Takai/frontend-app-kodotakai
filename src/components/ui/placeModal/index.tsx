import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import type { EnrichedPlace, Place } from "../../../hooks/places";
import { FaStar, FaPhoneAlt, FaMapMarkerAlt, FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useAgenda } from "../../../hooks/useAgenda";

export type PlaceModalProps = {
  isOpen: boolean;
  onClose: () => void;
  place: (Place | EnrichedPlace) | null;
  maxImages?: number; // Límite de imágenes a mostrar (por defecto 10)
  /**
   * Nuevo prop: si se proporciona, se llama con el place cuando el usuario
   * pulsa "Visitar". El padre puede usar esto para iniciar la navegación.
   */
  onVisit?: (place: Place | EnrichedPlace) => void;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

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

  const mapsUrl = useMemo(() => {
    if (!place) return undefined;
    if (place.place_id) return `https://www.google.com/maps/place/?q=place_id:${place.place_id}`;
    return undefined;
  }, [place]);

  const phone = useMemo(() => {
    if (!place) return undefined;
    const enriched = place as EnrichedPlace;
    return enriched.formatted_phone_number || enriched.contact_info?.phone;
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

  if (!isOpen || !place) return null;

  const description = (place as EnrichedPlace).editorial_summary?.overview;
  const address = (place as EnrichedPlace).formatted_address || place.vicinity;
  const stop = (e: React.MouseEvent) => e.stopPropagation();

  // Nuevo handler local para el botón "Visitar"
  const handleVisitClick = () => {
    if (!place) return;
    // Si el padre nos dio un onVisit, llamarlo para que inicie la navegación en el mapa
    if (onVisit) {
      onVisit(place);
      onClose();
      return;
    }
    // Si no hay onVisit, abrir google maps en nueva pestaña como fallback
    if (mapsUrl) {
      window.open(mapsUrl, "_blank", "noopener,noreferrer");
      onClose();
    } else {
      // Si no hay mapsUrl, simplemente no hacer nada (o podrías mostrar un toast)
      alert("No hay una ubicación disponible para abrir en Google Maps.");
    }
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center backdrop-blur-sm overflow-y-auto"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
      onClick={onClose}
      aria-modal
      role="dialog"
    >
      <div
        className="relative w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl my-8"
        style={{ backgroundColor: 'var(--color-bone)' }}
        onClick={stop}
      >
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full shadow"
          style={{ 
            backgroundColor: 'var(--color-bone)',
            color: 'var(--color-blue)'
          }}
        >
          <FaTimes className="h-4 w-4" />
        </button>

        {/* Carrusel de imágenes */}
        <div className="relative h-56 w-full overflow-hidden sm:h-64 group">
          <img
            src={images[currentImageIndex]}
            alt={`${place.name} - Imagen ${currentImageIndex + 1}`}
            className="h-full w-full object-cover transition-opacity duration-300"
            loading="lazy"
          />

          {typeof place.rating === "number" && (
            <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full px-3 py-1" style={{ backgroundColor: 'var(--color-blue)', color: 'var(--color-bone)' }}>
              <FaStar className="h-4 w-4" style={{ color: 'var(--color-green)' }} />
              <span className="text-sm font-semibold">{place.rating.toFixed(1)}</span>
            </div>
          )}

          {images.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 text-gray-800 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white flex items-center justify-center"
                aria-label="Imagen anterior"
              >
                <FaChevronLeft className="h-4 w-4" />
              </button>

              <button
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 text-gray-800 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white flex items-center justify-center"
                aria-label="Imagen siguiente"
              >
                <FaChevronRight className="h-4 w-4" />
              </button>

              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      index === currentImageIndex ? "w-6 bg-white" : "w-1.5 bg-white/60 hover:bg-white/80"
                    }`}
                    aria-label={`Ir a imagen ${index + 1}`}
                  />
                ))}
              </div>

              <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
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
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                  index === currentImageIndex ? "border-[#00324A] scale-105" : "border-gray-200 opacity-60 hover:opacity-100"
                }`}
              >
                <img src={img} alt={`Miniatura ${index + 1}`} className="w-full h-full object-cover" loading="lazy" />
              </button>
            ))}
          </div>
        )}

        <div className="p-4 sm:p-6">
          <h3 className="mb-1 text-xl font-bold sm:text-2xl" style={{ color: 'var(--color-blue)' }}>{place.name}</h3>

          {address && (
            <div className="mb-3 flex items-start gap-2" style={{ color: 'var(--color-blue)' }}>
              <FaMapMarkerAlt className="mt-1 h-4 w-4 flex-shrink-0" style={{ color: 'var(--color-blue-light)' }} />
              <span className="text-sm sm:text-base">{address}</span>
            </div>
          )}

          {description && (
            <p className="mb-4 whitespace-pre-line text-sm leading-relaxed text-gray-700 sm:text-base">
              {description}
            </p>
          )}

          {phone && (
            <div className="mt-4 flex items-center gap-2 text-gray-800">
              <FaPhoneAlt className="h-4 w-4 text-gray-500" />
              <span className="text-sm sm:text-base font-medium select-text">{phone}</span>
            </div>
          )}

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-2 font-semibold text-white shadow hover:bg-black"
              onClick={handleAgendar}
            >
              Agendar
            </button>

            {/* Aqui: llamamos a onVisit si viene del padre; si no, abrimos mapsUrl */}
            <button
              type="button"
              onClick={handleVisitClick}
              disabled={!mapsUrl && !onVisit}
              className={`inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 font-semibold text-gray-800 shadow-sm transition hover:bg-gray-200 ${
                (!mapsUrl && !onVisit) ? "cursor-not-allowed opacity-50" : ""
              }`}
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
