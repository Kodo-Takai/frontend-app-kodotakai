import { useEffect, useMemo } from "react";
import type { EnrichedPlace, Place } from "../../../hooks/places";
import { FaStar, FaPhoneAlt, FaMapMarkerAlt, FaTimes } from "react-icons/fa";

export type PlaceModalProps = {
  isOpen: boolean;
  onClose: () => void;
  place: (Place | EnrichedPlace) | null;
};

export default function PlaceModal({ isOpen, onClose, place }: PlaceModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  const photoUrl = useMemo(() => {
    if (!place) return "https://picsum.photos/800/450?random=place-modal";
    return place.photo_url || "https://picsum.photos/800/450?random=place-modal-fallback";
  }, [place]);

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

  if (!isOpen || !place) return null;

  const description = (place as EnrichedPlace).editorial_summary?.overview;
  const address = (place as EnrichedPlace).formatted_address || place.vicinity;

  const stop = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
      aria-modal
      role="dialog"
    >
      <div
        className="relative w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-xl"
        onClick={stop}
      >
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow hover:bg-white"
        >
          <FaTimes className="h-4 w-4" />
        </button>

        <div className="relative h-56 w-full overflow-hidden sm:h-64">
          <img
            src={photoUrl}
            alt={place.name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
          {typeof place.rating === "number" && (
            <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-[#00324A] px-3 py-1 text-white">
              <FaStar className="h-4 w-4 text-[#FF0C12]" />
              <span className="text-sm font-semibold">{place.rating.toFixed(1)}</span>
            </div>
          )}
        </div>

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
              onClick={() => { /* por ahora sin funcionalidad */ }}
            >
              Agendar
            </button>

            {mapsUrl ? (
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 font-semibold text-gray-800 shadow-sm transition hover:bg-gray-50"
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
}