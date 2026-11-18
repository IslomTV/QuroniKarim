import Link from "next/link";
import { PlayButton } from "@/components/player/PlayButton";
import type { Surah, Track } from "@/lib/types";

export function SurahNumberBadge({ number, size = "md" }: { number: number; size?: "sm" | "md" | "lg" }) {
  const box = size === "lg" ? "h-14 w-14" : size === "sm" ? "h-8 w-8" : "h-10 w-10";
  const text = size === "lg" ? "text-[13px]" : size === "sm" ? "text-[9px]" : "text-[10.5px]";
  return (
    <span className={`relative flex flex-none items-center justify-center ${box}`} aria-hidden="true">
      <span className="absolute inset-[13%] rotate-45 rounded-[4px] border border-gold/40 bg-gold/[0.07]" />
      <span className={`relative font-semibold tabular-nums text-gold-bright ${text}`}>
        {String(number).padStart(3, "0")}
      </span>
    </span>
  );
}

export function SurahCard({
  surah,
  track,
  queue,
}: {
  surah: Surah;
  track?: Track | null;
  queue?: Track[];
}) {
  return (
    <div className="panel card-hover group flex items-center gap-2.5 p-3.5">
      <Link href={`/surahs/${surah.slug}`} className="flex min-w-0 flex-1 items-center gap-3">
        <SurahNumberBadge number={surah.number} />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13.5px] font-semibold text-ink transition-colors group-hover:text-gold-bright">
            {surah.name}
          </span>
          <span className="mt-0.5 block truncate text-[10.5px] text-muted">
            {surah.englishName} · {surah.verses} oyat · {surah.revelation}
          </span>
        </span>
        <span className="hidden font-arabic text-[17px] text-gold/85 sm:block" dir="rtl">
          {surah.arabicName}
        </span>
      </Link>
      {track !== undefined && (
        <PlayButton track={track ?? null} queue={queue} variant="bare" className="h-8 w-8 flex-none" />
      )}
    </div>
  );
}

export function SurahCompactRow({
  surah,
  track,
  queue,
  detail,
}: {
  surah: Surah;
  track: Track | null;
  queue?: Track[];
  detail?: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-line/60 bg-panel/35 px-3 py-2.5">
      <SurahNumberBadge number={surah.number} size="sm" />
      <Link href={`/surahs/${surah.slug}`} className="min-w-0 flex-1">
        <p className="truncate text-[12.5px] font-medium hover:text-gold-bright">{surah.name}</p>
        <p className="truncate text-[10.5px] text-muted">{detail || `${surah.verses} oyat · ${surah.revelation}`}</p>
      </Link>
      <span className="font-arabic text-base text-gold/70">{surah.arabicName}</span>
      <PlayButton track={track} queue={queue} variant="bare" className="h-8 w-8" />
    </div>
  );
}
