/**
 * Componente principal del juego
 * Mejorado con:
 * - Transiciones entre fases
 * - Mejor manejo de estados
 * - Loading states
 * - Animaciones
 */

import React, { Suspense, useEffect, lazy } from "react";
import { useGameStore } from "@/store/useGameStore";

// Lazy loading para mejor performance
const BriefingPhase = lazy(() => import("./BriefingPhase").then((module) => ({ default: module.BriefingPhase })));
const NegotiationPhase = lazy(() => import("./NegotiationPhase").then((module) => ({ default: module.NegotiationPhase })));
const DraftingPhase = lazy(() => import("./DraftingPhase").then((module) => ({ default: module.DraftingPhase })));
const VotingPhase = lazy(() => import("./VotingPhase").then((module) => ({ default: module.VotingPhase })));
const RevealPhase = lazy(() => import("./RevealPhase").then((module) => ({ default: module.RevealPhase })));

const phases = {
  BRIEFING: BriefingPhase,
  NEGOTIATION: NegotiationPhase,
  DRAFTING: DraftingPhase,
  VOTING: VotingPhase,
  REVEAL: RevealPhase,
};

export const Game: React.FC = () => {
  const { phase, isInitialized } = useGameStore();

  // Efecto para manejar transiciones de fase
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [phase]);

  if (!isInitialized) {
    return null;
  }

  const PhaseComponent = phases[phase];

  return (
    <div className="min-h-screen fade-in">
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-un-blue"></div>
              <p className="text-slate-400">Cargando...</p>
            </div>
          </div>
        }
      >
        <PhaseComponent />
      </Suspense>
    </div>
  );
};
