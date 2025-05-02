import React from "react";
import { cn } from "../../lib/utils";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import { ArrowUpRight, Filter } from "lucide-react";

interface ChartCardProps {
  title: string;
  subtext?: string;
  data: Array<any>;
  dataKey: string;
  className?: string;
}

const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtext,
  data,
  dataKey,
  className,
}) => {
  return (
    <div
      className={cn(
        "rounded-xl p-5 shadow-md bg-background/90 dark:bg-gray-900/80 h-full",
        className
      )}
    >
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="font-medium text-primary dark:text-primary">
            {title}
          </h3>
          {subtext && (
            <p className="text-xs text-accent dark:text-accent mt-1">
              {subtext}
            </p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-1 rounded hover:bg-primary/10 text-primary/60 hover:text-primary transition-colors">
            <Filter size={14} />
          </button>
          <button className="p-1 rounded hover:bg-primary/10 text-primary/60 hover:text-primary transition-colors">
            <ArrowUpRight size={14} />
          </button>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 10, left: -25, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ff" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#0ff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="name"
              stroke="#6c7293"
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: "#2e2e40" }}
            />
            <YAxis
              stroke="#6c7293"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-futuristic-darker p-2 border border-white/10 rounded-md text-xs">
                      <p className="text-green-600 font-medium">{`${payload[0].value}`}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke="#0ff"
              strokeWidth={2}
              dot={{ fill: "#0ff", strokeWidth: 2, r: 4, stroke: "#0a0b16" }}
              activeDot={{
                r: 6,
                stroke: "#0ff",
                strokeWidth: 2,
                fill: "#0a0b16",
              }}
              fillOpacity={1}
              fill="url(#colorGradient)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartCard;
