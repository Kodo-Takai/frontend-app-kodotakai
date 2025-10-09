import React, { memo, type ReactNode, useMemo, useEffect } from 'react';

interface CategoryWrapperProps {
  children: ReactNode;
  backgroundImage?: string;
  backgroundSize?: string;
  backgroundPosition?: string;
  className?: string;
  maxWidth?: string;
  minHeight?: string;
}

/**
 * Wrapper de categorías simplificado
 * 
 * Características:
 * - Manejo optimizado de fondos de imagen
 * - Sin animaciones complejas
 * - Memoización para performance
 * - Estructura simple y directa
 */
const CategoryWrapper: React.FC<CategoryWrapperProps> = memo(({
  children,
  backgroundImage,
  backgroundSize = "130%",
  backgroundPosition = "top center",
  className = "",
  maxWidth = "max-w-md",
  minHeight = "min-h-screen"
}) => {
  // Preload de imagen de fondo para carga instantánea
  useEffect(() => {
    if (backgroundImage) {
      const img = new Image();
      img.src = backgroundImage;
      // Preload la imagen para que esté lista cuando se necesite
    }
  }, [backgroundImage]);

  // Memoizar las clases del contenedor
  const containerClasses = useMemo(() => [
    "relative flex flex-col",
    maxWidth,
    "mx-auto",
    minHeight,
    className
  ].filter(Boolean).join(" "), [maxWidth, minHeight, className]);
  
  // Memoizar los estilos del fondo con optimizaciones
  const backgroundStyles = useMemo(() => ({
    backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
    backgroundSize,
    backgroundPosition,
    backgroundRepeat: "no-repeat" as const,
    // Optimizaciones para carga rápida
    backgroundAttachment: "scroll" as const,
    willChange: "transform" as const,
  }), [backgroundImage, backgroundSize, backgroundPosition]);
  
  return (
    <div className={containerClasses}>
      {/* Fondo optimizado con preload */}
      {backgroundImage && (
        <div
          className="absolute top-0 left-0 w-full h-140 sm:h-40 md:h-48 lg:h-56 bg-center bg-no-repeat bg-cover"
          style={backgroundStyles}
          // Optimizaciones adicionales
          role="img"
          aria-hidden="true"
        />
      )}
      
      {/* Contenido principal */}
      <div className="relative z-10 flex flex-col gap-3 p-6">
        {children}
      </div>
    </div>
  );
});

CategoryWrapper.displayName = 'CategoryWrapper';

export default CategoryWrapper;
