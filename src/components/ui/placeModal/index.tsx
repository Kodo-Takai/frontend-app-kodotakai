// src/components/modals/PlaceModal.tsx
import { useEffect } from "react";
import { MdClose, MdPlace, MdPhone, MdLanguage } from "react-icons/md";
import { FaStar, FaMapMarkerAlt } from "react-icons/fa";
import { TbLocationFilled } from "react-icons/tb";
import "./index.scss";

interface Place {
  name: string;
  rating?: number;
  vicinity?: string;
  place_id: string;
  photo_url: string;
  location?: { lat: number; lng: number };
  formatted_address?: string;
  formatted_phone_number?: string;
  website?: string;
  opening_hours?: {
    open_now?: boolean;
    weekday_text?: string[];
  };
}

interface PlaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  place: Place | null;
  onVisit?: (place: Place) => void;
}

export default function PlaceModal({
  isOpen,
  onClose,
  place,
  onVisit,
}: PlaceModalProps) {
  // Cerrar modal con tecla Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !place) return null;

  // Renderizar estrellas
  const renderStars = (rating?: number) => {
    if (!rating) return null;

    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }, (_, i) => (
          <FaStar
            key={`star-${i}`}
            className={`w-4 h-4 ${
              i < fullStars
                ? "text-[#FF0C12]"
                : i === fullStars && hasHalfStar
                ? "text-[#FF0C12] opacity-50"
                : "text-gray-300"
            }`}
          />
        ))}
        <span className="text-gray-700 text-sm font-semibold ml-2">
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };

  const handleVisitClick = () => {
    if (onVisit) {
      onVisit(place);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-slideUp">
        {/* Header con imagen */}
        <div className="relative h-64 w-full">
          <img
            src={place.photo_url}
            alt={place.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {/* Botón cerrar */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/90 hover:bg-white rounded-full p-2 transition-colors duration-200 shadow-lg"
            aria-label="Cerrar modal"
          >
            <MdClose className="w-6 h-6 text-gray-700" />
          </button>

          {/* Rating badge */}
          {typeof place.rating === "number" && (
            <div className="absolute top-4 left-4">
              <div className="flex items-center gap-1 bg-white/95 px-3 py-1.5 rounded-full shadow-lg">
                <FaStar className="w-4 h-4 text-[#FF0C12]" />
                <span className="text-sm font-bold text-gray-800">
                  {place.rating.toFixed(1)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Contenido */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-16rem)]">
          {/* Título */}
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            {place.name}
          </h2>

          {/* Rating con estrellas */}
          {place.rating && (
            <div className="mb-4">{renderStars(place.rating)}</div>
          )}

          {/* Información de contacto y ubicación */}
          <div className="space-y-3 mb-6">
            {/* Dirección */}
            <div className="flex items-start gap-3">
              <MdPlace className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-1">
                  Dirección
                </p>
                <p className="text-sm text-gray-600">
                  {place.formatted_address || place.vicinity || "No disponible"}
                </p>
              </div>
            </div>

            {/* Teléfono */}
            {place.formatted_phone_number && (
              <div className="flex items-start gap-3">
                <MdPhone className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">
                    Teléfono
                  </p>
                  <a
                    href={`tel:${place.formatted_phone_number}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {place.formatted_phone_number}
                  </a>
                </div>
              </div>
            )}

            {/* Sitio web */}
            {place.website && (
              <div className="flex items-start gap-3">
                <MdLanguage className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">
                    Sitio web
                  </p>
                  <a
                    href={place.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Visitar sitio web
                  </a>
                </div>
              </div>
            )}

            {/* Horarios */}
            {place.opening_hours?.weekday_text && (
              <div className="flex items-start gap-3">
                <MdPlace className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    Horarios
                  </p>
                  <div className="space-y-1">
                    {place.opening_hours.weekday_text.map((text, i) => (
                      <p key={i} className="text-xs text-gray-600">
                        {text}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Estado abierto/cerrado */}
            {place.opening_hours?.open_now !== undefined && (
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                    place.opening_hours.open_now
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {place.opening_hours.open_now ? "Abierto ahora" : "Cerrado"}
                </span>
              </div>
            )}
          </div>

          {/* Botones de acción */}
          <div className="flex gap-3">
            <button
              onClick={handleVisitClick}
              className="flex-1 bg-[#00324A] hover:bg-[#004060] text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-300 flex items-center justify-center gap-2"
            >
              <TbLocationFilled className="w-5 h-5" />
              Cómo llegar
            </button>

            {place.location && (
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${place.location.lat},${place.location.lng}&query_place_id=${place.place_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-white hover:bg-gray-50 text-[#00324A] font-semibold py-3 px-6 rounded-xl transition-colors duration-300 flex items-center justify-center gap-2 border-2 border-[#00324A]"
              >
                <FaMapMarkerAlt className="w-4 h-4" />
                Ver en Google Maps
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}