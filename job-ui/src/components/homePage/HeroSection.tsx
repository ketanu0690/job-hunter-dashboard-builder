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

const HeroSection = () => {
  const [scrollY, setScrollY] = useState(0);
  const [briefcaseReachedBottom, setBriefcaseReachedBottom] = useState(false);
  const [briefcaseOpen, setBriefcaseOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<
    Array<{ role: string; content: string }>
  >([
    {
      role: "assistant",
      content: "Hello! I'm your career assistant. How can I help you today?",
    },
  ]);

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

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (!chatMessage.trim()) return;

    // Add user message to chat
    const newHistory = [...chatHistory, { role: "user", content: chatMessage }];

    setChatHistory(newHistory);

    // Simulate AI response
    setTimeout(() => {
      let response = "";

      if (chatMessage.toLowerCase().includes("job")) {
        response =
          "I can help you find job opportunities that match your skills and preferences. What kind of position are you looking for?";
      } else if (chatMessage.toLowerCase().includes("resume")) {
        response =
          "Your resume is crucial in job hunting! Would you like tips on how to optimize it for ATS systems or tailor it for specific roles?";
      } else if (chatMessage.toLowerCase().includes("interview")) {
        response =
          "Preparing for interviews is important. I can share common questions and strategies for different roles. What type of interview are you preparing for?";
      } else {
        response =
          "I'm here to assist with your job search journey. I can help with finding job opportunities, resume optimization, interview preparation, and career advice. What would you like to know more about?";
      }

      setChatHistory([...newHistory, { role: "assistant", content: response }]);
    }, 800);

    setChatMessage("");
  };

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

      {/* Job AI Chat Dialog */}
      <Dialog open={chatOpen} onOpenChange={setChatOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-hidden flex flex-col bg-futuristic-dark border border-white/20">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bot size={18} className="text-accent" />
              <span className="text-foreground">Career Assistant AI</span>
            </DialogTitle>
            <DialogDescription className="text-foreground/70">
              Your AI-powered career and job search companion
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto py-4 px-1 space-y-4 mb-4 max-h-[50vh]">
            {chatHistory.map((msg, i) => (
              <div
                key={i}
                className={cn(
                  "p-3 rounded-lg max-w-[85%]",
                  msg.role === "assistant"
                    ? "bg-background/10 text-foreground self-start"
                    : "bg-accent/20 text-foreground ml-auto self-end"
                )}
              >
                {msg.content}
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="flex gap-2 mt-auto">
            <input
              type="text"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="Ask about jobs, interviews, resumes..."
              className="flex-1 bg-futuristic-card border border-white/10 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-accent"
            />
            <Button
              type="submit"
              className="bg-accent hover:bg-accent/80 text-accent-foreground"
            >
              Send
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Parallax background with gradient overlay */}
      <div
        className="absolute inset-0 w-full h-full z-0"
        style={{
          backgroundImage: bgUrl
            ? `url('${bgUrl}')`
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
            <Github size={14} className="text-white" />
            <span className="text-white font-medium">Open Source Project</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight"
          >
            Find your next <br className="hidden md:block" />
            <span className="text-accent">tech career</span> opportunity
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-white/80 text-xl mb-8"
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
              className="bg-accent text-accent-foreground hover:bg-accent/80 text-lg px-8"
            >
              Get Started
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-accent text-accent-foreground hover:bg-accent/10 text-lg px-8"
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
          <span className="text-white/60 text-sm mb-2">Scroll to explore</span>
          <ArrowDown className="text-white/60" size={20} />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
