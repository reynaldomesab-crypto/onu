/**
 * Componente Progress mejorado
 * Mejoras:
 * - Mejor manejo de responsive
 * - Mejor animación
 * - Mejor visualización
 */

import React from "react";
import { cn } from "@/utils/cn";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  color?: "primary" | "success" | "warning" | "error";
  showValue?: boolean;
  animated?: boolean;
}

const progressSizes = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-4",
};

const progressColors = {
  primary: "bg-un-blue",
  success: "bg-e10-green",
  warning: "bg-amber-500",
  error: "bg-p5-red",
};

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  size = "md",
  color = "primary",
  showValue = false,
  animated = false,
  className,
  ...props
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className="w-full" {...props}>
      <div className="flex justify-between items-center mb-1">
        {showValue && (
          <span className="text-xs text-slate-400 font-medium">
            {Math.round(percentage)}%
          </span>
        )}
      </div>
      <div className={cn(
        "w-full bg-slate-800 rounded-full overflow-hidden transition-all duration-300",
        progressSizes[size]
      )}>
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            progressColors[color],
            animated && "animate-fill"
          )}
          style={{
            width: `${percentage}%`,
            '--target-width': `${percentage}%`
          } as React.CSSProperties}
        />
      </div>
    </div>
  );
};

export const ProgressBar: React.FC<ProgressProps> = Progress;
export const ProgressCircle: React.FC<ProgressProps> = ({ value, max = 100, size = "md", color = "primary", className }) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const radius = size === "sm" ? 20 : size === "md" ? 30 : 40;
  const strokeWidth = 4;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className={cn("relative", className)}>
      <svg
        width={radius * 2 + strokeWidth}
        height={radius * 2 + strokeWidth}
        className="transform -rotate-90"
      >
        <circle
          cx={radius + strokeWidth / 2}
          cy={radius + strokeWidth / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          className="text-slate-800"
        />
        <circle
          cx={radius + strokeWidth / 2}
          cy={radius + strokeWidth / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          stroke={color === "primary" ? "#3b82f6" : color === "success" ? "#16a34a" : color === "warning" ? "#f59e0b" : "#dc2626"}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-semibold text-slate-400">
          {Math.round(percentage)}%
        </span>
      </div>
    </div>
  );
};
