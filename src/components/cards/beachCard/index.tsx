import { useState } from "react";
import { FaStar, FaMapMarkerAlt } from "react-icons/fa";
import { MdPlace } from "react-icons/md";
import { TbLocationFilled } from "react-icons/tb";
import { usePlaces, type EnrichedPlace } from "../../../hooks/places";
import PlaceModal from "../../ui/placeModal";
import "./index.scss";

// --- IMPORTACIONES PARA NAVEGACIÓN Y AGENDA ---
import { useNavigate } from "react-router-dom";
import { useNavigationContext } from "../../../context/navigationContext";
import { useAgenda } from "../../../hooks/useAgenda";

// Extender EnrichedPlace para mayor consistencia
interface Beach extends EnrichedPlace {}

export default function BeachCards() {
  const { places: beaches, loading } = usePlaces({
    category: "beaches",
    enableEnrichment: true,
    maxResults: 6,
  });

  // --- ESTADO Y HOOKS EN EL COMPONENTE PADRE ---
  const { setInitialDestination } = useNavigationContext();
  const navigate = useNavigate();
  const { addItem } = useAgenda(); // Asumo que necesitas esto para la opción 'Agendar'

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<Beach | null>(null);

  const handleOpenModal = (beach: Beach) => {
    setSelectedPlace(beach);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPlace(null);
  };

  const handleNavigation = (beach: Beach) => {
    setInitialDestination(beach);
    navigate('/maps');
  };

  const displayedBeaches = beaches.slice(0, 6);

  const BeachCard = ({ beach }: { beach: Beach }) => {
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [imageError, setImageError] = useState(false);

    const getProcessedPhotos = () => {
      if (!beach.photos || beach.photos.length === 0) {
        return [];
      }

      // Asegúrate de que las fotos tengan el formato correcto
      return beach.photos.slice(0, 3).map((photo: any) => { // Uso 'any' temporalmente si la inferencia es compleja
        if (typeof photo === "object" && "getUrl" in photo) {
          return {
            photo_url: photo.getUrl({ maxWidth: 400, maxHeight: 300 }),
          };
        }
        return {
          photo_url: photo.photo_url || beach.photo_url,
        };
      });
    };

    const processedPhotos = getProcessedPhotos();

    const nextPhoto = (e: React.MouseEvent) => {
      e.stopPropagation(); // Evita que se propague el clic al div principal
      if (processedPhotos.length > 0) {
        setCurrentPhotoIndex((prev) => (prev + 1) % processedPhotos.length);
      }
    };

    const prevPhoto = (e: React.MouseEvent) => {
      e.stopPropagation(); // Evita que se propague el clic al div principal
      if (processedPhotos.length > 0) {
        setCurrentPhotoIndex((prev) =>
          prev === 0 ? processedPhotos.length - 1 : prev - 1
        );
      }
    };

    const handleImageError = () => setImageError(true);


    const handleAgendarFromMenu = (e: React.MouseEvent) => {
      e.stopPropagation(); // Evita que se cierre el menú o abra el modal subyacente
      setMenuOpen(false); // Cierra el menú
      // Aquí va tu lógica existente para agendar, que ya funciona bien.
      const agendaItem = { 
        id: beach.place_id, 
        name: beach.name, 
        vicinity: beach.vicinity, 
        latitude: beach.geometry?.location.lat, 
        longitude: beach.geometry?.location.lng 
      };
      addItem(agendaItem);
      alert(`¡${beach.name} ha sido agregado a tu agenda!`);
    };

    const renderStars = (rating?: number) => {
      if (!rating) return null;

      const fullStars = Math.floor(rating);
      const stars = Array.from({ length: 5 }, (_, i) => (
        <FaStar
          key={`beach-star-${i}`}
          className="w-3 h-3"
          style={{
            color: i < fullStars ? "var(--color-green)" : "var(--color-bone)",
          }}
        />
      ));

      return (
        <div className="flex items-center gap-1">
          {stars}
          <span className="text-gray-600 text-xs font-semibold ml-1">
            {rating.toFixed(1)}
          </span>
        </div>
      );
    };

    return (
      // Clic en la tarjeta abre el modal
      <div 
        className="beach-card-width shadow-sm"
        onClick={() => handleOpenModal(beach)}
      >
        <div className="beach-card-container">
          <div className="beach-card-header">
            <div className="beach-card-title-section">
              <div className="beach-card-experience-text">
              <img
                    src="/icons/playas_icons/beach.svg"
                    alt="Compass"
                    width="30"
                    height="30"
                    className="beach-card-compass-icon"
                  />
              </div>

              <div className="beach-card-name-section">
                <div className="beach-card-experience-label">
                  EXPERIMENTA NUEVAS PLAYAS
                </div>
                <h3 className="beach-card-beach-name">{beach.name}</h3>
              </div>
            </div>

            <div className="beach-card-description-row">
              <MdPlace className="w-3 h-3 text-gray-400 flex-shrink-0" />
              <span className="line-clamp-2">
                {beach.vicinity || "Descubre esta increíble playa y vive una experiencia única en la costa colombiana"}
              </span>
            </div>
          </div>

          <div className="beach-card-image-section">
            
            {/* Carrusel de imágenes */}
            <button
              onClick={prevPhoto}
              disabled={processedPhotos.length <= 1}
              className="beach-card-nav-button"
            >
                <img
                  src="/icons/Arrow-Left-Black.svg"
                  alt="Anterior"
                  width="18"
                  height="18"
                  className="beach-card-arrow-icon"
                />
            </button>

            <div className="beach-card-image-container">
              {processedPhotos.map((photo, index) => {
                const getImagePosition = (photoIndex: number) => {
                  const totalPhotos = processedPhotos.length;
                  const relativePosition =
                    (photoIndex - currentPhotoIndex + totalPhotos) %
                    totalPhotos;

                  switch (relativePosition) {
                    case 0:
                      return {
                        position: "center",
                        transform: "translateX(0) rotate(0deg)",
                        zIndex: 3,
                        hasBorder: true,
                      };
                    case 1:
                      return {
                        position: "right",
                        transform: "translateX(50px) rotate(10deg)",
                        zIndex: 1,
                        hasBorder: false,
                      };
                    case 2:
                      return {
                        position: "left",
                        transform: "translateX(-50px) rotate(-10deg)",
                        zIndex: 2,
                        hasBorder: false,
                      };
                    default:
                      return {
                        position: "hidden",
                        transform: "translateX(0) rotate(0deg)",
                        zIndex: 0,
                        hasBorder: false,
                      };
                  }
                };

                const imageStyle = getImagePosition(index);

                if (imageStyle.position === "hidden") return null;

                return (
                  <img
                    key={`${beach.name}-${index}`}
                    src={
                      imageError
                        ? "https://picsum.photos/97/114?random=error"
                        : photo.photo_url ||
                          "https://picsum.photos/97/114?random=beach-default"
                    }
                    alt={beach.name}
                    className={`beach-card-image ${
                      imageStyle.hasBorder
                        ? "beach-card-image-main"
                        : "beach-card-image-back"
                    }`}
                    style={{
                      transform: imageStyle.transform,
                      zIndex: imageStyle.zIndex,
                    }}
                    loading="lazy"
                    onError={handleImageError}
                    onClick={(e) => { 
                      e.stopPropagation(); // Evita que se abra el modal
                      setCurrentPhotoIndex(index); 
                    }}
                  />
                );
              })}
            </div>

            <button
              onClick={nextPhoto}
              disabled={processedPhotos.length <= 1}
              className="beach-card-nav-button"
            >
                <img
                  src="/icons/Arrow-Right-Black.svg"
                  alt="Siguiente"
                  width="18"
                  height="18"
                  className="beach-card-arrow-icon"
                />
            </button>
          </div>

          <div className="beach-card-footer">
            <div className="beach-card-rating-display">
              {renderStars(beach.rating)}
            </div>

            <div className="beach-card-indicators">
              {processedPhotos.map((_, index) => (
                <button
                  key={index}
                  className={`beach-card-indicator ${
                    index === currentPhotoIndex ? "active" : ""
                  }`}
                  onClick={(e) => { 
                    e.stopPropagation(); // Evita que se abra el modal
                    setCurrentPhotoIndex(index); 
                  }}
                />
              ))}
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation(); // Evita que el clic se propague al div principal
                handleOpenModal(beach); // Este botón abre el modal
              }}
              className="beach-card-visit-button"
            >
              Visitar <TbLocationFilled className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="beach-scroll">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={`beach-skeleton-${i}`} className="beach-card-width-skeleton">
              <div className="rounded-xl overflow-hidden shadow-lg animate-pulse">
                <div className="h-72 bg-[var(--color-blue-light)]" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (!displayedBeaches.length) {
      return (
        <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center mx-6">
          <div className="text-gray-400 mb-3">
            <FaMapMarkerAlt className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No hay playas disponibles
          </h3>
          <p className="text-gray-600 text-sm">
            No encontramos playas cercanas en este momento.
          </p>
        </div>
      );
    }

    return (
      <div className="beach-scroll">
        {displayedBeaches.map((beach) => (
          <BeachCard key={beach.place_id || beach.id} beach={beach as Beach} />
        ))}
      </div>
    );
  };

  return (
    <div className="w-full mb-3">
      <h2 className="text-lg font-extrabold mb-2 text-[var(--color-text-primary)]">
        Visita estas Playas
      </h2>
      {renderContent()}

      {/* El Modal vive aquí, una sola vez, y se conecta a la navegación */}
      {selectedPlace && (
        <PlaceModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          place={selectedPlace}
          onVisit={handleNavigation}
        />
      )}
    </div>
  );
}