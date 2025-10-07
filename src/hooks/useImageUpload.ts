import { useState } from 'react';
import { uploadImageToCloudinary } from '../config/cloudinary';

interface UseImageUploadReturn {
    isUploading: boolean;
    error: string | null;
    uploadImage: (file: File) => Promise<string>;
    clearError: () => void;
}

export const useImageUpload = (): UseImageUploadReturn => {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const uploadImage = async (file: File): Promise<string> => {
        if (!file) {
            throw new Error('No se ha seleccionado ningún archivo');
        }

        if (!file.type.startsWith('image/')) {
            throw new Error('El archivo debe ser una imagen');
        }

        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            throw new Error('La imagen no puede ser mayor a 5MB');
        }

        setIsUploading(true);
        setError(null);

        try {
            const imageUrl = await uploadImageToCloudinary(file);
            return imageUrl;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al subir la imagen';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsUploading(false);
        }
    };

    const clearError = () => setError(null);

    return {
        isUploading,
        error,
        uploadImage,
        clearError,
    };
};