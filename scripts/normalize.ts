/**
 * Funciones de normalización para los datasets del Consejo de Seguridad de la ONU.
 *
 * Cada normalizador recibe datos crudos de diversas fuentes y devuelve
 * objetos tipados siguiendo las interfaces definidas en /scripts/types/datasets.ts.
 *
 * Todas las funciones incluyen un campo _meta con información de trazabilidad.
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
} from "./types/datasets";

/**
 * Crea el objeto _meta común para todos los datasets
 */
function createMeta(
  source: string,
  recordCount: number
): NormalizedDataset<any>["_meta"] {
  return {
    source,
    fetchedAt: new Date().toISOString(),
    recordCount,
    schemaVersion: 1,
  };
}

/**
 * Normaliza datos de membresía del Consejo de Seguridad (DPPA-SCMembership)
 * Campos: country, role, startYear, endYear
 */
export function normalizeSCMembership(
  rawData: any[],
  source = "https://api.psdata.un.org/public"
): NormalizedDataset<SCMembershipRecord> {
  const data: SCMembershipRecord[] = rawData.map((item) => ({
    country: item.country_code || item.country || item.code || "",
    role: (item.role || item.type || "E10").toUpperCase() === "P5" ? "P5" : "E10",
    startYear: parseInt(item.start_year || item.startYear || item.year_start || "0", 10) || 0,
    endYear:
      item.end_year || item.endYear || item.year_end
        ? parseInt(item.end_year || item.endYear || item.year_end, 10)
        : null,
  }));

  return {
    _meta: createMeta(source, data.length),
    data,
  };
}

/**
 * Normaliza datos de grupos regionales (DPPA-SCRegionalGroupMembership)
 * Campos: country, regionalGroup
 */
export function normalizeSCRegionalGroups(
  rawData: any[],
  source = "https://api.psdata.un.org/public"
): NormalizedDataset<SCRegionalGroupRecord> {
  const data: SCRegionalGroupRecord[] = rawData.map((item) => ({
    country: item.country_code || item.country || item.code || "",
    regionalGroup: item.regional_group || item.regionalGroup || item.group || "",
  }));

  return {
    _meta: createMeta(source, data.length),
    data,
  };
}

/**
 * Normaliza votos del Consejo de Seguridad (DPPA-SCVOTES)
 * Campos: resolutionId, date, votes, result
 */
export function normalizeSCVotes(
  rawData: any[],
  source = "https://api.psdata.un.org/public"
): NormalizedDataset<SCVoteRecord> {
  const data: SCVoteRecord[] = rawData.map((item) => {
    // Normalizar votos: puede venir como objeto o array
    let votes: Record<string, "yes" | "no" | "abstain"> = {};

    if (item.votes && typeof item.votes === "object") {
      votes = Object.entries(item.votes).reduce((acc, [country, value]) => {
        acc[country] = String(value).toLowerCase() as "yes" | "no" | "abstain";
        return acc;
      }, {} as Record<string, "yes" | "no" | "abstain">);
    }

    // Determinar resultado
    let result: "adopted" | "vetoed" | "rejected" = "adopted";
    if (item.result) {
      const r = String(item.result).toLowerCase();
      if (r.includes("veto")) result = "vetoed";
      else if (r.includes("reject") || r.includes("fail")) result = "rejected";
      else result = "adopted";
    }

    return {
      resolutionId: item.resolution_id || item.resolutionId || item.id || "",
      date: item.date || item.vote_date || new Date().toISOString(),
      votes,
      result,
    };
  });

  return {
    _meta: createMeta(source, data.length),
    data,
  };
}

/**
 * Normaliza vetos ejercidos (DPPA-SCVETOES)
 * Campos: date, vetoingCountry, topic, resolutionId
 */
export function normalizeSCVetoes(
  rawData: any[],
  source = "https://api.psdata.un.org/public"
): NormalizedDataset<SCVetoRecord> {
  const data: SCVetoRecord[] = rawData.map((item) => ({
    date: item.date || item.veto_date || new Date().toISOString(),
    vetoingCountry: item.vetoing_country || item.vetoingCountry || item.country || "",
    topic: item.topic || item.subject || "",
    resolutionId: item.resolution_id || item.resolutionId || "",
  }));

  return {
    _meta: createMeta(source, data.length),
    data,
  };
}

/**
 * Normaliza misiones de campo (DPPA-FieldMissions)
 * Campos: missionId, name, mandateComponents[]
 */
export function normalizeFieldMissions(
  rawData: any[],
  source = "https://api.psdata.un.org/public"
): NormalizedDataset<FieldMissionRecord> {
  const data: FieldMissionRecord[] = rawData.map((item) => ({
    missionId: item.mission_id || item.missionId || item.id || "",
    name: item.name || item.mission_name || "",
    mandateComponents: Array.isArray(item.mandate_components)
      ? item.mandate_components
      : item.mandateComponents
      ? String(item.mandate_components).split(",").map((s) => s.trim())
      : [],
  }));

  return {
    _meta: createMeta(source, data.length),
    data,
  };
}

