/**
 * Cláusulas predefinidas para el borrador de resolución.
 * El jugador selecciona entre estas cláusulas en la fase DRAFTING.
 * Cada cláusula muestra impacto y riesgo de veto estimado por P5.
 *
 * Estos son placeholders. En producción deberían venir de la API o UNSC-BENCH.
 */
import { Clause } from "./index";

export const CLAUSES: Clause[] = [
  {
    id: "clause-001",
    text: "Expresa profunda preocupación por la deterioración de la situación en la región.",
    type: "observacion",
    impact: "bajo",
    vetoRiskByCountry: {
      USA: "bajo",
      CHN: "bajo",
      RUS: "medio",
      FRA: "bajo",
      GBR: "bajo",
    },
    category: "observación",
  },
  {
    id: "clause-002",
    text: "Pide el cese inmediato de las hostilidades y el respeto al derecho internacional humanitario.",
    type: "llamado",
    impact: "medio",
    vetoRiskByCountry: {
      USA: "bajo",
      CHN: "bajo",
      RUS: "medio",
      FRA: "bajo",
      GBR: "bajo",
    },
    category: "llamado",
  },
  {
    id: "clause-003",
    text: "Condena enérgicamente las violaciones de los derechos humanos cometidas por las partes.",
    type: "condena",
    impact: "alto",
    vetoRiskByCountry: {
      USA: "bajo",
      CHN: "alto",
      RUS: "alto",
      FRA: "bajo",
      GBR: "bajo",
    },
    category: "condena",
  },
  {
    id: "clause-004",
    text: "Establece un mecanismo de monitoreo independiente sobre el terreno.",
    type: "monitoreo",
    impact: "medio",
    vetoRiskByCountry: {
      USA: "medio",
      CHN: "alto",
      RUS: "alto",
      FRA: "bajo",
      GBR: "medio",
    },
    category: "monitoreo",
  },
  {
    id: "clause-005",
    text: "Impone sanciones dirigidas contra individuos y entidades responsables de la violencia.",
    type: "sanciones",
    impact: "alto",
    vetoRiskByCountry: {
      USA: "bajo",
      CHN: "alto",
      RUS: "alto",
      FRA: "medio",
      GBR: "bajo",
    },
    category: "sanciones",
  },
  {
    id: "clause-006",
    text: "Solicita al Secretario General que presente un informe en un plazo de 30 días.",
    type: "llamado",
    impact: "bajo",
    vetoRiskByCountry: {
      USA: "bajo",
      CHN: "bajo",
      RUS: "bajo",
      FRA: "bajo",
      GBR: "bajo",
    },
    category: "informe",
  },
  {
    id: "clause-007",
    text: "Decide permanecer activamente sazado del asunto.",
    type: "observacion",
    impact: "bajo",
    vetoRiskByCountry: {
      USA: "bajo",
      CHN: "bajo",
      RUS: "bajo",
      FRA: "bajo",
      GBR: "bajo",
    },
    category: "observación",
  },
];

/**
 * Obtiene una cláusula por su ID.
 */
export function getClauseById(id: string): Clause | undefined {
  return CLAUSES.find((c) => c.id === id);
}

/**
 * Filtra cláusulas por tipo.
 */
export function getClausesByType(type: Clause["type"]): Clause[] {
  return CLAUSES.filter((c) => c.type === type);
}

/**
 * Obtiene el nivel de riesgo de veto para un país P5 dado una cláusula.
 */
export function getClauseVetoRisk(clause: Clause, countryCode: string): "bajo" | "medio" | "alto" {
  return clause.vetoRiskByCountry[countryCode] || "bajo";
}
