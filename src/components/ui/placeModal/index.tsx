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
};

export default function PlaceModal({ isOpen, onClose, place, maxImages = 5 }: PlaceModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { addItem } = useAgenda();

  useEffect(() => {
    if (!isOpen) return;

    // Resetear el índice de imagen cuando se abre el modal
    setCurrentImageIndex(0);

    // Prevenir scroll del body cuando el modal está abierto
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

  // Procesar todas las imágenes disponibles
  const images = useMemo(() => {
    if (!place) return [];

    const imageList: string[] = [];

    // Intentar obtener múltiples fotos del lugar enriquecido
    const enriched = place as any;
    if (enriched.photos && Array.isArray(enriched.photos)) {
      enriched.photos.forEach((photo: any) => {
        const url = photo.getUrl ? photo.getUrl() : photo.photo_url || photo;
        if (url) imageList.push(url);
      });
    }

    // Si hay photo_url principal, agregarlo si no está en la lista
    if (place.photo_url && !imageList.includes(place.photo_url)) {
      imageList.unshift(place.photo_url);
    }

    // Si no hay imágenes, usar placeholder
    if (imageList.length === 0) {
      imageList.push("https://picsum.photos/800/450?random=place-modal-fallback");
    }

    // Limitar el número de imágenes
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

    // Crear el item de agenda
    const agendaItem = {
      destinationId: place.place_id || place.id || `place_${Date.now()}`,
      destinationName: place.name,
      location: (place as EnrichedPlace).formatted_address || place.vicinity || 'Ubicación no disponible',
      scheduledDate: new Date().toISOString(), // Fecha actual como string ISO
      scheduledTime: new Date().toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      status: 'pending' as const,
      category: 'restaurant' as const, // Por defecto, se puede mejorar después
      image: place.photo_url || images[0] || 'https://picsum.photos/400/300?random=agenda',
      description: (place as EnrichedPlace).editorial_summary?.overview || `Visita a ${place.name}`,
    };

    // Agregar a la agenda
    addItem(agendaItem);
    
    // Cerrar el modal
    onClose();
    
    // Mostrar confirmación (opcional)
    alert(`¡${place.name} ha sido agregado a tu agenda!`);
  };

  if (!isOpen || !place) return null;

  const description = (place as EnrichedPlace).editorial_summary?.overview;
  const address = (place as EnrichedPlace).formatted_address || place.vicinity;

  const stop = (e: React.MouseEvent) => e.stopPropagation();

  const modalContent = (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
      aria-modal
      role="dialog"
    >
      <div
        className="relative w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-xl my-8"
        onClick={stop}
      >
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow hover:bg-white"
        >
          <FaTimes className="h-4 w-4" />
        </button>

        {/* Carrusel de imágenes */}
        <div className="relative h-56 w-full overflow-hidden sm:h-64 group">
          {/* Imagen actual */}
          <img
            src={images[currentImageIndex]}
            alt={`${place.name} - Imagen ${currentImageIndex + 1}`}
            className="h-full w-full object-cover transition-opacity duration-300"
            loading="lazy"
          />

          {/* Rating badge */}
          {typeof place.rating === "number" && (
            <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-[#00324A] px-3 py-1 text-white">
              <FaStar className="h-4 w-4 text-[#FF0C12]" />
              <span className="text-sm font-semibold">{place.rating.toFixed(1)}</span>
            </div>
          )}

          {/* Controles del carrusel - solo si hay más de 1 imagen */}
          {images.length > 1 && (
            <>
              {/* Botón anterior */}
              <button
                onClick={handlePrevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 text-gray-800 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white flex items-center justify-center"
                aria-label="Imagen anterior"
              >
                <FaChevronLeft className="h-4 w-4" />
              </button>

              {/* Botón siguiente */}
              <button
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 text-gray-800 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white flex items-center justify-center"
                aria-label="Imagen siguiente"
              >
                <FaChevronRight className="h-4 w-4" />
              </button>

              {/* Indicadores de puntos */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      index === currentImageIndex
                        ? "w-6 bg-white"
                        : "w-1.5 bg-white/60 hover:bg-white/80"
                    }`}
                    aria-label={`Ir a imagen ${index + 1}`}
                  />
                ))}
              </div>

              {/* Contador de imágenes */}
              <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                {currentImageIndex + 1} / {images.length}
              </div>
            </>
          )}
        </div>

        {/* Miniaturas de imágenes - solo si hay más de 1 imagen */}
        {images.length > 1 && (
          <div className="px-4 pt-3 pb-2 flex gap-2 overflow-x-auto scrollbar-hide">
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                  index === currentImageIndex
                    ? "border-[#00324A] scale-105"
                    : "border-gray-200 opacity-60 hover:opacity-100"
                }`}
              >
                <img
                  src={img}
                  alt={`Miniatura ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        )}

        <div className="p-4 sm:p-6">
          <h3 className="mb-1 text-xl font-bold text-gray-900 sm:text-2xl">{place.name}</h3>

          {address && (
            <div className="mb-3 flex items-start gap-2 text-gray-700">
              <FaMapMarkerAlt className="mt-1 h-4 w-4 flex-shrink-0 text-gray-500" />
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

            {mapsUrl ? (
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 font-semibold text-gray-800 shadow-sm transition hover:bg-gray-200"
              >
                <FaMapMarkerAlt className="h-4 w-4" />
                <span>Visitar</span>
              </a>
            ) : (
              <button
                type="button"
                disabled
                className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-100 px-4 py-2 font-semibold text-gray-400"
              >
                <FaMapMarkerAlt className="h-4 w-4" />
                <span>Visitar</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Renderizar el modal usando un portal para que esté fuera del contenedor animado
  return createPortal(modalContent, document.body);
}