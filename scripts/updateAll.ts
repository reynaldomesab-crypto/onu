#!/usr/bin/env tsx

/**
 * Orquestador principal de actualización de datos del Consejo de Seguridad de la ONU.
 *
 * Recorre secuencialmente todos los datasets definidos, los descarga, normaliza
 * y escribe los JSON en /public/data/.
 *
 * Uso:
 *   tsx scripts/updateAll.ts              # Ejecución normal
 *   tsx scripts/updateAll.ts --dry-run    # Solo validar, no escribir archivos
 */

import * as fs from "fs";
import * as path from "path";
import {
  UpdateLog,
  UpdateLogEntry,
} from "./types/datasets";

// ============================================================================
// Importar clientes de fuentes
// ============================================================================

import { fetchAllPages } from "./sources/psdata";
import { fetchUNSCRResolutions } from "./sources/unsc";
import { readCRCitations, readCRSpeeches } from "./sources/crUnsc";

// ============================================================================
// Importar normalizadores
// ============================================================================

import {
  normalizeSCMembership,
  normalizeSCRegionalGroups,
  normalizeSCVotes,
  normalizeSCVetoes,
  normalizeFieldMissions,
  normalizePeacekeeperFatalities,
  normalizeUNSCRResolutions,
  normalizeSanctions,
  normalizeSCPresidencies,
  normalizeCRCitations,
  normalizeCRSpeeches,
} from "./normalize";

// ============================================================================
// Configuración de datasets
// ============================================================================

interface DatasetConfig {
  id: string;
  name: string;
  outputFile: string;
  group: "A" | "B" | "C";
  enabled: true;
}

// Grupo A: Desde API PSData
const GROUP_A_DATASETS: DatasetConfig[] = [
  {
    id: "DPPA-SCMembership",
    name: "Miembros del Consejo de Seguridad",
    outputFile: "sc-membership.json",
    group: "A",
    enabled: true,
  },
  {
    id: "DPPA-SCRegionalGroupMembership",
    name: "Grupos Regionales",
    outputFile: "sc-regional-groups.json",
    group: "A",
    enabled: true,
  },
  {
    id: "DPPA-SCVOTES",
    name: "Votos del Consejo de Seguridad",
    outputFile: "sc-votes.json",
    group: "A",
    enabled: true,
  },
  {
    id: "DPPA-SCVETOES",
    name: "Vetos Ejercidos",
    outputFile: "sc-vetoes.json",
    group: "A",
    enabled: true,
  },
  {
    id: "DPPA-FieldMissions",
    name: "Misiones de Campo",
    outputFile: "field-missions.json",
    group: "A",
    enabled: true,
  },
  {
    id: "DPPADPOSS-FATALITIES",
    name: "Fatalidades de Cascos Azules",
    outputFile: "peacekeeper-fatalities.json",
    group: "A",
    enabled: true,
  },
];

// Grupo B: Fuentes externas con descarga estática
const GROUP_B_DATASETS: DatasetConfig[] = [
  {
    id: "UNSCR-Resolutions",
    name: "Resoluciones UNSCR",
    outputFile: "unscr-resolutions.json",
    group: "B",
    enabled: true,
  },
  {
    id: "SC-Sanctions",
    name: "Lista Consolidada de Sanciones",
    outputFile: "sc-sanctions-consolidated.json",
    group: "B",
    enabled: true,
  },
  {
    id: "SC-Presidencies",
    name: "Presidencias E10",
    outputFile: "sc-presidencies.json",
    group: "B",
    enabled: true,
  },
];

// Grupo C: Datos de referencia empaquetados manualmente
const GROUP_C_DATASETS: DatasetConfig[] = [
  {
    id: "CR-UNSC-Citations",
    name: "Citas del Corpus CR-UNSC",
    outputFile: "cr-unsc-citations.json",
    group: "C",
    enabled: true,
  },
  {
    id: "UNSC-Speeches",
    name: "Discursos de Muestra",
    outputFile: "unsc-speeches-sample.json",
    group: "C",
    enabled: true,
  },
];

