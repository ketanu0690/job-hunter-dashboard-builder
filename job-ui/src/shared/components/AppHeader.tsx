import { useState, useEffect } from "react";
import {
  Menu,
  Search,
  Briefcase,
  X,
  Sun,
  Moon,
  Building,
  BookOpen,
  Info,
  Phone,
  LogOut,
  LogIn,
  User,
} from "lucide-react";
import { useTheme } from "../utils/use-theme";
import { useAuth } from "@/providers/AuthProvider";
import { useNavigate } from "@tanstack/react-router";
import { useToast } from "@/hooks/use-toast";
import BrandLogo from "../../../public/assests/Brand_logo.png";
import UniversalSearch from "./UniversalSearch";
const Header = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  const navigate = useNavigate();

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        !target.closest("#user-menu-button") &&
        !target.closest("#user-menu-dropdown")
      ) {
        setUserMenuOpen(false);
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  const handleMenuItemClick = (item) => {
    console.log(`Navigating to: ${item.to}`);
    toast({
      title: "info",
      description: `Opening ${item.label} page`,
    });
    setMobileMenuOpen(false);
  };

  const handleLogin = () => {
    navigate({ to: "/login", search: { redirect: "/dashboard" } });
  };

  const handleLogout = () => {
    logout();
    navigate({ to: "/", search: {} });
    toast({
      title: "Success",
      description: "Logged out successfully!",
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  const menuItems = [
    { label: "KJobs", to: "/jobs", icon: Briefcase },
    { label: "Companies", to: "/companies", icon: Building },
    { label: "Resources", to: "/resources", icon: BookOpen },
    { label: "About Us", to: "/about", icon: Info },
    { label: "Contact", to: "/contact", icon: Phone },
  ];

  const quickLinks = [
    "Career Blog",
    "Job Applications",
    "Resume Builder",
    "Salary Guide",
    "Interview Tips",
    "Success Stories",
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 backdrop-blur transition-all duration-300 ${
          scrolled
            ? `py-2 shadow-md border-b ${theme === "dark" ? "bg-gray-900/80 border-gray-700" : "bg-white/80 border-gray-200"}`
            : "py-2 bg-transparent border-transparent shadow-none"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-8">
          {/* Logo */}
          <div className="flex items-center cursor-pointer group">
            <img
              src={BrandLogo}
              alt="Brand logo"
              className={`${theme === "dark" ? "invert" : ""}`}
              width={40}
              height={40}
            />
            <span
              className={`font-bold text-xl ${
                scrolled
                  ? "text-orange-500"
                  : theme === "dark"
                    ? "text-orange-400"
                    : "text-orange-600"
              }`}
              onClick={() => {
                navigate({ to: "/" });
                setMobileMenuOpen(false);
              }}
            >
              Ketan
              <span
                className={`${scrolled ? `${theme === "dark" ? "text-white" : "text-black"}` : `${theme === "dark" ? "text-white" : "text-black"}`}`}
              >
                One
              </span>
            </span>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex bg-white dark:bg-gray-800 rounded-lg overflow-hidden flex-1 max-w-2xl border border-gray-200 dark:border-gray-600">
            <input
              type="text"
              placeholder="Search apps and services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-3 bg-transparent focus:outline-none"
              onFocus={() => setSearchOpen(true)}
              readOnly
            />
            <button
              onClick={() => setSearchOpen(true)}
              type="button"
              className="bg-orange-500 hover:bg-orange-600 px-6 py-3 transition-colors"
            >
              <Search size={20} className="text-white" />
            </button>
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className={`p-2 rounded-full transition-all hover:scale-110 ${
                theme === "dark"
                  ? "bg-gray-800 hover:bg-gray-700 text-yellow-400"
                  : "bg-white hover:bg-gray-100 text-gray-600 border border-gray-200"
              }`}
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Search Toggle - Mobile */}
            <button className="lg:hidden p-2 rounded-full transition-all hover:scale-110 bg-white/10 hover:bg-white/20">
              <Search size={20} />
            </button>

            {/* User Dropdown */}
            <div className="relative">
              <button
                id="user-menu-button"
                onClick={() => setUserMenuOpen((open) => !open)}
                className={`p-2 rounded-full transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                  theme === "dark"
                    ? "bg-gray-800 text-orange-400"
                    : "bg-gray-100 text-orange-600"
                }`}
                aria-haspopup="true"
                aria-expanded={userMenuOpen}
                aria-label="User menu"
                type="button"
              >
                {user?.username ? (
                  <span className="inline-block w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center font-semibold">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                ) : (
                  <User size={20} />
                )}
              </button>

              {userMenuOpen && (
                <div
                  id="user-menu-dropdown"
                  className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50`}
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu-button"
                >
                  {isAuthenticated ? (
                    <>
                      <button
                        onClick={() => {
                          navigate({ to: "/dashboard" });
                          setUserMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-orange-500 hover:text-white"
                        role="menuitem"
                        type="button"
                      >
                        Dashboard
                      </button>
                      <button
                        onClick={() => {
                          handleLogout();
                          setUserMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-orange-500 hover:text-white"
                        role="menuitem"
                        type="button"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          navigate({
                            to: "/login",
                            search: { redirect: "/dashboard" },
                          });
                          setUserMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-orange-500 hover:text-white"
                        role="menuitem"
                        type="button"
                      >
                        Continue On KOne
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-full transition-all hover:scale-110 ${
                mobileMenuOpen
                  ? "bg-orange-500 text-white"
                  : theme === "dark"
                    ? "bg-gray-800 hover:bg-gray-700"
                    : "bg-white hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>
      {/* Full Screen Menu */}
      {mobileMenuOpen && (
        <div
          className={`fixed inset-0 z-40 flex items-center justify-center ${
            theme === "dark"
              ? "bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900"
              : "bg-gradient-to-br from-gray-600 via-blue-100 to-purple-300"
          }`}
        >
          <div className="container mx-auto px-8 max-h-screen overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 py-8">
              {/* Navigation */}
              <div className="space-y-8">
                <h2 className="text-orange-500 text-lg font-medium mb-5">
                  Navigation
                </h2>
                <nav className="space-y-2">
                  {menuItems.map((item, i) => {
                    const IconComponent = item.icon;
                    return (
                      <div
                        key={item.label}
                        onClick={() => handleMenuItemClick(item)}
                        className="flex items-center group py-3 text-2xl md:text-3xl font-bold hover:text-orange-500 transition-colors cursor-pointer"
                      >
                        <span
                          className={`w-10 h-10 flex items-center justify-center rounded-full mr-4 transition-colors ${
                            theme === "dark"
                              ? "bg-gray-800 group-hover:bg-orange-500/20"
                              : "bg-gray-500 group-hover:bg-orange-500/20"
                          }`}
                        >
                          <IconComponent size={20} />
                        </span>
                        {item.label}
                      </div>
                    );
                  })}
                </nav>
              </div>

              {/* Quick Links & Actions */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-orange-500 text-lg font-medium mb-5">
                    Quick Links
                  </h2>
                  <nav className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {quickLinks.map((item, i) => (
                      <a
                        key={item}
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          alert(`Opening ${item}`);
                        }}
                        className={`py-2 transition-colors text-sm flex items-center hover:text-orange-500 ${
                          theme === "dark" ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        <span className="w-1 h-1 bg-orange-500 rounded-full mr-2"></span>
                        {item}
                      </a>
                    ))}
                  </nav>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-4 mt-8">
                  {!isAuthenticated ? (
                    <>
                      <button
                        onClick={handleLogin}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-full font-medium transition-colors"
                      >
                        Sign In
                      </button>
                      <button
                        onClick={handleLogin}
                        className="w-full border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white py-3 rounded-full font-medium transition-colors"
                      >
                        Sign Up
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        navigate({ to: "/dashboard" });
                        setMobileMenuOpen(false);
                      }}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-full font-medium transition-colors"
                    >
                      Go to Dashboard
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Univarsal Search  */}
      <UniversalSearch
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </>
  );
};

export default Header;
