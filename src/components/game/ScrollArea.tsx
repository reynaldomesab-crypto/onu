/**
 * Componente ScrollArea mejorado
 * Mejoras:
 * - Mejor manejo de responsive
 * - Mejor scrollbar
 * - Mejor animación
 */

import React, { useEffect, useRef } from "react";
import { cn } from "@/utils/cn";

interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  maxHeight?: string;
  showScrollbar?: boolean;
}

export const ScrollArea: React.FC<ScrollAreaProps> = ({
  className,
  children,
  maxHeight = "100%",
  showScrollbar = true,
  ...props
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        // Scroll ended
      }, 150);
    };

    container.addEventListener('scroll', handleScroll);
    return () => {
      container.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "overflow-y-auto overflow-x-hidden",
        "scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800",
        showScrollbar && "scrollbar-thin",
        !showScrollbar && "scrollbar-hide",
        maxHeight !== "100%" && `max-h-[${maxHeight}]`,
        "transition-all duration-200",
        className
      )}
      {...props}
    >
      <div className="min-h-full">
        {children}
      </div>
    </div>
  );
};

export const ScrollAreaContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="py-4">{children}</div>;
};

export const ScrollAreaHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="pb-4 border-b border-slate-700/50">{children}</div>;
};

export const ScrollAreaFooter: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="pt-4 border-t border-slate-700/50">{children}</div>;
};
