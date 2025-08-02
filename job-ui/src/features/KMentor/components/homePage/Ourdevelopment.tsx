import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { Rocket } from "lucide-react";
import React, { useMemo, useRef } from "react";

const SLIDE_ANIM = {
  opacity: [0, 1, 0.7],
  scale: [1, 2, 0.7],
};

const slides = [
  {
    id: "mentorship-impact",
    title: "🎓 Mentorship Impact (Not Just Teaching — Transforming)",
    bgColor: "var(--background)",
    content: `
      Over 120 students have launched their careers through our guidance.
      From Tier-1 cities to remote towns, we've helped aspiring developers land real roles in tech — not by luck, but through skill, support, and structure.
    `,
  },
  {
    id: "how-we-mentored",
    title: "🤝 How We Mentored (No Gyaan, Just Real Growth)",
    bgColor: "var(--card)",
    content: `
      🚀 1:1 guidance, resume reviews, mock interviews.  
      🧑‍💻 Hands-on projects in React, TypeScript, .NET.  
      💬 Soft skills coaching & portfolio building.  
      💼 Internships, first jobs, and even FAANG prep — all rooted in practical mentorship.
    `,
  },
  // existing slides
  {
    id: "project-vision",
    title: "🚀 Project Vision & Planning (Because We Totally Had a Vision)",
    bgColor: "var(--background)",
    content: `We made a plan. Then ignored it. Classic.`,
  },
  {
    id: "design-phase",
    title: "🎨 Design & Prototyping (Just Make It Pretty, Please)",
    bgColor: "var(--card)",
    content: `Designed for users. Accidentally made it look good, too. Oops.`,
  },
  {
    id: "development-phase",
    title: "👨‍💻 Agile Development (Breaking Code, Not Hearts)",
    bgColor: "var(--background)",
    content: `Wrote code. Broke things. Googled solutions. Repeat.`,
  },
  {
    id: "launch-iterate",
    title: "🎉 Launch & Iterate (Spoiler Alert: We're Never 'Done')",
    bgColor: "var(--primary)",
    content: `We launched. Immediately started fixing what we launched.`,
  },
];

function useHorizontalScroll(
  scrollProgress: MotionValue<number>,
  sectionCount: number
) {
  const translateX = useTransform(
    scrollProgress,
    [0, 1],
    ["0%", `-${(sectionCount - 1) * 100}%`]
  );
  return { translateX };
}

// Shooting star component
const ShootingStar = ({
  x,
  y,
  delay,
}: {
  x: number;
  y: number;
  delay: number;
}) => (
  <>
    <div
      className="absolute bg-white rounded-full"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: "4px",
        height: "4px",
        boxShadow:
          "0 0 10px rgba(255,255,255,0.8), 0 0 20px rgba(0,212,255,0.6)",
        animation: `shooting-star 1.8s ease-out infinite`,
        animationDelay: `${delay}s`,
      }}
    />
    <div
      className="absolute rounded-full bg-gradient-to-tr from-white via-cyan-300 to-transparent blur-sm"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: "120px",
        height: "2px",
        transform: "rotate(45deg)",
        opacity: 0.4,
        animation: `shooting-star 1.8s ease-out infinite`,
        animationDelay: `${delay}s`,
      }}
    />
  </>
);

const TwinklingStar = ({
  x,
  y,
  size,
  opacity,
  scaleDuration,
  rotateDuration,
}: any) => (
  <motion.div
    className="absolute"
    animate={{
      scale: [1, 1.15, 1],
      rotate: [0, 180, 360],
    }}
    transition={{
      scale: { duration: scaleDuration, repeat: Infinity, repeatType: "loop" },
      rotate: { duration: rotateDuration, repeat: Infinity, ease: "linear" },
    }}
    style={{ top: `${x}%`, left: `${y}%`, opacity }}
  >
    <div
      className="relative"
      style={{ width: `${size * 3}px`, height: `${size * 3}px` }}
    >
      <div className="absolute left-1/2 top-0 w-0.5 h-full bg-gradient-to-b from-white via-cyan-200 to-transparent -translate-x-1/2" />
      <div className="absolute top-1/2 left-0 h-0.5 w-full bg-gradient-to-r from-white via-cyan-200 to-transparent -translate-y-1/2" />
      <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
    </div>
  </motion.div>
);

