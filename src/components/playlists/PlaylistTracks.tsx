"use client";

import { ChevronLeft, ChevronRight, Download, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { FavoriteButton } from "@/components/player/FavoriteButton";
import { PlayButton } from "@/components/player/PlayButton";
import { QueueButton } from "@/components/player/QueueButton";
import { formatDuration } from "@/lib/format";
import type { Track } from "@/lib/types";

const PAGE_SIZE = 25;

export function PlaylistTracks({ tracks }: { tracks: Track[] }) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tracks;
    return tracks.filter((track) =>
      `${track.title} ${track.titleArabic} ${track.reciterName} ${track.subtitle}`.toLowerCase().includes(q)
    );
  }, [tracks, query]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const safePage = Math.min(page, Math.max(0, totalPages - 1));
  const pageItems = filtered.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE);

  return (
    <section id="tracks" className="pt-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Treklar röyxati</p>
          <h2 className="display mt-2 text-[clamp(1.7rem,2.6vw,2.35rem)]">Bu töplamdagi har bir trek</h2>
          <p className="mt-1.5 text-[12.5px] text-muted">
            {tracks.length} ta trek · istalgan qatorda tinglaşni bosing yoki yuqoridan butun pleylistni boşlang.
          </p>
        </div>
        <div className="relative w-full sm:w-[280px]">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-2" />
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(0);
            }}
            placeholder="Sura yoki qorini toping…"
            aria-label="Bu pleylistdan qidiriş"
            className="input py-2.5 pl-9 pr-3 text-[12px]"
          />
        </div>
      </div>

      <div className="panel mt-4 overflow-hidden">
        <div className="hidden grid-cols-[34px_1fr_180px_88px_118px] items-center gap-2 border-b border-line/70 px-4 py-2.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-muted-2 md:grid">
          <span>#</span>
          <span>Sura</span>
          <span>Qori</span>
          <span className="text-right">Davomiylik</span>
          <span className="text-right">Amallar</span>
        </div>

        {pageItems.map((track, index) => {
          const absolute = safePage * PAGE_SIZE + index + 1;
          const duration = track.parts.reduce((sum, part) => sum + (part.duration || 0), 0);
          return (
            <div
              key={track.id}
              className="group grid grid-cols-[28px_1fr_auto] items-center gap-2 border-b border-line/40 px-3 py-2.5 transition-colors last:border-0 hover:bg-white/[0.025] md:grid-cols-[34px_1fr_180px_88px_118px] md:px-4"
            >
              <span className="text-[10px] tabular-nums text-muted-2 md:text-[11px]">{absolute}</span>
              <div className="flex min-w-0 items-center gap-2">
                <PlayButton
                  track={track}
                  queue={filtered}
                  variant="bare"
                  className="h-8 w-8 flex-none"
                  ariaLabel={`Tinglash: ${track.title}`}
                />
                <div className="min-w-0">
                  <p className="truncate text-[12px] font-medium text-ink transition-colors group-hover:text-gold-bright">
                    {track.title}
                    {track.parts.length > 1 && (
                      <span className="ml-1.5 rounded bg-gold/10 px-1 py-0.5 align-middle text-[7.5px] font-semibold uppercase tracking-wider text-gold">
                        {track.parts.length} qism
                      </span>
                    )}
                  </p>
                  <p className="truncate text-[9.5px] text-muted-2 md:hidden">
                    {track.reciterName} · {formatDuration(duration)}
                  </p>
                  <p className="hidden truncate font-arabic text-[12px] leading-relaxed text-gold/60 md:block" dir="rtl">
                    {track.titleArabic}
                  </p>
                </div>
              </div>
              <p className="hidden truncate text-[10.5px] text-muted md:block">{track.reciterName}</p>
              <p className="hidden text-right text-[10px] tabular-nums text-muted-2 md:block">{formatDuration(duration)}</p>
              <div className="flex items-center justify-end gap-0.5">
                <a
                  href={track.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="icon-btn hidden h-7 w-7 sm:inline-flex"
                  aria-label={`Yuklab olish: ${track.title}`}
                  title="Yuklab oliş"
                >
                  <Download className="h-3.5 w-3.5" />
                </a>
                <FavoriteButton id={track.id} className="hidden h-7 w-7 sm:inline-flex" />
                <QueueButton track={track} className="hidden h-7 w-7 lg:inline-flex" />
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <p className="px-4 py-12 text-center text-[12px] text-muted">Bu qidiruvga mos trek yöq.</p>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="text-[10.5px] text-muted-2">
          {filtered.length === 0 ? 0 : safePage * PAGE_SIZE + 1}–
          {Math.min(filtered.length, safePage * PAGE_SIZE + PAGE_SIZE)} / {filtered.length} körsatilmoqda
        </p>
        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setPage(Math.max(0, safePage - 1))}
              disabled={safePage === 0}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-muted transition-colors hover:text-ink disabled:opacity-30"
              aria-label="Oldingi sahifa"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <span className="px-2 text-[10px] text-muted-2">
              {safePage + 1} / {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage(Math.min(totalPages - 1, safePage + 1))}
              disabled={safePage === totalPages - 1}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-muted transition-colors hover:text-ink disabled:opacity-30"
              aria-label="Keyingi sahifa"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
