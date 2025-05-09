import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Github, Star } from "lucide-react";
import { Button } from "../ui/button";

const OpenSourceBanner = () => {
  const [ref, inView] = useInView({
    triggerOnce: false, // Changed from true to false
    threshold: 0.2,
  });

  const starAnimation = {
    hidden: { scale: 0.5, opacity: 0, rotate: -15 },
    visible: {
      scale: 1,
      opacity: 1,
      rotate: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="py-20 bg-gradient-to-r from-background to-accent"
    >
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-card/90 rounded-xl shadow-2xl p-8">
          <div className="max-w-xl">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-3xl font-bold mb-4"
            >
              Join Our Open Source Community
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg text-foreground/80 mb-6"
            >
              We believe in the power of collaborative development. Help us
              build a better job platform for everyone by contributing to our
              open-source project.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex gap-4"
            >
              <Button className="bg-background text-foreground hover:bg-background/90 gap-2 border border-accent yellow-hover yellow-focus">
                <Github size={18} />
                View on GitHub
              </Button>
              <Button
                variant="outline"
                className="border-accent text-foreground hover:bg-background/10 gap-2 yellow-hover yellow-focus"
              >
                <Star size={18} />
                Star the Project
              </Button>
            </motion.div>
          </div>

          <motion.div
            variants={starAnimation}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="relative"
          >
            <div className="w-40 h-40 rounded-full bg-background/10 backdrop-blur-md flex items-center justify-center border-2 border-accent">
              <Star size={64} className="text-accent animate-glow" />
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "loop",
                }}
                className="absolute inset-0 rounded-full border border-accent/20"
              />
            </div>
            <div className="absolute top-0 left-0 w-full h-full blur-2xl bg-accent/20 rounded-full -z-10" />
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default OpenSourceBanner;
