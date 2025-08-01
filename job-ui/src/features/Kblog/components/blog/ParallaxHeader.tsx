import { useTheme } from "@/shared/utils/use-theme";
import { useNavigate } from "@tanstack/react-router";
import {
  PenLine,
  ShieldCheck,
  CalendarDays,
  LayoutDashboard,
} from "lucide-react";

interface ParallaxHeaderProps {
  title: string;
  isBlogAdmin?: boolean;
}

const ParallaxHeader: React.FC<ParallaxHeaderProps> = ({
  title,
  isBlogAdmin,
}) => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const benefits = [
    {
      icon: <PenLine className="text-purple-500" size={16} />,
      label: "Thought Leadership",
    },
    {
      icon: <ShieldCheck className="text-blue-500" size={16} />,
      label: "Developer Trusted",
    },
    {
      icon: <CalendarDays className="text-teal-500" size={16} />,
      label: "Always Fresh",
    },
  ];

  return (
    <header className="text-center m-16">
      <h1
        className={`text-4xl md:text-5xl font-bold mb-4 leading-tight ${
          theme === "dark" ? " text-gray-800" : " text-gray-400"
        }`}
      >
        {title}
      </h1>
      <p
        className={`text-lg max-w-3xl mx-auto leading-relaxed mb-6 ${
          theme === "dark" ? "text-gray-300" : "text-gray-600"
        }`}
      >
        Dive into insightful articles, engineering deep-dives, and best
        practices—curated for modern developers who love building the future.
      </p>

      <div className="flex flex-wrap justify-center gap-4 mt-4 mb-6">
        {benefits.map(({ icon, label }, i) => (
          <div
            key={i}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium shadow-sm ${
              theme === "dark"
                ? "bg-gray-800 text-gray-100"
                : "bg-white text-gray-800"
            }`}
          >
            {icon}
            <span>{label}</span>
          </div>
        ))}
      </div>

      {isBlogAdmin && (
        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate({ to: "/manageBlog" })}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-full hover:bg-primary/90 transition"
          >
            <LayoutDashboard size={18} />
            Manage
          </button>
        </div>
      )}
    </header>
  );
};

export default ParallaxHeader;
