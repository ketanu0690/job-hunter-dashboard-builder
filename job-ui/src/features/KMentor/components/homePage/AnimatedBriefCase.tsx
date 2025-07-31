import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";
import { useEffect, useState } from "react";

const AnimatedBriefCase = ({
  handleOnClick,
}: {
  handleOnClick: () => void;
}) => {
  const [briefcaseReachedBottom, setBriefcaseReachedBottom] = useState(false);
  const [briefcaseOpen, setBriefcaseOpen] = useState(false);

  useEffect(() => {
    // Briefcase animation timing
    const briefcaseTimer = setTimeout(() => {
      setBriefcaseReachedBottom(true);
      setTimeout(() => setBriefcaseOpen(true), 500);
    }, 2000);

    return () => {
      clearTimeout(briefcaseTimer);
    };
  }, []);

  return (
    <motion.div
      className="fixed right-10 top-0 z-50 flex flex-col items-center cursor-pointer"
      initial={{ y: -100 }}
      animate={{
        y: briefcaseReachedBottom
          ? window.innerHeight / 2
          : window.innerHeight / 2 - 100,
      }}
      transition={{
        duration: 2,
        ease: "easeInOut",
      }}
      onClick={handleOnClick}
    >
      {/* Thread line */}
      <div className="w-[2px] h-[100px] "></div>

      {/* Briefcase with heartbeat animation and improved visibility */}
      <motion.div
        className="relative mt-2"
        animate={{
          rotateY: briefcaseOpen ? [0, 180, 0] : 0,
          scale: [1, 1.15, 1],
        }}
        transition={{
          rotateY: { duration: 1.5, ease: "easeInOut" },
          scale: { duration: 1.2, repeat: Infinity, repeatType: "loop" },
        }}
      >
        <span className="inline-flex items-center justify-center rounded-full border border-border shadow-lg p-2 ring-4">
          <Briefcase
            size={40}
            className="text-accent drop-shadow-[0_0_16px_hsl(var(--accent))]"
          />
        </span>
      </motion.div>
    </motion.div>
  );
};

export default AnimatedBriefCase;
