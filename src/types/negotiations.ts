/**
 * Escenarios de negociación del Consejo de Seguridad.
 *
 * Basados en los problemas globales más graves del momento (conflicto armado,
 * crisis humanitaria, ciberseguridad, cambio climático, etc.) que el Consejo ha
 * abordado recientemente o debe abordar en la sesión actual.
 *
 * Estos escenarios se actualizan con las fuentes oficiales de la ONU
 * (PSData / UNSC / sanciones) mediante el pipeline mensual de /scripts.
 */

export interface NegotiationScenario {
  /** Identificador único del escenario */
  id: string;
  /** Tema principal (clave de clasificación en fuentes oficiales) */
  topic: string;
  /** Título corto del escenario */
  title: string;
  /** Descripción del problema grave a negociar */
  description: string;
  /** Nota breve con datos oficiales de la ONU sobre el problema (texto corto) */
  unDataNote?: string;
}

/**
 * Solución propuesta durante la negociación.
 * Cada problema puede tener hasta 5 soluciones distintas, cada una con
 * consecuencias diferenciadas.
 */
export interface NegotiationSolution {
  /** Identificador único de la solución */
  id: string;
  /** Escenario al que pertenece */
  scenarioId: string;
  /** Título de la solución */
  title: string;
  /** Descripción de la solución */
  description: string;
  /** Consecuencias esperadas de implementar la solución */
  expectedConsequence: {
    /** Familias alcanzadas por ayuda (variabilidad lógica) */
    aidFamiliesReached: number;
    /** Sobrecargo de la logística (% sobre el presupuesto planificado) */
    logisticsOvercostPct: number;
    /** ¿La misión/intervención fue efectiva? */
    missionEffective: boolean;
    /** Nivel de riesgo resultante */
    riskLevel: "bajo" | "medio" | "alto";
  };
}

/**
 * Soluciones genéricas para cualquier problema grave del Consejo.
 * Se generan con tácticas diplomáticas distintas y consecuencias diferenciadas.
 */
function buildSolutions(scenarioId: string): NegotiationSolution[] {
  const baseId = (n: number) => `${scenarioId}-sol-${n}`;
  const tactics: Array<Pick<NegotiationSolution, "title" | "description">> = [
    {
      title: "Diplomacia preventiva",
      description:
        "Impulso de canales diplomáticos bilaterales y regionales antes de escalar el conflicto.",
    },
    {
      title: "Sanciones coordinadas",
      description:
        "Imposición coordinada de sanciones por parte de los miembros del Consejo.",
    },
    {
      title: "Apoyo humanitario reforzado",
      description:
        "Incremento de ayuda humanitaria y misiones de paz con mandato reforzado.",
    },
    {
      title: "Mediación internacional",
      description:
        "Activación de mediación de la ONU con apoyo regional y de la coalición de Estados.",
    },
    {
      title: "Acción colectiva E10",
      description:
        "Resolución conjunta de la coalición de miembros no permanentes con perfil constructivo.",
    },
  ];

  const consequences: Array<
    Pick<NegotiationSolution["expectedConsequence"], "aidFamiliesReached" | "logisticsOvercostPct" | "missionEffective" | "riskLevel">
  > = [
    { aidFamiliesReached: 120, logisticsOvercostPct: 8, missionEffective: true, riskLevel: "bajo" },
    { aidFamiliesReached: 280, logisticsOvercostPct: 15, missionEffective: true, riskLevel: "bajo" },
    { aidFamiliesReached: 450, logisticsOvercostPct: 25, missionEffective: false, riskLevel: "medio" },
    { aidFamiliesReached: 90, logisticsOvercostPct: 5, missionEffective: true, riskLevel: "bajo" },
    { aidFamiliesReached: 200, logisticsOvercostPct: 18, missionEffective: false, riskLevel: "alto" },
  ];

  return tactics.map((tactic, index) => ({
    id: baseId(index + 1),
    scenarioId,
    title: tactic.title,
    description: tactic.description,
    expectedConsequence: {
      ...consequences[index],
      riskLevel: index === 4 ? "alto" : index === 2 ? "medio" : "bajo",
    },
  }));
}

/**
 * Devuelve las 5 soluciones (más distintas entre sí) para un escenario.
 */
export function getSolutionsForScenario(scenarioId: string): NegotiationSolution[] {
  return buildSolutions(scenarioId);
}

/**
 * Escenarios activos de negociación del Consejo de Seguridad.
 * Se recomienda rotar / ampliar este catálogo con los datasets actualizados
 * por el workflow mensual (UNSC_RESOLUTIONS, DPPA-*, etc.).
 */
export const NEGOTIATION_SCENARIOS: NegotiationScenario[] = [
  {
    id: "scn-ukraine",
    topic: "conflicto-armado",
    title: "Conflito armado en Ucrania",
    description:
      "Negociar un cese al fuego inmediato y mecanismos de seguridad alimentaria.",
    unDataNote:
      "Según datos oficiales de la ONU, el Consejo ha adoptado numerosas resoluciones sobre el conflicto en Ucrania, incluyendo mecanismos de seguridad alimentaria y evacuación. La agencia humanitaria (OCHA) reporta miles de personas en necesidad de protección.",
  },
  {
    id: "scn-gaza",
    topic: "proteccion-civil",
    title: "Crisis de Gaza",
    description:
      "Negociar pausas humanitarias y protección de civiles con base en resoluciones previas.",
    unDataNote:
      "La ONU ha registrado en Gaza situaciones de protección civil y desastres humanitarios. El OCHA y la ONU destacan la urgencia de pausas humanitarias y la protección de civiles.",
  },
  {
    id: "scn-sudan",
    topic: "inseguridad-humanitaria",
    title: "Inseguridad en Sudán",
    description:
      "Negociar acceso humanitario y protección de civiles en zonas de conflicto.",
    unDataNote:
      "En Sudán, la ONU y sus agencias han documentado inseguridad humanitaria con millones de personas desplazadas. Los marcos de protección civil son centrales para la respuesta.",
  },
  {
    id: "scn-haiti",
    topic: "estabilidad-regional",
    title: "Estabilidad en Haití",
    description:
      "Negociar apoyo policial y restauración de la autoridad nacional.",
    unDataNote:
      "La ONU y la comunidad internacional han reportado inestabilidad en Haití, donde la misión de apoyo requiere coordinación logística y seguridad.",
  },
  {
    id: "scn-cyber",
    topic: "ciberseguridad",
    title: "Ciberataques a infraestructura crítica",
    description:
      "Negociar normas de conducta responsable entre estados miembros.",
    unDataNote:
      "La ONU ha venido emitiendo resoluciones sobre ciberseguridad y protección de infraestructuras críticas frente a amenazas digitales.",
  },
  {
    id: "scn-clima",
    topic: "seguridad-climatica",
    title: "Seguridad climática",
    description:
      "Negociar acciones coordinadas frente a desastres ambientales y migratorios.",
    unDataNote:
      "La ONU ha alertado sobre la intersección entre cambio climático, seguridad humana y desplazamientos forzados, orientando acciones coordinadas.",
  },
];
