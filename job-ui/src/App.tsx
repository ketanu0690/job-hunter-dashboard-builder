import { Toaster } from "sonner";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import LinkedInAutomation from "./pages/LinkedInAutomation";
import NotFound from "./pages/NotFound";
import BlogListPage from "./pages/BlogListPage";
import BlogCreatePage from "./pages/BlogCreatePage";
import BlogEditPage from "./pages/BlogEditPage";
import React from "react";
import { AuthProvider } from "./components/forms/AuthForm";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route
              path="/linkedin-automation"
              element={<LinkedInAutomation />}
            />
            <Route path="/blogs" element={<BlogListPage />} />
            <Route path="/blogs/create" element={<BlogCreatePage />} />
            <Route path="/blogs/edit/:id" element={<BlogEditPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
