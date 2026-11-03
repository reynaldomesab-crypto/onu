/**
 * Eventos simulados del día para la fase BRIEFING.
 * Estos son placeholders preparados para conectar a una API externa.
 */
import { DailyEvent } from "./index";

export const DAILY_EVENTS: DailyEvent[] = [
  {
    id: "event-001",
    title: "Escalada de tensiones en la región del Sahel",
    description:
      "Informes de enfrentamientos armados entre grupos rebeldes y fuerzas gubernamentales han aumentado en las últimas 48 horas. La ONU expresa preocupación por la situación humanitaria.",
    date: new Date(),
    involvedCountries: ["MLI", "NER", "TCD"],
    urgency: "alta",
    addressed: false,
  },
  {
    id: "event-002",
    title: "Crisis de refugiados en el Mediterráneo oriental",
    description:
      "Miles de personas intentan cruzar hacia Europa en embarcaciones precarias. Los países costeros solicitan asistencia internacional coordinada.",
    date: new Date(),
    involvedCountries: ["GRC", "TUR", "CYP"],
    urgency: "media",
    addressed: false,
  },
  {
    id: "event-003",
    title: "Propuesta de sanciones contra entidad sancionada",
    description:
      "Varios miembros del Consejo han propuesto sanciones dirigidas contra una entidad acusada de financiar actividades ilícitas que amenazan la paz internacional.",
    date: new Date(),
    involvedCountries: ["IRN", "PRK"],
    urgency: "media",
    addressed: false,
  },
];

/**
 * Obtiene los eventos del día no atendidos.
 */
export function getPendingEvents(): DailyEvent[] {
  return DAILY_EVENTS.filter((e) => !e.addressed);
}

/**
 * Marca un evento como atendido.
 */
export function markEventAddressed(eventId: string): void {
  const event = DAILY_EVENTS.find((e) => e.id === eventId);
  if (event) {
    event.addressed = true;
  }
}
