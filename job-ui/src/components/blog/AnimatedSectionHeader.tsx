import React, { useEffect, useRef } from "react";

interface AnimatedSectionHeaderProps {
  color: string;
  icon: string;
  title: string;
}

const AnimatedSectionHeader: React.FC<AnimatedSectionHeaderProps> = ({
  color,
  icon,
  title,
}) => {
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
        }
      },
      { threshold: 0.1 }
    );
    if (headerRef.current) {
      observer.observe(headerRef.current);
    }
    return () => {
      if (headerRef.current) {
        observer.unobserve(headerRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={headerRef}
      className={`flex items-center gap-3 mb-6 opacity-0 translate-y-4 transition-all duration-700 ${color} p-3 rounded-lg shadow-sm`}
    >
      <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-md">
        <span className="font-bold text-xl">{icon}</span>
      </div>
      <h2 className="text-xl md:text-2xl font-bold">{title}</h2>
      <div className="ml-auto h-1 bg-white/30 flex-grow max-w-24 rounded-full"></div>
    </div>
  );
};

export default AnimatedSectionHeader;
