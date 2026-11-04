/**
 * Lector del corpus CR-UNSC (descarga estática)
 *
 * Este módulo lee archivos estáticos del corpus de citas CR-UNSC
 * que deben estar previamente descargados en el repositorio.
 * No realiza llamadas de red; simplemente lee archivos locales.
 */

import * as fs from "fs";
import * as path from "path";

const CORPUS_DIR = path.join(process.cwd(), "scripts", "sources", "corpus");

/**
 * Lee un archivo JSON del corpus CR-UNSC
 * @param filename - Nombre del archivo dentro del directorio corpus/
 * @returns Datos parseados o null si no existe
 */
export function readCorpusFile(filename: string): any[] | null {
  const filePath = path.join(CORPUS_DIR, filename);

  if (!fs.existsSync(filePath)) {
    console.warn(`[CR-UNSC] Archivo no encontrado: ${filePath}`);
    return null;
  }

  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(content);

    if (Array.isArray(data)) {
      console.log(`[CR-UNSC] Leídos ${data.length} registros de ${filename}`);
      return data;
    }

    console.warn(`[CR-UNSC] ${filename} no contiene un array válido`);
    return null;
  } catch (err) {
    console.error(`[CR-UNSC] Error leyendo ${filename}: ${err}`);
    return null;
  }
}

/**
 * Lee las citas del corpus CR-UNSC
 */
export function readCRCitations(): any[] | null {
  return readCorpusFile("cr-unsc-citations.json");
}

/**
 * Lee los discursos de muestra del corpus CR-UNSC
 */
export function readCRSpeeches(): any[] | null {
  return readCorpusFile("unsc-speeches-sample.json");
}

/**
 * Verifica si el directorio del corpus existe
 */
export function corpusExists(): boolean {
  return fs.existsSync(CORPUS_DIR);
}

/**
 * Lista los archivos disponibles en el corpus
 */
export function listCorpusFiles(): string[] {
  if (!fs.existsSync(CORPUS_DIR)) {
    return [];
  }

  return fs.readdirSync(CORPUS_DIR).filter((f) => f.endsWith(".json"));
}
