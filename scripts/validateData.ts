#!/usr/bin/env tsx

/**
 * Script de validación de datos normalizados.
 *
 * Verifica que todos los JSON esperados existen, tienen _meta.recordCount > 0
 * y cumplen el esquema definido con Zod.
 *
 * Uso:
 *   tsx scripts/validateData.ts
 */

import * as fs from "fs";
import * as path from "path";
import { z } from "zod";

// ============================================================================
// Esquemas de validación con Zod
// ============================================================================

const MetaSchema = z.object({
  source: z.string().min(1),
  fetchedAt: z.string().datetime(),
  recordCount: z.number().nonnegative(),
  schemaVersion: z.number().positive(),
});

const SCMembershipSchema = z.object({
  country: z.string().min(1),
  role: z.enum(["P5", "E10"]),
  startYear: z.number().int().positive(),
  endYear: z.number().int().nonnegative().nullable(),
});

const SCRegionalGroupSchema = z.object({
  country: z.string().min(1),
  regionalGroup: z.string().min(1),
});

const SCVoteSchema = z.object({
  resolutionId: z.string().min(1),
  date: z.string().datetime(),
  votes: z.record(z.string(), z.enum(["yes", "no", "abstain"])),
  result: z.enum(["adopted", "vetoed", "rejected"]),
});

const SCVetoSchema = z.object({
  date: z.string().datetime(),
  vetoingCountry: z.string().min(1),
  topic: z.string().min(1),
  resolutionId: z.string().min(1),
});

const FieldMissionSchema = z.object({
  missionId: z.string().min(1),
  name: z.string().min(1),
  mandateComponents: z.array(z.string()),
});

const PeacekeeperFatalitySchema = z.object({
  year: z.number().int().positive(),
  mission: z.string().min(1),
  count: z.number().int().nonnegative(),
});

const UNSCRResolutionSchema = z.object({
  resolutionId: z.string().min(1),
  title: z.string().min(1),
  date: z.string().datetime(),
  number: z.number().int().positive(),
  topic: z.string().min(1),
  votes: z.record(z.string(), z.enum(["yes", "no", "abstain"])),
  result: z.enum(["adopted", "vetoed", "rejected"]),
});

const SanctionSchema = z.object({
  sanctionId: z.string().min(1),
  type: z.enum(["individual", "entity"]),
  name: z.string().min(1),
  list: z.array(z.string()),
  listedDate: z.string().datetime(),
  country: z.string().optional(),
});

const SCPresidencySchema = z.object({
  country: z.string().min(1),
  month: z.string().min(1),
  presidentName: z.string().optional(),
});

const CRCitationSchema = z.object({
  citationId: z.string().min(1),
  citedResolutionId: z.string().min(1),
  citingResolutionId: z.string().min(1),
  citationType: z.enum([
    "follow-up",
    "amendment",
    "repeal",
    "reference",
  ]),
});

const SpeechSchema = z.object({
  speechId: z.string().min(1),
  speaker: z.string().min(1),
  country: z.string().min(1),
  date: z.string().datetime(),
  topic: z.string().min(1),
  text: z.string().min(1),
});

// ============================================================================
// Configuración de datasets esperados
// ============================================================================

interface ExpectedDataset {
  file: string;
  schema: z.ZodSchema<any>;
  recordType: string;
}

