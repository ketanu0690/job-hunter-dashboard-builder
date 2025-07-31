import React from "react";
import Sidebar from "../../components/dashboard/Sidebar";
import FloatingActionButton from "../../components/dashboard/FloatingActionButton";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <main className="p-6 md:p-8">{children}</main>
      </div>
      <FloatingActionButton />
    </div>
  );
};

export default DashboardLayout;
