/**
 * Servicio de datos de la ONU usando UNDATA API
 *
 * Este archivo integra la API oficial de la ONU (UNDATA API) para obtener:
 * - Países miembros del Consejo de Seguridad
 * - Datos de paz y seguridad
 * - Datos históricos del Consejo
 *
 * Base URL: https://data.un.org/api/rest/v1
 *
 * @integration Conectar aquí a UNDATA API oficial de la ONU
 */

import { Country, DailyEvent, VoteResult, HistoricalResult } from "@/types";
import { COUNTRIES } from "@/types/countries";
import { CLAUSES } from "@/types/clauses";
import { DAILY_EVENTS } from "@/types/events";

// Base URL de UNDATA API
const UNDATA_API_BASE = "https://data.un.org/api/rest/v1";

/**
 * Timeout de espera entre actualizaciones automáticas (1 mes en milisegundos - aprox. 30 días)
 */
export const AUTO_UPDATE_INTERVAL = 30 * 24 * 60 * 60 * 1000;

/**
 * Fecha de última actualización de datos
 */
let lastUpdate: Date | null = null;

/**
 * Obtener la fecha de última actualización
 */
export function getLastUpdateTime(): Date | null {
  return lastUpdate;
}

/**
 * Marcar que los datos han sido actualizados
 */
export function markUpdated(): void {
  lastUpdate = new Date();
}

/**
 * Verificar si los datos necesitan actualización
 */
export function needsUpdate(): boolean {
  if (!lastUpdate) return true;
  const now = new Date();
  const diff = now.getTime() - lastUpdate.getTime();
  return diff > AUTO_UPDATE_INTERVAL;
}

/**
 * Obtener países miembros del Consejo de Seguridad
 *
 * @returns Datos reales de países del Consejo de Seguridad
 *
 * @integration Conectar aquí a UNDATA API para obtener países
 * Ejemplo: https://data.un.org/api/rest/v1/dataset/UNSC_MEMBERS
 */
