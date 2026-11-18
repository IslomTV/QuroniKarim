import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Navigatsiya yöli" className="flex flex-wrap items-center gap-1.5 text-[12px] text-muted-2">
      <Link href="/" className="inline-flex items-center gap-1.5 transition-colors hover:text-gold">
        <Home className="h-3.5 w-3.5" />
        <span className="sr-only">Boş sahifa</span>
      </Link>
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`} className="flex items-center gap-1.5">
          <ChevronRight className="h-3 w-3 text-muted-2/60" />
          {item.href ? (
            <Link href={item.href} className="transition-colors hover:text-gold">
              {item.label}
            </Link>
          ) : (
            <span className="text-muted">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
