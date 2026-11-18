"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useRef, type ReactNode } from "react";

export function ScrollRail({
  eyebrow,
  title,
  subtitle,
  action,
  children,
  className = "",
  railClassName = "",
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  railClassName?: string;
}) {
  const railRef = useRef<HTMLDivElement>(null);

  const scroll = useCallback((direction: -1 | 1) => {
    const node = railRef.current;
    if (!node) return;
    node.scrollBy({ left: direction * Math.max(280, node.clientWidth * 0.72), behavior: "smooth" });
  }, []);

  return (
    <section className={className}>
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          {eyebrow && <p className="eyebrow mb-2.5">{eyebrow}</p>}
          <h2 className="display text-[clamp(1.6rem,2.4vw,2.15rem)] leading-[1.1]">{title}</h2>
          {subtitle && <p className="mt-1.5 text-[13px] text-muted">{subtitle}</p>}
        </div>
        <div className="flex flex-none items-center gap-2">
          {action}
          <div className="hidden items-center gap-1.5 sm:flex">
            <button
              type="button"
              onClick={() => scroll(-1)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-gold/45 hover:text-gold"
              aria-label="Çapga suriş"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scroll(1)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-gold/45 hover:text-gold"
              aria-label="Öngga suriş"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      <div ref={railRef} className={`rail ${railClassName}`}>
        {children}
      </div>
    </section>
  );
}
