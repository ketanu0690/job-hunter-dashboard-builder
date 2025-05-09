import React, { useState, useEffect, useRef } from "react";

const ParallaxHeader = ({ title }: { title: string }) => {
  const [offset, setOffset] = useState(0);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        const scrollPosition = window.scrollY;
        setOffset(scrollPosition * 0.4);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      ref={headerRef}
      className="relative h-64 md:h-80 overflow-hidden mb-12 rounded-xl"
    >
      <div
        className="absolute inset-0 bg-gradient-to-r from-[#FFD500] to-[#FFF3B0]"
        style={{ transform: `translateY(${offset * 0.5}px)` }}
      >
        <div className="absolute inset-0 bg-[url('/api/placeholder/1200/400')] opacity-20 mix-blend-overlay"></div>
        <div className="absolute inset-0">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/10"
              style={{
                width: `${Math.random() * 100 + 50}px`,
                height: `${Math.random() * 100 + 50}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                transform: `translateY(${
                  offset * (0.2 + Math.random() * 0.3)
                }px)`,
                opacity: 0.1 + Math.random() * 0.2,
              }}
            ></div>
          ))}
        </div>
      </div>
      <div
        className="absolute inset-0 flex items-center justify-center text-foreground z-10"
        style={{ transform: `translateY(${offset * 0.2}px)` }}
      >
        <h1 className="text-4xl md:text-5xl font-bold text-center px-4">
          {title}
        </h1>
      </div>
    </div>
  );
};

export default ParallaxHeader;
