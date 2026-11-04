/**
 * Tipos y interfaces del dominio del juego "¿Puedes cambiar el mundo?".
 *
 * Este archivo define la estructura de datos utilizada en toda la aplicación.
 * Cada interfaz incluye comentarios explicando su propósito y campos.
 */

import type { NegotiationSolution } from "./negotiations";

export type { NegotiationSolution } from "./negotiations";

/**
 * País miembro del Consejo de Seguridad de la ONU.
 * isP5 = true indica que es miembro permanente con derecho a veto.
 * Un jugador nunca puede seleccionar un P5 como su país.
 */
export interface Country {
  /** Código ISO de 3 letras del país (ej. "USA", "CHN", "FRA") */
  code: string;
  /** Nombre completo del país */
  name: string;
  /** Nombre oficial en español */
  nameEs: string;
  /** Bandera (emoji o URL) */
  flag: string;
  /** true si es miembro permanente (P5) con derecho a veto */
  isP5: boolean;
  /** Región geográfica */
  region: string;
  /** Rol actual en el Consejo */
  role: string;
  /** Postura ideológica general (simulada) */
  stance: "cooperativo" | "neutral" | "reservado" | "confrontativo";
}

/**
 * Cláusula predefinida para un borrador de resolución.
 * El jugador no escribe texto libre; selecciona cláusulas de esta lista.
 */
export interface Clause {
  /** Identificador único de la cláusula */
  id: string;
  /** Texto de la cláusula en español */
  text: string;
  /** Tipo de cláusula (ej. "condena", "llamado", "sanciones", "observación") */
  type: "condena" | "llamado" | "sanciones" | "observacion" | "monitoreo";
  /** Nivel de impacto de la cláusula: bajo, medio o alto */
  impact: "bajo" | "medio" | "alto";
  /** Riesgo estimado de veto por cada país P5 (clave: código ISO del país) */
  vetoRiskByCountry: Record<string, "bajo" | "medio" | "alto">;
  /** Categoría temática de la cláusula */
  category: string;
}

/**
 * Borrador de resolución construido por el jugador.
 * Se compone de cláusulas seleccionadas, un tono y un país objetivo.
 */
export interface Draft {
  /** Identificador único del borrador */
  id: string;
  /** Cláusulas seleccionadas (orden importa) */
  clauses: Clause[];
  /** Tono del borrador: "firmo", "equilibrado", "conciliador" */
  tone: "firmo" | "equilibrado" | "conciliador";
  /** País objetivo al que va dirigida la resolución (opcional) */
  targetCountry?: string;
  /** Fecha de creación */
  createdAt: Date;
  /** Estado del borrador */
  status: "borrador" | "presentado" | "aprobado" | "rechazado" | "vetado";
}

/**
 * Resultado del predicción de riesgo de veto.
 * Generado por predictVetoRisk() tras analizar un borrador.
 */
export interface VetoRisk {
  /** Riesgo global de veto (0.0 = mínimo riesgo, 1.0 = máximo riesgo) */
  overallRisk: number;
  /** Riesgo por cada país P5 (clave: código ISO) */
  riskByCountry: Record<string, number>;
  /** Países P5 que probablemente vetarán (probabilidad > 0.5) */
  likelyVetoers: string[];
  /** Recomendación generada por el modelo */
  recommendation: string;
  /** Indica si el resultado proviene del modelo ONNX real o es simulado */
  isSimulated: boolean;
}

/**
 * Acción realizada por el jugador en el juego.
 * Se registra en el historial de acciones.
 */
export interface GameAction {
  /** Identificador único de la acción */
  id: string;
  /** Tipo de acción */
  type: "consulta" | "borrador" | "voto" | "negociacion";
  /** Descripción de la acción */
  description: string;
  /** Día en que se realizó */
  day: number;
  /** Fase en la que ocurrió */
  phase: GamePhase;
  /** Costo en acciones */
  cost: number;
  /** Timestamp */
  timestamp: Date;
}

/**
 * Mensaje de chat en la fase de negociación.
 */
export interface ChatMessage {
  /** Identificador único del mensaje */
  id: string;
  /** Emisor: "jugador" o código ISO del país */
  sender: string;
  /** Nombre del emisor para mostrar en UI */
  senderName: string;
  /** Texto del mensaje */
  text: string;
  /** Timestamp */
  timestamp: Date;
  /** Si el mensaje es del jugador */
  isPlayer: boolean;
}

