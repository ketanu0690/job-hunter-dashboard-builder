import React, { useState } from "react";
import {
  Home,
  Briefcase,
  Users,
  Settings,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  PenBoxIcon,
  Settings2Icon,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useNavigate } from "@tanstack/react-router";

const Sidebar = ({
  collapsed,
  setCollapsed,
}: {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const navigate = useNavigate();

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, route: "/dashboard" },
    { id: "jobs", label: "Jobs", icon: Briefcase, route: "/jobs" },
    { id: "community", label: "Community", icon: Users, route: "/community" },
    { id: "ai", label: "AI Tools", icon: Sparkles, route: "/ai" },
    { id: "blogs", label: "Blogs", icon: PenBoxIcon, route: "/manage-blogs" },
    {
      id: "settings",
      label: "Settings",
      icon: Settings2Icon,
      route: "/settings",
    },
  ];

  const isActive = (route: string) => location.pathname === route;

  return (
    <aside
      className={cn(
        "flex flex-col bg-primary text-primary-foreground border border-primary/20 transition-all duration-300 fixed top-20 left-0",
        collapsed ? "w-16" : "w-64",
        "h-screen" // fixed full height
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-primary/20">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-gradient-to-br from-accent to-primary flex items-center justify-center">
              <Sparkles size={18} />
            </div>
            <span className="font-bold text-sm">JobFlow</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-full hover:bg-accent/20 transition-colors"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 py-6 flex flex-col items-start space-y-2 px-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate({ to: item.route })}
            className={cn(
              "flex items-center w-full p-2 rounded-lg transition-all duration-200",
              isActive(item.route)
                ? "bg-accent text-accent-foreground font-medium shadow"
                : "hover:bg-accent/30"
            )}
          >
            <item.icon size={18} />
            {!collapsed && (
              <span className="ml-3 text-sm whitespace-nowrap">
                {item.label}
              </span>
            )}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
