import { Cloudinary } from '@cloudinary/url-gen';

export const cloudinary = new Cloudinary({
    cloud: {
        cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dpjxfizvk',
    },
});

export const CLOUDINARY_CONFIG = {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dpjxfizvk',
    uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'profile_images',
};

export const uploadImageToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);

    try {
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
            {
                method: 'POST',
                body: formData,
            }
        );
        const data = await response.json();
        if (!response.ok) {
            console.error('Cloudinary error response:', data);
            throw new Error(`Error uploading image: ${data.error?.message || response.statusText}`);
        }
        return data.secure_url;
    } catch (error) {
        console.error('Error uploading image to Cloudinary:', error);
        throw error;
    }
};