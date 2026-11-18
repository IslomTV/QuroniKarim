import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  action,
  align = "left",
  className = "",
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={`mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between ${
        align === "center" ? "text-center sm:flex-col sm:items-center" : ""
      } ${className}`}
    >
      <div className={align === "center" ? "mx-auto" : ""}>
        {eyebrow && <p className="eyebrow mb-2.5">{eyebrow}</p>}
        <h2 className="display text-[clamp(1.7rem,2.6vw,2.35rem)] leading-[1.1] text-ink">{title}</h2>
        {subtitle && <p className="mt-2 max-w-[620px] text-[13.5px] leading-relaxed text-muted">{subtitle}</p>}
      </div>
      {action && <div className="flex flex-none items-center gap-2">{action}</div>}
    </div>
  );
}
