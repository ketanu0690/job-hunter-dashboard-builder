import { motion } from "framer-motion";
import {
  ArrowDown,
  Briefcase,
  Github,
  MessageCircleMore,
  X,
  Bot,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { APIHelper } from "../../utils/axios";
import ChatBot from "./ChatBot";

declare global {
  interface Window {
    puter?: any;
  }
}

const HeroSection = () => {
  const [scrollY, setScrollY] = useState(0);
  const [briefcaseReachedBottom, setBriefcaseReachedBottom] = useState(false);
  const [briefcaseOpen, setBriefcaseOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  // Use localStorage for Unsplash image
  const [bgUrl, setBgUrl] = useLocalStorage<string | null>(
    "unsplash_image",
    null
  );

  useEffect(() => {
    // Handle scroll for parallax effect
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Custom cursor implementation
    const cursor = document.createElement("div");
    cursor.classList.add("custom-cursor");
    document.body.appendChild(cursor);

    const moveCursor = (e: MouseEvent) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    };

    document.addEventListener("mousemove", moveCursor);

    // Briefcase animation timing
    const briefcaseTimer = setTimeout(() => {
      setBriefcaseReachedBottom(true);
      setTimeout(() => setBriefcaseOpen(true), 500);
    }, 2000);

    // Fetch Unsplash image only if not cached
    if (!bgUrl) {
      const fetchBg = async () => {
        try {
          const accessKey = import.meta.env.VITE_UNSPLASH_API_KEY;
          const data = await APIHelper.get<any>(
            `https://api.unsplash.com/photos/random?query=tech,office,workspace&orientation=landscape&client_id=${accessKey}`
          );
          // Handle both object and array response
          let url = null;
          if (Array.isArray(data) && data.length > 0 && data[0].urls) {
            url = data[0].urls.regular || data[0].urls.full || null;
          } else if (data && data.urls) {
            url = data.urls.regular || data.urls.full || null;
          }
          if (url) setBgUrl(url);
        } catch (err) {
          setBgUrl(null);
        }
      };
      fetchBg();
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousemove", moveCursor);
      document.body.removeChild(cursor);
      clearTimeout(briefcaseTimer);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Animated Briefcase Introduction - Now on the right side with heartbeat animation */}
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
        onClick={() => setChatOpen(true)}
      >
        {/* Thread line */}
        <div className="w-[2px] h-[100px] bg-foreground dark:bg-background bg-gradient-to-b from-transparent to-foreground dark:to-background"></div>

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
          <span className="inline-flex items-center justify-center rounded-full bg-foreground dark:bg-background border border-border shadow-lg p-2 ring-4 ring-accent/40 dark:ring-accent/60 animate-glow">
            <Briefcase
              size={40}
              className="text-accent drop-shadow-[0_0_16px_hsl(var(--accent))]"
            />
          </span>
        </motion.div>
      </motion.div>

      {/* ChatBot Dialog */}
      <ChatBot open={chatOpen} onOpenChange={setChatOpen} />

      {/* Parallax background with gradient overlay */}
      <div
        className="absolute inset-0 w-full h-full z-0"
        style={{
          backgroundImage: bgUrl
            ? `linear-gradient(to bottom, hsl(var(--accent)) 0%, hsl(var(--accent) / 0.5) 50%, hsl(var(--pure-white) / 0.1) 100%), url('${bgUrl}')`
            : `linear-gradient(
                to bottom,
                hsl(var(--background)) 0%,
                hsl(var(--primary)) 60%,
                hsl(var(--accent)) 100%
              )`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          transform: `translateY(${scrollY * 0.2}px)`,
          filter: bgUrl ? "brightness(0.5)" : undefined,
          transition: "background 0.3s",
        }}
      />

      <div className="relative container mx-auto px-6 z-10">
        <div className="max-w-3xl">
          {/* "Open Source" label */}
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

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
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

          {/* CTAs */}
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

      {/* Scroll down indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
        }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
      >
        <motion.div
          animate={{
            y: [0, 10, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "loop",
          }}
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
