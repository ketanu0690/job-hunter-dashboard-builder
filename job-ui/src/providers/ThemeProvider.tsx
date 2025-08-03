import React, { createContext, useContext, useEffect, useState } from "react";

// Define type
export type Theme = "light" | "dark";

// Helpers for localStorage
const THEME_STORAGE_KEY = "app_theme";

const getStoredTheme = (): Theme => {
  if (typeof window === "undefined") return "light"; // SSR safe
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  return stored === "dark" || stored === "light" ? stored : "light";
};

const saveTheme = (theme: Theme) => {
  localStorage.setItem(THEME_STORAGE_KEY, theme);
  window.dispatchEvent(new Event("theme-change")); // Optional: cross-tab / in-app updates
};

// Context types
interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

// Context + default
export const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  setTheme: () => {},
  toggleTheme: () => {},
});

// Provider Component
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>(() => getStoredTheme());

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    saveTheme(newTheme);
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // React to cross-tab theme changes
  useEffect(() => {
    const syncTheme = () => setThemeState(getStoredTheme());
    window.addEventListener("theme-change", syncTheme);
    return () => window.removeEventListener("theme-change", syncTheme);
  }, []);

  // Apply theme to <html> class (for Tailwind dark mode)
  useEffect(() => {
    const html = document.documentElement;
    html.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
