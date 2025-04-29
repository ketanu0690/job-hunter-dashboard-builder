import { useState, useEffect } from "react";

type Theme = "light" | "dark";
/**
 * Custom hook to manage the theme of the application.
 * It uses local storage to persist the theme.
 * @returns {[Theme, (theme: Theme) => void]} An array containing the current theme and a function to set the theme.
 */
const useTheme = (): [Theme, (theme: Theme) => void] => {
  const [theme, setTheme] = useState<Theme>("light");

    /**
     * This effect is used to set the theme when the component is mounted.
     * It will check if there is a theme in local storage.
     * If there is, it will set the theme to that value.
     * If not, it will set the theme to "light".
     * It also sets the "data-theme" attribute of the html element.
     * Finally, it sets the "dark" class to the html element if the theme is "dark".
     */
  
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") as Theme | null;
    if (storedTheme) {
      setTheme(storedTheme);
    } else {
      setTheme("light");
    }
    document.documentElement.setAttribute("data-theme", theme);

    if (theme === "dark") {
        document.documentElement.classList.add("dark");
    } else {
        document.documentElement.classList.remove("dark");
    }
  }, []);
    /**
     * This effect is used to save the theme in local storage whenever the theme changes.
     * It also sets the "data-theme" attribute of the html element.
     * Finally, it sets the "dark" class to the html element if the theme is "dark", or removes it if it's light.
     */
  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return [theme, setTheme];
};

export default useTheme;