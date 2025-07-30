import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "./globals.css";
import { QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import { queryClient } from "./routerSetup";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error(
    "Root element not found. Ensure there's a <div id='root'></div> in your HTML."
  );
}

ReactDOM.createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
);
