/**
 * Modelo de predicción de riesgo de veto para "El Arte de lo Posible".
 *
 * Este archivo integra ONNX Runtime Web para ejecutar un modelo local de
 * predicción de veto en el navegador/dispositivo móvil.
 *
 * Arquitectura:
 *   - loadModel(): Carga el modelo ONNX desde /models/veto_model.onnx
 *   - predictVetoRisk(draft): Predice el riesgo de veto de un borrador.
 *     Si el modelo está cargado, lo usa para inferencia real.
 *     Si no, devuelve valores simulados (modo fallback).
 *
 * El modelo ONNX debería aceptar como entrada las características del borrador
 * (cláusulas, tono, país objetivo) y producir como salida el riesgo de veto
 * por país P5.
 */

import { Draft, VetoRisk, Clause } from "@/types";
import { P5_COUNTRIES } from "@/types/countries";
import type { InferenceSession } from "onnxruntime-web";
import { Tensor } from "onnxruntime-web";

// Ruta al modelo ONNX local (desplegado con la app web / en assets de Capacitor)
export const ONNX_MODEL_PATH = "/models/veto_model.onnx";

/**
 * Sesión de inferencia ONNX. Null mientras el modelo no esté cargado.
 */
let inferenceSession: InferenceSession | null = null;

/**
 * Indica si el modelo está en proceso de carga.
 */
let isLoading = false;

/**
 * Error de carga del modelo, si lo hay.
 */
let loadError: Error | null = null;

/**
 * Importación dinámica de ONNX Runtime Web.
 * Se importa de forma dinámica para no bloquear el bundle si no está disponible.
 */
async function loadOnnxRuntime(): Promise<typeof import("onnxruntime-web")> {
  return import("onnxruntime-web");
}

/**
 * Carga el modelo ONNX desde la ruta local.
 *
 * @returns true si el modelo se cargó correctamente, false en caso contrario.
 *
 * @integration Asegúrese de que /models/veto_model.onnx esté incluido en
 *   los assets desplegables de Vite (vite.config.ts) o copiado a
 *   android/app/src/main/assets al hacer cap sync.
 */
export async function loadModel(): Promise<boolean> {
  if (inferenceSession) return true;
  if (isLoading) {
    // Esperar a que termine la carga en curso
    while (isLoading) {
      await new Promise((r) => setTimeout(r, 100));
    }
    return Boolean(inferenceSession);
  }

  isLoading = true;

  try {
    const ort = await loadOnnxRuntime();
    inferenceSession = await ort.InferenceSession.create(ONNX_MODEL_PATH);
    loadError = null;
    return true;
  } catch (err) {
    loadError = err as Error;
    console.warn(
      "[vetoModel] No se pudo cargar el modelo ONNX. Usando modo simulado.",
      err
    );
    return false;
  } finally {
    isLoading = false;
  }
}

/**
 * Verifica si el modelo está cargado y listo para inferencia.
 */
export function isModelLoaded(): boolean {
  return inferenceSession !== null;
}

/**
 * Obtiene el error de carga, si existe.
 */
export function getLoadError(): Error | null {
  return loadError;
}

/**
 * Convierte un valor de impacto categórico a numérico para el modelo.
 */
function impactToNumber(impact: Clause["impact"]): number {
  switch (impact) {
    case "bajo":
      return 1;
    case "medio":
      return 2;
    case "alto":
      return 3;
    default:
      return 1;
  }
}

/**
 * Convierte un valor de tono categórico a numérico.
 */
function toneToNumber(tone: Draft["tone"]): number {
  switch (tone) {
    case "conciliador":
      return 1;
    case "equilibrado":
      return 2;
    case "firmo":
      return 3;
    default:
      return 2;
  }
}

/**
 * Extrae características numéricas del borrador para alimentar al modelo ONNX.
 *
 * Las características incluyen:
 *   - Número de cláusulas
 *   - Suma de impactos
 *   - Valor numérico del tono
 *   - Indicadores de riesgo de veto por cláusula y país P5
 *
 * @returns Float32Array con las características del borrador
 */
