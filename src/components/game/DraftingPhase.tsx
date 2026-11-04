/**
 * Fase DRAFTING: Interfaz de redacción guiada.
 * El jugador selecciona cláusulas predefinidas. Cada cláusula muestra impacto
 * y riesgo de veto estimado por cada P5. El borrador se construye visualmente.
 */
import React, { useState } from "react";
import { useGameStore } from "@/store/useGameStore";
import { Clause, Draft } from "@/types";
import { Button } from "@/components/ui/Button";
import { DayBudgetBar } from "@/components/ui/DayBudgetBar";
import { PlayerRestrictionNotice } from "@/components/ui/PlayerRestrictionNotice";
import { Badge } from "@/components/ui/Badge";
import { CountryBadge } from "@/components/ui/CountryBadge";
import { cn } from "@/utils/cn";
import { CLAUSES } from "@/types/clauses";
import { P5_COUNTRIES } from "@/types/countries";

export const DraftingPhase: React.FC = () => {
  const {
    currentDay,
    actionBudget,
    maxActionsPerDay,
    currentDraft,
    setPhase,
    useAction,
    createDraft,
    addClauseToDraft,
    removeClauseFromDraft,
    setDraftTone,
    clearDraft,
    submitDraft,
    isLoading,
  } = useGameStore();

  const [draftTone, setDraftToneLocal] = useState<Draft["tone"]>("equilibrado");

  const clausesByType = CLAUSES.reduce((acc, clause) => {
    if (!acc[clause.type]) acc[clause.type] = [];
    acc[clause.type].push(clause);
    return acc;
  }, {} as Record<string, Clause[]>);

  const handleCreateDraft = () => {
    if (currentDraft) return;
    if (!useAction(1)) return;
    createDraft(draftTone);
    setDraftToneLocal(draftTone);
  };

  const handleAddClause = (clauseId: string) => {
    if (!currentDraft) {
      // Crear borrador automáticamente si no existe
      if (!useAction(1)) return;
      createDraft(draftTone);
      setDraftToneLocal(draftTone);
    }
    addClauseToDraft(clauseId);
  };

  const handleRemoveClause = (clauseId: string) => {
    removeClauseFromDraft(clauseId);
  };

  const handleBackToBriefing = () => {
    setPhase("BRIEFING");
  };

  const handleSubmit = () => {
    if (!currentDraft || currentDraft.clauses.length === 0) return;
    submitDraft();
  };

  if (!currentDraft) {
    return (
      <div className="p-4 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-un-white">Redacción de Borrador</h1>
            <p className="text-slate-400">
              Seleccione cláusulas para construir su resolución. Cada cláusula muestra su impacto y riesgo de veto.
            </p>
          </div>
          <DayBudgetBar day={currentDay} budget={actionBudget} maxBudget={maxActionsPerDay} />
        </div>

        <PlayerRestrictionNotice />

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
          <h2 className="text-lg font-semibold text-un-white mb-4">Nuevo Borrador</h2>
          <div className="flex justify-center gap-3 mb-6">
            {["conciliador", "equilibrado", "firmo"].map((tone) => (
              <Button
                key={tone}
                variant={draftTone === tone ? "primary" : "outline"}
                size="sm"
                onClick={() => setDraftToneLocal(tone as Draft["tone"])}
              >
                {tone.charAt(0).toUpperCase() + tone.slice(1)}
              </Button>
            ))}
          </div>
          <Button
            variant="primary"
            size="lg"
            onClick={handleCreateDraft}
            disabled={actionBudget < 1}
          >
            Crear Borrador
          </Button>
        </div>
      </div>
    );
  }

  const totalImpact = currentDraft.clauses.reduce(
    (sum, c) => sum + (c.impact === "alto" ? 3 : c.impact === "medio" ? 2 : 1),
    0
  );

  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-un-white">Redacción</h1>
          <p className="text-slate-400">
            Borrador #{currentDraft.id.split("-")[1]}
          </p>
        </div>
        <DayBudgetBar day={currentDay} budget={actionBudget} maxBudget={maxActionsPerDay} />
      </div>

      <PlayerRestrictionNotice />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel izquierdo: Cláusulas disponibles */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-un-white">Cláusulas Disponibles</h2>
          {Object.entries(clausesByType).map(([type, clauses]) => (
            <div key={type} className="space-y-2">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2">
                {type}
              </h3>
              {(clauses as Clause[]).map((clause) => {
                const alreadyAdded = currentDraft.clauses.some((c) => c.id === clause.id);
                return (
                  <div
                    key={clause.id}
                    className={cn(
                      "p-3 rounded-xl border flex justify-between items-start",
                      alreadyAdded
                        ? "border-e10-green/40 bg-e10-green/10"
                        : "border-slate-700 bg-slate-800/50 hover:border-un-blue/50"
                    )}
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-sm text-un-white">{clause.text}</h4>
                      <div className="flex gap-2 mt-2">
                        <Badge impact={clause.impact}>{clause.impact}</Badge>
                        <span className="text-xs text-slate-500">{clause.category}</span>
                      </div>
                      <div className="mt-2 flex gap-2">
                        {P5_COUNTRIES.map((p5) => (
                          <span
                            key={p5.code}
                            className="flex items-center gap-1"
                            title={`Veto ${p5.nameEs}: ${clause.vetoRiskByCountry[p5.code]}`}
                          >
                            <Badge impact={clause.vetoRiskByCountry[p5.code] as "bajo" | "medio" | "alto"}>
                              {p5.code}
                            </Badge>
                          </span>
                        ))}
                      </div>
                    </div>
                    <Button
                      variant={alreadyAdded ? "ghost" : "primary"}
                      size="sm"
                      onClick={() => handleAddClause(clause.id)}
                      disabled={alreadyAdded || actionBudget < 1}
                    >
                      {alreadyAdded ? "Añadida" : "Añadir"}
                    </Button>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Panel centro: Borrador actual */}
        <div className="space-y-4">
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-un-white">Borrador Actual</h2>
              <Button variant="danger" size="sm" onClick={clearDraft}>
                Limpiar
              </Button>
            </div>

            <div className="mb-4">
              <label className="text-xs text-slate-400 block mb-2">Tono del borrador</label>
              <div className="flex gap-2">
                {["conciliador", "equilibrado", "firmo"].map((tone) => (
                  <Button
                    key={tone}
                    variant={draftTone === tone ? "primary" : "outline"}
                    size="sm"
                    onClick={() => {
                      setDraftToneLocal(tone as Draft["tone"]);
                      setDraftTone(tone as Draft["tone"]);
                    }}
                  >
                    {tone.charAt(0).toUpperCase() + tone.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            {currentDraft.clauses.length === 0 ? (
              <p className="text-slate-400 text-sm text-center">
                No hay cláusulas seleccionadas. Elija cláusulas del panel izquierdo.
              </p>
            ) : (
              <div className="space-y-2">
                {currentDraft.clauses.map((clause) => (
                  <div
                    key={clause.id}
                    className="flex items-center justify-between p-2 rounded bg-slate-900/50 border border-slate-700/50"
                  >
                    <div className="flex-1">
                      <p className="text-sm text-un-white">{clause.text}</p>
                      <div className="flex gap-1 mt-1">
                        {P5_COUNTRIES.map((p5) => (
                          <Badge
                            key={p5.code}
                            impact={clause.vetoRiskByCountry[p5.code] as "bajo" | "medio" | "alto"}
                            size="sm"
                          >
                            {p5.code}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleRemoveClause(clause.id)}>
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 p-3 rounded-lg bg-slate-900/30 border border-slate-700/30">
              <p className="text-xs text-slate-400 mb-1">Impacto total del borrador</p>
              <div className="text-lg font-bold text-un-white">{totalImpact}</div>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Button variant="ghost" onClick={handleBackToBriefing}>
              Volver al Briefing
            </Button>
            <Button
              variant="primary"
              size="lg"
              onClick={handleSubmit}
              disabled={
                currentDraft.clauses.length === 0 || actionBudget < 1 || isLoading
              }
              className={currentDraft.clauses.length === 0 ? "opacity-50" : ""}
            >
              Presentar a Votación (Redacción en segundo plano)
            </Button>
          </div>
        </div>

        {/* Panel derecho: Resumen de riesgos de veto */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-un-white">Riesgo de Veto por P5</h2>
          {P5_COUNTRIES.map((p5) => {
            const maxRisk = currentDraft.clauses.reduce((max, clause) => {
              const risk = clause.vetoRiskByCountry[p5.code] || "bajo";
              return risk === "alto"
                ? 3
                : risk === "medio"
                ? Math.max(max, 2)
                : Math.max(max, 1);
            }, 0);

            const riskLabel = maxRisk >= 3 ? "Alto" : maxRisk === 2 ? "Medio" : "Bajo";
            const riskColor = maxRisk >= 3 ? "p5-red" : maxRisk === 2 ? "amber-500" : "e10-green";

            return (
              <div key={p5.code} className="p-3 rounded-xl border bg-slate-800/30">
                <div className="flex justify-between items-center mb-1">
                  <CountryBadge country={p5} size="sm" />
                  <span className={cn("text-xs font-bold", riskColor === "p5-red" ? "text-p5-red" : riskColor === "amber-500" ? "text-amber-400" : "text-e10-green")}>
                    {riskLabel}
                  </span>
                </div>
                <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full",
                      riskColor === "p5-red" ? "bg-p5-red" : riskColor === "amber-500" ? "bg-amber-500" : "bg-e10-green"
                    )}
                    style={{ width: `${(maxRisk / 3) * 100}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
