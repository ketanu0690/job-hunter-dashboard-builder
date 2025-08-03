import React from "react";
import Sidebar from "../../components/dashboard/Sidebar";
import FloatingActionButton from "../../components/dashboard/FloatingActionButton";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen ">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6 md:p-8">{children}</main>
      </div>

      {/* Floating Action Button (fixed to bottom-right) */}
      <FloatingActionButton />
    </div>
  );
};

export default DashboardLayout;
