/**
 * Componente LoadingSpinner mejorado
 * Mejoras:
 * - Mejor manejo de responsive
 * - Mejor animación
 * - Varias variantes
 */

import React from "react";
import { cn } from "@/utils/cn";

type SpinnerSize = "sm" | "md" | "lg" | "xl";
type SpinnerColor = "primary" | "secondary" | "success" | "warning" | "error";

interface LoadingSpinnerProps {
  size?: SpinnerSize;
  color?: SpinnerColor;
  text?: string;
  className?: string;
}

const spinnerSizes = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-10 h-10",
  xl: "w-16 h-16",
};

const spinnerColors = {
  primary: "border-un-blue border-t-transparent",
  secondary: "border-slate-600 border-t-slate-400",
  success: "border-e10-green border-t-transparent",
  warning: "border-amber-500 border-t-transparent",
  error: "border-p5-red border-t-transparent",
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  color = "primary",
  text,
  className = ""
}) => {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className={cn(
          "rounded-full border-2 animate-spin",
          spinnerSizes[size],
          spinnerColors[color]
        )}
      />
      {text && <p className="text-sm text-slate-400">{text}</p>}
    </div>
  );
};

export const FullScreenLoader: React.FC<{ text?: string }> = ({ text }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <LoadingSpinner size="xl" text={text} />
    </div>
  );
};

export const InlineLoader: React.FC<{ size?: SpinnerSize; text?: string }> = ({
  size,
  text
}) => {
  return <LoadingSpinner size={size} text={text} />;
};
