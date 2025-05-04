import React from "react";
import AnimatedHeader from "../components/homePage/AnimatedHeader";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="bg-background text-foreground ">
      <AnimatedHeader />
      <main className="pt-24  ">{children}</main>
    </div>
  );
};

export default MainLayout;
