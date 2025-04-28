import React from "react";
import { cn } from "../../lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface MetricsCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  change?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "success" | "warning" | "info";
}

const MetricsCard: React.FC<MetricsCardProps> = ({
  title,
  value,
  icon: Icon,
  change,
  variant = "default",
}) => {
  const variantStyles = {
    default: "bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20",
    success:
      "bg-gradient-to-br from-green-100 to-primary/10 border-green-400/20",
    warning:
      "bg-gradient-to-br from-yellow-100 to-pink-100 border-yellow-400/20",
    info: "bg-gradient-to-br from-accent/10 to-primary/10 border-accent/20",
  };

  const iconStyles = {
    default: "bg-primary/10 text-primary",
    success: "bg-green-100 text-green-600",
    warning: "bg-yellow-100 text-yellow-600",
    info: "bg-accent/10 text-accent",
  };

  return (
    <div className={cn("rounded-xl p-5 shadow-md", variantStyles[variant])}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-primary/80 dark:text-primary/60">
            {title}
          </p>
          <p className="text-2xl font-bold mt-1 text-primary dark:text-primary">
            {value}
          </p>

          {change && (
            <div className="flex items-center mt-2">
              {change.isPositive ? (
                <TrendingUp size={14} className="text-green-500 mr-1" />
              ) : (
                <TrendingDown size={14} className="text-pink-500 mr-1" />
              )}
              <span
                className={cn(
                  "text-xs",
                  change.isPositive ? "text-green-600" : "text-pink-600"
                )}
              >
                {change.value}% from last week
              </span>
            </div>
          )}
        </div>

        <div className={cn("p-3 rounded-lg", iconStyles[variant])}>
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
};

export default MetricsCard;
