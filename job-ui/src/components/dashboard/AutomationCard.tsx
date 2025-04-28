import React from "react";
import { cn } from "../../lib/utils";
import { ExternalLink } from "lucide-react";

interface AutomationCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  stats?: {
    label: string;
    value: string | number;
  };
  variant?: "linkedin" | "naukri" | "content";
}

const AutomationCard: React.FC<AutomationCardProps> = ({
  title,
  description,
  icon: Icon,
  stats,
  variant = "linkedin",
}) => {
  const variantStyles = {
    linkedin:
      "border-l-4 border-l-primary bg-gradient-to-r from-primary/10 to-transparent",
    naukri:
      "border-l-4 border-l-green-400 bg-gradient-to-r from-green-100 to-transparent",
    content:
      "border-l-4 border-l-purple-400 bg-gradient-to-r from-purple-100 to-transparent",
  };

  const iconStyles = {
    linkedin: "text-primary",
    naukri: "text-green-500",
    content: "text-purple-500",
  };

  return (
    <div
      className={cn(
        "rounded-xl p-5 transition-all duration-300 hover:translate-x-1 cursor-pointer group shadow-md",
        variantStyles[variant]
      )}
    >
      <div className="flex items-center mb-4">
        <Icon size={20} className={iconStyles[variant]} />
        <h3 className="ml-2 font-semibold text-primary dark:text-primary">
          {title}
        </h3>
        <ExternalLink
          size={14}
          className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-primary/60 dark:text-primary/80"
        />
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
        {description}
      </p>

      {stats && (
        <div className="mt-4 pt-3 border-t border-primary/10">
          <div className="flex justify-between items-center">
            <span className="text-xs text-primary/80 dark:text-primary/60">
              {stats.label}
            </span>
            <span className="text-sm font-medium text-primary dark:text-primary">
              {stats.value}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AutomationCard;
