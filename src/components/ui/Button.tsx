/**
 * Componente Button mejorado
 * Mejoras:
 * - Mejor manejo de focus states
 * - Mejor loading state
 * - Mejor hover effects
 * - Mejor disabled state
 */

import React from "react";
import { cn } from "@/utils/cn";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "outline" | "success";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      disabled,
      loading,
      children,
      icon,
      fullWidth,
      ...props
    },
    ref
  ) => {
    const variants = {
      primary: "bg-un-blue hover:bg-blue-600 text-white shadow-lg shadow-blue-500/20",
      secondary: "bg-slate-700 hover:bg-slate-600 text-white shadow-lg shadow-slate-500/20",
      danger: "bg-p5-red hover:bg-red-600 text-white shadow-lg shadow-red-500/20",
      success: "bg-e10-green hover:bg-green-600 text-white shadow-lg shadow-green-500/20",
      ghost: "bg-transparent hover:bg-slate-800 text-slate-300",
      outline: "border border-slate-600 bg-transparent hover:bg-slate-800 text-slate-300",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm",
          "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-un-blue",
          "active:scale-95",
          "whitespace-nowrap",
          fullWidth && "w-full",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {loading && <span className="animate-spin">⟳</span>}
        {icon && !loading && <span>{icon}</span>}
        <span>{children}</span>
      </button>
    );
  }
);

Button.displayName = "Button";