/**
 * Evento del día mostrado en la fase de briefing.
 */
export interface DailyEvent {
  /** Identificador del evento */
  id: string;
  /** Título del evento */
  title: string;
  /** Descripción del evento */
  description: string;
  /** Fecha simulada */
  date: Date;
  /** Países involucrados (códigos ISO) */
  involvedCountries: string[];
  /** Urgencia del evento */
  urgency: "baja" | "media" | "alta";
  /** Si ya fue atendido */
  addressed: boolean;
}

/**
 * Resultado simulado de una votación.
 */
export interface VoteResult {
  /** Votos a favor */
  votesFor: number;
  /** Votos en contra */
  votesAgainst: number;
  /** Abstenciones */
  abstentions: number;
  /** Vetos ejercidos (códigos ISO de P5) */
  vetoes: string[];
  /** Si la resolución fue aprobada */
  approved: boolean;
}

/**
 * Resultado histórico de ejemplo para comparar en la fase REVEAL.
 */
export interface HistoricalResult {
  /** ID de la resolución histórica */
  resolutionId: string;
  /** Título */
  title: string;
  /** Resultado real histórico */
  voteResult: VoteResult;
  /** Comentario histórico */
  comment: string;
}

/**
 * Consecuencia publicada tras la aprobación de una resolución.
 * Se publica con una espera de 2-3 días y con variabilidad lógica
 * en los efectos (ayuda humanitaria, logística, etc.).
 */
export interface GameConsequence {
  /** ID de la resolución aprobada */
  resolutionId: string;
  /** Título de la resolución */
  title: string;
  /** Si fue aprobada */
  approved: boolean;
  /** Día en que se publicó el resultado */
  publishedDay: number;
  /** Días que faltaban para la publicación */
  daysUntilPublication: number;
  /** Familias alcanzadas por la ayuda (variabilidad lógica) */
  aidFamiliesReached: number;
  /** Sobrecargo de la logística (% sobre el presupuesto planificado) */
  logisticsOvercostPct: number;
  /** ¿La misión de paz fue efectiva? */
  missionEffective: boolean;
  /** Riesgos secundarios registrados (coherencia lógica) */
  secondaryRisks: string[];
}

/**
 * Fases de la máquina de estados del juego.
 */
export type GamePhase =
  | "BRIEFING"
  | "NEGOTIATION"
  | "DRAFTING"
  | "VOTING"
  | "REVEAL";

/**
 * Estado del juego gestionado por Zustand.
 */
export interface GameState {
  /** Día actual simulado */
  currentDay: number;
  /** Fase actual del juego */
  phase: GamePhase;
  /** Presupuesto de acciones restante hoy */
  actionBudget: number;
  /** Acciones totales disponibles por día */
  maxActionsPerDay: number;
  /** País del jugador (siempre E10) */
  playerCountry: Country | null;
  /** Lista de todos los países del Consejo */
  countries: Country[];
  /** Países P5 (con veto) */
  p5Countries: Country[];
  /** Países E10 (electos) */
  e10Countries: Country[];
  /** Borrador actual en construcción */
  currentDraft: Draft | null;
  /** Historial de borradores presentados */
  draftHistory: Draft[];
  /** Historial de acciones realizadas */
  actionHistory: GameAction[];
  /** Mensajes de chat de la negociación */
  chatMessages: ChatMessage[];
  /** Eventos del día actual */
  dailyEvents: DailyEvent[];
  /** Último resultado de predicción de veto */
  lastVetoRisk: VetoRisk | null;
  /** Último resultado de votación */
  lastVoteResult: VoteResult | null;
  /** Resultado histórico para comparar */
  historicalResult: HistoricalResult | null;
  /** Consecuencia pendiente de una resolución aprobada (por publicar) */
  pendingConsequence: GameConsequence | null;
  /** Historial de consecuencias publicadas */
  consequences: GameConsequence[];
  /** Solución de negociación activa seleccionada por el jugador */
  activeNegotiationSolution: NegotiationSolution | null;
  /** Si el juego está inicializado */
  isInitialized: boolean;
  /** Si hay una acción en curso (loading) */
  isLoading: boolean;
  /** Mensaje de error si lo hay */
  error: string | null;
}
