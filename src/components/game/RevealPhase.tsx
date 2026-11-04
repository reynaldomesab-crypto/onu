/**
 * Fase REVEAL: Muestra el resultado de la votación simulada y lo compara
 * con un "resultado histórico" de ejemplo.
 */
import React from "react";
import { useGameStore } from "@/store/useGameStore";
import { Button } from "@/components/ui/Button";
import { DayBudgetBar } from "@/components/ui/DayBudgetBar";
import { PlayerRestrictionNotice } from "@/components/ui/PlayerRestrictionNotice";
import { CountryBadge } from "@/components/ui/CountryBadge";
import { cn } from "@/utils/cn";

export const RevealPhase: React.FC = () => {
  const {
    currentDay,
    actionBudget,
    maxActionsPerDay,
    currentDraft,
    lastVoteResult,
    historicalResult,
    setPhase,
    nextDay,
    lastVetoRisk,
    pendingConsequence,
    consequences,
  } = useGameStore();

  const handleNewDay = () => {
    nextDay();
  };

  const handleBackToBriefing = () => {
    setPhase("BRIEFING");
  };

  if (!lastVoteResult || !currentDraft) {
    return (
      <div className="p-4 text-center">
        <h1 className="text-2xl font-bold text-un-white">Revelación</h1>
        <p className="text-slate-400 mt-2">No hay resultados para mostrar.</p>
        <Button variant="outline" onClick={handleBackToBriefing}>
          Volver al Briefing
        </Button>
      </div>
    );
  }

  const approved = lastVoteResult ? lastVoteResult.approved : false;
  const vetoes = lastVoteResult ? lastVoteResult.vetoes : [];
  const pending = approved ? pendingConsequence : null;
  const published = pending
    ? consequences.find((c) => c.resolutionId === currentDraft?.id) ?? null
    : null;

  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-un-white">Revelación del Resultado</h1>
          <p className="text-slate-400">Resultado de la votación del borrador.</p>
        </div>
        <DayBudgetBar day={currentDay} budget={actionBudget} maxBudget={maxActionsPerDay} />
      </div>

      <PlayerRestrictionNotice />

      {/* Resultado principal */}
      <div className={cn(
        "p-6 rounded-2xl border text-center",
        approved
          ? "bg-emerald-500/10 border-emerald-500/30"
          : "bg-p5-red/10 border-p5-red/30"
      )}>
        <div className="text-6xl font-bold mb-2">
          {approved ? "✅" : "❌"}
        </div>
        <h2 className="text-3xl font-bold mb-1">
          {approved ? "RESOLUCIÓN APROBADA" : "RESOLUCIÓN RECHAZADA"}
        </h2>
        <p className="text-slate-300">
          {approved
            ? "Su borrador ha sido aprobado por el Consejo de Seguridad."
            : `Su borrador ha sido bloqueado${vetoes.length > 0 ? ` por veto de: ${vetoes.join(", ")}` : ""}.`}
        </p>
      </div>

      {/* Detalles de la votación */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
          <p className="text-xs text-slate-400 uppercase">A Favor</p>
          <p className="text-2xl font-bold text-e10-green">{lastVoteResult.votesFor}</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
          <p className="text-xs text-slate-400 uppercase">En Contra</p>
          <p className="text-2xl font-bold text-p5-red">{lastVoteResult.votesAgainst}</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
          <p className="text-xs text-slate-400 uppercase">Abstenciones</p>
          <p className="text-2xl font-bold text-slate-400">{lastVoteResult.abstentions}</p>
        </div>
      </div>

      {/* Vetos */}
      {vetoes.length > 0 && (
        <div className="bg-slate-800/50 border border-p5-red/30 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-p5-red mb-2">Vetos Ejercidos (P5)</h3>
          <div className="flex gap-2">
            {vetoes.map((code) => (
              <CountryBadge key={code} country={code} />
            ))}
          </div>
        </div>
      )}

      {/* Comparación con resultado histórico */}
      {historicalResult && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
          <h2 className="text-lg font-semibold text-un-white mb-4">Comparación Histórica</h2>
          <p className="text-sm text-slate-300 mb-3">
            <span className="font-semibold">Resolución histórica:</span> {historicalResult.title}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-slate-900/30">
              <p className="text-xs text-slate-400 uppercase">Su Resultado</p>
              <p className="text-sm font-semibold">
                {lastVoteResult.approved ? "Aprobada" : "Rechazada"}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-slate-900/30">
              <p className="text-xs text-slate-400 uppercase">Resultado Histórico</p>
              <p className="text-sm font-semibold">
                {historicalResult.voteResult.approved ? "Aprobada" : "Rechazada"}
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3">
            {historicalResult.comment}
          </p>
        </div>
      )}

      {/* Predicción de veto vs realidad */}
      {lastVetoRisk && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
          <h2 className="text-lg font-semibold text-un-white mb-4">Predicción vs Realidad</h2>
          <p className="text-sm text-slate-300 mb-3">
            El modelo predijo un riesgo global de
            <span className="font-semibold">
              {(lastVetoRisk.overallRisk * 100).toFixed(0)}%
            </span>
          </p>
          <p className="text-xs text-slate-500">
            {lastVetoRisk.isSimulated
              ? "Nota: La predicción se realizó en modo simulado (modelo ONNX no cargado)."
              : "Nota: La predicción se realizó con el modelo ONNX local."}
          </p>
        </div>
      )}

      {/* Espera de publicación de consecuencias (si fue aprobada) */}
      {approved && pending && !published && (
        <div className="bg-slate-800/50 border border-un-blue/30 rounded-xl p-5 text-center">
          <h2 className="text-lg font-semibold text-un-white mb-2">Publicación Programada</h2>
          <p className="text-sm text-slate-300">
            La resolución aprobada se publicará como resultado de la redacción en{" "}
            <span className="font-semibold text-un-white">{pending.daysUntilPublication} días</span>.
          </p>
        </div>
      )}

      {/* Consecuencias publicadas de la resolución aprobada */}
      {published && (
        <div className="bg-slate-800/50 border border-emerald-500/30 rounded-xl p-5">
          <h2 className="text-lg font-semibold text-un-white mb-4">Consecuencias Publicadas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-slate-900/30">
              <p className="text-xs text-slate-400 uppercase">Familias alcanzadas (ayuda)</p>
              <p className="text-xl font-bold text-e10-green">{published.aidFamiliesReached}</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-900/30">
              <p className="text-xs text-slate-400 uppercase">Sobrecosto logístico</p>
              <p className="text-xl font-bold text-amber-400">{published.logisticsOvercostPct}%</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-900/30">
              <p className="text-xs text-slate-400 uppercase">Efectividad de la misión</p>
              <p className="text-xl font-bold text-un-blue">{published.missionEffective ? "Efectiva" : "Inefectiva"}</p>
            </div>
          </div>
          {published.secondaryRisks.length > 0 && (
            <p className="text-xs text-slate-400 mt-3">Riesgos secundarios: {published.secondaryRisks.join(", ")}</p>
          )}
        </div>
      )}

      {/* Acciones finales */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={handleBackToBriefing}>
          Volver al Briefing
        </Button>
        <Button
          variant="primary"
          onClick={handleNewDay}
          disabled={actionBudget < 1}
        >
          Nuevo Día (1 acción)
        </Button>
      </div>
    </div>
  );
};

