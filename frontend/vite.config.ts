import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isDev = mode === "development";

  return {
    server: {
      host: "0.0.0.0",
      port: 8080,
      proxy: {
        // Proxy API calls during development to the backend
        "/api": {
          target: "http://localhost:3000", // Backend server
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, "/api"), // optional rewrite
        },
      },
    },
    plugins: [
      react(),
      ...(isDev ? [componentTagger()] : []),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
  };
});
