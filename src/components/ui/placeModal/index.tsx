// src/components/modals/PlaceModal.tsx
import { useEffect } from "react";
import { MdClose, MdPlace, MdPhone, MdLanguage, MdAccessTime } from "react-icons/md";
import { FaStar, FaMapMarkerAlt, FaWifi, FaParking, FaSwimmingPool, FaDumbbell, FaSpa, FaUtensils, FaDog, FaWheelchair } from "react-icons/fa";
import { TbLocationFilled } from "react-icons/tb";
import type { EnrichedPlace } from "../../../hooks/places/types";

interface PlaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  place: EnrichedPlace | null;
  onVisit?: (place: EnrichedPlace) => void;
}

export default function PlaceModal({
  isOpen,
  onClose,
  place,
  onVisit,
}: PlaceModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";

      // Cargar información adicional del hotel si está disponible
      if (place) {
        console.log("Cargando información del hotel:", place);
        // Aquí puedes agregar lógica para cargar datos adicionales si es necesario
      }
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose, place]);

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

  // Renderizar precio
  const renderPriceLevel = () => {
    if (!place.price_info) return null;

    return (
      <div className="flex items-center gap-2">
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${place.price_info.color}`}
        >
          {place.price_info.symbol} {place.price_info.description}
        </span>
      </div>
    );
  };

  // Renderizar amenidades de hospedaje
  const renderLodgingAmenities = () => {
    if (!place.lodging_info) return null;

    const amenities = [
      { icon: FaWifi, label: "WiFi", value: place.lodging_info.wifi_available },
      { icon: FaParking, label: "Estacionamiento", value: place.lodging_info.parking_available },
      { icon: FaSwimmingPool, label: "Piscina", value: place.lodging_info.pool_available },
      { icon: FaDumbbell, label: "Gimnasio", value: place.lodging_info.gym_available },
      { icon: FaSpa, label: "Spa", value: place.lodging_info.spa_available },
      { icon: FaUtensils, label: "Restaurante", value: place.lodging_info.restaurant_available },
      { icon: FaDog, label: "Pet Friendly", value: place.lodging_info.pet_friendly },
    ].filter(amenity => amenity.value === true);

    if (amenities.length === 0) return null;

    return (
      <div className="mb-4">
        <p className="text-sm font-semibold text-gray-700 mb-2">Amenidades</p>
        <div className="flex flex-wrap gap-2">
          {amenities.map((amenity, index) => (
            <div
              key={index}
              className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-xs font-medium"
            >
              <amenity.icon className="w-3.5 h-3.5" />
              {amenity.label}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Renderizar servicios adicionales
  const renderAdditionalServices = () => {
    if (!place.lodging_info) return null;

    const services = [
      { label: "Servicio a la habitación", value: place.lodging_info.room_service },
      { label: "Servicio de lavandería", value: place.lodging_info.laundry_service },
      { label: "Conserje", value: place.lodging_info.concierge },
      { label: "Valet parking", value: place.lodging_info.valet_parking },
      { label: "Shuttle al aeropuerto", value: place.lodging_info.airport_shuttle },
      { label: "Centro de negocios", value: place.lodging_info.business_center },
      { label: "Salas de conferencias", value: place.lodging_info.conference_rooms },
    ].filter(service => service.value === true);

    if (services.length === 0) return null;

    return (
      <div className="mb-4">
        <p className="text-sm font-semibold text-gray-700 mb-2">Servicios</p>
        <ul className="grid grid-cols-2 gap-2">
          {services.map((service, index) => (
            <li key={index} className="flex items-center gap-2 text-xs text-gray-600">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
              {service.label}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  // Renderizar horarios de check-in/check-out
  const renderCheckInOut = () => {
    if (!place.lodging_info?.check_in_time && !place.lodging_info?.check_out_time) {
      return null;
    }

    return (
      <div className="flex items-start gap-3 mb-4">
        <MdAccessTime className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-1">
            Horarios
          </p>
          <div className="space-y-1">
            {place.lodging_info.check_in_time && (
              <p className="text-sm text-gray-600">
                Check-in: {place.lodging_info.check_in_time}
              </p>
            )}
            {place.lodging_info.check_out_time && (
              <p className="text-sm text-gray-600">
                Check-out: {place.lodging_info.check_out_time}
              </p>
            )}
          </div>
        </div>
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

          {/* Estado abierto/cerrado - solo si está disponible */}
          {place.is_open_now !== undefined && (
            <div className="absolute bottom-4 left-4">
              <span
                className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg ${
                  place.is_open_now
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                }`}
              >
                {place.is_open_now ? "● Abierto ahora" : "● Cerrado"}
              </span>
            </div>
          )}
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-4">
          {/* Descripción del lugar */}
          {place.editorial_summary?.overview && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Descripción</h3>
              <p className="text-sm text-gray-600">{place.editorial_summary.overview}</p>
            </div>
          )}

          {/* Página web */}
          {place.website && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Sitio web</h3>
              <a
                href={place.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm"
              >
                {place.website}
              </a>
            </div>
          )}

          {/* Información de contacto */}
          {place.formatted_phone_number && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Teléfono</h3>
              <p className="text-sm text-gray-600">{place.formatted_phone_number}</p>
            </div>
          )}

          {/* Rating con estrellas y nivel de precio */}
          <div className="flex items-center gap-4 mb-4">
            {place.rating && renderStars(place.rating)}
            {renderPriceLevel()}
          </div>

          {/* Accesibilidad */}
          {(place.wheelchair_accessible || place.wheelchair_accessible_entrance) && (
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                <FaWheelchair className="w-3.5 h-3.5 mr-1.5" />
                Accesible para sillas de ruedas
              </span>
            </div>
          )}

          {/* Características especiales (vino, desayuno) */}
          {(place.serves_wine || place.serves_breakfast) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {place.serves_wine && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
                  🍷 Sirve vino
                </span>
              )}
              {place.serves_breakfast && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800">
                  🍳 Sirve desayuno
                </span>
              )}
            </div>
          )}

          {/* Amenidades y servicios de hospedaje */}
          {renderLodgingAmenities()}
          {renderAdditionalServices()}

          {/* Horarios de check-in/check-out */}
          {renderCheckInOut()}

          {/* Información de contacto y ubicación */}
          <div className="space-y-3 mb-6">
            {/* Dirección */}
            {(place.formatted_address || place.vicinity) && (
              <div className="flex items-start gap-3">
                <MdPlace className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">
                    Dirección
                  </p>
                  <p className="text-sm text-gray-600">
                    {place.formatted_address || place.vicinity}
                  </p>
                </div>
              </div>
            )}

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
                    className="text-sm text-blue-600 hover:underline break-all"
                  >
                    Visitar sitio web
                  </a>
                </div>
              </div>
            )}

            {/* Horarios de operación */}
            {place.opening_hours_detailed?.weekday_text && 
             place.opening_hours_detailed.weekday_text.length > 0 && (
              <div className="flex items-start gap-3">
                <MdAccessTime className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    Horarios de operación
                  </p>
                  <div className="space-y-1">
                    {place.opening_hours_detailed.weekday_text.map((text, i) => (
                      <p key={i} className="text-xs text-gray-600">
                        {text}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Reviews destacadas */}
          {place.reviews && place.reviews.length > 0 && (
            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-700 mb-3">
                Reseñas recientes
              </p>
              <div className="space-y-3">
                {place.reviews.slice(0, 2).map((review, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-800">
                        {review.author_name}
                      </span>
                      <div className="flex items-center gap-1">
                        <FaStar className="w-3 h-3 text-[#FF0C12]" />
                        <span className="text-xs text-gray-600">
                          {review.rating}/5
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-3">
                      {review.text}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {review.relative_time_description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

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
                href={
                  place.google_maps_url ||
                  `https://www.google.com/maps/search/?api=1&query=${place.location.lat},${place.location.lng}&query_place_id=${place.place_id}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-white hover:bg-gray-50 text-[#00324A] font-semibold py-3 px-6 rounded-xl transition-colors duration-300 flex items-center justify-center gap-2 border-2 border-[#00324A]"
              >
                <FaMapMarkerAlt className="w-4 h-4" />
                Ver en Maps
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}