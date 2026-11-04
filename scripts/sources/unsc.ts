/**
 * Cliente para UNSCR Open Data (resoluciones del Consejo de Seguridad)
 *
 * Descarga datos estáticos desde el portal de UNSCR.
 * Nota: UNSCR no tiene una API REST pública documentada, por lo que
 * se implementa una descarga de archivos estáticos desde sus portales.
 */

const UNSCR_BASE = "https://www.un.org/securitycouncil/content/";
const DEFAULT_TIMEOUT = 30000;

/**
 * Descarga un archivo desde una URL y lo devuelve como texto
 */
async function fetchText(
  url: string,
  timeout = DEFAULT_TIMEOUT
): Promise<string> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "Accept": "*/*",
        "User-Agent": "ONU-Game-Data-Updater/1.0",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.text();
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Descarga resoluciones del Consejo de Seguridad desde UNSCR
 * Nota: Esta es una implementación base. La URL real puede requerir
 * ajustes según la estructura del portal UNSCR.
 *
 * @returns Array de objetos con datos de resoluciones
 */
export async function fetchUNSCRResolutions(): Promise<any[]> {
  console.log("[UNSCR] Iniciando descarga de resoluciones");

  // Intentar descargar desde diferentes endpoints posibles
  const possibleUrls = [
    `${UNSCR_BASE}resolutions.json`,
    `${UNSCR_BASE}data/resolutions.json`,
    "https://www.un.org/securitycouncil/sites/www.un.org.securitycouncil/files/resolutions.json",
  ];

  let lastError: unknown = null;

  for (const url of possibleUrls) {
    try {
      const text = await fetchText(url);
      const data = JSON.parse(text);

      if (Array.isArray(data)) {
        console.log(`[UNSCR] Descargadas ${data.length} resoluciones desde ${url}`);
        return data;
      }

      if (data && data.resolutions && Array.isArray(data.resolutions)) {
        console.log(
          `[UNSCR] Descargadas ${data.resolutions.length} resoluciones desde ${url}`
        );
        return data.resolutions;
      }
    } catch (err) {
      lastError = err;
      console.warn(`[UNSCR] Falló ${url}: ${err}`);
    }
  }

  console.warn(
    `[UNSCR] No se pudieron descargar resoluciones. Último error: ${lastError}`
  );
  return [];
}

/**
 * Descarga la lista de resoluciones adoptadas
 */
export async function fetchAdoptedResolutions(): Promise<any[]> {
  const data = await fetchUNSCRResolutions();
  return data.filter(
    (r: any) => r.status?.toLowerCase() === "adopted" || r.result?.toLowerCase() === "adopted"
  );
}
