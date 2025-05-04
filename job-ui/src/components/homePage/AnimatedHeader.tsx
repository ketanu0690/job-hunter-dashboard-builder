import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Search, Briefcase, User, X, Sun, Moon } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../forms/AuthForm";
import { supabase } from "../../integrations/supabase/client";
import ThemeToggle from "../ui/theme-toggle";
import useTheme from "../ui/use-theme";

const AnimatedHeader = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { session, setSession } = useAuth();
  const [theme, setTheme] = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    navigate("/login");
  };

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  // Wheel-like menu item variants
  const menuItemVariants = {
    hidden: (i: number) => ({
      opacity: 0,
      rotate: -180,
      scale: 0.5,
      y: -20,
      x: -50,
      transition: {
        delay: i * 0.05,
        duration: 0.5,
      },
    }),
    visible: (i: number) => ({
      opacity: 1,
      rotate: 0,
      scale: 1,
      y: 0,
      x: 0,
      transition: {
        delay: i * 0.1,
        type: "spring",
        stiffness: 300,
        damping: 25,
      },
    }),
    exit: (i: number) => ({
      opacity: 0,
      rotate: 180,
      scale: 0.5,
      transition: {
        delay: i * 0.05,
        duration: 0.5,
      },
    }),
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ",
          scrolled
            ? "py-2 bg-futuristicDark/80 shadow-lg"
            : "py-6 bg-transparent"
        )}
      >
        <div className="container mx-auto px-4 flex items-center justify-between gap-8">
          {/* Logo */}
          <Link to="/">
            <motion.div
              className="flex items-center cursor-pointer"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Briefcase className="text-accent mr-2" size={24} />
              <span
                className={cn(
                  "font-medium hover:text-accent transition-colors",
                  scrolled
                    ? "text-accent dark:text-foreground"
                    : "text-foreground"
                )}
              >
                Career
                <span className="text-base">Flow</span>
              </span>
            </motion.div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6 flex-1 justify-center">
            <Link
              to="/blogs"
              className={cn(
                "font-medium hover:text-accent transition-colors text-foreground ",
                scrolled
                  ? "text-accent dark:text-foreground"
                  : "text-foreground"
              )}
            >
              Blogs
            </Link>
            {session && (
              <Link
                to="/admin"
                className={cn(
                  "font-medium hover:text-accent transition-colors text-foreground ",
                  scrolled
                    ? "text-accent dark:text-foreground"
                    : "text-foreground"
                )}
              >
                Dashboard
              </Link>
            )}
          </nav>

          {/* Icons and Auth Buttons */}
          <div className="flex items-center gap-2">
            <motion.button
              onClick={() => {
                setTheme(theme === "light" ? "dark" : "light");
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 text-foreground hover:text-accent transition-colors bg-background/80 dark:bg-background/60 rounded-full border border-border"
            >
              {theme === "dark" ? (
                <Sun
                  size={20}
                  className="h-[1.2rem] w-[1.2rem] text-foreground rotate-0 scale-100 transition-all"
                />
              ) : (
                <Moon
                  size={20}
                  className="h-[1.2rem] w-[1.2rem] text-foreground rotate-0 scale-100 transition-all"
                />
              )}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 text-foreground/80 hover:text-accent transition-colors bg-background/5 rounded-full"
            >
              <Search size={20} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 text-foreground/80 hover:text-accent transition-colors bg-background/5 rounded-full"
            >
              <User size={20} />
            </motion.button>
            {!session && (
              <Link to="/login">
                <Button className="ml-2 bg-accent text-accent-foreground font-semibold px-4 py-2 rounded-lg hover:bg-accent/80 transition-all">
                  Sign In
                </Button>
              </Link>
            )}
            {!session && (
              <Link to="/signup">
                <Button className="ml-2 bg-accent text-accent-foreground font-semibold px-4 py-2 rounded-lg hover:bg-accent/80 transition-all">
                  Sign Up
                </Button>
              </Link>
            )}
            {session && (
              <button
                onClick={handleLogout}
                className="ml-2 bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg transition-all"
              >
                Logout
              </button>
            )}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "p-2 transition-colors rounded-full  border border-border",
                menuOpen
                  ? "text-foreground bg-background/90"
                  : "text-foreground bg-background/60 hover:bg-background/80"
              )}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? (
                <X size={20} className="text-foreground" />
              ) : (
                <Menu size={20} className="text-foreground" />
              )}
            </motion.button>
          </div>
        </div>
      </header>

      {/* Full Screen Menu with Wheel Animation */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 flex items-center justify-center"
            style={{
              background:
                "linear-gradient(180deg, hsl(var(--background)) 0%, hsl(var(--primary)) 60%, hsl(var(--accent)) 100%)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="container mx-auto px-8">
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="space-y-12">
                  <div>
                    <h2 className="text-accent text-lg font-medium mb-5">
                      Navigation
                    </h2>
                    <nav className="space-y-2">
                      {[
                        { label: "Jobs", to: "/jobs" },
                        { label: "Companies", to: "/companies" },
                        { label: "Resources", to: "/resources" },
                        { label: "About Us", to: "/about" },
                        { label: "Contact", to: "/contact" },
                      ].map((item, i) => (
                        <motion.div
                          key={item.label}
                          custom={i}
                          variants={menuItemVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className="origin-left"
                        >
                          <Link
                            to={item.to}
                            className="flex items-center group py-3 text-3xl font-bold text-[var(--foreground)] hover:text-accent transition-colors"
                          >
                            <span className="bg-background/10 w-10 h-10 flex items-center justify-center rounded-full mr-4 group-hover:bg-accent/20 transition-colors">
                              {i + 1}
                            </span>
                            {item.label}
                          </Link>
                        </motion.div>
                      ))}
                    </nav>
                  </div>
                </div>

                <div className="space-y-12">
                  <div>
                    <h2 className="text-accent text-lg font-medium mb-5">
                      Quick Links
                    </h2>
                    <nav className="grid grid-cols-2 gap-2">
                      {[
                        "Career Blog",
                        "Job Applications",
                        "Resume Builder",
                        "Salary Guide",
                        "Interview Tips",
                        "Success Stories",
                      ].map((item, i) => (
                        <motion.a
                          key={item}
                          href="#"
                          custom={i}
                          variants={menuItemVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className="py-2 text-[var(--foreground)]/80 hover:text-accent transition-colors text-sm flex items-center"
                        >
                          <span className="w-1 h-1 bg-accent rounded-full mr-2"></span>
                          {item}
                        </motion.a>
                      ))}
                    </nav>
                  </div>

                  <div className="flex flex-col gap-4 mt-8">
                    {!session && (
                      <Link to="/login">
                        <Button className="w-full bg-accent hover:bg-accent/80 text-accent-foreground font-medium">
                          Sign In
                        </Button>
                      </Link>
                    )}
                    {!session && (
                      <Link to="/signup">
                        <Button className="w-full bg-accent hover:bg-accent/80 text-accent-foreground font-medium">
                          Sign Up
                        </Button>
                      </Link>
                    )}
                    {session && (
                      <Link to="/admin" className="w-full">
                        <Button className="w-full bg-accent hover:bg-accent/80 text-accent-foreground font-medium">
                          Go to Dashboard
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AnimatedHeader;
