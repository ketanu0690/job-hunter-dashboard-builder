// src/App.tsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { Toaster } from "sonner";

import { AuthProvider } from "./components/forms/AuthForm";

import Index from "./pages/Index";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import BlogManagement from "./pages/BlogManagement";
import LinkedInAutomation from "./pages/LinkedInAutomation";
import NotFound from "./pages/NotFound";

import { BlogProvider } from "./hooks/BlogProvider";
import AnimatedHeader from "./components/homePage/AnimatedHeader";
import MediumFeed from "./components/blog/MediumFeed";
import MainLayout from "./layouts/MainLayout";
const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <AuthProvider>
            <MainLayout>
              <BlogProvider>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/blogs" element={<BlogManagement />} />
                  <Route
                    path="/admin/linkedin-automation"
                    element={<LinkedInAutomation />}
                  />
                  <Route path="/blogs" element={<MediumFeed />} />
                  {/* 404 Catch All */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BlogProvider>
            </MainLayout>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
