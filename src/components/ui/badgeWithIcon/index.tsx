import { type ReactNode } from "react";

interface BadgeWithIconProps {
  icon: ReactNode;
  label: string;
}

export default function BadgeWithIcon({ icon, label }: BadgeWithIconProps) {
  return (
    <div className="inline-flex items-center gap-2 h-10 rounded-xl bg-white shadow-sm px-5 font-medium text-gray-800 hover:scale-105 transition-transform duration-200 cursor-pointer">
      {icon}
      <span>{label}</span>
    </div>
  );
}
