/**
 * Modelo de predicción de riesgo de veto para "¿Puedes cambiar el mundo?".
 *
 * Este archivo integra el modelo basado en el dataset UNBench (datos reales
 * del Consejo de Seguridad de la ONU) para predecir el riesgo de veto.
 *
 * Arquitectura:
 *   - predictVetoRisk(draft): Predice el riesgo de veto de un borrador usando
 *     características extraídas del dataset UNBench con resoluciones reales.
 */

import { Draft, VetoRisk } from "@/types";
import { predictVetoRisk as predictFromUNBench } from "@/services/unBenchModel";

/**
 * Predice el riesgo de veto de un borrador usando el modelo UNBench.
 *
 * @param draft - Borrador a evaluar
 * @returns Objeto VetoRisk con el riesgo por país y global
 */
export async function predictVetoRisk(draft: Draft): Promise<VetoRisk> {
  return predictFromUNBench(draft);
}

/**
 * Re-exportar características para uso externo si es necesario.
 */
export { UNBENCH_FEATURES } from "@/services/unBenchModel";
export { extractDraftFeatures } from "@/services/unBenchModel";