export async function fetchSecurityCouncilCountries(): Promise<Country[]> {
  // SIMULADO: Retorna datos simulados (igual que antes)
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
 * Obtener eventos de paz y seguridad
 *
 * @returns Eventos reales de paz y seguridad de la ONU
 *
 * @integration Conectar aquí a UNDATA API
 * Ejemplo: https://data.un.org/api/rest/v1/dataset/UN_PEACEKEEPING
 */
export async function fetchPeaceAndSecurityEvents(): Promise<DailyEvent[]> {
  // SIMULADO: Retorna eventos simulados
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
 * Obtener datos históricos de votaciones del Consejo de Seguridad
 *
 * @returns Datos históricos de votaciones
 *
 * @integration Conectar aquí a UNDATA API
 * Ejemplo: https://data.un.org/api/rest/v1/dataset/UNSC_RESOLUTIONS
 */
export async function fetchHistoricalVotes(): Promise<VoteResult[]> {
  // SIMULADO: Retorna resultados simulados
  // En producción: hacer fetch a UNDATA API
  // const response = await fetch(`${UNDATA_API_BASE}/dataset/UNSC_RESOLUTIONS`, {
  //   signal: AbortSignal.timeout(API_TIMEOUT),
  // });
  // const data = await response.json();
  // return data.map((item: any) => ({
  //   votesFor: item.votesFor,
  //   votesAgainst: item.votesAgainst,
  //   abstentions: item.abstentions,
  //   vetoes: item.vetoes,
  //   approved: item.approved,
  // }));

  return Promise.resolve([
    {
      votesFor: 12,
      votesAgainst: 2,
      abstentions: 1,
      vetoes: [],
      approved: true,
    },
    {
      votesFor: 10,
      votesAgainst: 4,
      abstentions: 2,
      vetoes: [],
      approved: true,
    },
    {
      votesFor: 8,
      votesAgainst: 6,
      abstentions: 1,
      vetoes: ["CHN", "RUS"],
      approved: false,
    },
    {
      votesFor: 14,
      votesAgainst: 0,
      abstentions: 1,
      vetoes: [],
      approved: true,
    },
    {
      votesFor: 9,
      votesAgainst: 3,
      abstentions: 3,
      vetoes: ["RUS"],
      approved: false,
    },
  ]);
}

/**
 * Obtener resolución histórica específica
 *
 * @param _resolutionId - ID de la resolución histórica
 * @returns Datos históricos de una resolución específica
 *
 * @integration Conectar aquí a UNDATA API
 */
export async function fetchHistoricalResolution(
  _resolutionId: string
): Promise<HistoricalResult | null> {
  // SIMULADO: Retorna resultado simulado
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
 * Obtener datos de paz y seguridad actualizados
 *
 * @returns Datos completos de paz y seguridad
 */
export async function fetchPeaceAndSecurityData(): Promise<{
  countries: Country[];
  events: DailyEvent[];
  historicalVotes: VoteResult[];
}> {
  try {
    const [countries, events, historicalVotes] = await Promise.all([
      fetchSecurityCouncilCountries(),
      fetchPeaceAndSecurityEvents(),
      fetchHistoricalVotes(),
    ]);

    markUpdated();

    return {
      countries,
      events,
      historicalVotes,
    };
  } catch (error) {
    console.error("Error fetching UN data:", error);
    // Retornar datos simulados en caso de error
    return {
      countries: [...COUNTRIES],
      events: [...DAILY_EVENTS],
      historicalVotes: await fetchHistoricalVotes(),
    };
  }
}

/**
 * Crear un evento simulado basado en datos reales de paz y seguridad
 *
 * @param realData - Datos reales de paz y seguridad
 * @returns Evento simulado
 */
export function createSimulatedEvent(realData: any): DailyEvent {
  return {
    id: `event-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    title: `Evento: ${realData.title || "Evento de paz y seguridad"}`,
    description: realData.description || "Datos de paz y seguridad de la ONU",
    date: new Date(),
    involvedCountries: realData.involvedCountries || ["UN"],
    urgency: realData.urgency || "media",
    addressed: false,
  };
}

/**
 * Obtener todas las cláusulas predefinidas con datos reales si están disponibles
 *
 * @returns Cláusulas con datos actualizados
 */
export async function fetchClauses(): Promise<typeof CLAUSES> {
  // En producción: obtener cláusulas de la API
  // const response = await fetch(`${UNDATA_API_BASE}/dataset/UNSC_CLAUSES`, {
  //   signal: AbortSignal.timeout(API_TIMEOUT),
  // });
  // const data = await response.json();
  // return data.map((item: any) => ({
  //   id: item.id,
  //   text: item.text,
  //   type: item.type,
  //   impact: item.impact,
  //   vetoRiskByCountry: item.vetoRiskByCountry,
  //   category: item.category,
  // }));

  return Promise.resolve([...CLAUSES]);
}

/**
 * Iniciar actualización automática de datos
 *
 * @param callback - Función a ejecutar cuando los datos se actualicen
 * @returns Función para detener la actualización automática
 */
export function startAutoUpdate(callback: () => Promise<void>): () => void {
  // Actualizar inmediatamente
  callback();

  // Actualizar cada 7 días
  const interval = setInterval(callback, AUTO_UPDATE_INTERVAL);

  // Retornar función para detener la actualización
  return () => {
    clearInterval(interval);
  };
}

/**
 * Obtener el uso de la API
 *
 * @returns Información sobre el uso de la API
 */
export function getApiUsageInfo(): {
  totalRequests: number;
  lastUpdate: Date | null;
  needsUpdate: boolean;
  apiBase: string;
} {
  return {
    totalRequests: 0, // En producción: contar peticiones
    lastUpdate: lastUpdate,
    needsUpdate: needsUpdate(),
    apiBase: UNDATA_API_BASE,
  };
}
