/**
 * Pantalla de inicio mejorada con datos en vivo de la ONU
 * Mejoras:
 * - Carga de datos reales de la ONU
 * - Actualización automática
 * - Mejor manejo de estado
 * - Notificaciones Toast
 */

import React, { useState, useEffect } from "react";
import { useGameStore } from "@/store/useGameStore";
import { E10_COUNTRIES, P5_COUNTRIES } from "@/types/countries";
import { Button } from "@/components/ui/Button";
import { CountryBadge } from "@/components/ui/CountryBadge";
import { Card } from "@/components/ui/Card";
import { showToast } from "@/utils/toast";
import { cn } from "@/utils/cn";
import { Globe, ShieldAlert, Users, RefreshCw, Database } from "lucide-react";
import { useUnDataService } from "@/hooks/useUnDataService";

export const Home: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const { initGame, isInitialized, playerCountry, error, setError } =
    useGameStore();
  const { loading: unLoading, loadData, needsRefresh, forceUpdate } =
    useUnDataService();

  useEffect(() => {
    // Cargar datos de la ONU al montar el componente
    loadData();
  }, [loadData]);

  const handleSelectCountry = (code: string) => {
    setSelectedCountry(code);
    setError(null);
  };

  const handleStartGame = () => {
    if (!selectedCountry) {
      showToast(
        "Seleccione un país miembro electo (E10) para comenzar.",
        "warning"
      );
      return;
    }
    initGame(selectedCountry);
  };

  const handleBackToHome = () => {
    setSelectedCountry(null);
    setError(null);
  };

  const handleRefreshData = async () => {
    await forceUpdate();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700/50 backdrop-blur-sm sticky top-0 z-40 bg-slate-900/80">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-un-blue/20 flex items-center justify-center">
                <Globe className="w-6 h-6 text-un-blue" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-un-white">
                  ¿Puedes cambiar el mundo?
                </h1>
                <p className="text-xs text-slate-400">
                  Consejo de Seguridad de la ONU - Datos en vivo
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefreshData}
                disabled={unLoading}
                className="flex items-center gap-2"
              >
                <RefreshCw className={cn("w-4 h-4", unLoading && "animate-spin")} />
                {needsRefresh ? "Actualizar" : "Actualizado"}
              </Button>
              {isInitialized && playerCountry && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-400">Tu país:</span>
                  <CountryBadge country={playerCountry} size="sm" />
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {!isInitialized ? (
          <div className="space-y-8 fade-in">
            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-6 border-l-4 border-l-e10-green">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-e10-green/10 flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-e10-green" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-un-white mb-1">
                      Miembro Electo
                    </h3>
                    <p className="text-sm text-slate-400">
                      Usted preside el Consejo como miembro electo (E10).
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-l-4 border-l-p5-red">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-p5-red/10 flex items-center justify-center flex-shrink-0">
                    <ShieldAlert className="w-5 h-5 text-p5-red" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-un-white mb-1">
                      Sin Veto
                    </h3>
                    <p className="text-sm text-slate-400">
                      Los E10 no tienen derecho a veto. Deben negociar con los P5.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-l-4 border-l-blue-500">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <Database className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-un-white mb-1">
                      Datos en Vivo
                    </h3>
                    <p className="text-sm text-slate-400">
                      Datos de paz y seguridad de la ONU.
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Selección de País */}
            <Card className="p-8 bg-slate-800/50">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-un-white">
                  Seleccione su país
                </h2>
                {needsRefresh && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={forceUpdate}
                    disabled={unLoading}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className={cn("w-4 h-4", unLoading && "animate-spin")} />
                    Actualizar datos
                  </Button>
                )}
              </div>
              <p className="text-slate-400 mb-6">
                Debe elegir un miembro electo (E10). Los P5 tienen veto y no son seleccionables.
              </p>

              <div className="space-y-6">
                {/* Paises E10 */}
                <div>
                  <h3 className="text-sm font-semibold text-e10-green mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-e10-green"></span>
                    Miembros Electos (E10)
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {E10_COUNTRIES.map((country) => (
                      <Button
                        key={country.code}
                        variant={selectedCountry === country.code ? "primary" : "outline"}
                        size="lg"
                        onClick={() => handleSelectCountry(country.code)}
                        className={cn(
                          "h-auto py-3 px-4 text-left",
                          selectedCountry === country.code
                            ? "bg-un-blue text-white"
                            : "bg-slate-900 hover:bg-slate-800 border-slate-600 text-slate-300"
                        )}
                      >
                        <CountryBadge country={country} size="md" className="mb-2 block" />
                        <span className="block text-sm font-medium">
                          {country.nameEs}
                        </span>
                        <span className="block text-xs text-slate-500">
                          {country.region}
                        </span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Paises P5 - Solo informativo */}
                <div>
                  <h3 className="text-sm font-semibold text-p5-red mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-p5-red"></span>
                    Miembros Permanentes (P5) - No seleccionables
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {P5_COUNTRIES.map((country) => (
                      <CountryBadge key={country.code} country={country} size="sm" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Los P5 tienen derecho a veto y actúan como contrapartes en la negociación.
                  </p>
                </div>
              </div>

              {error && (
                <div className="mt-4 p-4 rounded-lg bg-p5-red/10 border border-p5-red/30">
                  <p className="text-sm text-p5-red">{error}</p>
                </div>
              )}

              <div className="mt-8 flex gap-3">
                <Button
                  variant="ghost"
                  onClick={handleBackToHome}
                  className="flex-1"
                >
                  Volver
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleStartGame}
                  disabled={!selectedCountry}
                  className="flex-1"
                >
                  Comenzar Juego
                </Button>
              </div>
            </Card>
          </div>
        ) : (
          <div className="fade-in">
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-un-blue/20 mb-4">
                <Globe className="w-10 h-10 text-un-blue" />
              </div>
              <h2 className="text-2xl font-bold text-un-white mb-2">
                Bienvenido al Consejo
              </h2>
              <p className="text-slate-400 mb-6">
                {playerCountry?.nameEs} - Día {useGameStore.getState().currentDay}
              </p>
              <p className="text-slate-500 mb-6 max-w-md mx-auto">
                El juego está listo. Será redirigido al Briefing del día actual.
              </p>
              <Button variant="primary" size="lg" onClick={() => {}}>
                Continuar al Juego
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500">
              ¿Puedes cambiar el mundo? © 2026 - Datos de la ONU
            </p>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <span>React 18</span>
              <span>•</span>
              <span>TypeScript</span>
              <span>•</span>
              <span>UNDATA API</span>
              <span>•</span>
              <span>ONNX Runtime</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