const EXPECTED_DATASETS: ExpectedDataset[] = [
  {
    file: "sc-membership.json",
    schema: z.object({
      _meta: MetaSchema,
      data: z.array(SCMembershipSchema),
    }),
    recordType: "SCMembershipRecord",
  },
  {
    file: "sc-regional-groups.json",
    schema: z.object({
      _meta: MetaSchema,
      data: z.array(SCRegionalGroupSchema),
    }),
    recordType: "SCRegionalGroupRecord",
  },
  {
    file: "sc-votes.json",
    schema: z.object({
      _meta: MetaSchema,
      data: z.array(SCVoteSchema),
    }),
    recordType: "SCVoteRecord",
  },
  {
    file: "sc-vetoes.json",
    schema: z.object({
      _meta: MetaSchema,
      data: z.array(SCVetoSchema),
    }),
    recordType: "SCVetoRecord",
  },
  {
    file: "field-missions.json",
    schema: z.object({
      _meta: MetaSchema,
      data: z.array(FieldMissionSchema),
    }),
    recordType: "FieldMissionRecord",
  },
  {
    file: "peacekeeper-fatalities.json",
    schema: z.object({
      _meta: MetaSchema,
      data: z.array(PeacekeeperFatalitySchema),
    }),
    recordType: "PeacekeeperFatalityRecord",
  },
  {
    file: "unscr-resolutions.json",
    schema: z.object({
      _meta: MetaSchema,
      data: z.array(UNSCRResolutionSchema),
    }),
    recordType: "UNSCRResolutionRecord",
  },
  {
    file: "sc-sanctions-consolidated.json",
    schema: z.object({
      _meta: MetaSchema,
      data: z.array(SanctionSchema),
    }),
    recordType: "SanctionRecord",
  },
  {
    file: "sc-presidencies.json",
    schema: z.object({
      _meta: MetaSchema,
      data: z.array(SCPresidencySchema),
    }),
    recordType: "SCPresidencyRecord",
  },
  {
    file: "cr-unsc-citations.json",
    schema: z.object({
      _meta: MetaSchema,
      data: z.array(CRCitationSchema),
    }),
    recordType: "CRCitationRecord",
  },
  {
    file: "unsc-speeches-sample.json",
    schema: z.object({
      _meta: MetaSchema,
      data: z.array(SpeechSchema),
    }),
    recordType: "SpeechRecord",
  },
  {
    file: "_update-log.json",
    schema: z.object({
      executedAt: z.string().datetime(),
      totalDatasets: z.number().int().nonnegative(),
      successful: z.number().int().nonnegative(),
      failed: z.number().int().nonnegative(),
      skipped: z.number().int().nonnegative(),
      datasets: z.array(
        z.object({
          datasetId: z.string().min(1),
          outputFile: z.string().min(1),
          status: z.enum(["success", "failed", "skipped"]),
          recordCount: z.number().int().nonnegative(),
          timestamp: z.string().datetime(),
          error: z.string().optional(),
        })
      ),
    }),
    recordType: "UpdateLog",
  },
];

// ============================================================================
// Validación
// ============================================================================

const DATA_DIR = path.join(process.cwd(), "public", "data");

let hasErrors = false;
let filesChecked = 0;
let filesValid = 0;

function logError(message: string): void {
  console.error(`  ✗ ${message}`);
  hasErrors = true;
}

function logSuccess(message: string): void {
  console.log(`  ✓ ${message}`);
  filesValid++;
}

function logWarning(message: string): void {
  console.warn(`  ⚠ ${message}`);
}

async function main(): Promise<void> {
  console.log("=".repeat(60));
  console.log("[validateData] Iniciando validación de datasets");
  console.log("=".repeat(60));
  console.log(`Directorio: ${DATA_DIR}\n`);

  if (!fs.existsSync(DATA_DIR)) {
    console.error(`\n❌ El directorio ${DATA_DIR} no existe`);
    console.log("\nEjecuta primero: pnpm run update-data");
    process.exit(1);
  }

  for (const dataset of EXPECTED_DATASETS) {
    filesChecked++;
    const filePath = path.join(DATA_DIR, dataset.file);

    console.log(`\n[${filesChecked}/${EXPECTED_DATASETS.length}] ${dataset.file}`);

    // Verificar que el archivo existe
    if (!fs.existsSync(filePath)) {
      logError(`Archivo no encontrado`);
      continue;
    }

    // Leer y parsear
    let content: any;
    try {
      const raw = fs.readFileSync(filePath, "utf-8");
      content = JSON.parse(raw);
    } catch (err) {
      logError(`Error parseando JSON: ${err}`);
      continue;
    }

    // Validar con Zod
    const result = dataset.schema.safeParse(content);

    if (!result.success) {
      logError(`Esquema inválido`);
      result.error.issues.forEach((e) => {
        console.log(`    - ${e.path.join(".")}: ${e.message}`);
      });
      continue;
    }

    // Verificar que tiene registros
    const data = result.data.data;
    if (data.length === 0) {
      logWarning(`Archivo válido pero sin registros (recordCount: 0)`);
    } else {
      logSuccess(`Esquema válido - ${data.length} registros`);
    }

    // Verificar _meta
    if (!result.data._meta || !result.data._meta.source) {
      logWarning(`Falta _meta.source`);
    }
    if (!result.data._meta || result.data._meta.recordCount !== data.length) {
      logWarning(
        `recordCount (${result.data._meta?.recordCount}) no coincide con data.length (${data.length})`
      );
    }
  }

  // Resumen
  console.log("\n" + "=".repeat(60));
  console.log("[validateData] RESUMEN");
  console.log("=".repeat(60));
  console.log(`  Archivos verificados: ${filesChecked}`);
  console.log(`  Archivos válidos:     ${filesValid}`);
  console.log(`  Errores:              ${filesChecked - filesValid}`);

  if (hasErrors) {
    console.log("\n❌ Validación falló");
    process.exit(1);
  } else {
    console.log("\n✅ Todos los datasets son válidos");
    process.exit(0);
  }
}

main().catch((err) => {
  console.error("Error fatal en validación:", err);
  process.exit(1);
});
