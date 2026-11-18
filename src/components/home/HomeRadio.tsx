"use client";

import Link from "next/link";
import { ArrowUpRight, Radio } from "lucide-react";
import { useMemo, useState } from "react";
import { PlayButton } from "@/components/player/PlayButton";
import type { Track } from "@/lib/types";

type Station = {
  slug: string;
  name: string;
  arabicName: string;
  category: string;
  country: string;
  description: string;
  track: Track;
};

export function HomeRadio({ stations }: { stations: Station[] }) {
  const [category, setCategory] = useState("Barçasi");
  const [country, setCountry] = useState("Barçasi");
  const categories = useMemo(() => ["Barçasi", ...new Set(stations.map((station) => station.category))], [stations]);
  const countries = useMemo(() => ["Barçasi", ...new Set(stations.map((station) => station.country))], [stations]);
  const visible = stations.filter(
    (station) => (category === "Barçasi" || station.category === category) && (country === "Barçasi" || station.country === country)
  );

  return (
    <div className="panel p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full border border-gold/35 bg-gold/[0.07] text-gold">
            <Radio className="h-5 w-5" />
          </span>
          <div>
            <p className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-red-300">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500 live-dot" /> Jonli efirda
            </p>
            <p className="display text-lg leading-tight text-ink">Qurʼon radiosi</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className="pill py-2 text-[11px]"
              data-active={category === item}
            >
              {item}
            </button>
          ))}
          <Link href="/radio" className="btn btn-gold btn-sm ml-1">
            Radioni oçiş <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      <div className="mt-4 border-t border-line pt-4">
        <div className="mb-3 flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-2">Dunyo böylab Qurʼon radiosi</span>
          {countries.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCountry(item)}
              className={`rounded-md border px-2 py-1 text-[10.5px] transition-colors ${
                country === item
                  ? "border-gold/45 bg-gold/10 text-gold-bright"
                  : "border-line text-muted hover:border-gold/30 hover:text-ink"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {visible.slice(0, 6).map((station) => (
            <div key={station.slug} className="flex items-center gap-2.5 rounded-lg border border-line/60 bg-white/[0.015] p-2.5">
              <PlayButton track={station.track} variant="circle" className="h-9 w-9 flex-none" ariaLabel={`Tinglash: ${station.name}`} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[11.5px] font-medium">{station.name}</p>
                <p className="truncate text-[10px] text-muted-2">{station.country}</p>
              </div>
            </div>
          ))}
        </div>
        {visible.length === 0 && (
          <p className="py-6 text-center text-[12px] text-muted">Bu birikma uçun hozirça stansiya yöq.</p>
        )}
      </div>
    </div>
  );
}
