import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/integrations/supabase/client";

const UserDropdown = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { session, setSession } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    navigate({ to: "/login" });
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((prev) => !prev)}
        className="p-2 text-foreground/80 hover:text-accent transition-colors bg-background/5 rounded-full"
      >
        <User size={20} />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-40 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg shadow-lg z-50"
          >
            <div className="flex flex-col px-4 py-2">
              {!session && (
                <>
                  <Link to="/login">
                    <button className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-accent py-1 text-left w-full">
                      Sign In
                    </button>
                  </Link>
                  <Link to="/login">
                    <button className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-accent py-1 text-left w-full">
                      Sign Up
                    </button>
                  </Link>
                </>
              )}
              {session && (
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-red-500 hover:text-red-600 py-1 text-left w-full"
                >
                  Logout
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserDropdown;
