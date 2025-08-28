import { useTheme } from "@/shared/utils/use-theme";
import { ArrowRight, Star, TrendingUp, Zap } from "lucide-react";
import { useState } from "react";
import { apps, categories } from "./constant";
import SpiralApps from "./SpiralApps";

const AppShell = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { theme } = useTheme();

  const filteredApps = apps.filter((app) => {
    const matchesCategory =
      selectedCategory === "all" || app.category === selectedCategory;
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
    <>
      <section className="text-center mb-16">
        <section className="container mx-auto text-center mt-24">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight typing-animation">
            One Place. Endless Possibilities.
          </h2>
          <p className="text-xl max-w-4xl mx-auto leading-relaxed mb-8 fade-in">
            This app brings together multiple platforms into one simple space.
            Read from different sources in one feed. Get AI-powered summaries so
            you save time. Share your thoughts in your own words—no copy-paste
            fluff. Connect with mentors, communities, and people who matter.
            It’s not just another app—it’s your hub to learn, share, and grow.
          </p>
        </section>

        <SpiralApps apps={filteredApps} />

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
                        <span className="text-sm opacity-90">{app.rating}</span>
                      </div>
                    </div>

                    <div className="relative z-10">
                      <h3 className="text-3xl font-bold mb-4">
                        {index === 0
                          ? "Profound features."
                          : "Surprising capabilities."}
                      </h3>

                      <div className="flex items-center space-x-2 mb-4">
                        <span className="text-2xl font-bold">{app.price}</span>
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
            <p className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>
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
          Join millions of users who trust our platform for their daily digital
          needs.
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
    </>
  );
};

export default AppShell;
