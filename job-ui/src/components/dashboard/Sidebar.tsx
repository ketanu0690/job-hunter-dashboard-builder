import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  Briefcase,
  Users,
  LineChart,
  Sparkles,
  Settings,
  PenTool,
  ChevronLeft,
  ChevronRight,
  LinkedinIcon,
} from "lucide-react";
import { cn } from "../../lib/utils";

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, route: "/dashboard" },
    {
      id: "linkedin",
      label: "LinkedIn",
      icon: LinkedinIcon,
      subItems: [
        { id: "easy-apply", label: "Easy Apply", route: "/linkedin/easy-apply" },
        { id: "connections", label: "Smart Connections", route: "/linkedin/connections" },
        { id: "messages", label: "Message Templates", route: "/linkedin/messages" },
      ],
    },
    {
      id: "naukri",
      label: "Naukri",
      icon: Briefcase,
      subItems: [
        { id: "naukri-apply", label: "Quick Apply", route: "/naukri/quick-apply" },
        { id: "resume", label: "Resume Tailoring", route: "/naukri/resume" },
      ],
    },
    {
      id: "content",
      label: "Content",
      icon: PenTool,
      subItems: [
        { id: "blogs", label: "Blogs", route: "/admin/blogs" },
        { id: "jobposts", label: "Job Posts", route: "/admin/job-posts" },
      ],
    },
    { id: "analytics", label: "Analytics", icon: LineChart, route: "/analytics" },
    { id: "recommendations", label: "Recommendations", icon: Sparkles, route: "/recommendations" },
    {
      id: "community",
      label: "Community",
      icon: Users,
      subItems: [
        { id: "groups", label: "Groups", route: "/community/groups" },
        { id: "featured", label: "Featured", route: "/community/featured" },
      ],
    },
  ];

  const toggleMenu = (id: string) => {
    setExpandedMenus((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Click only navigates for sub-items; main items solely toggle
  const handleClick = (id: string, route?: string, isSub: boolean = false) => {
    if (isSub && route) {
      navigate(route);
    } else if (!isSub && !route) {
      toggleMenu(id);
    }
  };

  const isActive = (route?: string, id?: string) => {
    if (route) return location.pathname === route;
    return location.pathname.includes(id || "");
  };

  return (
    <aside
      className={cn(
        "flex flex-col h-full bg-primary/90 text-primary-foreground border-r border-primary/20 transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo Area */}
      <div className="flex items-center justify-between p-4 border-b border-primary/20">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-gradient-to-br from-accent to-primary flex items-center justify-center">
              <Sparkles size={18} className="text-accent-foreground" />
            </div>
            <span className="font-bold text-primary-foreground">JobFlow</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-full hover:bg-accent/20 transition-colors"
        >
          {collapsed ? (
            <ChevronRight size={16} className="text-primary-foreground" />
          ) : (
            <ChevronLeft size={16} className="text-primary-foreground" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <React.Fragment key={item.id}>
              <li>
                <button
                  onClick={() => handleClick(item.id, item.route, false)}
                  className={cn(
                    "flex items-center w-full p-2 rounded-lg transition-all duration-200",
                    isActive(item.route, item.id)
                      ? "bg-accent text-accent-foreground shadow"
                      : "hover:bg-accent/30 text-primary-foreground"
                  )}
                >
                  <item.icon
                    size={18}
                    className={cn(
                      "transition-colors",
                      isActive(item.route, item.id)
                        ? "text-accent-foreground"
                        : "text-primary-foreground"
                    )}
                  />

                  {!collapsed && (
                    <>
                      <span className="ml-3 flex-1 whitespace-nowrap">
                        {item.label}
                      </span>
                      {item.subItems && (
                        <ChevronRight
                          size={16}
                          className={cn(
                            "transition-transform duration-200",
                            expandedMenus.includes(item.id) &&
                              "transform rotate-90"
                          )}
                        />
                      )}
                    </>
                  )}
                </button>
              </li>

              {!collapsed &&
                item.subItems &&
                expandedMenus.includes(item.id) && (
                  <li className="pl-4">
                    <ul className="space-y-1 py-1">
                      {item.subItems.map((subItem) => (
                        <li key={subItem.id}>
                          <button
                            onClick={() => handleClick(subItem.id, subItem.route, true)}
                            className={cn(
                              "flex items-center w-full p-2 rounded-lg transition-all duration-200",
                              isActive(subItem.route, subItem.id)
                                ? "bg-accent text-accent-foreground shadow"
                                : "hover:bg-accent/30 text-primary-foreground/80"
                            )}
                          >
                            <div className="w-1 h-1 rounded-full bg-primary-foreground/50 mr-3"></div>
                            <span className="flex-1 whitespace-nowrap text-sm">
                              {subItem.label}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </li>
                )}
            </React.Fragment>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-primary/20">
        <div className="flex items-center justify-between">
          <button className="p-2 rounded-lg hover:bg-accent/20 transition-colors">
            <Settings size={18} className="text-primary-foreground" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
