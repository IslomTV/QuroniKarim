"use client";

import Link from "next/link";
import { CheckCircle2, ChevronLeft, ChevronRight, Flame, Headphones } from "lucide-react";
import { useMemo, useState } from "react";
import { PlayButton } from "@/components/player/PlayButton";
import { ReciterPhoto } from "@/components/ui/ReciterPhoto";
import type { SurahRecitationOption } from "@/lib/content";
import { formatCompact, formatDuration } from "@/lib/format";
import type { Track } from "@/lib/types";

const PAGE_SIZE = 20;
const QIRAA_ORDER = [
  "hafs-an-asim",
  "warsh-an-nafi",
  "qalun-an-nafi",
  "shubah-an-asim",
  "ad-duri-an-abu-amr",
  "as-susi-an-abu-amr",
];

export function SurahReciters({
  options,
  surahName,
  surahArabic,
}: {
  options: SurahRecitationOption[];
  surahName: string;
  surahArabic: string;
}) {
  const [qiraa, setQiraa] = useState("all");
  const [page, setPage] = useState(0);

  const queue = useMemo(() => options.map((option) => option.track), [options]);

  const qiraaCounts = useMemo(() => {
    const map = new Map<string, { label: string; count: number }>();
    for (const option of options) {
      const item = map.get(option.qiraaSlug) ?? { label: option.qiraa, count: 0 };
      item.count += 1;
      map.set(option.qiraaSlug, item);
    }
    return [...map.entries()].sort((a, b) => {
      const ai = QIRAA_ORDER.indexOf(a[0]);
      const bi = QIRAA_ORDER.indexOf(b[0]);
      return (ai < 0 ? 99 : ai) - (bi < 0 ? 99 : bi) || b[1].count - a[1].count;
    });
  }, [options]);

  const filtered = useMemo(() => {
    const list = qiraa === "all" ? options : options.filter((option) => option.qiraaSlug === qiraa);
    return [...list].sort((a, b) => {
      const ai = QIRAA_ORDER.indexOf(a.qiraaSlug);
      const bi = QIRAA_ORDER.indexOf(b.qiraaSlug);
      const groupDiff = (ai < 0 ? 99 : ai) - (bi < 0 ? 99 : bi);
      if (groupDiff !== 0) return groupDiff;
      return b.reciter.totalListens - a.reciter.totalListens;
    });
  }, [options, qiraa]);

  const topReciters = useMemo(() => {
    const seen = new Set<string>();
    const list: SurahRecitationOption[] = [];
    for (const option of [...options].sort((a, b) => b.reciter.totalListens - a.reciter.totalListens)) {
      if (seen.has(option.reciter.slug)) continue;
      seen.add(option.reciter.slug);
      list.push(option);
      if (list.length === 10) break;
    }
    return list;
  }, [options]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const safePage = Math.min(page, Math.max(0, totalPages - 1));
  const pageItems = filtered.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE);

  const groups: { slug: string; label: string; items: SurahRecitationOption[] }[] = [];
  for (const option of pageItems) {
    const group = groups.find((item) => item.slug === option.qiraaSlug);
    if (group) group.items.push(option);
    else groups.push({ slug: option.qiraaSlug, label: option.qiraa, items: [option] });
  }

  const changeQiraa = (value: string) => {
    setQiraa(value);
    setPage(0);
  };

  return (
    <section id="reciters" className="pt-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Qorilar</p>
          <h2 className="display mt-2 text-[clamp(1.7rem,2.6vw,2.35rem)]">
            {surahName} tilovatlari
          </h2>
          <p className="mt-1.5 font-arabic text-[15px] text-gold/75" dir="rtl">{surahArabic}</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="relative">
            <span className="sr-only">Tilovat böyiça filtrlaş</span>
            <select
              value={qiraa}
              onChange={(event) => changeQiraa(event.target.value)}
              className="min-w-[240px] appearance-none rounded-full border border-line bg-panel px-4 py-2.5 pr-9 text-[12px] text-ink outline-none transition-colors hover:border-gold/40"
            >
              <option value="all">Barça tilovatlar ({options.length})</option>
              {qiraaCounts.map(([slug, item]) => (
                <option key={slug} value={slug}>
                  {item.label} ({item.count})
                </option>
              ))}
            </select>
            <ChevronRight className="pointer-events-none absolute right-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 rotate-90 text-muted-2" />
          </label>
          <span className="hidden rounded-full border border-gold/25 bg-gold/[0.07] px-3 py-2 text-[10.5px] font-medium text-gold sm:inline">
            {filtered.length} qori
          </span>
        </div>
      </div>

      <div className="panel relative mt-5 overflow-hidden p-4 sm:p-5">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
        <div className="mb-4 flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold/10 text-gold">
            <Flame className="h-3.5 w-3.5" />
          </span>
          <h3 className="text-[13px] font-semibold text-ink">Eng köp tinglangan</h3>
          <span className="text-[10px] text-muted-2">tinglovçilar birinçi murojaat qiladigan ovozlar</span>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {topReciters.map((option) => (
            <div
              key={option.reciter.slug}
              className="group relative flex flex-col items-center rounded-lg border border-line/60 bg-white/[0.02] px-3 py-3.5 text-center transition-colors hover:border-gold/35"
            >
              <Link href={`/reciters/${option.reciter.slug}`} className="relative">
                <ReciterPhoto
                  src={option.reciter.photo}
                  alt={option.reciter.name}
                  className="h-16 w-16 border border-gold/25 sm:h-[72px] sm:w-[72px]"
                  sizes="72px"
                />
                <span className="absolute -bottom-1 -right-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <PlayButton track={option.track} queue={queue} variant="circle" className="h-7 w-7" ariaLabel={`Tinglash: ${surahName} — ${option.reciter.name}`} />
                </span>
              </Link>
              <Link href={`/reciters/${option.reciter.slug}`} className="mt-2 line-clamp-2 min-h-[30px] text-[11px] font-medium leading-snug text-ink transition-colors group-hover:text-gold-bright">
                {option.reciter.name}
              </Link>
              <span className="mt-1 inline-flex items-center gap-1 text-[9px] text-muted-2">
                <Headphones className="h-2.5 w-2.5" /> {formatCompact(option.reciter.totalListens)} tinglaş
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        <button type="button" onClick={() => changeQiraa("all")} className="pill text-[11px]" data-active={qiraa === "all"}>
          Barça rivoyatlar
        </button>
        {qiraaCounts.map(([slug, item]) => (
          <button key={slug} type="button" onClick={() => changeQiraa(slug)} className="pill text-[11px]" data-active={qiraa === slug}>
            {item.label} <span className="text-[9px] opacity-65">{item.count}</span>
          </button>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 rounded-lg border border-line/60 bg-panel/40 px-3.5 py-2.5">
        <p className="text-[10.5px] text-muted-2">
          {filtered.length === 0 ? 0 : safePage * PAGE_SIZE + 1}–{Math.min(filtered.length, safePage * PAGE_SIZE + PAGE_SIZE)} / {filtered.length} qori körsatilmoqda
        </p>
        <Pagination page={safePage} total={totalPages} onChange={setPage} compact />
      </div>

      {filtered.length === 0 ? (
        <div className="panel mt-4 px-6 py-14 text-center">
          <p className="display text-xl">Bu rivoyatda hozirça tilovat yöq</p>
          <p className="mt-2 text-[12.5px] text-muted">Bu surani eşitiş uçun yuqoridan boşqa rivoyatni tanlang.</p>
        </div>
      ) : (
        <div className="mt-5 space-y-5">
          {groups.map((group) => (
            <div key={group.slug}>
              <div className="mb-2 flex items-center gap-2">
                <h3 className="text-[12.5px] font-semibold text-gold-bright">{group.label}</h3>
                <span className="rounded border border-line bg-white/[0.03] px-1.5 py-0.5 text-[8.5px] font-semibold uppercase tracking-wider text-muted-2">
                  {group.items.length} qori
                </span>
                <span className="h-px flex-1 bg-line" />
              </div>
              <div className="grid gap-2 lg:grid-cols-2">
                {group.items.map((option) => (
                  <RecitationRow
                    key={`${option.reciter.slug}-${option.recitationIndex}`}
                    option={option}
                    queue={queue}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-5 flex justify-center">
        <Pagination page={safePage} total={totalPages} onChange={setPage} />
      </div>
    </section>
  );
}

function RecitationRow({ option, queue }: { option: SurahRecitationOption; queue: Track[] }) {
  return (
    <div className="panel-soft group flex items-center gap-2.5 p-2.5 transition-colors hover:border-gold/35">
      <PlayButton track={option.track} queue={queue} variant="bare" className="h-9 w-9 flex-none" ariaLabel={`Tinglash: ${option.track.title} — ${option.reciter.name}`} />
      <Link href={`/reciters/${option.reciter.slug}`} className="flex-none">
        <ReciterPhoto
          src={option.reciter.photo}
          alt={option.reciter.name}
          className="h-10 w-10 border border-line"
          sizes="40px"
        />
      </Link>
      <Link href={`/reciters/${option.reciter.slug}`} className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p className="truncate text-[12px] font-medium text-ink transition-colors group-hover:text-gold-bright">
            {option.reciter.name}
          </p>
          {option.reciter.hasCompleteQuran && <CheckCircle2 className="h-3 w-3 flex-none text-green-bright" />}
        </div>
        <div className="mt-0.5 flex flex-wrap items-center gap-1">
          {option.styleLabel && <span className="tag py-[2px] text-[8.5px]">{option.styleLabel}</span>}
          <span className="text-[9px] text-muted-2">{option.qiraa}</span>
          {option.duration > 0 && (
            <>
              <span className="text-[8px] text-muted-2/60">·</span>
              <span className="text-[9px] text-muted-2">{formatDuration(option.duration)}</span>
            </>
          )}
          {option.track.parts.length > 1 && (
            <>
              <span className="text-[8px] text-muted-2/60">·</span>
              <span className="text-[9px] text-gold/75">{option.track.parts.length} qism</span>
            </>
          )}
        </div>
      </Link>
      <span className="flex-none text-[9.5px] text-muted-2">{formatCompact(option.reciter.totalListens)}</span>
    </div>
  );
}

function Pagination({
  page,
  total,
  onChange,
  compact = false,
}: {
  page: number;
  total: number;
  onChange: (page: number) => void;
  compact?: boolean;
}) {
  if (total <= 1) return null;
  const windowSize = 9;
  const start = Math.max(0, Math.min(page - Math.floor(windowSize / 2), total - windowSize));
  const pages = compact
    ? []
    : Array.from({ length: Math.min(total, windowSize) }, (_, index) => start + index);
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => onChange(Math.max(0, page - 1))}
        disabled={page === 0}
        className={`flex items-center justify-center gap-1 rounded-full border border-line text-muted transition-colors hover:border-gold/40 hover:text-ink disabled:opacity-30 ${compact ? "h-7 px-2.5 text-[10px]" : "h-8 w-8"}`}
        aria-label="Oldingi sahifa"
      >
        <ChevronLeft className="h-3.5 w-3.5" />
        {compact && <span>Oldingi</span>}
      </button>
      {pages.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onChange(item)}
          className={`flex h-8 min-w-8 items-center justify-center rounded-full border px-1 text-[11px] transition-colors ${
            item === page ? "border-gold bg-gold font-bold text-[#15170f]" : "border-line text-muted hover:text-ink"
          }`}
          aria-label={`${item + 1}-sahifa`}
          aria-current={item === page ? "page" : undefined}
        >
          {item + 1}
        </button>
      ))}
      {compact && (
        <span className="px-1 text-[10px] text-muted-2">
          {page + 1} / {total}
        </span>
      )}
      <button
        type="button"
        onClick={() => onChange(Math.min(total - 1, page + 1))}
        disabled={page === total - 1}
        className={`flex items-center justify-center gap-1 rounded-full border border-line text-muted transition-colors hover:border-gold/40 hover:text-ink disabled:opacity-30 ${compact ? "h-7 px-2.5 text-[10px]" : "h-8 w-8"}`}
        aria-label="Keyingi sahifa"
      >
        {compact && <span>Keyingi</span>}
        <ChevronRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
