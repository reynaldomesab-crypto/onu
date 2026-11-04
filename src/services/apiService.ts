/**
 * Servicio de API principal para "¿Puedes cambiar el mundo?"
 *
 * Este archivo integra la API oficial de la ONU (UNDATA API) para obtener:
 * - Países miembros del Consejo de Seguridad
 * - Eventos de paz y seguridad
 * - Datos históricos de votaciones
 * - Cláusulas predefinidas
 *
 * Base URL: https://data.un.org/api/rest/v1
 *
 * @integration Conectar aquí a UNDATA API oficial de la ONU
 */

import {
  DailyEvent,
  Country,
  Draft,
  VoteResult,
  HistoricalResult,
} from "@/types";
import { COUNTRIES } from "@/types/countries";
import { DAILY_EVENTS } from "@/types/events";

// Base URL de UNDATA API
const UNDATA_API_BASE = "https://data.un.org/api/rest/v1";

// Timeout de 30 segundos para las peticiones
const API_TIMEOUT = 30000;

// Contador de peticiones
let totalRequests = 0;

/**
 * Obtener eventos del día para la fase BRIEFING
 *
 * @returns Datos simulados de DailyEvent[] (placeholder)
 * @integration Conectar aquí a UNDATA API:
 * GET https://data.un.org/api/rest/v1/dataset/UN_PEACEKEEPING
 * O a UNSC-BENCH para eventos históricos del Consejo.
 */
export async function fetchDailyEvents(): Promise<DailyEvent[]> {
  totalRequests++;

  // SIMULADO: Retorna datos estáticos
  // En producción: hacer fetch a UNDATA API
  // const response = await fetch(`${UNDATA_API_BASE}/dataset/UN_PEACEKEEPING`, {
  //   signal: AbortSignal.timeout(API_TIMEOUT),
  // });
  // const data = await response.json();
  // return data.map((item: any) => ({
  //   id: item.id,
  //   title: item.title,
  //   description: item.description,
  //   date: new Date(item.date),
  //   involvedCountries: item.involvedCountries,
  //   urgency: item.urgency,
  //   addressed: false,
  // }));

  return Promise.resolve([...DAILY_EVENTS]);
}

/**
 * Obtener la lista de países miembros del Consejo de Seguridad
 *
 * @returns Datos simulados de Country[] (placeholder)
 * @integration Conectar aquí a UNDATA API:
 * GET https://data.un.org/api/rest/v1/dataset/UNSC_MEMBERS
 * O a UNSC-BENCH para composiciones históricas del Consejo.
 */
export async function fetchCountries(): Promise<Country[]> {
  totalRequests++;

  // SIMULADO: Retorna datos estáticos
  // En producción: hacer fetch a UNDATA API
  // const response = await fetch(`${UNDATA_API_BASE}/dataset/UNSC_MEMBERS`, {
  //   signal: AbortSignal.timeout(API_TIMEOUT),
  // });
  // const data = await response.json();
  // return data.map((item: any) => ({
  //   code: item.code,
  //   name: item.name,
  //   nameEs: item.nameEs,
  //   flag: item.flag,
  //   isP5: item.isP5,
  //   region: item.region,
  //   role: item.role,
  //   stance: item.stance,
  // }));

  return Promise.resolve([...COUNTRIES]);
}

/**
 * Obtener un borrador de resolución por ID
 *
 * @param _draftId - ID del borrador
 * @returns Datos simulados de Draft
 *
 * @integration Conectar aquí a UNDATA API:
 * GET https://data.un.org/api/rest/v1/dataset/UNSC_RESOLUTIONS/{draftId}
 */
export async function fetchDraft(_draftId: string): Promise<Draft | null> {
  totalRequests++;

  // SIMULADO: Retorna null (no hay borradores preexistentes)
  // En producción: hacer fetch a UNDATA API
  // const response = await fetch(`${UNDATA_API_BASE}/dataset/UNSC_RESOLUTIONS/${draftId}`, {
  //   signal: AbortSignal.timeout(API_TIMEOUT),
  // });
  // const data = await response.json();
  // return {
  //   id: data.id,
  //   clauses: data.clauses,
  //   tone: data.tone,
  //   targetCountry: data.targetCountry,
  //   createdAt: new Date(data.createdAt),
  //   status: data.status,
  // };

  return Promise.resolve(null);
}

