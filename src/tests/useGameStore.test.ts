import { describe, it, expect, beforeEach } from "vitest";
import { useGameStore } from "@/store/useGameStore";
import { E10_COUNTRIES, P5_COUNTRIES } from "@/types/countries";

describe("useGameStore", () => {
  beforeEach(() => {
    useGameStore.setState({
      currentDay: 1,
      phase: "BRIEFING",
      actionBudget: 3,
      playerCountry: null,
      isInitialized: false,
    });
  });

  it("no permite inicializar con un país P5", () => {
    const p5 = P5_COUNTRIES[0];
    useGameStore.getState().initGame(p5.code);
    expect(useGameStore.getState().isInitialized).toBe(false);
    expect(useGameStore.getState().error).toContain("P5");
  });

  it("permite inicializar con un país E10", () => {
    const e10 = E10_COUNTRIES[0];
    useGameStore.getState().initGame(e10.code);
    expect(useGameStore.getState().isInitialized).toBe(true);
    expect(useGameStore.getState().playerCountry?.code).toBe(e10.code);
    expect(useGameStore.getState().phase).toBe("BRIEFING");
    expect(useGameStore.getState().actionBudget).toBe(3);
  });

  it("gasta acciones correctamente", () => {
    const e10 = E10_COUNTRIES[0];
    useGameStore.getState().initGame(e10.code);
    const result = useGameStore.getState().useAction(1);
    expect(result).toBe(true);
    expect(useGameStore.getState().actionBudget).toBe(2);
  });

  it("no permite gastar más acciones de las disponibles", () => {
    const e10 = E10_COUNTRIES[0];
    useGameStore.getState().initGame(e10.code);
    useGameStore.getState().useAction(3);
    const result = useGameStore.getState().useAction(1);
    expect(result).toBe(false);
    expect(useGameStore.getState().actionBudget).toBe(0);
  });

  it("crea un borrador y añade cláusulas", () => {
    const e10 = E10_COUNTRIES[0];
    useGameStore.getState().initGame(e10.code);
    useGameStore.getState().useAction(1);
    const draft = useGameStore.getState().createDraft("equilibrado");
    expect(draft.clauses.length).toBe(0);

    const added = useGameStore.getState().addClauseToDraft("clause-001");
    expect(added).toBe(true);
    expect(useGameStore.getState().currentDraft?.clauses.length).toBe(1);
  });

  it("restaura el presupuesto al cambiar de día", () => {
    const e10 = E10_COUNTRIES[0];
    useGameStore.getState().initGame(e10.code);
    useGameStore.getState().useAction(3);
    expect(useGameStore.getState().actionBudget).toBe(0);

    useGameStore.getState().nextDay();
    expect(useGameStore.getState().currentDay).toBe(2);
    expect(useGameStore.getState().actionBudget).toBe(3);
  });
});