function extractDraftFeatures(draft: Draft): Float32Array {
  const features: number[] = [];

  // Número de cláusulas
  features.push(draft.clauses.length);

  // Suma de impactos numéricos
  const totalImpact = draft.clauses.reduce(
    (sum, c) => sum + impactToNumber(c.impact),
    0
  );
  features.push(totalImpact);

  // Tono numérico
  features.push(toneToNumber(draft.tone));

  // Para cada país P5, el riesgo máximo de veto entre todas las cláusulas
  for (const country of P5_COUNTRIES) {
    const maxRisk = draft.clauses.reduce((max, clause) => {
      const risk = clause.vetoRiskByCountry[country.code] || "bajo";
      const riskValue = risk === "bajo" ? 1 : risk === "medio" ? 2 : 3;
      return Math.max(max, riskValue);
    }, 0);
    features.push(maxRisk);
  }

  return new Float32Array(features);
}

/**
 * Predice el riesgo de veto de un borrador.
 *
 * Si el modelo ONNX está cargado, realiza inferencia real.
 * Si no, devuelve valores simulados basados en heurísticas simples.
 *
 * @param draft - Borrador a evaluar
 * @returns Objeto VetoRisk con el riesgo por país y global
 */
export async function predictVetoRisk(draft: Draft): Promise<VetoRisk> {
  // Asegurar que el modelo esté cargado (no bloqueante si falla)
  await loadModel();

  const riskByCountry: Record<string, number> = {};
  const likelyVetoers: string[] = [];
  let isSimulated = true;

  if (isModelLoaded() && inferenceSession) {
    try {
      isSimulated = false;
      const features = extractDraftFeatures(draft);

      // Crear tensor de entrada para ONNX
      const inputTensor = new Tensor("float32", features, [1, features.length]);

      // Ejecutar inferencia (nombre de entrada/salida dependen del modelo exportado)
      // TODO: Ajustar "input" y "output" según los nombres reales del modelo ONNX exportado.
      const outputs = await inferenceSession.run({ input: inputTensor });

      // Suponiendo que la salida es un tensor [1, numP5] con probabilidades de veto
      const outputData = outputs.output as Tensor;
      const probabilities = outputData.data as Float32Array;

      for (let i = 0; i < P5_COUNTRIES.length; i++) {
        const country = P5_COUNTRIES[i];
        const risk = Math.min(Math.max(probabilities[i] || 0, 0), 1);
        riskByCountry[country.code] = risk;
        if (risk > 0.5) {
          likelyVetoers.push(country.code);
        }
      }
    } catch (err) {
      console.warn("[vetoModel] Error en inferencia ONNX, usando fallback simulado.", err);
      isSimulated = true;
    }
  }

  // Fallback: valores simulados basados en heurística
  if (isSimulated) {
    for (const country of P5_COUNTRIES) {
      const clauseRisks = draft.clauses.map((c) => {
        const r = c.vetoRiskByCountry[country.code] || "bajo";
        return r === "bajo" ? 0.1 : r === "medio" ? 0.5 : 0.8;
      });
      const maxRisk = Math.max(...clauseRisks, 0.05);
      const tonePenalty = draft.tone === "firmo" ? 0.15 : draft.tone === "conciliador" ? -0.1 : 0;
      const risk = Math.min(Math.max(maxRisk + tonePenalty, 0), 1);
      riskByCountry[country.code] = risk;
      if (risk > 0.5) likelyVetoers.push(country.code);
    }
  }

  // Riesgo global: promedio ponderado de los riesgos por país
  const p5Risks = P5_COUNTRIES.map((c) => riskByCountry[c.code] || 0);
  const overallRisk =
    p5Risks.length > 0
      ? p5Risks.reduce((sum, r) => sum + r, 0) / p5Risks.length
      : 0;

  // Recomendación basada en el riesgo global
  let recommendation: string;
  if (overallRisk < 0.33) {
    recommendation =
      "El borrador tiene bajo riesgo de veto. Puede presentarse con confianza.";
  } else if (overallRisk < 0.66) {
    recommendation =
      "El borrador tiene riesgo moderado. Considere suavizar cláusulas de alto impacto antes de presentar.";
  } else {
    recommendation =
      "El borrador tiene alto riesgo de veto. Es probable que al menos un P5 lo bloquee. Revise las cláusulas de condena y sanciones.";
  }

  return {
    overallRisk,
    riskByCountry,
    likelyVetoers,
    recommendation,
    isSimulated,
  };
}

/**
 * Libera la sesión de inferencia (útil para pruebas o recarga).
 */
export function unloadModel(): void {
  if (inferenceSession) {
    // InferenceSession no tiene método close público en todas las versiones;
    // se establece a null para permitir GC.
    inferenceSession = null;
  }
  loadError = null;
}
