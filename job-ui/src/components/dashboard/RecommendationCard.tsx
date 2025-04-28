import React from "react";
import { cn } from "../../lib/utils";
import { Sparkles, ChevronRight, Star } from "lucide-react";

interface RecommendationCardProps {
  title: string;
  type: "job" | "skill" | "connection";
  items: Array<{
    id: string;
    title: string;
    description?: string;
    score?: number;
  }>;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({
  title,
  type,
  items,
}) => {
  const typeStyles = {
    job: {
      icon: <Sparkles size={16} className="text-primary" />,
      accent: "border-l-primary",
    },
    skill: {
      icon: <Star size={16} className="text-purple-500" />,
      accent: "border-l-purple-400",
    },
    connection: {
      icon: <Star size={16} className="text-green-500" />,
      accent: "border-l-green-400",
    },
  };

  return (
    <div className="rounded-xl p-5 h-full shadow-md bg-white/90 dark:bg-gray-900/80">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          {typeStyles[type].icon}
          <h3 className="ml-2 font-medium text-primary dark:text-primary">
            {title}
          </h3>
        </div>
        <button className="text-xs text-primary hover:underline flex items-center">
          View All <ChevronRight size={14} className="ml-1" />
        </button>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className={cn(
              "border-l-2 pl-3 py-2 bg-accent/10 rounded-r-md transition-all hover:translate-x-1",
              typeStyles[type].accent
            )}
          >
            <div className="flex justify-between">
              <h4 className="text-sm font-medium text-primary dark:text-primary">
                {item.title}
              </h4>
              {item.score !== undefined && (
                <div className="px-2 rounded-full bg-primary/10 text-xs flex items-center text-primary dark:text-primary">
                  {item.score}%
                </div>
              )}
            </div>
            {item.description && (
              <p className="text-xs text-accent dark:text-accent mt-1">
                {item.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendationCard;
