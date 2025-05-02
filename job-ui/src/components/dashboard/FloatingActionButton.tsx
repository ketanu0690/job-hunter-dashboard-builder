import React, { useState } from "react";
import { Plus, X, FileText, Users, PenTool } from "lucide-react";
import { cn } from "../../lib/utils";

interface ActionItem {
  icon: React.ElementType;
  label: string;
  color: string;
}

const FloatingActionButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const actionItems: ActionItem[] = [
    { icon: FileText, label: "New Job Post", color: "bg-green-600" },
    { icon: PenTool, label: "New Blog", color: "bg-neon-purple" },
    { icon: Users, label: "New Connection", color: "bg-neon-green" },
  ];

  return (
    <div className="fixed right-6 bottom-6 z-10 flex flex-col-reverse items-end space-y-2 space-y-reverse">
      {isOpen && (
        <div className="flex flex-col-reverse gap-3 mb-4 items-end">
          {actionItems.map((item, index) => (
            <button
              key={index}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg shadow-lg transition-all",
                "bg-futuristic-card hover:translate-x-[-4px]",
                "animate-fade-in origin-right",
                `animate-delay-${index * 100}`
              )}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <span className="text-sm text-white">{item.label}</span>
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center",
                  item.color
                )}
              >
                <item.icon size={14} className="text-white" />
              </div>
            </button>
          ))}
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center transition-all animate-pulse-glow",
          isOpen
            ? "bg-background text-futuristic-dark"
            : "bg-neon-green text-futuristic-dark"
        )}
      >
        {isOpen ? <X size={20} /> : <Plus size={20} />}
      </button>
    </div>
  );
};

export default FloatingActionButton;
