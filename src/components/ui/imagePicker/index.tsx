import React, { useRef } from "react";

interface ImagePickerProps {
  currentImage?: string;
  onImageSelect: (file: File) => void;
  isUploading?: boolean;
  disabled?: boolean;
  className?: string;
}

const ImagePicker: React.FC<ImagePickerProps> = ({
  currentImage,
  onImageSelect,
  isUploading = false,
  disabled = false,
  className = "",
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div
        className="w-[100px] h-[100px] flex flex-col items-end cursor-pointer"
        onClick={handleImageClick}
      >
        <img
          src={currentImage || "/profilePic.webp"}
          className="w-full h-full rounded-full object-cover"
          alt="Foto de perfil"
        />
        <div className="absolute bottom-0 right-0 translate-y-[10px] translate-x-[20px] bg-[var(--color-bone)] rounded-full p-3 border border-gray-200 animate-bubble-in">
          {isUploading ? (
            <div className="animate-spin">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="#00324A"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="31.416"
                  strokeDashoffset="31.416"
                  className="animate-spin"
                />
              </svg>
            </div>
          ) : (
            <svg
              width="20"
              height="20"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M.375 11.656v2.969h2.969L12.1 5.869 9.13 2.9zm14.02-8.083a.79.79 0 0 0 0-1.116L12.543.605a.79.79 0 0 0-1.116 0l-1.45 1.448 2.97 2.97z"
                fill="#00324A"
              />
            </svg>
          )}
        </div>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled || isUploading}
      />
    </div>
  );
};

export default ImagePicker;