/**
 * Normaliza fatalidades de cascos azules (DPPADPOSS-FATALITIES)
 * Campos: year, mission, count
 */
export function normalizePeacekeeperFatalities(
  rawData: any[],
  source = "https://api.psdata.un.org/public"
): NormalizedDataset<PeacekeeperFatalityRecord> {
  const data: PeacekeeperFatalityRecord[] = rawData.map((item) => ({
    year: parseInt(item.year || item.año || "0", 10) || 0,
    mission: item.mission || item.misión || "",
    count: parseInt(item.count || item.cantidad || "0", 10) || 0,
  }));

  return {
    _meta: createMeta(source, data.length),
    data,
  };
}

/**
 * Normaliza resoluciones UNSCR (fuente externa)
 * Campos: resolutionId, title, date, number, topic, votes, result
 */
export function normalizeUNSCRResolutions(
  rawData: any[],
  source = "https://www.un.org/securitycouncil/"
): NormalizedDataset<UNSCRResolutionRecord> {
  const data: UNSCRResolutionRecord[] = rawData.map((item) => {
    let votes: Record<string, "yes" | "no" | "abstain"> = {};

    if (item.votes && typeof item.votes === "object") {
      votes = Object.entries(item.votes).reduce((acc, [country, value]) => {
        acc[country] = String(value).toLowerCase() as "yes" | "no" | "abstain";
        return acc;
      }, {} as Record<string, "yes" | "no" | "abstain">);
    }

    let result: "adopted" | "vetoed" | "rejected" = "adopted";
    if (item.result) {
      const r = String(item.result).toLowerCase();
      if (r.includes("veto")) result = "vetoed";
      else if (r.includes("reject") || r.includes("fail")) result = "rejected";
    }

    return {
      resolutionId: item.resolution_id || item.resolutionId || item.id || "",
      title: item.title || item.título || "",
      date: item.date || item.fecha || new Date().toISOString(),
      number: parseInt(item.number || item.numero || "0", 10) || 0,
      topic: item.topic || item.tema || "",
      votes,
      result,
    };
  });

  return {
    _meta: createMeta(source, data.length),
    data,
  };
}

/**
 * Normaliza lista consolidada de sanciones (scsanctions.un.org)
 * Campos: sanctionId, type, name, list[], listedDate, country?
 */
export function normalizeSanctions(
  rawData: any[],
  source = "https://scsanctions.un.org/resources/xml/en/consolidated.xml"
): NormalizedDataset<SanctionRecord> {
  const data: SanctionRecord[] = rawData.map((item) => ({
    sanctionId: item.sanction_id || item.id || "",
    type: item.type === "entity" ? "entity" : "individual",
    name: item.name || item.nombre || "",
    list: Array.isArray(item.list) ? item.list : item.list ? [item.list] : [],
    listedDate: item.listed_date || item.listedDate || new Date().toISOString(),
    country: item.country || item.país || undefined,
  }));

  return {
    _meta: createMeta(source, data.length),
    data,
  };
}

/**
 * Normaliza presidencias E10 (CSV de HDX)
 * Campos: country, month, presidentName?
 */
export function normalizeSCPresidencies(
  rawData: any[],
  source = "https://data.humdata.org/"
): NormalizedDataset<SCPresidencyRecord> {
  const data: SCPresidencyRecord[] = rawData.map((item) => ({
    country: item.country || item.país || "",
    month: item.month || item.mes || "",
    presidentName: item.president_name || item.presidente || undefined,
  }));

  return {
    _meta: createMeta(source, data.length),
    data,
  };
}

/**
 * Normaliza citas del corpus CR-UNSC (datos manuales)
 * Campos: citationId, citedResolutionId, citingResolutionId, citationType
 */
export function normalizeCRCitations(
  rawData: any[],
  source = "scripts/sources/corpus/cr-unsc-citations.json"
): NormalizedDataset<CRCitationRecord> {
  const data: CRCitationRecord[] = rawData.map((item) => ({
    citationId: item.citation_id || item.id || "",
    citedResolutionId: item.cited_resolution_id || item.citedResolutionId || "",
    citingResolutionId: item.citing_resolution_id || item.citingResolutionId || "",
    citationType:
      item.citation_type || item.citationType || "reference",
  }));

  return {
    _meta: createMeta(source, data.length),
    data,
  };
}

/**
 * Normaliza discursos de muestra (datos manuales)
 * Campos: speechId, speaker, country, date, topic, text
 */
export function normalizeCRSpeeches(
  rawData: any[],
  source = "scripts/sources/corpus/unsc-speeches-sample.json"
): NormalizedDataset<SpeechRecord> {
  const data: SpeechRecord[] = rawData.map((item) => ({
    speechId: item.speech_id || item.id || "",
    speaker: item.speaker || item.orador || "",
    country: item.country || item.país || "",
    date: item.date || item.fecha || new Date().toISOString(),
    topic: item.topic || item.tema || "",
    text: item.text || item.texto || "",
  }));

  return {
    _meta: createMeta(source, data.length),
    data,
  };
}
