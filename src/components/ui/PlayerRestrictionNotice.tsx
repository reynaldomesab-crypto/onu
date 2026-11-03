/**
 * Componente PlayerRestrictionNotice mejorado
 * Mejoras:
 * - Mejor manejo de responsive
 * - Mejor visualización
 * - Mejor animación
 */

import React from "react";
import { ShieldAlert, CheckCircle } from "lucide-react";

export const PlayerRestrictionNotice: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-xl p-5 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-e10-green/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

      <div className="relative z-10">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-e10-green/10 flex items-center justify-center flex-shrink-0">
            <ShieldAlert className="w-6 h-6 text-e10-green" />
          </div>

          <div className="flex-1">
            <h3 className="text-base font-semibold text-un-white mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-e10-green animate-pulse"></span>
              Rol del jugador: Miembro Electo (E10)
            </h3>

            <div className="space-y-2">
              <p className="text-sm text-slate-300">
                Usted preside el Consejo como miembro electo. <strong className="text-e10-green">
                  No puede seleccionar un miembro permanente (P5)
                </strong> como su país. Los P5 tienen derecho a veto y actúan como contraparte en la negociación.
              </p>

              <div className="flex items-center gap-2 text-sm text-slate-400 bg-slate-900/50 rounded-lg p-3">
                <CheckCircle className="w-4 h-4 text-e10-green flex-shrink-0" />
                <span>Su rol: Negociación y Presidencia</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {["Cooperación", "Negociación", "Presidencia"].map((item) => (
                  <span
                    key={item}
                    className="px-2 py-1 bg-slate-700/50 rounded-md text-xs text-slate-300"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
