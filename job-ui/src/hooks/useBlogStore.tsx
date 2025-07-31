import { useContext } from "react";
import { BlogContext } from "../providers/BlogProvider";

export const useBlogStore = () => {
  const ctx = useContext(BlogContext);
  if (!ctx) throw new Error('useBlogStore must be used within BlogProvider');
  return ctx;
};
