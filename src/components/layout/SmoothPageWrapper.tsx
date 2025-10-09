import React, { memo, type ReactNode, useMemo } from 'react';

interface PageWrapperProps {
  children: ReactNode;
  className?: string;
  maxWidth?: string;
  padding?: string;
  backgroundColor?: string;
  minHeight?: string;
}

/**
 * Wrapper de página simplificado
 * 
 * Características:
 * - Sin animaciones complejas
 * - Memoización para performance
 * - Estructura simple y directa
 * - Fácil de mantener
 */
const PageWrapper: React.FC<PageWrapperProps> = memo(({
  children,
  className = "",
  maxWidth = "max-w-md",
  padding = "p-6",
  backgroundColor = "bg-white",
  minHeight = "min-h-screen"
}) => {
  // Memoizar las clases del contenedor
  const containerClasses = useMemo(() => [
    "flex flex-col gap-3",
    maxWidth,
    "mx-auto",
    padding,
    backgroundColor,
    minHeight,
    className
  ].filter(Boolean).join(" "), [maxWidth, padding, backgroundColor, minHeight, className]);
  
  return (
    <div className={containerClasses}>
      {children}
    </div>
  );
});

PageWrapper.displayName = 'PageWrapper';

export default PageWrapper;
