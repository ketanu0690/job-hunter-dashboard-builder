import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import React, { useRef } from "react";

export interface Section {
  id: string;
  bgColor: string;
  title: string;
  subtitle?: string;
  content?: React.ReactNode;
}

const ANIMATION_CONFIG = {
  opacity: [1, 5, 0.7],
  scale: [5, 1, 4],
};

function useHorizontalScroll(
  scrollProgress: MotionValue<number>,
  totalSections: number
) {
  const translateX = useTransform(
    scrollProgress,
    [0, 1],
    ["0%", `-${(totalSections - 1) * 100}%`]
  );

  return { translateX };
}
const slides = [
  {
    id: "project-vision",
    title: "🚀 Project Vision & Planning (Because We Totally Had a Vision)",
    bgColor: "var(--background)",
    content: `
      We made a plan. Then ignored it. Classic.
    `,
  },
  {
    id: "design-phase",
    title: "🎨 Design & Prototyping (Just Make It Pretty, Please)",
    bgColor: "var(--card)",
    content: `
      Designed for users. Accidentally made it look good, too. Oops.
    `,
  },
  {
    id: "development-phase",
    title: "👨‍💻 Agile Development (Breaking Code, Not Hearts)",
    bgColor: "var(--background)",
    content: `
      Wrote code. Broke things. Googled solutions. Repeat.
    `,
  },
  {
    id: "launch-iterate",
    title: "🎉 Launch & Iterate (Spoiler Alert: We're Never 'Done')",
    bgColor: "var(--primary)",
    content: `
      We launched. Immediately started fixing what we launched.
    `,
  },
];

const OurDevelopment = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const { translateX } = useHorizontalScroll(scrollYProgress, slides.length);

  return (
    <div
      ref={containerRef}
      className="relative h-[400vh] bg-[var(--background)]"
    >
      {/* Gradient background for the launch area */}
      <div
        className="absolute inset-0 w-full h-full z-0"
        style={{
          background: `linear-gradient(180deg, hsl(var(--background)) 0%, hsl(var(--primary)) 60%, hsl(var(--accent)) 100%)`,
          transition: "background 0.3s",
        }}
      />
      <div className="sticky top-0 h-screen overflow-hidden z-10">
        <motion.div
          className="flex h-full"
          style={{
            x: translateX,
          }}
        >
          {slides.map((section, index) => {
            const sectionStart = index / slides.length;
            const sectionEnd = (index + 1) / slides.length;

            const sectionProgress = useTransform(
              scrollYProgress,
              [sectionStart, sectionEnd],
              [0, 1]
            );

            const opacity = useTransform(
              sectionProgress,
              [0, 0.5, 1],
              ANIMATION_CONFIG.opacity
            );

            const scale = useTransform(
              sectionProgress,
              [0, 0.5, 1],
              ANIMATION_CONFIG.scale
            );

            return (
              <motion.div
                key={section.id}
                className="w-screen h-screen flex-shrink-0 flex items-center justify-center relative"
                style={{
                  backgroundColor: section.bgColor,
                  transform: `scale(${scale})`,
                }}
              >
                <motion.div className="container mx-auto px-4 z-10">
                  <div className="max-w-4xl mx-auto text-center">
                    <motion.h2 className="text-4xl md:text-5xl font-bold mb-4 text-[var(--foreground)] drop-shadow-lg">
                      {section.title}
                    </motion.h2>

                    {section.content && (
                      <motion.div className="text-lg text-[var(--muted-foreground)] drop-shadow">
                        {section.content}
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

export default OurDevelopment;
