import { type ReactNode } from "react";

interface BadgeWithIconProps {
  icon: ReactNode;
  hoverIcon?: ReactNode;
  label: string;
  id: string;
  isActive?: boolean;
  onClick?: (id: string) => void;
}

export default function BadgeWithIcon({
  icon,
  hoverIcon,
  label,
  id,
  isActive = false,
  onClick,
}: BadgeWithIconProps) {
  const handleClick = () => {
    if (onClick) {
      onClick(id);
    }
  };

  return (
    <div
      className={`inline-flex items-center gap-2 h-10 rounded-xl shadow-sm px-5 font-medium transition-all duration-200 cursor-pointer ${
        isActive
          ? "bg-[#00324A] text-white border-3 border-[#d7d7d7] scale-105"
          : "bg-white text-gray-800 hover:bg-gray-50 hover:scale-105"
      }`}
      onClick={handleClick}
    >
      {isActive && hoverIcon ? hoverIcon : icon}
      <span>{label}</span>
    </div>
  );
}
