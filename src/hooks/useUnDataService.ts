/**
 * Hook personalizado para usar la API de la ONU
 *
 * Este hook proporciona funciones para:
 * - Obtener datos en vivo de la ONU
 * - Actualizar datos automáticamente
 * - Manejar estado de carga y errores
 */

import { useState, useCallback } from "react";
import {
  fetchPeaceAndSecurityData,
  fetchClauses,
  fetchHistoricalVotes,
  needsUpdate,
  getLastUpdateTime,
} from "@/services/unDataService";
import { showToast } from "@/utils/toast";

export function useUnDataService() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsRefresh, setNeedsRefresh] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  /**
   * Cargar datos de la ONU
   */
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Solo mostramos que los datos están disponibles
      // En producción, aquí se conectaría a la API real
      // y se actualizaría el store con los datos reales
      await fetchPeaceAndSecurityData();
      setNeedsRefresh(false);
      setLastUpdate(new Date());
      showToast("Datos de la ONU disponibles", "success");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido";
      setError(errorMessage);
      showToast(`Error al cargar datos: ${errorMessage}`, "error");
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Cargar cláusulas actualizadas
   */
  const loadClauses = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await fetchClauses();
      showToast("Cláusulas disponibles", "success");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido";
      setError(errorMessage);
      showToast(`Error al cargar cláusulas: ${errorMessage}`, "error");
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Cargar resultados históricos
   */
  const loadHistoricalVotes = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await fetchHistoricalVotes();
      showToast("Resultados históricos disponibles", "success");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido";
      setError(errorMessage);
      showToast(`Error al cargar resultados históricos: ${errorMessage}`, "error");
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Verificar si es necesario actualizar los datos
   */
  const checkUpdateNeeded = useCallback(() => {
    const needs = needsUpdate();
    setNeedsRefresh(needs);
    return needs;
  }, []);

  /**
   * Actualizar datos manualmente
   */
  const forceUpdate = useCallback(async () => {
    await loadData();
  }, [loadData]);

  /**
   * Iniciar actualización automática periódica
   *
   * @param interval - Intervalo en milisegundos (por defecto: 7 días)
   * @returns Función para detener la actualización automática
   */
  const startAutoUpdate = useCallback(
    (interval: number = 7 * 24 * 60 * 60 * 1000) => {
      // Cargar datos inmediatamente
      loadData();

      // Actualizar periódicamente
      const intervalId = setInterval(loadData, interval);

      // Retornar función para detener la actualización
      return () => {
        clearInterval(intervalId);
      };
    },
    [loadData]
  );

  /**
   * Obtener información de la última actualización
   */
  const getUpdateInfo = useCallback(() => {
    return {
      lastUpdate: getLastUpdateTime(),
      needsUpdate: needsUpdate(),
      totalRequests: 0, // En producción: obtener del servicio de API
    };
  }, []);

  return {
    loading,
    error,
    needsRefresh,
    lastUpdate,
    loadData,
    loadClauses,
    loadHistoricalVotes,
    checkUpdateNeeded,
    forceUpdate,
    startAutoUpdate,
    getUpdateInfo,
  };
}
