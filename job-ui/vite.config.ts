import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import {
  tanstackRouter,
  TanStackRouterVite,
} from "@tanstack/router-plugin/vite";

export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 8080,
    strictPort: true,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
        rewrite: (p) => p.replace(/^\/api/, "/api"),
      },
    },
  },
  plugins: [
    react(), // ✅ React first
    tanstackRouter({
      target: "react",
      routesDirectory: "src/routes",
      autoCodeSplitting: false,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
