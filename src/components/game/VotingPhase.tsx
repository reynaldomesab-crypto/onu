/**
 * Fase VOTING: El jugador presenta el borrador. Se invoca predictVetoRisk
 * para evaluar el riesgo de veto antes de la votación simulada.
 */
import React, { useEffect } from "react";
import { useGameStore } from "@/store/useGameStore";
import { Button } from "@/components/ui/Button";
import { DayBudgetBar } from "@/components/ui/DayBudgetBar";
import { PlayerRestrictionNotice } from "@/components/ui/PlayerRestrictionNotice";
import { Badge } from "@/components/ui/Badge";
import { CountryBadge } from "@/components/ui/CountryBadge";
import { predictVetoRisk } from "@/models/vetoModel";

export const VotingPhase: React.FC = () => {
  const {
    currentDay,
    actionBudget,
    maxActionsPerDay,
    currentDraft,
    lastVetoRisk,
    setPhase,
    isLoading,
  } = useGameStore();

  useEffect(() => {
    // Si entramos a esta fase y no hay vetoRisk calculado, calcularlo
    if (currentDraft && !lastVetoRisk) {
      (async () => {
        try {
          const risk = await predictVetoRisk(currentDraft);
          // El store se actualiza via submitDraft, pero aquí se puede precargar
          console.log("Riesgo de veto calculado:", risk);
        } catch (err) {
          console.error("Error calculando riesgo de veto:", err);
        }
      })();
    }
  }, [currentDraft, lastVetoRisk]);

  const handleBackToDrafting = () => {
    setPhase("DRAFTING");
  };

  const handleProceedToReveal = () => {
    setPhase("REVEAL");
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-un-white">Votación</h1>
          <p className="text-slate-400">
            Evaluando el borrador antes de someterlo a votación.
          </p>
        </div>
        <DayBudgetBar day={currentDay} budget={actionBudget} maxBudget={maxActionsPerDay} />
      </div>

      <PlayerRestrictionNotice />

      {!currentDraft ? (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
          <p className="text-slate-400">No hay un borrador activo.</p>
          <Button variant="outline" onClick={handleBackToDrafting}>
            Volver a Redacción
          </Button>
        </div>
      ) : (
        <>
          {/* Información del borrador */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
            <h2 className="text-lg font-semibold text-un-white mb-4">Borrador a Presentar</h2>
            <p className="text-sm text-slate-300 mb-2">
              <span className="font-semibold">Tono:</span> {currentDraft.tone}
            </p>
            <p className="text-sm text-slate-300 mb-2">
              <span className="font-semibold">Cláusulas:</span> {currentDraft.clauses.length}
            </p>
            <ul className="text-sm text-slate-400 mt-2 space-y-1">
              {currentDraft.clauses.map((c) => (
                <li key={c.id} className="flex items-center gap-2">
                  <span>▫</span> {c.text}
                </li>
              ))}
            </ul>
          </div>

          {/* Resultado de predicción de veto (modelo ONNX) */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
            <h2 className="text-lg font-semibold text-un-white mb-4">
              Predicción de Riesgo de Veto (ONNX)
            </h2>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <p className="text-slate-400">Calculando riesgo con el modelo...</p>
              </div>
            ) : lastVetoRisk ? (
              <>
                <div className="mb-4">
                  <p className="text-sm text-slate-400 mb-1">Riesgo Global de Veto</p>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold">
                      {(lastVetoRisk.overallRisk * 100).toFixed(0)}%
                    </span>
                    <div className="w-full bg-slate-700 h-3 rounded-full overflow-hidden">
                      <div
                        className={lastVetoRisk.overallRisk > 0.66 ? "bg-p5-red" : lastVetoRisk.overallRisk > 0.33 ? "bg-amber-500" : "bg-e10-green"}
                        style={{ width: `${lastVetoRisk.overallRisk * 100}%` }}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {lastVetoRisk.recommendation}
                  </p>
                  <p className="text-xs text-slate-600 mt-1">
                    {lastVetoRisk.isSimulated ? "Modo simulado (modelo ONNX no cargado)" : "Modelo ONNX activo"}
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Riesgo por País P5
                  </h3>
                  {Object.entries(lastVetoRisk.riskByCountry).map(([code, risk]) => (
                    <div key={code} className="flex items-center justify-between p-2 bg-slate-900/30 rounded">
                      <CountryBadge country={code} size="sm" />
                      <span className="text-sm font-mono">
                        {(risk * 100).toFixed(0)}%
                      </span>
                      <Badge
                        impact={risk > 0.66 ? "alto" : risk > 0.33 ? "medio" : "bajo"}
                      >
                        {risk > 0.66 ? "Alto" : risk > 0.33 ? "Medio" : "Bajo"}
                      </Badge>
                    </div>
                  ))}
                </div>

                {lastVetoRisk.likelyVetoers.length > 0 && (
                  <div className="mt-3 p-3 rounded bg-p5-red/10 border border-p5-red/30">
                    <p className="text-sm text-p5-red font-semibold">
                      ⚠ Posibles vetoes: {lastVetoRisk.likelyVetoers.join(", ")}
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-400 text-sm">
                  Ejecute la predicción para evaluar el riesgo de veto.
                </p>
              </div>
            )}
          </div>

          {/* Botones de acción */}
          <div className="flex gap-3">
            <Button variant="ghost" onClick={handleBackToDrafting}>
              Volver a Redacción
            </Button>
            <Button
              variant="primary"
              onClick={handleProceedToReveal}
              disabled={!lastVetoRisk}
            >
              Proceder a Revelación
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
