import { type ReactNode } from "react";

interface BadgeWithIconProps {
  icon: ReactNode;
  hoverIcon?: ReactNode;
  label: string;
  id: string;
  isActive?: boolean;
  onClick?: (id: string) => void;
  activeColor?: string;
  activeBorderColor?: string;
}

export default function BadgeWithIcon({
  icon,
  hoverIcon,
  label,
  id,
  isActive = false,
  onClick,
  activeColor = "#00324A",
  activeBorderColor = "#d7d7d7",
}: BadgeWithIconProps) {
  const handleClick = () => {
    if (onClick) {
      onClick(id);
    }
  };

  return (
    <div
      className={`inline-flex items-center gap-1 h-10 rounded-xl shadow-sm px-4 font-medium transition-all duration-200 cursor-pointer ${
        isActive
          ? "text-white border-3 scale-105"
          : "bg-white text-gray-800 hover:bg-gray-50 hover:scale-105"
      }`}
      style={
        isActive
          ? {
              backgroundColor: activeColor,
              borderColor: activeBorderColor,
            }
          : {}
      }
      onClick={handleClick}
    >
      {isActive && hoverIcon ? hoverIcon : icon}
      <span>{label}</span>
    </div>
  );
}
