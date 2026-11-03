/**
 * Sistema de notificaciones Toast
 * Notificaciones no intrusivas que aparecen en la parte superior de la pantalla
 */

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

type ToastListener = (toast: Toast) => void;

class ToastManager {
  private listeners: Set<ToastListener> = new Set();
  private toasts: Toast[] = [];
  private defaultDuration = 4000;

  subscribe(listener: ToastListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((listener) => listener(this.toasts[0] || null));
  }

  show(message: string, type: ToastType = "info", duration?: number): string {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const toast: Toast = {
      id,
      type,
      message,
      duration: duration ?? this.defaultDuration,
    };

    this.toasts.push(toast);
    this.notify();

    // Auto-remover después de la duración
    setTimeout(() => {
      this.remove(id);
    }, toast.duration);

    return id;
  }

  remove(id: string): void {
    this.toasts = this.toasts.filter((t) => t.id !== id);
    this.notify();
  }

  clear(): void {
    this.toasts = [];
    this.notify();
  }

  getToasts(): Toast[] {
    return this.toasts;
  }
}

export const toastManager = new ToastManager();

// Exportar también una función helper para notificaciones
export function showToast(
  message: string,
  type: ToastType = "info",
  duration?: number
): string {
  return toastManager.show(message, type, duration);
}
