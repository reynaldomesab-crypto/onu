import { describe, it, expect } from "vitest";
import { predictVetoRisk } from "@/models/vetoModel";
import { CLAUSES } from "@/types/clauses";

describe("vetoModel", () => {
  it("predictVetoRisk devuelve valores basados en el modelo UNBench", async () => {
    const draft = {
      id: "test-draft",
      clauses: [CLAUSES[0], CLAUSES[2]],
      tone: "firmo" as const,
      targetCountry: "IRN",
      createdAt: new Date(),
      status: "borrador" as const,
    };

    const risk = await predictVetoRisk(draft);

    expect(risk).toHaveProperty("overallRisk");
    expect(risk).toHaveProperty("riskByCountry");
    expect(risk).toHaveProperty("likelyVetoers");
    expect(risk).toHaveProperty("recommendation");
    expect(risk.isSimulated).toBe(true);
    expect(risk.overallRisk).toBeGreaterThanOrEqual(0);
    expect(risk.overallRisk).toBeLessThanOrEqual(1);
  });

  it("identifica países con alto riesgo de veto", async () => {
    const draft = {
      id: "test-draft-2",
      clauses: [CLAUSES[2]], // condena con alto riesgo para CHN y RUS
      tone: "firmo" as const,
      createdAt: new Date(),
      status: "borrador" as const,
    };

    const risk = await predictVetoRisk(draft);

    // CHN y RUS tienen riesgo "alto" en clause-003
    expect(risk.riskByCountry["CHN"]).toBeGreaterThan(0.5);
    expect(risk.riskByCountry["RUS"]).toBeGreaterThan(0.5);
    expect(risk.likelyVetoers).toContain("CHN");
    expect(risk.likelyVetoers).toContain("RUS");
  });
});
