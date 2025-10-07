// src/components/ui/placeModal/index.tsx
import { useEffect } from "react"; // Solo para eventos DOM
import { MdClose, MdEvent } from "react-icons/md";
import { FaStar } from "react-icons/fa";
import { TbLocationFilled } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import type { EnrichedPlace } from "../../../hooks/places/types";

interface PlaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  place: EnrichedPlace | null; 
}

export default function PlaceModal({
  isOpen,
  onClose,
  place,
}: PlaceModalProps) {
  const navigate = useNavigate();
  
  // ✅ Solo manejo de eventos DOM (no hooks de datos)
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

  // ✅ Renderizado del modal usando los datos recibidos
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header con imagen */}
        <div className="relative h-64 w-full">
          <img
            src={place.photo_url} // ✅ Datos del prop
            alt={place.name}      // ✅ Datos del prop
            className="w-full h-full object-cover"
          />
          
          {/* Botón cerrar */}
          <button onClick={onClose} className="absolute top-4 right-4 bg-white/90 hover:bg-white rounded-full p-2">
            <MdClose className="w-6 h-6 text-gray-700" />
          </button>

          {/* Rating badge */}
          {typeof place.rating === "number" && (
            <div className="absolute top-4 left-4">
              <div className="flex items-center gap-1 bg-white/95 px-3 py-1.5 rounded-full shadow-lg">
                <FaStar className="w-4 h-4 text-[#FF0C12]" />
                <span className="text-sm font-bold text-gray-800">
                  {place.rating.toFixed(1)} {/* ✅ Datos del prop */}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-4">
          {/* Descripción */}
          {place.editorial_summary?.overview && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Descripción</h3>
              <p className="text-sm text-gray-600">{place.editorial_summary.overview}</p>
            </div>
          )}

          {/* Sitio web */}
          {place.website && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Sitio web</h3>
              <a href={place.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                {place.website}
              </a>
            </div>
          )}

          {/* Teléfono */}
          {place.formatted_phone_number && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Teléfono</h3>
              <p className="text-sm text-gray-600">{place.formatted_phone_number}</p>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex gap-3">
            {/* Botón Agendar - Sin funcionalidad por ahora */}
            <button
              onClick={() => {
                // TODO: Implementar funcionalidad de agendar
                console.log("Funcionalidad de agendar - Próximamente");
                alert("Funcionalidad de agendar estará disponible próximamente");
              }}
              className="flex-1 bg-[#FF0C12] hover:bg-[#E00B10] text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-300 flex items-center justify-center gap-2"
            >
              <MdEvent className="w-5 h-5" />
              Agendar
            </button>

            {/* Botón Visitar - Navega a Maps con ubicación */}
            {place.location && (
              <button
                onClick={() => {
                  // Navegar a Maps con los datos del lugar
                  const placeData = {
                    name: place.name,
                    location: place.location,
                    place_id: place.place_id,
                    rating: place.rating,
                    photo_url: place.photo_url,
                    formatted_address: place.formatted_address,
                    website: place.website,
                    formatted_phone_number: place.formatted_phone_number,
                  };
                  
                  // Navegar a Maps pasando los datos del lugar
                  navigate('/maps', { 
                    state: { 
                      selectedPlace: placeData,
                      searchQuery: place.name 
                    } 
                  });
                }}
                className="flex-1 bg-[#00324A] hover:bg-[#004060] text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-300 flex items-center justify-center gap-2"
              >
                <TbLocationFilled className="w-5 h-5" />
                Visitar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}