const OUTPUT_DIR = path.join(process.cwd(), "public", "data");
const MIN_SUCCESS_RATE = 0.8; // 80%

// ============================================================================
// Utilidades
// ============================================================================

function ensureOutputDir(): void {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`[updateAll] Directorio creado: ${OUTPUT_DIR}`);
  }
}

function readExistingData(outputFile: string): any[] | null {
  const filePath = path.join(OUTPUT_DIR, outputFile);
  if (!fs.existsSync(filePath)) {
    return null;
  }

  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(content);
    return parsed.data || null;
  } catch (err) {
    console.warn(
      `[updateAll] No se pudo leer archivo existente ${outputFile}: ${err}`
    );
    return null;
  }
}

function writeDataFile(
  outputFile: string,
  data: any,
  dryRun: boolean
): void {
  const filePath = path.join(OUTPUT_DIR, outputFile);

  if (dryRun) {
    console.log(`[updateAll] [DRY-RUN] Se escribiría: ${outputFile} (${data.data?.length || 0} registros)`);
    return;
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  console.log(
    `[updateAll] Escrito: ${outputFile} (${data.data?.length || 0} registros)`
  );
}

// ============================================================================
// Procesadores por grupo
// ============================================================================

/**
 * Procesa un dataset del Grupo A (API PSData)
 */
async function processGroupADataset(
  config: DatasetConfig,
  dryRun: boolean
): Promise<UpdateLogEntry> {
  const entry: UpdateLogEntry = {
    datasetId: config.id,
    outputFile: config.outputFile,
    status: "failed",
    recordCount: 0,
    timestamp: new Date().toISOString(),
  };

  try {
    console.log(`[updateAll] Procesando ${config.id} (Grupo A - PSData)`);

    const rawData = await fetchAllPages(config.id, 1000);

    if (!rawData || rawData.length === 0) {
      entry.status = "failed";
      entry.error = "No se obtuvieron registros";
      console.warn(`[updateAll] ${config.id}: 0 registros`);
      return entry;
    }

    // Normalizar según el tipo de dataset
    let normalized: any;
    switch (config.id) {
      case "DPPA-SCMembership":
        normalized = normalizeSCMembership(rawData);
        break;
      case "DPPA-SCRegionalGroupMembership":
        normalized = normalizeSCRegionalGroups(rawData);
        break;
      case "DPPA-SCVOTES":
        normalized = normalizeSCVotes(rawData);
        break;
      case "DPPA-SCVETOES":
        normalized = normalizeSCVetoes(rawData);
        break;
      case "DPPA-FieldMissions":
        normalized = normalizeFieldMissions(rawData);
        break;
      case "DPPADPOSS-FATALITIES":
        normalized = normalizePeacekeeperFatalities(rawData);
        break;
      default:
        throw new Error(`Normalizador no implementado para ${config.id}`);
    }

    writeDataFile(config.outputFile, normalized, dryRun);

    entry.status = "success";
    entry.recordCount = normalized.data.length;
    console.log(
      `[updateAll] ${config.id}: ${normalized.data.length} registros procesados`
    );
  } catch (err) {
    entry.error = err instanceof Error ? err.message : String(err);
    console.error(`[updateAll] ${config.id} falló: ${entry.error}`);

    // Mantener datos anteriores si existen
    const existing = readExistingData(config.outputFile);
    if (existing && !dryRun) {
      console.log(`[updateAll] ${config.id}: manteniendo datos anteriores`);
    }
  }

  return entry;
}

/**
 * Procesa un dataset del Grupo B (fuentes externas)
 */
async function processGroupBDataset(
  config: DatasetConfig,
  dryRun: boolean
): Promise<UpdateLogEntry> {
  const entry: UpdateLogEntry = {
    datasetId: config.id,
    outputFile: config.outputFile,
    status: "failed",
    recordCount: 0,
    timestamp: new Date().toISOString(),
  };

  try {
    console.log(`[updateAll] Procesando ${config.id} (Grupo B - externa)`);

    let rawData: any[] = [];

    switch (config.id) {
      case "UNSCR-Resolutions":
        rawData = await fetchUNSCRResolutions();
        break;
      case "SC-Sanctions":
        // TODO: Implementar descarga y parseo de XML de sanciones
        console.warn(`[updateAll] ${config.id}: descarga XML no implementada`);
        rawData = [];
        break;
      case "SC-Presidencies":
        // TODO: Implementar descarga de CSV de HDX
        console.warn(`[updateAll] ${config.id}: descarga CSV no implementada`);
        rawData = [];
        break;
      default:
        throw new Error(`Procesador no implementado para ${config.id}`);
    }

    if (!rawData || rawData.length === 0) {
      entry.status = "failed";
      entry.error = "No se obtuvieron registros";
      console.warn(`[updateAll] ${config.id}: 0 registros`);
      return entry;
    }

    // Normalizar
    let normalized: any;
    switch (config.id) {
      case "UNSCR-Resolutions":
        normalized = normalizeUNSCRResolutions(rawData);
        break;
      case "SC-Sanctions":
        normalized = normalizeSanctions(rawData);
        break;
      case "SC-Presidencies":
        normalized = normalizeSCPresidencies(rawData);
        break;
      default:
        throw new Error(`Normalizador no implementado para ${config.id}`);
    }

    writeDataFile(config.outputFile, normalized, dryRun);

    entry.status = "success";
    entry.recordCount = normalized.data.length;
    console.log(
      `[updateAll] ${config.id}: ${normalized.data.length} registros procesados`
    );
  } catch (err) {
    entry.error = err instanceof Error ? err.message : String(err);
    console.error(`[updateAll] ${config.id} falló: ${entry.error}`);

    const existing = readExistingData(config.outputFile);
    if (existing && !dryRun) {
      console.log(`[updateAll] ${config.id}: manteniendo datos anteriores`);
    }
  }

  return entry;
}

/**
 * Procesa un dataset del Grupo C (datos manuales)
 */
function processGroupCDataset(
  config: DatasetConfig,
  dryRun: boolean
): UpdateLogEntry {
  const entry: UpdateLogEntry = {
    datasetId: config.id,
    outputFile: config.outputFile,
    status: "failed",
    recordCount: 0,
    timestamp: new Date().toISOString(),
  };

  try {
    console.log(`[updateAll] Procesando ${config.id} (Grupo C - manual)`);

    let rawData: any[] | null = null;

    switch (config.id) {
      case "CR-UNSC-Citations":
        rawData = readCRCitations();
        break;
      case "UNSC-Speeches":
        rawData = readCRSpeeches();
        break;
      default:
        throw new Error(`Lector no implementado para ${config.id}`);
    }

    if (!rawData || rawData.length === 0) {
      console.warn(
        `[updateAll] ${config.id}: No hay datos en el corpus (archivo puede no existir)`
      );
      entry.status = "skipped";
      entry.error = "Archivo de corpus no encontrado o vacío";
      return entry;
    }

    // Normalizar
    let normalized: any;
    switch (config.id) {
      case "CR-UNSC-Citations":
        normalized = normalizeCRCitations(rawData);
        break;
      case "UNSC-Speeches":
        normalized = normalizeCRSpeeches(rawData);
        break;
      default:
        throw new Error(`Normalizador no implementado para ${config.id}`);
    }

    writeDataFile(config.outputFile, normalized, dryRun);

    entry.status = "success";
    entry.recordCount = normalized.data.length;
    console.log(
      `[updateAll] ${config.id}: ${normalized.data.length} registros procesados`
    );
  } catch (err) {
    entry.error = err instanceof Error ? err.message : String(err);
    console.error(`[updateAll] ${config.id} falló: ${entry.error}`);
  }

  return entry;
}

// ============================================================================
// Orquestador principal
// ============================================================================

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");

  console.log("=".repeat(60));
  console.log(
    `[updateAll] Iniciando actualización de datos del Consejo de Seguridad`
  );
  console.log(`[updateAll] Modo: ${dryRun ? "DRY-RUN" : "PRODUCCIÓN"}`);
  console.log("=".repeat(60));

  ensureOutputDir();

  const logEntries: UpdateLogEntry[] = [];

  // Procesar Grupo A (API PSData)
  console.log("\n[updateAll] === Grupo A: API PSData ===");
  for (const config of GROUP_A_DATASETS) {
    if (!config.enabled) continue;
    const entry = await processGroupADataset(config, dryRun);
    logEntries.push(entry);
  }

  // Procesar Grupo B (fuentes externas)
  console.log("\n[updateAll] === Grupo B: Fuentes Externas ===");
  for (const config of GROUP_B_DATASETS) {
    if (!config.enabled) continue;
    const entry = await processGroupBDataset(config, dryRun);
    logEntries.push(entry);
  }

  // Procesar Grupo C (datos manuales)
  console.log("\n[updateAll] === Grupo C: Datos Manuales ===");
  for (const config of GROUP_C_DATASETS) {
    if (!config.enabled) continue;
    const entry = processGroupCDataset(config, dryRun);
    logEntries.push(entry);
  }

  // Generar log de actualización
  const successful = logEntries.filter((e) => e.status === "success").length;
  const failed = logEntries.filter((e) => e.status === "failed").length;
  const skipped = logEntries.filter((e) => e.status === "skipped").length;
  const total = logEntries.length;

  const updateLog: UpdateLog = {
    executedAt: new Date().toISOString(),
    totalDatasets: total,
    successful,
    failed,
    skipped,
    datasets: logEntries,
  };

  const logPath = path.join(OUTPUT_DIR, "_update-log.json");

  if (!dryRun) {
    fs.writeFileSync(logPath, JSON.stringify(updateLog, null, 2), "utf-8");
    console.log(`\n[updateAll] Log escrito: ${logPath}`);
  } else {
    console.log(`\n[updateAll] [DRY-RUN] Log no escrito`);
  }

  // Resumen
  console.log("\n" + "=".repeat(60));
  console.log("[updateAll] RESUMEN");
  console.log("=".repeat(60));
  console.log(`  Total datasets:  ${total}`);
  console.log(`  Exitosos:        ${successful}`);
  console.log(`  Fallidos:        ${failed}`);
  console.log(`  Omitidos:        ${skipped}`);

  const successRate = total > 0 ? successful / total : 0;
  console.log(`  Tasa de éxito:   ${(successRate * 100).toFixed(1)}%`);

  // Mostrar detalles de fallos
  const failedEntries = logEntries.filter((e) => e.status === "failed");
  if (failedEntries.length > 0) {
    console.log("\n[updateAll] Fallos:");
    for (const entry of failedEntries) {
      console.log(`    - ${entry.datasetId}: ${entry.error}`);
    }
  }

  // Determinar código de salida
  if (successRate >= MIN_SUCCESS_RATE) {
    console.log(
      `\n[updateAll] Tasa de éxito (${(successRate * 100).toFixed(1)}%) >= umbral (${(MIN_SUCCESS_RATE * 100).toFixed(0)}%)`
    );
    process.exit(0);
  } else {
    console.error(
      `\n[updateAll] Tasa de éxito (${(successRate * 100).toFixed(1)}%) < umbral (${(MIN_SUCCESS_RATE * 100).toFixed(0)}%)`
    );
    process.exit(1);
  }
}

// Ejecutar
main().catch((err) => {
  console.error("[updateAll] Error fatal:", err);
  process.exit(1);
});
