/**
 * Componente CountryBadge mejorado
 * Mejoras:
 * - Mejor manejo de responsive
 * - Mejor hover effects
 * - Mejor animación
 */

import React from "react";
import { cn } from "@/utils/cn";
import { Flag } from "lucide-react";
import { Country } from "@/types";

interface CountryBadgeProps {
  country: Country | string;
  size?: "sm" | "md" | "lg";
  className?: string;
  showFlag?: boolean;
}

export const CountryBadge: React.FC<CountryBadgeProps> = ({
  country,
  size = "md",
  className = "",
  showFlag = false
}) => {
  const c = typeof country === "string"
    ? { code: country, nameEs: country, flag: "🌐", isP5: false }
    : country;

  const sizeClasses = {
    sm: "text-xs px-2 py-1 gap-1",
    md: "text-sm px-3 py-1.5 gap-2",
    lg: "text-base px-4 py-2 gap-2"
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-xl font-medium border transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500",
        "active:scale-95",
        c.isP5
          ? "border-p5-red/30 bg-p5-red/10 text-p5-red hover:bg-p5-red/20 hover:border-p5-red/40"
          : "border-e10-green/30 bg-e10-green/10 text-e10-green hover:bg-e10-green/20 hover:border-e10-green/40",
        sizeClasses[size],
        className
      )}
    >
      {showFlag && (
        <span className="flex-shrink-0" title={`${c.code} - ${c.nameEs}`}>
          <Flag className="w-3 h-3" />
        </span>
      )}
      <span className="flex-shrink-0">{c.flag}</span>
      <span className="flex-shrink-0">{c.nameEs}</span>
    </span>
  );
};

export const CountryFlag: React.FC<{ country: Country }> = ({ country }) => {
  return (
    <span className="text-3xl">{country.flag}</span>
  );
};

export const CountryCode: React.FC<{ code: string }> = ({ code }) => {
  return (
    <span className="font-mono text-xs text-slate-400">
      {code}
    </span>
  );
};
