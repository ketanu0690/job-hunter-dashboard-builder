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
import BlogListPage from "./pages/BlogListPage";
import BlogCreatePage from "./pages/BlogCreatePage";
import BlogEditPage from "./pages/BlogEditPage";
import NotFound from "./pages/NotFound";
import Header from "./components/Header";

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        
        <BrowserRouter>
          <AuthProvider>
          <Header/>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/blogs" element={<BlogManagement />} />
              <Route
                path="/linkedin-automation"
                element={<LinkedInAutomation />}
              />
              <Route path="/blogs" element={<BlogListPage />} />
              <Route path="/blogs/create" element={<BlogCreatePage />} />
              <Route path="/blogs/edit/:id" element={<BlogEditPage />} />
              {/* 404 Catch All */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
