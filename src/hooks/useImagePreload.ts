import { useEffect, useState } from 'react';

/**
 * Hook para preload de imágenes críticas
 * 
 * Características:
 * - Preload automático de imágenes
 * - Estado de carga
 * - Optimización de performance
 */
export const useImagePreload = (imageUrls: string[]) => {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!imageUrls.length) {
      setIsLoading(false);
      return;
    }

    let loadedCount = 0;
    const totalImages = imageUrls.length;
    const newLoadedImages = new Set<string>();

    const loadImage = (url: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        const img = new Image();

        img.onload = () => {
          newLoadedImages.add(url);
          loadedCount++;

          if (loadedCount === totalImages) {
            setLoadedImages(newLoadedImages);
            setIsLoading(false);
          }
          resolve();
        };

        img.onerror = () => {
          console.warn(`Failed to load image: ${url}`);
          loadedCount++;

          if (loadedCount === totalImages) {
            setLoadedImages(newLoadedImages);
            setIsLoading(false);
          }
          reject(new Error(`Failed to load image: ${url}`));
        };

        // Iniciar carga
        img.src = url;
      });
    };

    // Cargar todas las imágenes en paralelo
    Promise.allSettled(imageUrls.map(loadImage));

  }, [imageUrls]);

  return {
    loadedImages,
    isLoading,
    isImageLoaded: (url: string) => loadedImages.has(url)
  };
};

/**
 * Hook específico para preload de imágenes de categorías
 */
export const useCategoryImagePreload = () => {
  // URLs de todas las imágenes de categorías
  const categoryImages = [
    "/hotels-background-section-explore.svg",
    "/icons/discos/discos-background-section-explore.svg",
    "/icons/restaurants/restaurant-background-section-explore.svg",
    "/beach-background-section-explore.svg",
    "/icons/estudiar/study-background-section-explore.svg",
    "/icons/parques/parques-background-section-explore.svg"
  ];

  return useImagePreload(categoryImages);
};
