import { useState, useEffect } from "react";
import {
  Smartphone,
  Music,
  Camera,
  MessageCircle,
  Calendar,
  Settings,
  CloudRain,
  ShoppingBag,
  Map,
  Heart,
  Calculator,
  ArrowRight,
  Zap,
  Star,
  TrendingUp,
  Briefcase,
  PenIcon,
} from "lucide-react";
import { useTheme } from "@/shared/utils/use-theme";

const AppShell = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [theme] = useTheme();

  // Mock apps data with enhanced functionality
  const apps = [
    {
      id: "kjobs",
      name: "KJobs",
      description: "Professional career platform with AI-powered job matching",
      price: "Free",
      icon: Briefcase,
      color: "from-blue-500 to-blue-700",
      category: "productivity",
      url: "/jobs", // Internal route
      rating: 4.8,
      badge: "Popular",
      features: ["AI Matching", "Resume Builder", "Career Insights"],
      isInternal: true,
    },
    {
      id: "kmusic",
      name: "KMusic Studio",
      description: "Professional audio experience with spatial sound",
      price: "$9.99/month",
      originalPrice: "$14.99",
      icon: Music,
      color: "from-red-500 to-pink-600",
      category: "entertainment",
      url: "https://music.apple.com",
      rating: 4.8,
      badge: "Editor's Choice",
      features: ["Spatial Audio", "Offline Mode", "High Quality"],
    },
    {
      id: "kphotos",
      name: "KPhoto Pro",
      description: "AI-powered photo editing and cloud storage",
      price: "Free",
      icon: Camera,
      color: "from-blue-500 to-cyan-500",
      category: "productivity",
      url: "https://www.icloud.com/photos",
      rating: 4.9,
      badge: "New",
      features: ["AI Enhancement", "Cloud Sync", "RAW Support"],
    },
    {
      id: "kmessages",
      name: "KConnect",
      description: "Secure messaging with end-to-end encryption",
      price: "Free",
      icon: MessageCircle,
      color: "from-green-500 to-emerald-500",
      category: "communication",
      url: "https://messages.google.com",
      rating: 4.7,
      features: ["E2E Encryption", "Group Chat", "File Sharing"],
    },
    {
      id: "kcalendar",
      name: "KSchedule Pro",
      description: "Smart calendar with AI scheduling assistant",
      price: "$4.99/month",
      originalPrice: "$9.99",
      icon: Calendar,
      color: "from-orange-500 to-red-500",
      category: "productivity",
      url: "https://calendar.google.com",
      rating: 4.6,
      badge: "Trending",
      features: ["AI Assistant", "Team Sync", "Smart Reminders"],
    },
    {
      id: "kweather",
      name: "KWeather Plus",
      description: "Hyperlocal weather with beautiful visualizations",
      price: "Free",
      icon: CloudRain,
      color: "from-blue-400 to-blue-600",
      category: "utilities",
      url: "https://weather.com",
      rating: 4.5,
      features: ["Hyperlocal", "Radar Maps", "Alerts"],
    },
    {
      id: "kshopping",
      name: "KShop Smart",
      description: "AI-powered shopping with price comparison",
      price: "Free",
      icon: ShoppingBag,
      color: "from-purple-500 to-pink-500",
      category: "lifestyle",
      url: "https://www.amazon.com",
      rating: 4.4,
      features: ["Price Alerts", "Wish Lists", "Reviews"],
    },
    {
      id: "kmaps",
      name: "KNavigate",
      description: "Advanced navigation with real-time traffic",
      price: "Free",
      icon: Map,
      color: "from-green-400 to-blue-500",
      category: "utilities",
      url: "https://maps.google.com",
      rating: 4.8,
      features: ["Live Traffic", "Offline Maps", "AR View"],
    },
    {
      id: "khealth",
      name: "KWellness",
      description: "Complete health tracking and fitness coaching",
      price: "$6.99/month",
      icon: Heart,
      color: "from-red-400 to-pink-500",
      category: "lifestyle",
      url: "https://www.fitbit.com",
      rating: 4.7,
      features: ["Health Tracking", "AI Coach", "Social Features"],
    },
    {
      id: "kcalculator",
      name: "KCalc Pro",
      description: "Advanced calculator with scientific functions",
      price: "$2.99",
      icon: Calculator,
      color: "from-gray-600 to-gray-800",
      category: "utilities",
      url: "https://calculator.net",
      rating: 4.3,
      features: ["Scientific", "Graphing", "History"],
    },
    {
      id: "kBlog",
      name: "K Blog",
      description: "Read Blogs by ketan",
      price: "Free",
      icon: PenIcon,
      color: "from-gray-600 to-gray-800",
      category: "utilities",
      url: "/blogs",
      rating: 4.3,
      features: ["Scientific", "Graphing", "History"],
    },
  ];

  const categories = [
    { id: "all", name: "All Apps", icon: Smartphone },
    { id: "productivity", name: "Productivity", icon: TrendingUp },
    { id: "entertainment", name: "Entertainment", icon: Music },
    { id: "communication", name: "Communication", icon: MessageCircle },
    { id: "utilities", name: "Utilities", icon: Settings },
    { id: "lifestyle", name: "Lifestyle", icon: Heart },
  ];

  // Filter apps based on category and search
  const filteredApps = apps.filter((app) => {
    const matchesCategory =
      selectedCategory === "all" || app.category === selectedCategory;
    // const matchesSearch =
    //   app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    //   app.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory;
  });

  const handleAppClick = (app) => {
    if (app.isInternal) {
      // Handle internal routing - in a real app, you'd use proper routing
      console.log(`Navigating to internal route: ${app.url}`);
      alert(`Opening ${app.name} - Internal App`);
    } else {
      window.open(app.url, "_blank", "noopener,noreferrer");
    }
  };

  const featuredApps = filteredApps.slice(0, 2);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        theme === "dark"
          ? "bg-black text-white"
          : "bg-gradient-to-br from-gray-50 to-blue-50 text-gray-900"
      }`}
    >
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 pt-24 pb-8">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            The future hits home.
          </h2>
          <p
            className={`text-xl max-w-4xl mx-auto leading-relaxed mb-8 ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Simply connect your favorite devices and transform your house into a
            remarkably smart, convenient, and entertaining home. All with
            enterprise-grade security and privacy.
          </p>

          {/* Benefits */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div
              className={`flex items-center space-x-2 px-4 py-2 rounded-full shadow-sm ${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              }`}
            >
              <Zap className="text-orange-500" size={16} />
              <span className="text-sm font-medium">Lightning Fast</span>
            </div>
            <div
              className={`flex items-center space-x-2 px-4 py-2 rounded-full shadow-sm ${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              }`}
            >
              <Star className="text-yellow-500" size={16} />
              <span className="text-sm font-medium">4.8★ Average Rating</span>
            </div>
            <div
              className={`flex items-center space-x-2 px-4 py-2 rounded-full shadow-sm ${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              }`}
            >
              <TrendingUp className="text-green-500" size={16} />
              <span className="text-sm font-medium">Trending Now</span>
            </div>
          </div>
        </section>

        {/* Featured Apps */}
        {featuredApps.length > 0 && (
          <section className="mb-16">
            <h3 className="text-3xl font-bold mb-8">Featured Applications</h3>
            <div className="grid md:grid-cols-2 gap-8">
              {featuredApps.map((app, index) => {
                const IconComponent = app.icon;
                return (
                  <div
                    key={app.id}
                    className="group cursor-pointer"
                    onClick={() => handleAppClick(app)}
                  >
                    <div
                      className={`bg-gradient-to-br ${app.color} rounded-3xl p-8 text-white min-h-96 flex flex-col justify-between transition-all duration-500 hover:scale-105 hover:shadow-2xl relative overflow-hidden`}
                    >
                      {app.badge && (
                        <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold">
                          {app.badge}
                        </div>
                      )}

                      <div className="relative z-10">
                        <div className="text-sm font-medium mb-4 bg-white/20 rounded-full px-3 py-1 inline-block">
                          {app.name}
                        </div>
                        <div className="flex items-center space-x-2 mb-4">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={16}
                                className="text-yellow-300 fill-current"
                              />
                            ))}
                          </div>
                          <span className="text-sm opacity-90">
                            {app.rating}
                          </span>
                        </div>
                      </div>

                      <div className="relative z-10">
                        <h3 className="text-3xl font-bold mb-4">
                          {index === 0
                            ? "Profound features."
                            : "Surprising capabilities."}
                        </h3>

                        <div className="flex items-center space-x-2 mb-4">
                          <span className="text-2xl font-bold">
                            {app.price}
                          </span>
                          {app.originalPrice && (
                            <span className="text-lg line-through opacity-60">
                              {app.originalPrice}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2 mb-6">
                          {app.features?.slice(0, 2).map((feature, i) => (
                            <span
                              key={i}
                              className="bg-white/20 px-2 py-1 rounded text-xs"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center space-x-4">
                          <button className="bg-white text-gray-900 hover:bg-gray-100 px-6 py-3 rounded-full font-medium transition-colors">
                            Launch App
                          </button>
                          <span className="text-white/80 hover:text-white cursor-pointer flex items-center space-x-1 transition-colors">
                            <span>Learn more</span>
                            <ArrowRight size={16} />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Category Navigation */}
        <section className="mb-8">
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                    selectedCategory === category.id
                      ? "bg-orange-500 text-white shadow-lg scale-105"
                      : theme === "dark"
                        ? "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600"
                        : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200 hover:border-orange-300"
                  }`}
                >
                  <IconComponent size={16} />
                  <span>{category.name}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* App Grid */}
        <section>
          {filteredApps.length === 0 ? (
            <div className="text-center py-12">
              <p
                className={theme === "dark" ? "text-gray-400" : "text-gray-500"}
              >
                No apps found matching your search criteria.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredApps.map((app) => {
                const IconComponent = app.icon;
                return (
                  <div
                    key={app.id}
                    onClick={() => handleAppClick(app)}
                    className="group cursor-pointer"
                  >
                    <div
                      className={`rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-105 border relative ${
                        theme === "dark"
                          ? "bg-gray-800 border-gray-700 hover:border-gray-600"
                          : "bg-white border-gray-100 hover:border-gray-200"
                      }`}
                    >
                      {app.badge && (
                        <div className="absolute top-4 right-4 bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-bold">
                          {app.badge}
                        </div>
                      )}

                      <div
                        className={`w-16 h-16 bg-gradient-to-br ${app.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                      >
                        <IconComponent size={32} className="text-white" />
                      </div>

                      <h3 className="font-bold text-lg mb-1">{app.name}</h3>
                      <p
                        className={`text-sm mb-3 line-clamp-2 ${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {app.description}
                      </p>

                      <div className="flex items-center space-x-2 mb-3">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={12}
                              className="text-yellow-400 fill-current"
                            />
                          ))}
                        </div>
                        <span
                          className={`text-xs ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}
                        >
                          {app.rating}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {app.features?.slice(0, 2).map((feature, i) => (
                          <span
                            key={i}
                            className={`px-2 py-1 rounded text-xs ${
                              theme === "dark"
                                ? "bg-gray-700 text-gray-300"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {feature}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-orange-600 font-bold">
                            {app.price}
                          </span>
                          {app.originalPrice && (
                            <span
                              className={`text-sm line-through ${
                                theme === "dark"
                                  ? "text-gray-500"
                                  : "text-gray-400"
                              }`}
                            >
                              {app.originalPrice}
                            </span>
                          )}
                        </div>
                        <ArrowRight
                          size={16}
                          className={`transition-colors group-hover:text-orange-500 ${
                            theme === "dark" ? "text-gray-500" : "text-gray-400"
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Bottom CTA */}
        <section className="text-center mt-16 py-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl text-white">
          <h3 className="text-3xl font-bold mb-4">
            Ready to transform your digital experience?
          </h3>
          <p className="text-blue-100 mb-8 text-lg">
            Join millions of users who trust our platform for their daily
            digital needs.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => alert("Starting free trial...")}
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-full font-bold transition-colors"
            >
              Start Free Trial
            </button>
            <button
              onClick={() => setSelectedCategory("all")}
              className="border-2 border-white hover:bg-white hover:text-blue-600 text-white px-8 py-3 rounded-full font-bold transition-colors"
            >
              View All Apps
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AppShell;
