import React from "react";
import Header from "../components/homePage/AnimatedHeader";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <Header />
      <div className="h-20" />
      <main>{children}</main>
    </div>
  );
};

export default MainLayout;
