import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./forms/AuthForm";
import ThemeToggle from "./ui/theme-toggle";

const Header: React.FC = () => {
  const { session, setSession } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await import("../integrations/supabase/client").then(
      async ({ supabase }) => {
        await supabase.auth.signOut();
        setSession(null);
        navigate("/login");
      }
    );
  };

  return (
    <header className="w-full py-6 bg-white dark:bg-gray-900 shadow">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-700 dark:text-blue-300">
          <Link to="/">TechJobTracker</Link>
        </h1>
        <nav className="flex items-center gap-6">
          <Link
            to="/"
            className={`text-base font-medium hover:text-blue-700 dark:hover:text-blue-300 transition-colors ${
              location.pathname === "/"
                ? "text-blue-700 dark:text-blue-300 underline"
                : "text-gray-700 dark:text-gray-200"
            }`}
          >
            Home
          </Link>
          <Link
            to="/blogs"
            className={`text-base font-medium hover:text-blue-700 dark:hover:text-blue-300 transition-colors ${
              location.pathname.startsWith("/blogs")
                ? "text-blue-700 dark:text-blue-300 underline"
                : "text-gray-700 dark:text-gray-200"
            }`}
          >
            Blogs
          </Link>
          {session && (
            <Link
              to="/admin"
              className={`text-base font-medium hover:text-blue-700 dark:hover:text-blue-300 transition-colors ${
                location.pathname === "/admin"
                  ? "text-blue-700 dark:text-blue-300 underline"
                  : "text-gray-700 dark:text-gray-200"
              }`}
            >
              Dashboard
            </Link>
          )}
          <ThemeToggle />
          {session && (
            <button
              onClick={handleLogout}
              className="ml-4 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-all"
            >
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
