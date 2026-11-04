/**
 * Fase BRIEFING: Muestra los eventos del día.
 * El jugador revisa los eventos antes de pasar a la negociación o redacción.
 */
import React, { useEffect } from "react";
import { useGameStore } from "@/store/useGameStore";
import { DailyEvent } from "@/types";
import { Button } from "@/components/ui/Button";
import { DayBudgetBar } from "@/components/ui/DayBudgetBar";
import { fetchDailyEvents } from "@/services/apiService";
import { cn } from "@/utils/cn";

export const BriefingPhase: React.FC = () => {
  const {
    currentDay,
    actionBudget,
    maxActionsPerDay,
    playerCountry,
    dailyEvents,
    setPhase,
    markEventAddressed,
    useAction,
    isInitialized,
  } = useGameStore();

  useEffect(() => {
    // Cargar eventos del día al montar
    (async () => {
      try {
        await fetchDailyEvents();
      } catch (err) {
        console.error("Error cargando eventos:", err);
      }
    })();
  }, []);

  const handleStartNegotiation = () => {
    if (!useAction(1)) return;
    setPhase("NEGOTIATION");
  };

  const handleStartDrafting = () => {
    if (!useAction(1)) return;
    setPhase("DRAFTING");
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header con información del día y presupuesto */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-un-white">Briefing del Día {currentDay}</h1>
          <p className="text-slate-400">Revise los eventos del día antes de actuar.</p>
        </div>
        <DayBudgetBar day={currentDay} budget={actionBudget} maxBudget={maxActionsPerDay} />
      </div>

      {isInitialized && playerCountry ? (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-un-white">Bienvenido al Consejo de Seguridad</h2>
          <p className="text-slate-300 mb-6">
            Usted preside el Consejo como <strong className="text-e10-green">miembro no permanente</strong>.
          </p>
        </div>
      ) : null}

      {/* Eventos del día */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
        <h2 className="text-lg font-semibold text-un-white mb-4 flex items-center gap-2">
          <span>📋</span> Eventos del día
        </h2>

        {dailyEvents.length === 0 ? (
          <p className="text-slate-400 text-sm">No hay eventos pendientes para hoy.</p>
        ) : (
          <div className="space-y-3">
            {dailyEvents.map((event: DailyEvent) => (
              <div
                key={event.id}
                className={cn(
                  "p-4 rounded-lg border flex justify-between items-start",
                  event.addressed
                    ? "border-slate-700 bg-slate-800/30"
                    : "border-un-blue/30 bg-un-blue/10"
                )}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded text-xs font-bold",
                        event.urgency === "alta"
                          ? "bg-p5-red/20 text-p5-red border-p5-red/40"
                          : event.urgency === "media"
                          ? "bg-amber-500/20 text-amber-400 border-amber-500/40"
                          : "bg-e10-green/20 text-e10-green border-e10-green/40"
                      )}
                    >
                      {event.urgency.toUpperCase()}
                    </span>
                    {event.addressed && (
                      <span className="text-xs text-e10-green">Atendido</span>
                    )}
                  </div>
                  <h3 className="font-semibold text-un-white">{event.title}</h3>
                  <p className="text-slate-300 text-sm mt-1">{event.description}</p>
                  <p className="text-xs text-slate-500 mt-2">
                    Involucrados: {event.involvedCountries.join(", ")}
                  </p>
                </div>
                {!event.addressed ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      markEventAddressed(event.id);
                    }}
                  >
                    Atender
                  </Button>
                ) : (
                  <span className="text-xs text-slate-500">✓ Atendido</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Acciones disponibles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button
          variant="primary"
          size="lg"
          onClick={handleStartNegotiation}
          disabled={actionBudget < 1}
          className={actionBudget < 1 ? "opacity-50" : ""}
        >
          Ir a Negociación (1 acción)
        </Button>
        <Button
          variant="secondary"
          size="lg"
          onClick={handleStartDrafting}
          disabled={actionBudget < 1}
          className={actionBudget < 1 ? "opacity-50" : ""}
        >
          Ir a Redacción (1 acción)
        </Button>
      </div>
    </div>
  );
};
