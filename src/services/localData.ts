/**
 * Servicio de datos locales para el frontend.
 *
 * Carga los JSON normalizados desde /data/*.json (empaquetados estáticamente
 * en el repositorio mediante GitHub Actions).
 *
 * Implementa caché en memoria por sesión para evitar múltiples descargas
 * del mismo archivo.
 */

import {
  NormalizedDataset,
  SCMembershipRecord,
  SCRegionalGroupRecord,
  SCVoteRecord,
  SCVetoRecord,
  FieldMissionRecord,
  PeacekeeperFatalityRecord,
  UNSCRResolutionRecord,
  SanctionRecord,
  SCPresidencyRecord,
  CRCitationRecord,
  SpeechRecord,
  UpdateLog,
} from "@/types/datasets";

// ============================================================================
// Configuración
// ============================================================================

const DATA_BASE_URL = "/data";
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutos de caché

// ============================================================================
// Caché en memoria
// ============================================================================

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CacheEntry<any>>();

function getCached<T>(key: string): T | null {
  const entry = cache.get(key) as CacheEntry<T> | undefined;
  if (!entry) return null;

  const now = Date.now();
  if (now - entry.timestamp > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }

  return entry.data;
}

function setCached<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() });
}

// ============================================================================
// Función genérica de carga
// ============================================================================

async function loadJSON<T>(filename: string): Promise<T | null> {
  const cacheKey = filename;
  const cached = getCached<T>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(`${DATA_BASE_URL}/${filename}`, {
      cache: "no-cache", // Siempre validar con el servidor (ETag/Last-Modified)
    });

    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`[localData] Archivo no encontrado: ${filename}`);
        return null;
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    setCached<T>(cacheKey, data);
    return data;
  } catch (err) {
    console.warn(`[localData] Error cargando ${filename}: ${err}`);
    return null;
  }
}

// ============================================================================
// Funciones tipadas para cada dataset
// ============================================================================

/**
 * Obtiene miembros del Consejo de Seguridad
 */
export async function getSCMembership(): Promise<
  NormalizedDataset<SCMembershipRecord> | null
> {
  return loadJSON<NormalizedDataset<SCMembershipRecord>>("sc-membership.json");
}

/**
 * Obtiene grupos regionales
 */
export async function getSCRegionalGroups(): Promise<
  NormalizedDataset<SCRegionalGroupRecord> | null
> {
  return loadJSON<NormalizedDataset<SCRegionalGroupRecord>>(
    "sc-regional-groups.json"
  );
}

/**
 * Obtiene votos del Consejo de Seguridad
 */
export async function getSCVotes(): Promise<
  NormalizedDataset<SCVoteRecord> | null
> {
  return loadJSON<NormalizedDataset<SCVoteRecord>>("sc-votes.json");
}

/**
 * Obtiene vetos ejercidos
 */
export async function getSCVetoes(): Promise<
  NormalizedDataset<SCVetoRecord> | null
> {
  return loadJSON<NormalizedDataset<SCVetoRecord>>("sc-vetoes.json");
}

/**
 * Obtiene misiones de campo
 */
export async function getFieldMissions(): Promise<
  NormalizedDataset<FieldMissionRecord> | null
> {
  return loadJSON<NormalizedDataset<FieldMissionRecord>>("field-missions.json");
}

/**
 * Obtiene fatalidades de cascos azules
 */
export async function getPeacekeeperFatalities(): Promise<
  NormalizedDataset<PeacekeeperFatalityRecord> | null
> {
  return loadJSON<NormalizedDataset<PeacekeeperFatalityRecord>>(
    "peacekeeper-fatalities.json"
  );
}

/**
 * Obtiene resoluciones UNSCR
 */
export async function getUNSCRResolutions(): Promise<
  NormalizedDataset<UNSCRResolutionRecord> | null
> {
  return loadJSON<NormalizedDataset<UNSCRResolutionRecord>>(
    "unscr-resolutions.json"
  );
}

/**
 * Obtiene lista de sanciones
 */
export async function getSanctions(): Promise<
  NormalizedDataset<SanctionRecord> | null
> {
  return loadJSON<NormalizedDataset<SanctionRecord>>(
    "sc-sanctions-consolidated.json"
  );
}

/**
 * Obtiene presidencias E10
 */
export async function getSCPresidencies(): Promise<
  NormalizedDataset<SCPresidencyRecord> | null
> {
  return loadJSON<NormalizedDataset<SCPresidencyRecord>>(
    "sc-presidencies.json"
  );
}

/**
 * Obtiene citas del corpus CR-UNSC
 */
export async function getCRCitations(): Promise<
  NormalizedDataset<CRCitationRecord> | null
> {
  return loadJSON<NormalizedDataset<CRCitationRecord>>("cr-unsc-citations.json");
}

/**
 * Obtiene discursos de muestra
 */
export async function getCRSpeeches(): Promise<
  NormalizedDataset<SpeechRecord> | null
> {
  return loadJSON<NormalizedDataset<SpeechRecord>>("unsc-speeches-sample.json");
}

/**
 * Obtiene el log de última actualización
 */
export async function getUpdateLog(): Promise<UpdateLog | null> {
  return loadJSON<UpdateLog>("_update-log.json");
}

/**
 * Limpia la caché (útil para forzar recarga)
 */
export function clearCache(): void {
  cache.clear();
}

/**
 * Verifica si un archivo de datos existe
 */
export async function dataFileExists(filename: string): Promise<boolean> {
  try {
    const response = await fetch(`${DATA_BASE_URL}/${filename}`, {
      method: "HEAD",
    });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Obtiene todos los archivos de datos disponibles
 */
export async function listAvailableDataFiles(): Promise<string[]> {
  const log = await getUpdateLog();
  if (!log) return [];

  return log.datasets.map((d) => d.outputFile);
}
