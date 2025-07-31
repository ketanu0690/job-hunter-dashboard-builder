import { useQuery } from "@tanstack/react-query";
import { setTheme, themeQueryOptions } from "../types/theme-store";
import { Theme } from "../types/theme";

/**
 * Hook that exposes current theme and setter using TanStack Query
 */
export const useTheme = (): [Theme, (theme: Theme) => void] => {

  const query = useQuery<Theme>(themeQueryOptions);
  const theme = query.data || "light";

  return [theme, setTheme];
};