const DiagonalLines = ({
  scrollProgress,
}: {
  scrollProgress: MotionValue<number>;
}) => {
  const lines = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 5,
      })),
    []
  );

  const stars = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        scaleDuration: 0.8 + Math.random(),
        rotateDuration: 2 + Math.random() * 4,
        size: 1 + Math.random() * 1.5,
        opacity: 0.6 + Math.random() * 0.4,
      })),
    []
  );

  const backgroundX = useTransform(scrollProgress, [0.5, 1], ["0%", "50%"]);

  return (
    <motion.div
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0"
      style={{ x: backgroundX }}
    >
      {lines.map(({ id, x, y, delay }) => (
        <ShootingStar key={id} x={x} y={y} delay={delay} />
      ))}
      {stars.map((star) => (
        <TwinklingStar key={star.id} {...star} />
      ))}
    </motion.div>
  );
};

const OurDevelopment = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const { translateX } = useHorizontalScroll(scrollYProgress, slides.length);

  const rocketX = useTransform(scrollYProgress, [0, 1], ["80%", "5%"]);
  const rocketY = useTransform(scrollYProgress, [0, 1], ["5%", "80%"]);
  const rocketRotate = useTransform(scrollYProgress, [0, 1], [185, 185]);

  return (
    <div
      ref={containerRef}
      className="relative h-[400vh] bg-[var(--background)]"
    >
      <div
        className="absolute inset-0 w-full h-full z-0"
        style={{
          background: `linear-gradient(180deg, hsl(var(--background)) 0%, hsl(var(--primary)) 60%, hsl(var(--accent)) 100%)`,
        }}
      />
      <DiagonalLines scrollProgress={scrollYProgress} />

      <motion.div
        className="absolute z-20 pointer-events-none"
        style={{ top: rocketY, left: rocketX, rotate: rocketRotate }}
      >
        <div className="relative w-16 h-16 text-5xl">
          {/* 🚀 */}
          <Rocket
            className="w-12 h-12 text-white drop-shadow-xl"
            strokeWidth={2}
          />

          <div
            className="absolute top-full left-1/2 w-2 h-10 rounded-full bg-gradient-to-b from-yellow-300 via-orange-500 to-transparent -translate-x-1/2 blur-sm"
            style={{ animation: "fire-flicker 0.3s ease-in-out infinite" }}
          />
        </div>
      </motion.div>

      <div className="sticky top-0 h-screen overflow-hidden z-10">
        <motion.div className="flex h-full" style={{ x: translateX }}>
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
              [0.7, 1, 0.7]
            );
            const scale = useTransform(
              sectionProgress,
              [0, 0.5, 1],
              SLIDE_ANIM.scale
            );

            return (
              <motion.div
                key={section.id}
                className="w-screen h-screen flex-shrink-0 flex items-center justify-center relative"
                style={{ background: section.bgColor, scale, opacity }}
              >
                <motion.div className="container mx-auto px-4 z-10 text-center">
                  <motion.h2 className="text-2xl md:text-2xl font-bold mb-4 text-[var(--foreground)] drop-shadow-lg">
                    {section.title}
                  </motion.h2>
                  {section.content && (
                    <motion.div className="text-lg drop-shadow">
                      {section.content}
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      <style>{`
        @keyframes shooting-star {
          0% { transform: translate(0, 0) scale(1) rotate(45deg); opacity: 1; }
          100% { transform: translate(400px, 400px) scale(0.8) rotate(45deg); opacity: 0; }
        }
        @keyframes fire-flicker {
          0% { opacity: 0.6; transform: scaleY(1); }
          50% { opacity: 1; transform: scaleY(1.3); }
          100% { opacity: 0.6; transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
};

export default OurDevelopment;
