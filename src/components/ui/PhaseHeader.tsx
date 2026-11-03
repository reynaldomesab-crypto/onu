/**
 * Componente PhaseHeader mejorado
 * Mejoras:
 * - Mejor manejo de responsive
 * - Mejor animación
 * - Mejor visualización
 */

import React from "react";
import { cn } from "@/utils/cn";
import { GamePhase } from "@/types";
import { Activity, MessageCircle, FileText, Vote, CheckCircle } from "lucide-react";

const phaseLabels: Record<GamePhase, string> = {
  BRIEFING: "Briefing Diario",
  NEGOTIATION: "Negociación",
  DRAFTING: "Redacción",
  VOTING: "Votación",
  REVEAL: "Revelación",
};

const phaseIcons: Record<GamePhase, React.ReactNode> = {
  BRIEFING: <Activity className="w-4 h-4" />,
  NEGOTIATION: <MessageCircle className="w-4 h-4" />,
  DRAFTING: <FileText className="w-4 h-4" />,
  VOTING: <Vote className="w-4 h-4" />,
  REVEAL: <CheckCircle className="w-4 h-4" />,
};

const phaseColors: Record<GamePhase, string> = {
  BRIEFING: "bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30",
  NEGOTIATION: "bg-purple-500/20 text-purple-400 border-purple-500/30 hover:bg-purple-500/30",
  DRAFTING: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30 hover:bg-indigo-500/30",
  VOTING: "bg-orange-500/20 text-orange-400 border-orange-500/30 hover:bg-orange-500/30",
  REVEAL: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30",
};

interface PhaseHeaderProps {
  phase: GamePhase;
  animated?: boolean;
}

export const PhaseHeader: React.FC<PhaseHeaderProps> = ({
  phase,
  animated = false
}) => {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-bold border uppercase tracking-wider transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500",
        "hover:scale-105",
        animated && "animate-pulse-slow",
        phaseColors[phase]
      )}
    >
      {phaseIcons[phase]}
      <span className="flex-shrink-0">{phaseLabels[phase]}</span>
    </div>
  );
};

export const PhaseIndicator: React.FC<{ phase: GamePhase; active: boolean }> = ({
  phase,
  active
}) => {
  return (
    <div
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200",
        active
          ? "bg-slate-700/50 text-slate-200"
          : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"
      )}
    >
      {phaseIcons[phase]}
      <span className="text-sm font-medium">{phaseLabels[phase]}</span>
    </div>
  );
};
