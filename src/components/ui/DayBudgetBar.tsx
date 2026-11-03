/**
 * Componente DayBudgetBar mejorado
 * Mejoras:
 * - Mejor manejo de responsive
 * - Mejor animación de barra
 * - Mejor visualización del progreso
 */

import React, { useEffect } from "react";
import { cn } from "@/utils/cn";

interface DayBudgetBarProps {
  day: number;
  budget: number;
  maxBudget: number;
  animated?: boolean;
}

export const DayBudgetBar: React.FC<DayBudgetBarProps> = ({
  day,
  budget,
  maxBudget,
  animated = true
}) => {
  const percentage = (budget / maxBudget) * 100;
  const colorClass =
    percentage > 60 ? "bg-e10-green" :
    percentage > 30 ? "bg-amber-500" : "bg-p5-red";

  useEffect(() => {
    if (animated) {
      // Reiniciar animación al cambiar
    }
  }, [budget, animated]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center text-sm font-semibold text-slate-300">
        <span className="flex items-center gap-2">
          <span className="text-lg">📅</span>
          Día {day}
        </span>
        <span className="flex items-center gap-2">
          <span className="text-lg">⚡</span>
          Acciones: {budget}/{maxBudget}
        </span>
      </div>
      <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden border border-slate-700 shadow-inner">
        <div
          className={cn(
            "h-full transition-all duration-500 ease-out",
            colorClass,
            animated && "animate-fill"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-xs text-slate-500 text-center">
        {budget === maxBudget && "¡Acciones completadas!"}
        {budget < maxBudget && budget > 0 && `Quedan ${maxBudget - budget} acciones`}
      </p>
    </div>
  );
};

// Agregar keyframes para la animación
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fill {
      from { width: 0%; }
      to { width: var(--target-width); }
    }
    .animate-fill {
      animation: fill 0.5s ease-out forwards;
    }
  `;
  document.head.appendChild(style);
}
