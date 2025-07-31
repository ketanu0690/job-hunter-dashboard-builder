import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "./globals.css";
import { QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import { queryClient } from "./routerSetup";
import { initializeTheme } from "./shared/types/theme-store";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error(
    "Root element not found. Ensure there's a <div id='root'></div> in your HTML."
  );
}
// Initialize theme from localStorage before rendering app
initializeTheme();

ReactDOM.createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
);
