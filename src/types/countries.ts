/**
 * Datos simulados de los países del Consejo de Seguridad de la ONU.
 * Estos datos son placeholders y deben reemplazarse por datos reales de la API
 * o de UNSC-BENCH cuando se conecte al backend.
 *
 * P5 (miembros permanentes con veto): China, Francia, Rusia, Reino Unido, Estados Unidos.
 * E10 (miembros electos, sin veto): rotan cada 2 años.
 */
import { Country } from "./index";

export const COUNTRIES: Country[] = [
  // P5 - Miembros permanentes con derecho a veto
  {
    code: "USA",
    name: "Estados Unidos",
    nameEs: "Estados Unidos de América",
    flag: "🇺🇸",
    isP5: true,
    region: "América",
    role: "P5",
    stance: "cooperativo",
  },
  {
    code: "CHN",
    name: "China",
    nameEs: "República Popular China",
    flag: "🇨🇳",
    isP5: true,
    region: "Asia",
    role: "P5",
    stance: "reservado",
  },
  {
    code: "RUS",
    name: "Rusia",
    nameEs: "Federación Rusa",
    flag: "🇷🇺",
    isP5: true,
    region: "Europa/Asia",
    role: "P5",
    stance: "confrontativo",
  },
  {
    code: "FRA",
    name: "Francia",
    nameEs: "República Francesa",
    flag: "🇫🇷",
    isP5: true,
    region: "Europa",
    role: "P5",
    stance: "cooperativo",
  },
  {
    code: "GBR",
    name: "Reino Unido",
    nameEs: "Reino Unido de Gran Bretaña",
    flag: "🇬🇧",
    isP5: true,
    region: "Europa",
    role: "P5",
    stance: "cooperativo",
  },
  // E10 - Miembros electos (sin veto)
  {
    code: "BRA",
    name: "Brasil",
    nameEs: "República Federativa del Brasil",
    flag: "🇧🇷",
    isP5: false,
    region: "América",
    role: "E10",
    stance: "neutral",
  },
  {
    code: "JPN",
    name: "Japón",
    nameEs: "Japón",
    flag: "🇯🇵",
    isP5: false,
    region: "Asia",
    role: "E10",
    stance: "cooperativo",
  },
  {
    code: "DEU",
    name: "Alemania",
    nameEs: "República Federal de Alemania",
    flag: "🇩🇪",
    isP5: false,
    region: "Europa",
    role: "E10",
    stance: "cooperativo",
  },
  {
    code: "IND",
    name: "India",
    nameEs: "República de la India",
    flag: "🇮🇳",
    isP5: false,
    region: "Asia",
    role: "E10",
    stance: "neutral",
  },
  {
    code: "ZAF",
    name: "Sudáfrica",
    nameEs: "República de Sudáfrica",
    flag: "🇿🇦",
    isP5: false,
    region: "África",
    role: "E10",
    stance: "neutral",
  },
];

export const P5_COUNTRIES: Country[] = COUNTRIES.filter((c) => c.isP5);
export const E10_COUNTRIES: Country[] = COUNTRIES.filter((c) => !c.isP5);

/**
 * Obtiene un país por su código ISO.
 * Retorna null si no se encuentra.
 */
export function getCountryByCode(code: string): Country | undefined {
  return COUNTRIES.find((c) => c.code === code);
}

/**
 * Verifica si un país es P5 (tiene derecho a veto).
 */
export function isP5Country(country: Country | null | undefined): boolean {
  return Boolean(country && country.isP5);
}

/**
 * Obtiene el nombre para mostrar de un país, con su bandera.
 */
export function getCountryDisplayName(country: Country | null): string {
  if (!country) return "Desconocido";
  return `${country.flag} ${country.nameEs}`;
}
