/**
 * Cliente para la API de PSData (Peace & Security Data Hub de la ONU)
 *
 * URL base: https://api.psdata.un.org/public
 *
 * Endpoints soportados:
 *   GET /data/{datasetid}/{format}   → datos (usar json)
 *   GET /metadata/{datasetid}        → metadatos (columnas, tipos, descripción)
 *
 * Parámetros opcionales: per_page, page_num, filter
 */

import { z } from "zod";

// ============================================================================
// Tipos de respuesta de la API
// ============================================================================

export interface PSDataResponse<T = any> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface PSMetadata {
  datasetId: string;
  columns: Array<{
    name: string;
    type: string;
    description?: string;
  }>;
  description?: string;
  recordCount?: number;
}

// Esquema de validación para la respuesta de datos.
// Acepta tanto un objeto con paginación como un array plano (formato actual de la API).
const PSDataResponseSchema = z.object({
  data: z.array(z.any()),
  total: z.number(),
  page: z.number(),
  per_page: z.number(),
  total_pages: z.number(),
});

const PSDataSchema = z.union([PSDataResponseSchema, z.array(z.any())]);

/**
 * Extrae los registros del resultado parseado, sin importar el formato.
 */
function extractRecords(parsed: unknown): any[] {
  if (Array.isArray(parsed)) {
    return parsed;
  }
  const payload = parsed as { data?: any[] };
  if (payload && Array.isArray(payload.data)) {
    return payload.data;
  }
  throw new Error("Formato de respuesta inválido: no se encontraron registros");
}

/**
 * Espera un tiempo dado (para backoff exponencial)
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ============================================================================
// Configuración
// ============================================================================

const BASE_URL = "https://api.psdata.un.org/public";
const DEFAULT_TIMEOUT = 30000;
const MAX_RETRIES = 3;

// ============================================================================
// Utilidades internas
// ============================================================================

/**
 * Realiza una petición con reintentos y backoff exponencial
 */
async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retries = MAX_RETRIES,
  timeout = DEFAULT_TIMEOUT
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  const fetchOptions: RequestInit = {
    ...options,
    signal: controller.signal,
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      ...options.headers,
    },
  };

  clearTimeout(timeoutId);

  let lastError: unknown = null;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const startTime = Date.now();
      const response = await fetch(url, fetchOptions);
      const responseTime = Date.now() - startTime;

      console.log(
        `[PSData] ${response.status} ${url} (intento ${attempt}/${retries}, ${responseTime}ms)`
      );

      if (response.ok) {
        return response;
      }

      // Si es error 5xx o timeout, reintentar con backoff
      if (response.status >= 500 || response.status === 408) {
        lastError = new Error(`HTTP ${response.status}`);
        if (attempt < retries) {
          const backoff = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
          console.log(`[PSData] Reintentando en ${backoff}ms...`);
          await sleep(backoff);
          continue;
        }
      }

      // Errores 4xx no se reintentan (excepto 408)
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    } catch (err) {
      lastError = err;

      if (err instanceof Error && err.name === "AbortError") {
        console.warn(`[PSData] Timeout en intento ${attempt}/${retries}: ${url}`);
      } else {
        console.warn(`[PSData] Error en intento ${attempt}/${retries}: ${err}`);
      }

      if (attempt < retries) {
        const backoff = Math.pow(2, attempt) * 1000;
        await sleep(backoff);
      }
    }
  }

  throw lastError;
}

/**
 * Parsea y valida la respuesta JSON de PSData, devolviendo los registros.
 */
async function parsePSDataResponse(response: Response): Promise<any[]> {
  const text = await response.text();
  let data: any;

  try {
    data = JSON.parse(text);
  } catch (err) {
    throw new Error(`Respuesta JSON inválida: ${text.substring(0, 200)}`);
  }

  const parsed = PSDataSchema.safeParse(data);
  if (!parsed.success) {
    const errorMessages = parsed.error.issues.map((e) => e.message).join(", ");
    throw new Error(`Formato de respuesta inválido: ${errorMessages}`);
  }

  return extractRecords(parsed.data);
}

// ============================================================================
// API pública
// ============================================================================

/**
 * Obtiene un dataset de PSData con paginación opcional
 *
 * @param datasetId - ID del dataset (ej. DPPA-SCMembership)
 * @param options - Opciones de paginación y filtro
 * @returns Datos del dataset
 */
export async function fetchDataset(
  datasetId: string,
  options: {
    perPage?: number;
    pageNum?: number;
    filter?: string;
  } = {}
): Promise<any[]> {
  const { perPage, pageNum, filter } = options;

  const params = new URLSearchParams();
  if (perPage) params.append("per_page", String(perPage));
  if (pageNum) params.append("page_num", String(pageNum));
  if (filter) params.append("filter", filter);

  const url = `${BASE_URL}/data/${datasetId}/json${params.toString() ? "?" + params.toString() : ""}`;

  const response = await fetchWithRetry(url);
  const records = await parsePSDataResponse(response);

  return records;
}

/**
 * Obtiene metadatos de un dataset
 *
 * @param datasetId - ID del dataset
 * @returns Metadatos del dataset
 */
export async function fetchMetadata(datasetId: string): Promise<PSMetadata> {
  const url = `${BASE_URL}/metadata/${datasetId}`;
  const response = await fetchWithRetry(url);

  const text = await response.text();
  let data: any;

  try {
    data = JSON.parse(text);
  } catch (err) {
    throw new Error(`Respuesta JSON inválida en metadatos: ${text.substring(0, 200)}`);
  }

  return data as PSMetadata;
}

/**
 * Obtiene todas las páginas de un dataset
 *
 * @param datasetId - ID del dataset
 * @param perPage - Registros por página (default: 1000)
 * @returns Todos los registros del dataset
 */
export async function fetchAllPages(
  datasetId: string,
  perPage = 1000
): Promise<any[]> {
  const allData: any[] = [];
  let currentPage = 1;
  let totalPages = 1;

  console.log(`[PSData] Iniciando descarga completa de ${datasetId}`);

  while (currentPage <= totalPages) {
    const response = await fetchWithRetry(
      `${BASE_URL}/data/${datasetId}/json?per_page=${perPage}&page_num=${currentPage}`
    );
    const parsed: any = await parsePSDataResponse(response);

    allData.push(...parsed);
    const pageInfo: any = Array.isArray(parsed) ? { total_pages: 1 } : parsed;
    totalPages = pageInfo.total_pages;

    console.log(
      `[PSData] Página ${currentPage}/${totalPages} - ${parsed.length} registros`
    );

    currentPage++;

    if (currentPage <= totalPages) {
      // Pequeña pausa entre páginas para no saturar la API
      await sleep(200);
    }
  }

  console.log(
    `[PSData] Descarga completa de ${datasetId}: ${allData.length} registros en ${totalPages} páginas`
  );

  return allData;
}
