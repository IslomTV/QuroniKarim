"use client";

import { Radio, Signal } from "lucide-react";
import { useMemo, useState } from "react";
import { PlayButton } from "@/components/player/PlayButton";
import { Equalizer } from "@/components/ui/Equalizer";
import { ReciterPhoto } from "@/components/ui/ReciterPhoto";
import type { RadioStation, Track } from "@/lib/types";

export type RadioItem = {
  station: RadioStation;
  track: Track;
};

export function RadioStations({ items }: { items: RadioItem[] }) {
  const [category, setCategory] = useState("all");
  const categories = useMemo(
    () => [...new Set(items.map((item) => item.station.category))],
    [items]
  );
  const queue = useMemo(() => items.map((item) => item.track), [items]);

  const filtered = category === "all" ? items : items.filter((item) => item.station.category === category);

  return (
    <section className="pt-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Jonli stansiyalar</p>
          <h2 className="display mt-2 text-[clamp(1.7rem,2.6vw,2.35rem)]">Doim yoniq, doim tilovatda</h2>
          <p className="mt-1.5 text-[12.5px] text-muted">
            Ön ikkita uzluksiz oqim — navbat yöq, yuklab oliş yöq. Tinglaşni bosing va stansiya davom etsin.
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button type="button" onClick={() => setCategory("all")} className="pill text-[11px]" data-active={category === "all"}>
            Barça stansiyalar <span className="text-[9px] opacity-65">{items.length}</span>
          </button>
          {categories.map((item) => (
            <button key={item} type="button" onClick={() => setCategory(item)} className="pill text-[11px]" data-active={category === item}>
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map(({ station, track }) => (
          <article key={station.slug} className="panel group relative overflow-hidden p-4">
            <div
              className="absolute inset-x-0 top-0 h-px"
              style={{ background: `linear-gradient(90deg, transparent, ${station.accent}88, transparent)` }}
            />
            <div className="flex items-start gap-3">
              {station.image ? (
                <ReciterPhoto
                  src={station.image}
                  alt={station.name}
                  className="h-14 w-14 flex-none border border-line"
                  sizes="56px"
                />
              ) : (
                <span
                  className="flex h-14 w-14 flex-none items-center justify-center rounded-full border border-line"
                  style={{ background: `radial-gradient(circle at 50% 20%, ${station.accent}33, transparent 70%)` }}
                >
                  <Radio className="h-5 w-5" style={{ color: station.accent }} />
                </span>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded bg-[#e5484d]/15 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.14em] text-[#ff8a8e]">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#ff6b70]" /> JONLI
                  </span>
                  <span className="text-[9px] uppercase tracking-[0.14em] text-muted-2">{station.category}</span>
                </div>
                <h3 className="mt-1.5 truncate text-[14px] font-semibold text-ink transition-colors group-hover:text-gold-bright">
                  {station.name}
                </h3>
                <p className="truncate font-arabic text-[12.5px] text-muted-2" dir="rtl">{station.arabicName}</p>
              </div>
              <Equalizer className="mt-1 text-green-bright opacity-70" />
            </div>

            <p className="mt-3 line-clamp-2 min-h-[34px] text-[11.5px] leading-relaxed text-muted">{station.description}</p>

            <div className="mt-3 flex items-center justify-between gap-2 border-t border-line/70 pt-3">
              <span className="inline-flex items-center gap-1.5 text-[9.5px] text-muted-2">
                <Signal className="h-3 w-3" /> {station.country} · 24/7
              </span>
              <PlayButton
                track={track}
                queue={queue}
                label="Jonli tinglaş"
                size="sm"
                className="btn-outline py-2 text-[11.5px]"
                ariaLabel={`Jonli tinglash: ${station.name}`}
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
