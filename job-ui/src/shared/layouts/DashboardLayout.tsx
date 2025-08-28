// DashboardLayout.tsx
import React, { useState } from "react";

import FloatingActionButton from "../../components/dashboard/FloatingActionButton";
import Sidebar from "@/components/dashboard/Sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main Content Area */}
      <div
        className={`
          flex flex-1 flex-col overflow-hidden transition-all duration-300
          ${collapsed ? "ml-16" : "ml-56"}
        `}
      >
        <main className="flex-1 overflow-y-auto p-6 md:p-8">{children}</main>
      </div>

      <FloatingActionButton />
    </div>
  );
};

export default DashboardLayout;
