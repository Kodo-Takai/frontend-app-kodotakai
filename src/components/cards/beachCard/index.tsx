import { useState } from "react";
import { FaStar, FaMapMarkerAlt } from "react-icons/fa";
import { MdPlace } from "react-icons/md";
import { TbLocationFilled } from "react-icons/tb";
import { useBeaches } from "../../../hooks/places";
import "./index.scss";

interface Beach {
  name: string;
  photos: Array<{
    photo_url: string;
    rating?: number;
    vicinity?: string;
  }>;
  mainPhoto: any;
  rating?: number;
  vicinity?: string;
}

export default function BeachCards() {
  const { places: beaches, loading } = useBeaches({
    searchMethod: "both",
    limit: 6,
    enableMultiplePhotos: true,
  });

  const handleVisit = (beach: Beach) => {
    console.log("Visitando playa:", beach.name);
    // Aquí puedes agregar lógica de navegación
  };

  const displayedBeaches = beaches.slice(0, 6);

  const BeachCard = ({ beach }: { beach: Beach }) => {
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [imageError, setImageError] = useState(false);

    // Debug: Log de fotos disponibles
    console.log("BeachCard - Fotos disponibles:", {
      name: beach.name,
      photosCount: beach.photos?.length || 0,
      photos: beach.photos?.map(p => ({ photo_url: p.photo_url })) || []
    });

    const nextPhoto = () => {
      setCurrentPhotoIndex((prev) => (prev + 1) % beach.photos.length);
    };

    const prevPhoto = () => {
      setCurrentPhotoIndex((prev) =>
        prev === 0 ? beach.photos.length - 1 : prev - 1
      );
    };

    const handleImageError = () => {
      setImageError(true);
    };

    const handleVisitClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      handleVisit(beach);
    };

    const renderStars = (rating?: number) => {
      if (!rating) return null;

      const fullStars = Math.floor(rating);
      const stars = Array.from({ length: 5 }, (_, i) => (
        <FaStar
          key={`beach-star-${i}`}
          className={`w-3 h-3 ${
            i < fullStars ? "text-red-600" : "text-gray-300"
          }`}
          style={{ color: i < fullStars ? "#DC1217" : "#D1D5DB" }}
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
      <div className="beach-card-width">
        <div className="beach-card-container">
          <div className="beach-card-header">
            {/* Primera subfila - dividida en 2 columnas */}
            <div className="beach-card-title-section">
              {/* Columna 1: Icono red-compass */}
              <div className="beach-card-experience-text">
                <img
                  src="/icons/red-compass.svg"
                  alt="Compass"
                  width="30"
                  height="30"
                  margin-top="5px"
                  className="beach-card-compass-icon"
                />
              </div>

              {/* Columna 2: Nombre de la playa (dividido en 2 filas) */}
              <div className="beach-card-name-section">
                {/* Fila 1: Label "EXPERIMENTA NUEVAS PLAYAS" */}
                <div className="beach-card-experience-label">
                  EXPERIMENTA NUEVAS PLAYAS
                </div>

                {/* Fila 2: Nombre de la playa */}
                <h3 className="beach-card-beach-name">{beach.name}</h3>
              </div>
            </div>

            {/* Segunda subfila: Descripción/ubicación */}
            <div className="beach-card-description-row">
              <MdPlace className="w-3 h-3 text-gray-400 flex-shrink-0" />
              <span className="line-clamp-2">
                {beach.vicinity ||
                  "Descubre esta increíble playa y vive una experiencia única en la costa colombiana"}
              </span>
            </div>
          </div>

          <div className="beach-card-image-section">
            {/* Columna 1: Botón anterior */}

            <button
              onClick={prevPhoto}
              disabled={beach.photos.length <= 1}
              className="beach-card-nav-button"
            >
              <img
                src="/icons/white-arrow-left.svg"
                alt="Anterior"
                width="18"
                height="18"
                className="beach-card-arrow-icon"
              />
            </button>

            {/* Columna 2: Carrusel de 3 imágenes estilo baraja */}
            <div className="beach-card-image-container">
              {beach.photos.map((photo, index) => {
                // Calcular la posición relativa basada en el índice actual
                const getImagePosition = (photoIndex: number) => {
                  const totalPhotos = beach.photos.length;
                  const relativePosition =
                    (photoIndex - currentPhotoIndex + totalPhotos) %
                    totalPhotos;

                  switch (relativePosition) {
                    case 0: // Imagen principal (centro)
                      return {
                        position: "center",
                        transform: "translateX(0) rotate(0deg)",
                        zIndex: 3,
                        hasBorder: true,
                      };
                    case 1: // Imagen derecha (atrás)
                      return {
                        position: "right",
                        transform: "translateX(50px) rotate(10deg)",
                        zIndex: 1,
                        hasBorder: false,
                      };
                    case 2: // Imagen izquierda (atrás)
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
                        : photo.photo_url || "https://picsum.photos/97/114?random=beach-default"
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
                    onClick={() => setCurrentPhotoIndex(index)}
                  />
                );
              })}
            </div>

            {/* Columna 3: Botón siguiente */}
            <button
              onClick={nextPhoto}
              disabled={beach.photos.length <= 1}
              className="beach-card-nav-button"
            >
              <img
                src="/icons/white-arrow-right.svg"
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
              {beach.photos.map((_, index) => (
                <button
                  key={index}
                  className={`beach-card-indicator ${
                    index === currentPhotoIndex ? "active" : ""
                  }`}
                  onClick={() => setCurrentPhotoIndex(index)}
                />
              ))}
            </div>

            <button
              onClick={handleVisitClick}
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
            <div key={`beach-skeleton-${i}`} className="beach-card-width">
              <div className="rounded-xl overflow-hidden shadow-lg animate-pulse">
                <div className="h-72 bg-gray-200" />
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
        {displayedBeaches.map((beach, index) => (
          <BeachCard key={`${beach.name}-${index}`} beach={beach} />
        ))}
      </div>
    );
  };

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold text-gray-900  mb-4">
        Visita estas Playas
      </h2>
      {renderContent()}
    </div>
  );
}
