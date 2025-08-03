import React from "react";
import Header from "../components/AppHeader";
import AppFooter from "../components/AppFooter";
import { Toaster } from "../ui/toaster";
import { useTheme } from "../utils/use-theme";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { theme } = useTheme();
  return (
    <div className=" text-foreground min-h-screen">
      <Header />
      <main
        className={`min-h-screen transition-colors duration-300  px-4 pt-24 pb-8 ${
          theme === "dark"
            ? "bg-black text-white"
            : "bg-gradient-to-br from-gray-50 to-blue-50 text-gray-900"
        }`}
      >
        {children}
      </main>
      <AppFooter />
      <Toaster />
    </div>
  );
};

export default MainLayout;
