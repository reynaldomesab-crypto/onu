/**
 * Interfaces TypeScript para los datasets normalizados del Consejo de Seguridad de la ONU.
 * Cada dataset sigue la convención NormalizedDataset<T> con metadatos de trazabilidad.
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
 * Miembros del Consejo de Seguridad (DPPA-SCMembership)
 */
export interface SCMembershipRecord {
  /** Código ISO de 3 letras del país */
  country: string;
  /** Rol: P5 (permanente con veto) o E10 (no permanente electo) */
  role: "P5" | "E10";
  /** Año de inicio del mandato */
  startYear: number;
  /** Año de fin del mandato (null si es vigente) */
  endYear: number | null;
}

/**
 * Pertenencia a grupos regionales (DPPA-SCRegionalGroupMembership)
 */
export interface SCRegionalGroupRecord {
  /** Código ISO de 3 letras del país */
  country: string;
  /** Grupo regional al que pertenece */
  regionalGroup: string;
}

/**
 * Votos del Consejo de Seguridad (DPPA-SCVOTES)
 */
export interface SCVoteRecord {
  /** ID de la resolución (ej. S/2024/123) */
  resolutionId: string;
  /** Fecha de la votación (ISO-8601) */
  date: string;
  /** Votos por país: código ISO -> 'yes' | 'no' | 'abstain' */
  votes: Record<string, "yes" | "no" | "abstain">;
  /** Resultado: adopted, vetoed, rejected */
  result: "adopted" | "vetoed" | "rejected";
}

/**
 * Vetos ejercidos (DPPA-SCVETOES)
 */
export interface SCVetoRecord {
  /** Fecha del veto (ISO-8601) */
  date: string;
  /** País que ejerció el veto (código ISO) */
  vetoingCountry: string;
  /** Tema de la resolución */
  topic: string;
  /** ID de la resolución vetada */
  resolutionId: string;
}

/**
 * Misiones de campo (DPPA-FieldMissions)
 */
export interface FieldMissionRecord {
  /** ID de la misión */
  missionId: string;
  /** Nombre de la misión */
  name: string;
  /** Componentes del mandato */
  mandateComponents: string[];
}

/**
 * Fatalidades de cascos azules (DPPADPOSS-FATALITIES)
 */
export interface PeacekeeperFatalityRecord {
  /** Año */
  year: number;
  /** Misión */
  mission: string;
  /** Número de fatalidades */
  count: number;
}

/**
 * Grupo B - Fuentes externas
 */

/**
 * Resoluciones UNSCR (fuente externa)
 */
export interface UNSCRResolutionRecord {
  /** ID de la resolución */
  resolutionId: string;
  /** Título */
  title: string;
  /** Fecha de adopción (ISO-8601) */
  date: string;
  /** Número de resolución */
  number: number;
  /** Tema */
  topic: string;
  /** Votos: { yes, no, abstain } */
  votes: Record<string, "yes" | "no" | "abstain">;
  /** Resultado */
  result: "adopted" | "vetoed" | "rejected";
}

/**
 * Lista Consolidada de Sanciones (scsanctions.un.org)
 */
export interface SanctionRecord {
  /** ID de la sanción */
  sanctionId: string;
  /** Tipo: individuo o entidad */
  type: "individual" | "entity";
  /** Nombre */
  name: string;
  /** Lista de sanciones (ej. 1267, 1988, etc.) */
  list: string[];
  /** Fecha de inclusión (ISO-8601) */
  listedDate: string;
  /** País asociado */
  country?: string;
}

/**
 * Presidencias E10 (fuente HDX CSV)
 */
export interface SCPresidencyRecord {
  /** País que preside */
  country: string;
  /** Mes y año (YYYY-MM) */
  month: string;
  /** Presidente (nombre) */
  presidentName?: string;
}

/**
 * Grupo C - Datos de referencia empaquetados manualmente
 */

/**
 * Citas del corpus CR-UNSC (placeholder)
 */
export interface CRCitationRecord {
  /** ID de la cita */
  citationId: string;
  /** Resolución citada */
  citedResolutionId: string;
  /** Resolución que cita */
  citingResolutionId: string;
  /** Tipo de cita */
  citationType: "follow-up" | "amendment" | "repeal" | "reference";
}

/**
 * Muestra de discursos (placeholder)
 */
export interface SpeechRecord {
  /** ID del discurso */
  speechId: string;
  /** Orador */
  speaker: string;
  /** País del orador */
  country: string;
  /** Fecha (ISO-8601) */
  date: string;
  /** Tema */
  topic: string;
  /** Texto (fragmento) */
  text: string;
}

/**
 * Log de actualización
 */
export interface UpdateLogEntry {
  /** ID del dataset */
  datasetId: string;
  /** Nombre del archivo de salida */
  outputFile: string;
  /** Estado: success, failed, skipped */
  status: "success" | "failed" | "skipped";
  /** Número de registros procesados */
  recordCount: number;
  /** Marca de tiempo */
  timestamp: string;
  /** Mensaje de error (si falló) */
  error?: string;
}

export interface UpdateLog {
  /** Fecha de ejecución */
  executedAt: string;
  /** Número total de datasets */
  totalDatasets: number;
  /** Número de éxitos */
  successful: number;
  /** Número de fallos */
  failed: number;
  /** Número omitidos */
  skipped: number;
  /** Datasets detallados */
  datasets: UpdateLogEntry[];
}

/**
 * Estado actual de un dataset para comparación
 */
export interface DatasetState {
  /** ID del dataset */
  datasetId: string;
  /** Última fecha de actualización conocida */
  lastUpdated: string | null;
  /** Último conteo de registros conocido */
  lastRecordCount: number | null;
}
