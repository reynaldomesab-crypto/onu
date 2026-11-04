/**
 * Fase NEGOTIATION: Interfaz de chat donde el jugador interactúa con
 * representantes de otros países (P5 y E10).
 * Las respuestas de la IA son simuladas pero estructuradas para conectar un LLM externo.
 */
import React, { useEffect, useRef, useState } from "react";
import { useGameStore } from "@/store/useGameStore";
import { Country } from "@/types";
import { Button } from "@/components/ui/Button";
import { DayBudgetBar } from "@/components/ui/DayBudgetBar";
import { PlayerRestrictionNotice } from "@/components/ui/PlayerRestrictionNotice";
import { PhaseHeader } from "@/components/ui/PhaseHeader";
import { ScrollArea } from "@/components/game/ScrollArea";
import { cn } from "@/utils/cn";
import { NEGOTIATION_SCENARIOS, NegotiationScenario } from "@/types/negotiations";

export const NegotiationPhase: React.FC = () => {
  const {
    currentDay,
    actionBudget,
    maxActionsPerDay,
    phase,
    playerCountry,
    countries,
    chatMessages,
    setPhase,
    useAction,
    addPlayerMessage,
    addAiResponse,
    isLoading,
  } = useGameStore();

  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    if (!useAction(1)) return; // Cada consulta cuesta 1 acción

    addPlayerMessage(inputText);
    setInputText("");
  };

  const handleTalkToCountry = (countryCode: string) => {
    if (!useAction(1)) return;
    const country = countries.find((c) => c.code === countryCode);
    if (!country) return;

    // Simular consulta a un país específico
    addAiResponse(
      countryCode,
      `Embajador de ${country.nameEs}: Hemos recibido su consulta. Nuestra posición sobre este asunto es ${country.stance}. Estamos dispuestos a conversar si hay respeto mutuo.`
    );
  };

  const handleSelectScenario = (scenario: NegotiationScenario) => {
    // Seleccionar una propuesta activa de los problemas graves actuales
    // inicia una negociación formal (cuesta 1 acción).
    if (!useAction(1)) return;
    addPlayerMessage(`Propongo: ${scenario.title}. ${scenario.description}`);
  };

  const handleNextPhase = () => {
    setPhase("DRAFTING");
  };

  const handleBackToBriefing = () => {
    setPhase("BRIEFING");
  };

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-bold text-un-white">Negociación</h1>
          <p className="text-slate-400">Comuníquese con los representantes de otros países.</p>
        </div>
        <DayBudgetBar day={currentDay} budget={actionBudget} maxBudget={maxActionsPerDay} />
      </div>

      <PlayerRestrictionNotice />

      {/* Área de chat */}
      <div className="flex-1 bg-slate-900/40 border border-slate-700 rounded-xl overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-700 bg-slate-800/30">
          <PhaseHeader phase={phase} />
          <p className="text-xs text-slate-400 mt-1">
            {playerCountry?.nameEs} está presidiendo la sesión.
          </p>
        </div>

        <ScrollArea className="flex-1 p-4 space-y-4">
          {chatMessages.length === 0 && (
            <p className="text-slate-500 text-sm text-center">
              Inicie una conversación con un representante del Consejo.
            </p>
          )}
          {chatMessages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "max-w-[85%] p-3 rounded-2xl break-words",
                msg.isPlayer
                  ? "ml-auto bg-un-blue text-white rounded-tr-none"
                  : "mr-auto bg-slate-800 border border-slate-700 text-slate-200 rounded-tl-none"
              )}
            >
              <div className="flex justify-between items-start mb-1">
                <span
                  className={cn(
                    "text-xs font-semibold",
                    msg.isPlayer ? "text-blue-300" : "text-slate-400"
                  )}
                >
                  {msg.senderName}
                </span>
                <span className="text-[10px] text-slate-500">
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <p className="text-sm">{msg.text}</p>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </ScrollArea>

        {/* Input de mensaje */}
        <div className="p-3 border-t border-slate-700 bg-slate-900">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Escriba su mensaje..."
              className="flex-1 bg-slate-800 border border-slate-600 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              disabled={isLoading || actionBudget < 1}
            />
            <Button
              variant="primary"
              size="sm"
              disabled={!inputText.trim() || isLoading || actionBudget < 1}
              onClick={handleSendMessage}
            >
              Enviar
            </Button>
          </form>
        </div>
      </div>

      {/* Propuestas activas basadas en los problemas graves actuales */}
      <div className="mt-4">
        <h3 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">
          Propuestas activas
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {NEGOTIATION_SCENARIOS.map((scenario) => (
            <button
              key={scenario.id}
              type="button"
              onClick={() => handleSelectScenario(scenario)}
              disabled={actionBudget < 1 || isLoading}
              className="text-left p-3 rounded-xl border border-slate-700 bg-slate-800/50 hover:border-un-blue/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <p className="text-sm font-semibold text-un-white">{scenario.title}</p>
              <p className="text-xs text-slate-400 mt-1">{scenario.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Países con quienes negociar */}
      <div className="mt-4">
        <h3 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">
          Contactar a representante
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {countries.map((country: Country) => (
            <Button
              key={country.code}
              variant="outline"
              size="sm"
              disabled={country.code === playerCountry?.code || actionBudget < 1 || isLoading}
              onClick={() => handleTalkToCountry(country.code)}
              className={cn(
                country.isP5 ? "border-p5-red/30 text-p5-red hover:bg-p5-red/10" : "border-e10-green/30 text-e10-green hover:bg-e10-green/10",
                actionBudget < 1 ? "opacity-50" : ""
              )}
            >
              {country.flag} {country.code}
            </Button>
          ))}
        </div>
      </div>

      {/* Acciones de fase */}
      <div className="mt-4 flex gap-3">
        <Button variant="ghost" onClick={handleBackToBriefing}>
          Volver al Briefing
        </Button>
        <Button
          variant="secondary"
          onClick={handleNextPhase}
          disabled={actionBudget < 1}
        >
          Pasar a Redacción
        </Button>
      </div>
    </div>
  );
};

