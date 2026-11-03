/**
 * Componente Toast - Notificación no intrusiva
 */

import React from "react";
import { toastManager } from "@/utils/toast";
import { cn } from "@/utils/cn";

export const Toast: React.FC = () => {
  const toasts = toastManager.getToasts();

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "pointer-events-auto px-4 py-3 rounded-lg shadow-lg transform transition-all duration-300 ease-out",
            "max-w-sm w-full",
            "bg-white dark:bg-slate-800",
            "border-l-4",
            toast.type === "success" && "border-green-500",
            toast.type === "error" && "border-red-500",
            toast.type === "warning" && "border-amber-500",
            toast.type === "info" && "border-blue-500"
          )}
        >
          <div className="flex items-start gap-3">
            <span className="text-xl flex-shrink-0">
              {toast.type === "success" && "✓"}
              {toast.type === "error" && "✕"}
              {toast.type === "warning" && "⚠"}
              {toast.type === "info" && "ℹ"}
            </span>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => toastManager.remove(toast.id)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Toast;
