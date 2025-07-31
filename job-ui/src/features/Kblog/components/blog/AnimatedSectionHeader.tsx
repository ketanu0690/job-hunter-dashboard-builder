import React, { useEffect, useRef } from "react";

interface AnimatedSectionHeaderProps {
  color: string; // Tailwind text- or bg- color class (e.g., text-blue-500)
  icon: string;
  title: string;
}

const AnimatedSectionHeader: React.FC<AnimatedSectionHeaderProps> = ({
  color,
  icon,
  title,
}) => {
  return (
    <div
      className={`flex items-center gap-3 mb-6 opacity-0 translate-y-4 transition-all duration-700`}
    >
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center bg-muted text-xl font-medium ${color}`}
      >
        {icon}
      </div>
      <h2 className="text-xl md:text-2xl font-semibold">{title}</h2>
      <div className="ml-auto h-px bg-border flex-grow max-w-24" />
    </div>
  );
};

export default AnimatedSectionHeader;
