/**
 * Store de Zustand para la gestión del estado del juego "¿Puedes cambiar el mundo?".
 *
 * Este store centraliza todo el estado del juego:
 *   - Día actual y fase de la máquina de estados
 *   - Presupuesto de acciones por día
 *   - País del jugador (siempre E10, nunca P5)
 *   - Borrador actual y historial
 *   - Mensajes de chat de negociación
 *   - Eventos del día
 *   - Resultados de predicción de veto y votación
 *
 * Todas las acciones son funciones que devuelven un nuevo estado (inmutabilidad).
 */

import { create } from "zustand";
import {
  GameState,
  GamePhase,
  Draft,
  Clause,
  ChatMessage,
  VoteResult,
  HistoricalResult,
  VetoRisk,
  Country,
  DailyEvent,
} from "@/types";
import { E10_COUNTRIES, COUNTRIES, getCountryByCode } from "@/types/countries";
import { DAILY_EVENTS } from "@/types/events";
import { CLAUSES } from "@/types/clauses";
import { showToast } from "@/utils/toast";

// Configuración del presupuesto de acciones por día.
// Número limitado de acciones diarias (diplomacia, redacción, voto, etc.).
// Ajustado a 3 para permitir testear la aplicación con un ritmo de juego cómodo.
const MAX_ACTIONS_PER_DAY = 3;

/**
 * Genera un ID único simple.
 */
function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Estado inicial del juego.
 */
const initialState: GameState = {
  currentDay: 1,
  phase: "BRIEFING",
  actionBudget: MAX_ACTIONS_PER_DAY,
  maxActionsPerDay: MAX_ACTIONS_PER_DAY,
  playerCountry: null,
  countries: COUNTRIES,
  p5Countries: COUNTRIES.filter((c) => c.isP5),
  e10Countries: E10_COUNTRIES,
  currentDraft: null,
  draftHistory: [],
  actionHistory: [],
  chatMessages: [],
  dailyEvents: [...DAILY_EVENTS],
  lastVetoRisk: null,
  lastVoteResult: null,
  historicalResult: null,
  isInitialized: false,
  isLoading: false,
  error: null,
};

/**
 * Crea el store de Zustand con persistencia opcional en localStorage.
 */
