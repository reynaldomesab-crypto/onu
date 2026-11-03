/**
 * Componente Badge mejorado
 * Mejoras:
 * - Mejor manejo de responsive
 * - Mejor hover effects
 * - Mejor animaciones
 */

import React from "react";
import { cn } from "@/utils/cn";

type Impact = "bajo" | "medio" | "alto";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  impact?: Impact;
  variant?: "impact" | "risk" | "default" | "success" | "warning" | "error";
  size?: "sm" | "md" | "lg";
  animated?: boolean;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, impact, variant = "default", size = "md", animated = false, children, ...props }, ref) => {
    const impactColors: Record<Impact, string> = {
      bajo: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30",
      medio: "bg-amber-500/20 text-amber-400 border-amber-500/30 hover:bg-amber-500/30",
      alto: "bg-rose-500/20 text-rose-400 border-rose-500/30 hover:bg-rose-500/30",
    };

    const variantColors: Record<string, string> = {
      impact: "bg-slate-700/50 text-slate-300",
      risk: "bg-p5-red/20 text-p5-red border-p5-red/30 hover:bg-p5-red/30",
      default: "bg-slate-700/50 text-slate-300",
      success: "bg-e10-green/20 text-e10-green border-e10-green/30 hover:bg-e10-green/30",
      warning: "bg-amber-500/20 text-amber-400 border-amber-500/30 hover:bg-amber-500/30",
      error: "bg-p5-red/20 text-p5-red border-p5-red/30 hover:bg-p5-red/30",
    };

    const sizes = {
      sm: "px-2 py-0.5 text-xs",
      md: "px-2.5 py-1 text-xs",
      lg: "px-3 py-1 text-sm",
    };

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full font-medium border transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500",
          animated && "animate-pulse-slow",
          impact && impactColors[impact],
          variant && variantColors[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";
