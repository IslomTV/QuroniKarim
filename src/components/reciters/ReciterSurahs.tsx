"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, Download, Heart, ListPlus, Play } from "lucide-react";
import { useMemo, useState } from "react";
import { FavoriteButton } from "@/components/player/FavoriteButton";
import { PlayButton } from "@/components/player/PlayButton";
import { QueueButton } from "@/components/player/QueueButton";
import { SurahNumberBadge } from "@/components/cards/SurahCard";
import { clientBuildTrack, clientRecitationLongLabel } from "@/lib/client-tracks";
import { formatDuration } from "@/lib/format";
import type { Reciter, Surah, Track } from "@/lib/types";

type Mode = "surah" | "juz" | "hizb" | "quarter";

type Entry = {
  surah: Surah;
  track: Track;
  duration: number;
  parts: number;
};

const MODES: { key: Mode; label: string }[] = [
  { key: "surah", label: "Sura böyiça" },
  { key: "juz", label: "Juz böyiça" },
  { key: "hizb", label: "Hizb böyiça" },
  { key: "quarter", label: "Çorak böyiça" },
];

export function ReciterSurahs({
  reciter,
  surahs,
  initialIndex,
}: {
  reciter: Reciter;
  surahs: Surah[];
  initialIndex: number;
}) {
  const [recitationIndex, setRecitationIndex] = useState(initialIndex);
  const [mode, setMode] = useState<Mode>("surah");
  const [page, setPage] = useState(0);

  const entries = useMemo<Entry[]>(() => {
    const rec = reciter.recitations[recitationIndex];
    if (!rec) return [];
    return surahs
      .map((surah) => {
        const raw = rec.audio[String(surah.number)];
        if (!raw?.length) return null;
        const track = clientBuildTrack(reciter, recitationIndex, surah.number, surahs);
        if (!track) return null;
        return {
          surah,
          track,
          duration: raw.reduce((sum, part) => sum + (part[1] || 0), 0),
          parts: raw.length,
        };
      })
      .filter((entry): entry is Entry => Boolean(entry));
  }, [reciter, recitationIndex, surahs]);

  const queue = useMemo(() => entries.map((entry) => entry.track), [entries]);
  const pageSize = mode === "surah" ? 18 : 3;

  const grouped = useMemo(() => {
    if (mode === "surah") return [];
    const map = new Map<number, Entry[]>();
    for (const entry of entries) {
      const key = entry.surah[mode];
      const list = map.get(key) ?? [];
      list.push(entry);
      map.set(key, list);
    }
    return [...map.entries()].sort((a, b) => a[0] - b[0]);
  }, [entries, mode]);

  const totalPages = mode === "surah" ? Math.ceil(entries.length / 18) : Math.ceil(grouped.length / 3);
  const safePage = Math.min(page, Math.max(0, totalPages - 1));
  const pageEntries = mode === "surah" ? entries.slice(safePage * 18, safePage * 18 + 18) : [];
  const pageGroups = mode === "surah" ? [] : grouped.slice(safePage * 3, safePage * 3 + 3);

  const changeRecitation = (index: number) => {
    setRecitationIndex(index);
    setPage(0);
  };

  const changeMode = (next: Mode) => {
    setMode(next);
    setPage(0);
  };

  const rec = reciter.recitations[recitationIndex];

  return (
    <section id="recitations" className="pt-10">
      <div className="mb-5">
        <p className="eyebrow">Tilovatlar · Qiroat</p>
        <h2 className="display mt-2 text-[clamp(1.7rem,2.6vw,2.4rem)]">
          Barça {entries.length} surani körib çiqing
        </h2>
        <p className="mt-2 max-w-[760px] text-[12.5px] leading-relaxed text-muted">
          Rivoyat va surani tanlang. Juz, hizb yoki çorak böyiça köriş uçun yorliqlardan foydalaning — barçasi
          tanlangan tilovat ostida guruhlangan holda qoladi.
        </p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {reciter.recitations.map((recitation, index) => (
          <button
            key={`${recitation.slug}-${index}`}
            type="button"
            onClick={() => changeRecitation(index)}
            className="pill text-[11px]"
            data-active={index === recitationIndex}
            title={clientRecitationLongLabel(recitation)}
          >
            {clientRecitationLongLabel(recitation)}
            {recitation.completed && <span className="ml-1 text-[8px] opacity-70">●</span>}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        {MODES.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => changeMode(item.key)}
            className="pill text-[11.5px]"
            data-active={mode === item.key}
          >
            {item.label}
          </button>
        ))}
        {rec && (
          <span className="ml-auto hidden items-center gap-1.5 text-[10.5px] text-muted-2 sm:flex">
            <HeadphonesIcon /> {rec.completed ? "Töliq muşaf · " : ""}{entries.length} sura mavjud
          </span>
        )}
      </div>

      {entries.length === 0 ? (
        <div className="panel mt-5 px-6 py-12 text-center">
          <p className="display text-xl">Bu tilovat kataloglaştirilmoqda</p>
          <p className="mt-2 text-[12.5px] text-muted">Yuqoridan boşqa rivoyatni tanlang yoki boşqa qorini köring.</p>
        </div>
      ) : (
        <>
          {mode === "surah" && (
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {pageEntries.map((entry) => (
                <SurahRow key={entry.surah.number} entry={entry} queue={queue} />
              ))}
            </div>
          )}

          {mode !== "surah" && (
            <div className="mt-5 space-y-5">
              {pageGroups.map(([number, groupEntries]) => (
                <div key={number}>
                  <div className="mb-2 flex items-center gap-2">
                    <h3 className="display text-lg text-gold-bright">
                      {number}-{mode === "juz" ? "juz" : mode === "hizb" ? "hizb" : "chorak"}
                    </h3>
                    <span className="h-px flex-1 bg-line" />
                    <span className="text-[10px] text-muted-2">{groupEntries.length} sura</span>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {groupEntries.map((entry) => (
                      <SurahRow key={entry.surah.number} entry={entry} queue={queue} compact />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-5 flex flex-col items-center justify-between gap-3 sm:flex-row">
            <p className="text-[10.5px] text-muted-2">
              {mode === "surah" ? (
                <>{safePage * 18 + 1}–{Math.min(entries.length, safePage * 18 + 18)} / {entries.length} körsatilmoqda</>
              ) : (
                <>{Math.min(grouped.length, safePage * 3 + 1)}–{Math.min(grouped.length, safePage * 3 + 3)} / {grouped.length} guruh körsatilmoqda</>
              )}
            </p>
            <Pagination page={safePage} total={totalPages} onChange={setPage} />
          </div>
        </>
      )}
    </section>
  );
}

function HeadphonesIcon() {
  return <Play className="h-2.5 w-2.5 text-gold" />;
}

function SurahRow({ entry, queue, compact = false }: { entry: Entry; queue: Track[]; compact?: boolean }) {
  return (
    <div className="panel-soft group flex items-center gap-2 p-2.5 transition-colors hover:border-gold/35">
      <SurahNumberBadge number={entry.surah.number} size={compact ? "sm" : "md"} />
      <Link href={`/surahs/${entry.surah.slug}`} className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className={`truncate font-medium text-ink transition-colors group-hover:text-gold-bright ${compact ? "text-[11.5px]" : "text-[12.5px]"}`}>
            {entry.surah.name}
          </span>
          <span className={`flex-none rounded px-1 py-0.5 text-[7.5px] font-bold uppercase tracking-wider ${entry.surah.revelationPlace === "makkah" ? "bg-gold/10 text-gold" : "bg-green-bright/10 text-green-bright"}`}>
            {entry.surah.revelationPlace === "makkah" ? "Makkiy" : "Madaniy"}
          </span>
        </div>
        <p className="mt-0.5 truncate text-[9.5px] text-muted">
          {entry.surah.englishName} · {entry.surah.verses} oyat · {entry.surah.juz}-juz
          {entry.parts > 1 ? ` · ${entry.parts} qism` : ""}
          {entry.duration > 0 ? ` · ${formatDuration(entry.duration)}` : ""}
        </p>
      </Link>
      <span className="hidden font-arabic text-[15px] text-gold/75 md:block" dir="rtl">
        {entry.surah.arabicName}
      </span>
      <div className="flex flex-none items-center gap-0.5">
        <PlayButton track={entry.track} queue={queue} variant="bare" className="h-8 w-8" />
        <a
          href={entry.track.downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="icon-btn hidden h-8 w-8 sm:inline-flex"
          aria-label={`Yuklab olish: ${entry.surah.name}`}
          title="Yuklab oliş"
        >
          <Download className="h-[15px] w-[15px]" />
        </a>
        <span className="hidden sm:block">
          <FavoriteButton id={entry.track.id} className="h-8 w-8" />
        </span>
        <span className="hidden lg:block">
          <QueueButton track={entry.track} className="h-8 w-8" />
        </span>
      </div>
    </div>
  );
}

function Pagination({ page, total, onChange }: { page: number; total: number; onChange: (page: number) => void }) {
  if (total <= 1) return null;
  const pages = Array.from({ length: total }, (_, index) => index);
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => onChange(Math.max(0, page - 1))}
        disabled={page === 0}
        className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-muted transition-colors hover:text-ink disabled:opacity-30"
        aria-label="Oldingi sahifa"
      >
        <ChevronLeft className="h-3.5 w-3.5" />
      </button>
      {pages.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onChange(item)}
          className={`flex h-8 min-w-8 items-center justify-center rounded-full border px-1 text-[11px] transition-colors ${
            item === page ? "border-gold bg-gold text-[#15170f] font-bold" : "border-line text-muted hover:text-ink"
          }`}
          aria-label={`${item + 1}-sahifa`}
          aria-current={item === page ? "page" : undefined}
        >
          {item + 1}
        </button>
      ))}
      <button
        type="button"
        onClick={() => onChange(Math.min(total - 1, page + 1))}
        disabled={page === total - 1}
        className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-muted transition-colors hover:text-ink disabled:opacity-30"
        aria-label="Keyingi sahifa"
      >
        <ChevronRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
