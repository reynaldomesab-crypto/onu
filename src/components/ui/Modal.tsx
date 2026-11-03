/**
 * Componente Modal mejorado
 * Mejoras:
 * - Mejor manejo de responsive
 * - Mejor animación
 * - Mejor UX
 */

import React, { useEffect, useRef } from "react";
import { cn } from "@/utils/cn";
import { X } from "lucide-react";

interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  centered?: boolean;
  showCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
}

const modalSizes = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  full: "max-w-6xl",
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  size = "md",
  centered = true,
  showCloseButton = true,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  children,
  className,
  ...props
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && closeOnEscape) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, closeOnEscape, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={closeOnBackdropClick ? onClose : undefined}
      />

      {/* Modal Content */}
      <div
        ref={modalRef}
        className={cn(
          "relative bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl",
          "max-h-[90vh] overflow-y-auto",
          modalSizes[size],
          centered && "flex items-center justify-center",
          "animate-in fade-in zoom-in duration-200",
          className
        )}
        {...props}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
            <h2 className="text-xl font-semibold text-un-white">{title}</h2>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export const ModalHeader: React.FC<{ title: string; onClose: () => void; showCloseButton?: boolean }> = ({
  title,
  onClose,
  showCloseButton = true
}) => {
  return (
    <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
      <h2 className="text-xl font-semibold text-un-white">{title}</h2>
      {showCloseButton && (
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4 text-slate-400" />
        </button>
      )}
    </div>
  );
};

export const ModalBody: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="p-6">{children}</div>;
};

export const ModalFooter: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="p-6 border-t border-slate-700/50">{children}</div>;
};
