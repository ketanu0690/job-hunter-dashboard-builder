
import React from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

const ThemeToggle: React.FC = () => {
  // For now just a UI placeholder since we're using dark mode by default
  return (
    <Button variant="ghost" size="icon" className="text-sidebar-foreground hover:bg-white/10 hover:text-white">
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

export default ThemeToggle;
