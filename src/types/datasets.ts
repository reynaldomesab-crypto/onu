/**
 * Interfaces TypeScript para los datasets normalizados del Consejo de Seguridad de la ONU.
 * Estas interfaces deben coincidir con las definidas en /scripts/types/datasets.ts.
 */

/**
 * Estructura base de todos los datasets normalizados
 */
export interface NormalizedDataset<T> {
  _meta: {
    source: string;
    fetchedAt: string;
    recordCount: number;
    schemaVersion: number;
  };
  data: T[];
}

/**
 * Grupo A - Datasets desde API PSData
 */

/**
 * Miembros del Consejo de Seguridad
 */
export interface SCMembershipRecord {
  country: string;
  role: "P5" | "E10";
  startYear: number;
  endYear: number | null;
}

/**
 * Pertenencia a grupos regionales
 */
export interface SCRegionalGroupRecord {
  country: string;
  regionalGroup: string;
}

/**
 * Votos del Consejo de Seguridad
 */
export interface SCVoteRecord {
  resolutionId: string;
  date: string;
  votes: Record<string, "yes" | "no" | "abstain">;
  result: "adopted" | "vetoed" | "rejected";
}

/**
 * Vetos ejercidos
 */
export interface SCVetoRecord {
  date: string;
  vetoingCountry: string;
  topic: string;
  resolutionId: string;
}

/**
 * Misiones de campo
 */
export interface FieldMissionRecord {
  missionId: string;
  name: string;
  mandateComponents: string[];
}

/**
 * Fatalidades de cascos azules
 */
export interface PeacekeeperFatalityRecord {
  year: number;
  mission: string;
  count: number;
}

/**
 * Grupo B - Fuentes externas
 */

/**
 * Resoluciones UNSCR
 */
export interface UNSCRResolutionRecord {
  resolutionId: string;
  title: string;
  date: string;
  number: number;
  topic: string;
  votes: Record<string, "yes" | "no" | "abstain">;
  result: "adopted" | "vetoed" | "rejected";
}

/**
 * Lista Consolidada de Sanciones
 */
export interface SanctionRecord {
  sanctionId: string;
  type: "individual" | "entity";
  name: string;
  list: string[];
  listedDate: string;
  country?: string;
}

/**
 * Presidencias E10
 */
export interface SCPresidencyRecord {
  country: string;
  month: string;
  presidentName?: string;
}

/**
 * Grupo C - Datos de referencia empaquetados manualmente
 */

/**
 * Citas del corpus CR-UNSC
 */
export interface CRCitationRecord {
  citationId: string;
  citedResolutionId: string;
  citingResolutionId: string;
  citationType: "follow-up" | "amendment" | "repeal" | "reference";
}

/**
 * Muestra de discursos
 */
export interface SpeechRecord {
  speechId: string;
  speaker: string;
  country: string;
  date: string;
  topic: string;
  text: string;
}

/**
 * Log de actualización
 */
export interface UpdateLogEntry {
  datasetId: string;
  outputFile: string;
  status: "success" | "failed" | "skipped";
  recordCount: number;
  timestamp: string;
  error?: string;
}

export interface UpdateLog {
  executedAt: string;
  totalDatasets: number;
  successful: number;
  failed: number;
  skipped: number;
  datasets: UpdateLogEntry[];
}