/**
 * Obtener el resultado histórico de una votación para comparar en REVEAL
 *
 * @param _resolutionId - ID de la resolución histórica
 * @returns Datos simulados de HistoricalResult
 *
 * @integration Conectar aquí a UNDATA API:
 * GET https://data.un.org/api/rest/v1/dataset/UNSC_RESOLUTIONS/{resolutionId}
 * O a los datasets de votación histórica del UNSC-BENCH.
 */
export async function fetchHistoricalResult(
  _resolutionId: string
): Promise<HistoricalResult | null> {
  totalRequests++;

  // SIMULADO: Retorna null
  // En producción: hacer fetch a UNDATA API
  // const response = await fetch(`${UNDATA_API_BASE}/dataset/UNSC_RESOLUTIONS/${resolutionId}`, {
  //   signal: AbortSignal.timeout(API_TIMEOUT),
  // });
  // const data = await response.json();
  // return {
  //   resolutionId: data.id,
  //   title: data.title,
  //   voteResult: {
  //     votesFor: data.votesFor,
  //     votesAgainst: data.votesAgainst,
  //     abstentions: data.abstentions,
  //     vetoes: data.vetoes,
  //     approved: data.approved,
  //   },
  //   comment: data.comment,
  // };

  return Promise.resolve(null);
}

/**
 * Envía un borrador para votación
 *
 * @param draft - Borrador a presentar
 * @returns Datos simulados de VoteResult
 *
 * @integration Conectar aquí a UNDATA API:
 * POST https://data.un.org/api/rest/v1/dataset/UNSC_RESOLUTIONS
 * body: { draftId, clauses, tone }
 */
export async function submitDraftForVote(
  _draft: Draft
): Promise<VoteResult> {
  totalRequests++;

  // SIMULADO: Resultado de votación aleatorio simulado
  // En producción: hacer fetch a UNDATA API
  // const response = await fetch(`${UNDATA_API_BASE}/dataset/UNSC_RESOLUTIONS`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({
  //     clauses: draft.clauses,
  //     tone: draft.tone,
  //     targetCountry: draft.targetCountry,
  //     status: "pending",
  //   }),
  //   signal: AbortSignal.timeout(API_TIMEOUT),
  // });
  // const data = await response.json();
  // return {
  //   votesFor: data.votesFor,
  //   votesAgainst: data.votesAgainst,
  //   abstentions: data.abstentions,
  //   vetoes: data.vetoes,
  //   approved: data.approved,
  // };

  return Promise.resolve({
    votesFor: Math.floor(Math.random() * 10) + 5,
    votesAgainst: Math.floor(Math.random() * 4),
    abstentions: Math.floor(Math.random() * 3),
    vetoes: [],
    approved: Math.random() > 0.4,
  });
}

/**
 * Función genérica para realizar peticiones a la API de la ONU
 * Incluye manejo de errores y headers estándar.
 *
 * @param endpoint - Endpoint de la API
 * @param options - Opciones de fetch
 * @returns Respuesta parseada como JSON
 *
 * @integration Usar esta función para todas las llamadas reales a la API.
 */
export async function unApiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${UNDATA_API_BASE}${endpoint}`;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // TODO: Agregar autenticación (API key, Bearer token, etc.) cuando la API lo requiera.
  // headers["Authorization"] = `Bearer ${API_TOKEN}`;

  const response = await fetch(url, {
    ...options,
    headers,
    signal: AbortSignal.timeout(API_TIMEOUT),
  });

  if (!response.ok) {
    throw new Error(
      `Error de API de la ONU: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

/**
 * Obtener estadísticas de uso de la API
 *
 * @returns Información sobre el uso de la API
 */
export function getApiStats(): {
  totalRequests: number;
  lastRequest: Date | null;
} {
  return {
    totalRequests,
    lastRequest: totalRequests > 0 ? new Date() : null,
  };
}

/**
 * Obtener la URL base de la API
 *
 * @returns URL base de UNDATA API
 */
export function getApiBaseUrl(): string {
  return UNDATA_API_BASE;
}

/**
 * Obtener timeout de la API
 *
 * @returns Timeout en milisegundos
 */
export function getApiTimeout(): number {
  return API_TIMEOUT;
}
