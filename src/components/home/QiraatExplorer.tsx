"use client";

import Link from "next/link";
import { BookOpen, ChevronRight, Headphones, Radio, Sparkles, Star } from "lucide-react";
import { useState } from "react";
import { ReciterMiniRow } from "@/components/cards/ReciterCards";
import { SurahNumberBadge } from "@/components/cards/SurahCard";
import { PlayButton } from "@/components/player/PlayButton";
import type { ReciterCardData } from "@/lib/content";
import type { QiraatInfo } from "@/lib/content";
import { formatCompact } from "@/lib/format";
import type { Surah, Track } from "@/lib/types";

type StyleItem = { key: string; label: string; description: string; count: number };

export function QiraatExplorer({
  qiraat,
  styles,
  reciters,
  radios,
  surahs,
}: {
  qiraat: QiraatInfo[];
  styles: StyleItem[];
  reciters: { reciter: ReciterCardData; track: Track | null }[];
  radios: { slug: string; name: string; arabicName: string; category: string; country: string; track: Track }[];
  surahs: { surah: Surah; track: Track | null }[];
}) {
  const [tab, setTab] = useState("qiraat");
  const tabs = [
    { key: "qiraat", label: "Köp öqiladigan qiroatlar", icon: BookOpen },
    { key: "styles", label: "Turli tilovatlar", icon: Headphones },
    { key: "reciters", label: "Maşhur qorilar", icon: Star },
    { key: "radio", label: "Qurʼon radiosi", icon: Radio },
    { key: "surahs", label: "Qurʼon suralari", icon: Sparkles },
  ];

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
        {tabs.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setTab(item.key)}
            className="pill pill-green px-4 py-2.5 text-[12px]"
            data-active={tab === item.key}
          >
            <item.icon className="h-3.5 w-3.5" />
            {item.label}
          </button>
        ))}
      </div>

      {tab === "qiraat" && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {qiraat.map((item) => (
            <Link
              key={item.slug}
              href={`/reciters?qiraa=${item.slug}`}
              className={`panel card-hover group relative flex items-start gap-3 p-4 ${
                item.badge ? "border-green-bright/45" : ""
              }`}
            >
              <span className="flex h-11 w-11 flex-none items-center justify-center rounded-lg border border-green/35 bg-green/10 text-green-bright">
                <BookOpen className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[13.5px] font-semibold text-ink transition-colors group-hover:text-gold-bright">
                  {item.name}
                </span>
                <span className="mt-0.5 block text-[10.5px] leading-relaxed text-muted">{item.description}</span>
                <span className="mt-1.5 block text-[9.5px] uppercase tracking-wider text-muted-2">
                  {item.reciterCount} qori
                </span>
              </span>
              {item.badge && (
                <span className="absolute -top-2 left-3 rounded bg-green-bright px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-[#06120e]">
                  {item.badge}
                </span>
              )}
              <ChevronRight className="mt-1 h-4 w-4 flex-none text-muted-2 transition-transform group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      )}

      {tab === "styles" && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {styles.map((style) => (
            <Link
              key={style.key}
              href={`/reciters?style=${style.key}`}
              className="panel card-hover group flex items-center gap-3 p-4"
            >
              <span className="flex h-10 w-10 flex-none items-center justify-center rounded-lg border border-gold/25 bg-gold/[0.07] text-gold">
                <Headphones className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[13px] font-semibold">{style.label}</span>
                <span className="mt-0.5 block text-[10.5px] text-muted">{style.description}</span>
              </span>
              <span className="rounded-full border border-line px-2 py-0.5 text-[9.5px] text-muted-2">
                {style.count}
              </span>
            </Link>
          ))}
        </div>
      )}

      {tab === "reciters" && (
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {reciters.map(({ reciter, track }) => (
            <ReciterMiniRow
              key={reciter.slug}
              reciter={reciter}
              track={track}
              detail={`${reciter.country} · ${formatCompact(reciter.totalListens)} tinglash`}
            />
          ))}
        </div>
      )}

      {tab === "radio" && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {radios.map((station) => (
            <div key={station.slug} className="panel flex items-center gap-3 p-3.5">
              <PlayButton track={station.track} variant="circle" className="h-10 w-10 flex-none" ariaLabel={`Tinglash: ${station.name}`} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12.5px] font-semibold">{station.name}</p>
                <p className="truncate text-[10.5px] text-muted">
                  {station.category} · {station.country}
                </p>
              </div>
              <span className="font-arabic text-base text-gold/75">{station.arabicName}</span>
            </div>
          ))}
        </div>
      )}

      {tab === "surahs" && (
        <div className="grid gap-3 sm:grid-cols-2">
          {surahs.map(({ surah, track }) => (
            <div key={surah.slug} className="panel flex items-center gap-2 p-3">
              <Link href={`/surahs/${surah.slug}`} className="flex min-w-0 flex-1 items-center gap-2.5">
                <SurahNumberBadge number={surah.number} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[12.5px] font-semibold">{surah.name}</span>
                  <span className="block text-[10.5px] text-muted">
                    {surah.englishName} · {surah.verses} oyat
                  </span>
                </span>
                <span className="font-arabic text-lg text-gold/75">{surah.arabicName}</span>
              </Link>
              <PlayButton track={track} variant="bare" className="h-8 w-8" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
