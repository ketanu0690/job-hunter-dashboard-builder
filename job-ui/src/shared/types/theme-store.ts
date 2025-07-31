import { queryClient } from "@/routerSetup";
import { Theme } from "./theme";

const THEME_QUERY_KEY = ["theme"];

export const getStoredTheme = (): Theme => {
  return (localStorage.getItem("theme") as Theme) || "light";
};

export const setStoredTheme = (theme: Theme) => {
  localStorage.setItem("theme", theme);
  document.documentElement.setAttribute("data-theme", theme);
  document.documentElement.classList.toggle("dark", theme === "dark");
};

export const initializeTheme = () => {
  const stored = getStoredTheme();
  queryClient.setQueryData(THEME_QUERY_KEY, stored);
  setStoredTheme(stored);
};

export const setTheme = (theme: Theme) => {
  console.log("theme", theme);
  queryClient.setQueryData(THEME_QUERY_KEY, theme);
  setStoredTheme(theme);
};

export const getTheme = (): Theme => {
  return queryClient.getQueryData<Theme>(THEME_QUERY_KEY) ?? getStoredTheme();
};

export const themeQueryOptions = {
  queryKey: THEME_QUERY_KEY,
  queryFn: () => getStoredTheme(),
};