export const useGameStore = create<GameState & {
  // Acciones del juego
  initGame: (playerCountryCode: string) => void;
  setPhase: (phase: GamePhase) => void;
  nextDay: () => void;
  useAction: (cost: number) => boolean;
  canUseAction: (cost: number) => boolean;
  setPlayerCountry: (code: string) => boolean;
  createDraft: (tone: Draft["tone"], targetCountry?: string) => Draft;
  addClauseToDraft: (clauseId: string) => boolean;
  removeClauseFromDraft: (clauseId: string) => boolean;
  setDraftTone: (tone: Draft["tone"]) => void;
  clearDraft: () => void;
  submitDraft: () => Promise<void>;
  addChatMessage: (message: Omit<ChatMessage, "id" | "timestamp">) => void;
  addPlayerMessage: (text: string) => void;
  addAiResponse: (senderCode: string, text: string) => void;
  setVetoRisk: (risk: VetoRisk) => void;
  setVoteResult: (result: VoteResult) => void;
  setHistoricalResult: (result: HistoricalResult) => void;
  markEventAddressed: (eventId: string) => void;
  resetGame: () => void;
  setError: (message: string | null) => void;
  setLoading: (loading: boolean) => void;
}>
  ((set: any, get: any) => ({
    ...initialState,

      /**
       * Inicializa el juego seleccionando el país del jugador.
       * El jugador siempre debe ser un miembro no permanente.
       * Nunca se permite seleccionar un miembro permanente.
       */
      initGame: (playerCountryCode: string) => {
        const country = getCountryByCode(playerCountryCode);
        if (!country) {
          set({ error: `País ${playerCountryCode} no encontrado.` });
          return;
        }

        if (country.isP5) {
          set({
            error:
              "No se puede seleccionar un miembro permanente como país del jugador. Debe ser un miembro no permanente.",
          });
          return;
        }

        set({
          playerCountry: country,
          currentDay: 1,
          phase: "BRIEFING",
          actionBudget: MAX_ACTIONS_PER_DAY,
          isInitialized: true,
          error: null,
          dailyEvents: [...DAILY_EVENTS],
          actionHistory: [],
          chatMessages: [],
        });
      },

      /**
       * Cambia la fase actual del juego.
       */
      setPhase: (phase: GamePhase) => {
        set({ phase, error: null });
      },

      /**
       * Avanza al día siguiente, restaurando el presupuesto de acciones.
       */
      nextDay: () => {
        const { currentDay } = get();
        // Si quedan acciones sin usar, se pierden al cambiar de día (no se acumulan)
        set({
          currentDay: currentDay + 1,
          actionBudget: MAX_ACTIONS_PER_DAY,
          phase: "BRIEFING",
          currentDraft: null,
          lastVetoRisk: null,
          lastVoteResult: null,
          chatMessages: [],
          dailyEvents: [...DAILY_EVENTS].map((e) => ({ ...e, addressed: false })),
        });
      },

      /**
       * Verifica si se puede gastar una cantidad de acciones.
       */
      canUseAction: (cost: number) => {
        return get().actionBudget >= cost;
      },

      /**
       * Gasta acciones del presupuesto diario.
       * Retorna true si se pudo gastar, false si no hay suficiente presupuesto.
       */
      useAction: (cost: number) => {
        const { actionBudget } = get();
        if (actionBudget < cost) {
          set({ error: "No hay suficientes acciones disponibles hoy." });
          return false;
        }
        set({ actionBudget: actionBudget - cost, error: null });
        return true;
      },

      /**
       * Establece el país del jugador. Solo permite miembro no permanente.
       */
      setPlayerCountry: (code: string) => {
        const country = getCountryByCode(code);
        if (!country) {
          set({ error: "País no encontrado." });
          return false;
        }
        if (country.isP5) {
          set({
            error: "El jugador no puede ser un miembro permanente. Seleccione un miembro no permanente.",
          });
          return false;
        }
        set({ playerCountry: country, error: null });
        return true;
      },

      /**
       * Crea un nuevo borrador vacío.
       */
      createDraft: (tone: Draft["tone"], targetCountry?: string) => {
        const draft: Draft = {
          id: generateId("draft"),
          clauses: [],
          tone,
          targetCountry,
          createdAt: new Date(),
          status: "borrador",
        };
        set({ currentDraft: draft });
        return draft;
      },

      /**
       * Añade una cláusula al borrador actual.
       * Retorna true si se añadió, false si no hay borrador o ya existe.
       */
      addClauseToDraft: (clauseId: string) => {
        const { currentDraft } = get();
        if (!currentDraft) {
          set({ error: "No hay un borrador activo. Cree uno primero." });
          return false;
        }

        const clause = CLAUSES.find((c) => c.id === clauseId);
        if (!clause) {
          set({ error: "Cláusula no encontrada." });
          return false;
        }

        if (currentDraft.clauses.some((c: Clause) => c.id === clauseId)) {
          set({ error: "Esta cláusula ya está en el borrador." });
          return false;
        }

        const newDraft: Draft = {
          ...currentDraft,
          clauses: [...currentDraft.clauses, clause],
        };
        set({ currentDraft: newDraft, error: null });
        return true;
      },

      /**
       * Elimina una cláusula del borrador actual.
       */
      removeClauseFromDraft: (clauseId: string) => {
        const { currentDraft } = get();
        if (!currentDraft) return false;

        const newDraft: Draft = {
          ...currentDraft,
          clauses: currentDraft.clauses.filter((c: Clause) => c.id !== clauseId),
        };
        set({ currentDraft: newDraft });
        return true;
      },

      /**
       * Cambia el tono del borrador actual.
       */
      setDraftTone: (tone: Draft["tone"]) => {
        const { currentDraft } = get();
        if (!currentDraft) return;
        set({
          currentDraft: { ...currentDraft, tone },
        });
      },

      /**
       * Limpia el borrador actual.
       */
      clearDraft: () => {
        set({ currentDraft: null });
      },

      /**
       * Presenta el borrador para votación.
       * Invoca predictVetoRisk y luego simula el resultado de la votación.
       */
      submitDraft: async () => {
        const { currentDraft, useAction } = get();
        if (!currentDraft) {
          set({ error: "No hay un borrador para presentar." });
          return;
        }

        if (!useAction(1)) {
          return; // No hay presupuesto
        }

        if (currentDraft.clauses.length === 0) {
          set({ error: "El borrador debe tener al menos una cláusula." });
          // Devolver la acción si no se puede presentar
          set((state: any) => ({ actionBudget: state.actionBudget + 1 }));
          return;
        }

        // Redacción en segundo plano: la fase se mantiene en DRAFTING mientras se procesa
        set({ isLoading: true, phase: "DRAFTING", error: null });

        try {
          // 1. Predecir riesgo de veto usando el modelo UNBench (o simulado)
          const { predictVetoRisk } = await import("@/models/vetoModel");
          const vetoRisk = await predictVetoRisk(currentDraft);
          set({ lastVetoRisk: vetoRisk });

          // 2. Simular el resultado de la votación con aleatoriedad.
          //    Si hay vetos probables, la probabilidad de adopción se ajusta al riesgo global.
          const likelyVetoers = vetoRisk.likelyVetoers;
          const approvalChance =
            likelyVetoers.length === 0
              ? 0.85
              : Math.max(0.05, 1 - vetoRisk.overallRisk);
          const approved = Math.random() < approvalChance;
          const vetoes = approved ? [] : likelyVetoers;

          const voteResult: VoteResult = {
            votesFor: Math.floor(Math.random() * 5) + 5,
            votesAgainst: approved
              ? Math.floor(Math.random() * 2)
              : Math.floor(Math.random() * 3) + 1,
            abstentions: Math.floor(Math.random() * 3),
            vetoes,
            approved,
          };

          // 3. Actualizar estado del borrador con el resultado de la redacción
          const completedDraft: Draft = {
            ...currentDraft,
            status: voteResult.approved ? "aprobado" : "rechazado",
          };

          set({
            lastVoteResult: voteResult,
            currentDraft: completedDraft,
            draftHistory: [...get().draftHistory, completedDraft],
            phase: "REVEAL",
            isLoading: false,
          });

          // 4. Avisar al jugador del resultado de la redacción/votación
          if (voteResult.approved) {
            showToast(
              "Redacción completada: su resolución fue APROBADA por el Consejo.",
              "success"
            );
          } else {
            showToast(
              "Redacción completada: su resolución fue RECHAZADA (posible veto).",
              "warning"
            );
          }
        } catch (err) {
          set({
            error: "Error al presentar el borrador para votación.",
            isLoading: false,
          });
          console.error(err);
        }
      },

      /**
       * Añade un mensaje al chat de negociación.
       */
      addChatMessage: (message: Omit<ChatMessage, "id" | "timestamp">) => {
        const chatMessage: ChatMessage = {
          ...message,
          id: generateId("msg"),
          timestamp: new Date(),
        };
        set({
          chatMessages: [...get().chatMessages, chatMessage],
        });
      },

      /**
       * Añade un mensaje del jugador al chat.
       */
      addPlayerMessage: (text: string) => {
        const { playerCountry } = get();
        if (!playerCountry) return;

        get().addChatMessage({
          sender: "jugador",
          senderName: `Tú (${playerCountry.nameEs})`,
          text,
          isPlayer: true,
        });

        // Simular respuesta de la IA de otro país (rotando entre P5 y E10)
        setTimeout(() => {
          const { countries } = get();
          const otherCountries = countries.filter(
            (c: Country) => c.code !== playerCountry?.code
          );
          const randomCountry =
            otherCountries[Math.floor(Math.random() * otherCountries.length)];

          const aiResponses: Record<string, string> = {
            USA: "Entendemos su posición, pero debemos considerar las implicaciones para la seguridad internacional.",
            CHN: "Abogamos por el respeto a la soberanía y la no interferencia en asuntos internos.",
            RUS: "Cualquier resolución debe basarse en hechos verificados y no en especulaciones.",
            FRA: "Francia apoya un enfoque equilibrado que proteja a los civiles.",
            GBR: "El Reino Unido está comprometido con una solución diplomática duradera.",
          };

          const defaultResponse =
            "Tomamos nota de su propuesta y la estudiaremos con nuestros aliados.";
          const responseText = aiResponses[randomCountry.code] || defaultResponse;

          get().addChatMessage({
            sender: randomCountry.code,
            senderName: `${randomCountry.flag} ${randomCountry.nameEs}`,
            text: responseText,
            isPlayer: false,
          });
        }, 1200);
      },

      /**
       * Añade una respuesta de IA de un país específico al chat.
       */
      addAiResponse: (senderCode: string, text: string) => {
        const country = getCountryByCode(senderCode);
        if (!country) return;

        get().addChatMessage({
          sender: senderCode,
          senderName: `${country.flag} ${country.nameEs}`,
          text,
          isPlayer: false,
        });
      },

      /**
       * Establece el último resultado de predicción de veto.
       */
      setVetoRisk: (risk: VetoRisk) => {
        set({ lastVetoRisk: risk });
      },

      /**
       * Establece el último resultado de votación.
       */
      setVoteResult: (result: VoteResult) => {
        set({ lastVoteResult: result });
      },

      /**
       * Establece el resultado histórico para comparar en REVEAL.
       */
      setHistoricalResult: (result: HistoricalResult) => {
        set({ historicalResult: result });
      },

      /**
       * Marca un evento del día como atendido.
       */
      markEventAddressed: (eventId: string) => {
        set({
          dailyEvents: get().dailyEvents.map((e: DailyEvent) =>
            e.id === eventId ? { ...e, addressed: true } : e
          ),
        });
      },

      /**
       * Reinicia el juego al estado inicial.
       */
      resetGame: () => {
        set({ ...initialState });
      },

      /**
       * Establece un mensaje de error.
       */
      setError: (message: string | null) => {
        set({ error: message });
      },

      /**
       * Establece el estado de carga.
       */
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    }));
