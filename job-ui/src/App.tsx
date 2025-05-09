// src/App.tsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { Toaster } from "sonner";

import { AuthProvider } from "./components/forms/AuthForm";
import { BlogProvider } from "./hooks/BlogProvider";

// Layouts & Pages
import MainLayout from "./layouts/MainLayout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import BlogManagement from "./pages/BlogManagement";
import LinkedInAutomation from "./pages/LinkedInAutomation";
import NotFound from "./pages/NotFound";

// Components
import BlogShowcase from "./components/blog/BlogShowcase";

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster richColors position="top-right" />

        <BrowserRouter>
          <AuthProvider>
            <BlogProvider>
              <Routes>
                {/* Public Routes */}
                <Route
                  path="/"
                  element={
                    <MainLayout>
                      <Index />
                    </MainLayout>
                  }
                />
                <Route path="/login" element={<Login />} />
                <Route
                  path="/blogs"
                  element={
                    <MainLayout>
                      <BlogShowcase />
                    </MainLayout>
                  }
                />

                {/* Admin Routes */}
                <Route
                  path="/admin"
                  element={
                    <MainLayout>
                      <AdminDashboard />
                    </MainLayout>
                  }
                />
                <Route
                  path="/admin/blogs"
                  element={
                    <MainLayout>
                      <BlogManagement />
                    </MainLayout>
                  }
                />
                <Route
                  path="/admin/linkedin-automation"
                  element={
                    <MainLayout>
                      <LinkedInAutomation />
                    </MainLayout>
                  }
                />

                {/* Fallback */}
                <Route
                  path="*"
                  element={
                    <MainLayout>
                      <NotFound />
                    </MainLayout>
                  }
                />
              </Routes>
            </BlogProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
