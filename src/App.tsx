/**
 * Componente raíz de la aplicación
 * Mejorado como SPA moderna con:
 * - Sistema de notificaciones Toast
 * - Transiciones suaves entre fases
 * - Mejor manejo de responsive
 */

import React, { Suspense, lazy } from "react";
import { Toast } from "@/components/ui/Toast";
import { useGameStore } from "@/store/useGameStore";

// Lazy loading para mejor performance
const Home = lazy(() => import("@/pages/Home").then((module) => ({ default: module.Home })));
const Game = lazy(() => import("@/components/game/Game").then((module) => ({ default: module.Game })));

export const App: React.FC = () => {
  const { isInitialized } = useGameStore();

  return (
    <div className="min-h-screen bg-un-dark text-un-white font-sans">
      {/* Sistema de notificaciones */}
      <Toast />

      {/* Contenido principal */}
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-un-blue"></div>
          </div>
        }
      >
        {!isInitialized ? <Home /> : <Game />}
      </Suspense>

      {/* Estilos globales */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          padding: 0;
        }

        /* Scrollbar personalizado */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #1e293b;
        }

        ::-webkit-scrollbar-thumb {
          background: #475569;
          border-radius: 9999px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }

        /* Transiciones suaves */
        .fade-in {
          animation: fadeIn 0.3s ease-in-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .slide-in {
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        /* Efecto glass */
        .glass {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(4px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        /* Efecto pulse suave */
        .pulse-slow {
          animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
      `}</style>
    </div>
  );
};

export default App;
