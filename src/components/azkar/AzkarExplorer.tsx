"use client";

import { Check, Copy, RotateCcw, Search } from "lucide-react";
import { useMemo, useState } from "react";
import type { AzkarCategory, AzkarItem } from "@/lib/types";

export function AzkarExplorer({
  categories,
  items,
}: {
  categories: AzkarCategory[];
  items: AzkarItem[];
}) {
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [counts, setCounts] = useState<Record<string, number>>({});

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      if (category !== "all" && item.category !== category) return false;
      if (!q) return true;
      return `${item.title} ${item.transliteration} ${item.translation} ${item.source} ${item.arabic}`
        .toLowerCase()
        .includes(q);
    });
  }, [items, category, query]);

  const copy = async (item: AzkarItem) => {
    try {
      await navigator.clipboard.writeText(`${item.arabic}\n\n${item.transliteration}\n\n${item.translation}\n\n${item.source}`);
      setCopied(item.id);
      window.setTimeout(() => setCopied(null), 1600);
    } catch {
      setCopied(null);
    }
  };

  const bump = (item: AzkarItem) => {
    setCounts((current) => {
      const value = (current[item.id] ?? 0) + 1;
      return { ...current, [item.id]: value > item.count ? 0 : value };
    });
  };

  const reset = (id: string) => setCounts((current) => ({ ...current, [id]: 0 }));

  return (
    <section className="pt-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-wrap gap-1.5">
          <button type="button" onClick={() => setCategory("all")} className="pill text-[11px]" data-active={category === "all"}>
            Barça zikrlar <span className="text-[9px] opacity-65">{items.length}</span>
          </button>
          {categories.map((item) => (
            <button key={item.slug} type="button" onClick={() => setCategory(item.slug)} className="pill text-[11px]" data-active={category === item.slug}>
              {item.name} <span className="text-[9px] opacity-65">{items.filter((entry) => entry.category === item.slug).length}</span>
            </button>
          ))}
        </div>

        <div className="relative w-full lg:w-[280px]">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-2" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Zikrlarni qidiriş…"
            aria-label="Zikrlarni qidiriş"
            className="input py-2.5 pl-9 pr-3 text-[12px]"
          />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-y border-line/60 py-2.5">
        <p className="text-[10.5px] text-muted-2">
          <span className="font-semibold text-ink">{filtered.length}</span> / {items.length} zikr körsatilmoqda
        </p>
        <p className="hidden text-[10px] text-muted-2 sm:block">Öqiyotganda hisoblagiçni bosing — tugagaç u nolga qaytadi.</p>
      </div>

      <div className="mt-5 grid items-start gap-3 lg:grid-cols-2">
        {filtered.map((item) => {
          const categoryInfo = categories.find((entry) => entry.slug === item.category);
          const done = (counts[item.id] ?? 0) >= item.count;
          return (
            <article key={item.id} className="panel relative overflow-hidden p-4 sm:p-5">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="tag tag-gold py-[2px] text-[8.5px]">{categoryInfo?.name ?? item.category}</span>
                    {item.count > 1 && <span className="text-[9px] text-muted-2">× {item.count}</span>}
                  </div>
                  <h3 className="mt-2 text-[13.5px] font-semibold text-ink">{item.title}</h3>
                  <p className="mt-0.5 text-[9.5px] text-muted-2">{item.source}</p>
                </div>
                <button
                  type="button"
                  onClick={() => void copy(item)}
                  className="icon-btn h-8 w-8 flex-none border border-line"
                  aria-label={`Nusxalash: ${item.title}`}
                  title="Nusxalaş"
                >
                  {copied === item.id ? <Check className="h-3.5 w-3.5 text-green-bright" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>

              <p className="mt-4 font-arabic text-[clamp(1.15rem,2vw,1.45rem)] leading-[2.05] text-ink" dir="rtl">
                {item.arabic}
              </p>
              <p className="mt-3 text-[10.5px] italic leading-relaxed text-gold/65">{item.transliteration}</p>
              <p className="mt-2 text-[11.5px] leading-relaxed text-muted">{item.translation}</p>

              <div className="mt-4 flex items-center justify-between gap-3 border-t border-line/60 pt-3">
                <div className="flex items-center gap-2">
                  <span className="text-[9.5px] text-muted-2">
                    {done ? "Tugallandi" : `${counts[item.id] ?? 0} / ${item.count}`}
                  </span>
                  <div className="h-1.5 w-20 overflow-hidden rounded-full bg-white/10">
                    <span
                      className="block h-full rounded-full bg-gold transition-all"
                      style={{ width: `${Math.min(100, ((counts[item.id] ?? 0) / item.count) * 100)}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  {(counts[item.id] ?? 0) > 0 && (
                    <button
                      type="button"
                      onClick={() => reset(item.id)}
                      className="icon-btn h-8 w-8"
                      aria-label={`Nolga qaytarish: ${item.title}`}
                      title="Hisoblagiçni nolga qaytariş"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => bump(item)}
                    className={`btn btn-sm py-2 text-[11px] ${done ? "btn-outline" : "btn-gold"}`}
                    aria-label={`Sanash: ${item.title}`}
                  >
                    {done ? <Check className="h-3.5 w-3.5" /> : null}
                    {done ? "Tugallandi" : "Sanaş uçun bosing"}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="panel mt-5 px-6 py-14 text-center">
          <p className="display text-xl">Bu qidiruvga mos zikr topilmadi</p>
          <p className="mt-2 text-[12.5px] text-muted">Boşqa sözni sinab köring yoki yuqoridan boşqa toifani tanlang.</p>
        </div>
      )}
    </section>
  );
}
