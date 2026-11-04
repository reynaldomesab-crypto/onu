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
  },
  {
    id: "scn-gaza",
    topic: "proteccion-civil",
    title: "Crisis de Gaza",
    description:
      "Negociar pausas humanitarias y protección de civiles con base en resoluciones previas.",
  },
  {
    id: "scn-sudan",
    topic: "inseguridad-humanitaria",
    title: "Inseguridad en Sudán",
    description:
      "Negociar acceso humanitario y protección de civiles en zonas de conflicto.",
  },
  {
    id: "scn-haiti",
    topic: "estabilidad-regional",
    title: "Estabilidad en Haití",
    description:
      "Negociar apoyo policial y restauración de la autoridad nacional.",
  },
  {
    id: "scn-cyber",
    topic: "ciberseguridad",
    title: "Ciberataques a infraestructura crítica",
    description:
      "Negociar normas de conducta responsable entre estados miembros.",
  },
  {
    id: "scn-clima",
    topic: "seguridad-climatica",
    title: "Seguridad climática",
    description:
      "Negociar acciones coordinadas frente a desastres ambientales y migratorios.",
  },
];
