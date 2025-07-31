import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, Github } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../../../../shared/ui/button";
import ChatBot from "./ChatBot";
import Image from "../../../public/assests/Hero_section_bg_2.jpg";
import AnimatedBriefCase from "./AnimatedBriefCase";

declare global {
  interface Window {
    puter?: any;
  }
}

const HeroSection = () => {
  const [chatOpen, setChatOpen] = useState(false);

  // Enhanced scroll control
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 500], [0, 100]);
  const headlineY = useTransform(scrollY, [0, 500], [0, -50]);

  useEffect(() => {
    // Custom cursor
    const cursor = document.createElement("div");
    cursor.classList.add("custom-cursor");
    document.body.appendChild(cursor);

    const moveCursor = (e: MouseEvent) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    };

    document.addEventListener("mousemove", moveCursor);

    return () => {
      document.removeEventListener("mousemove", moveCursor);
      document.body.removeChild(cursor);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Animated Briefcase */}
      <AnimatedBriefCase handleOnClick={() => setChatOpen(true)} />
      <ChatBot open={chatOpen} onOpenChange={setChatOpen} />

      {/* Enhanced Parallax Background */}
      <motion.div
        className="absolute inset-0 w-full h-full z-0"
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        initial={{ opacity: 0 }}
        style={{
          backgroundImage: Image
            ? `linear-gradient(to bottom, hsl(var(--accent)) 0%, hsl(var(--accent) / 0.5) 50%, hsl(var(--pure-white) / 0.1) 100%), url('${Image}')`
            : `linear-gradient(to bottom, hsl(var(--background)), hsl(var(--primary)), hsl(var(--accent)))`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
          filter: "brightness(0.5)",
          minHeight: "500px",
        }}
      />

      <div className="relative container mx-auto px-6 z-10">
        <div className="max-w-3xl">
          {/* Open Source Tag */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-background/10 backdrop-blur-sm px-4 py-1 rounded-full text-sm mb-6"
          >
            <Github size={14} className="text-foreground" />
            <span className="text-foreground font-medium">
              Open Source Project
            </span>
          </motion.div>

          {/* Headline with Parallax */}
          <motion.h1
            style={{ y: headlineY }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold text-accent mb-6 tracking-tight"
          >
            Find your next <br className="hidden md:block" />
            <span className="text-primary">tech career</span> opportunity
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-muted-foreground text-xl mb-8"
          >
            An open-source platform connecting developers with their dream jobs.
            Apply with ease, track applications, and grow your career.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button
              size="lg"
              className="bg-primary text-primary-foreground yellow-border yellow-focus yellow-hover yellow-glow text-lg px-8 border-2 border-accent"
            >
              Get Started
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-accent text-accent yellow-hover yellow-focus text-lg px-8"
            >
              View Jobs
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <span className="text-muted-foreground text-sm mb-2">
            Scroll to explore
          </span>
          <ArrowDown className="text-muted-foreground" size={20} />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
