import Link from "next/link";
import { CheckCircle2, Eye, Headphones, Star } from "lucide-react";
import { PlayButton } from "@/components/player/PlayButton";
import { ReciterPhoto } from "@/components/ui/ReciterPhoto";
import type { ReciterCardData } from "@/lib/content";
import { formatCompact, formatNumber } from "@/lib/format";
import type { Track } from "@/lib/types";

export function ReciterSquare({
  reciter,
  track,
  queue,
}: {
  reciter: ReciterCardData;
  track: Track | null;
  queue?: Track[];
}) {
  return (
    <article className="group w-[146px] sm:w-[158px]">
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-line bg-panel-2 transition-colors group-hover:border-gold/45">
        <Link href={`/reciters/${reciter.slug}`} className="absolute inset-0 z-0" aria-label={reciter.name}>
          <ReciterPhoto src={reciter.photo} alt={reciter.name} rounded="rounded-xl" className="absolute inset-0" sizes="160px" />
          <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/5" />
        </Link>
        {reciter.isTopReciter && (
          <span className="absolute left-2 top-2 z-10 rounded bg-black/55 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.14em] text-gold-bright backdrop-blur-sm">
            Maşhur
          </span>
        )}
        <div className="absolute bottom-2.5 right-2.5 z-10 translate-y-1 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
          <PlayButton track={track} queue={queue} variant="circle" className="h-9 w-9" ariaLabel={`Tinglash: ${reciter.name}`} />
        </div>
      </div>
      <Link href={`/reciters/${reciter.slug}`} className="mt-2.5 block">
        <h3 className="line-clamp-2 min-h-[34px] text-center text-[12.5px] font-medium leading-snug text-ink transition-colors group-hover:text-gold-bright">
          {reciter.name}
        </h3>
        <p className="mt-1 flex items-center justify-center gap-1 text-[10.5px] text-muted-2">
          <Headphones className="h-3 w-3" /> {formatCompact(reciter.totalListens)} tinglaş
        </p>
      </Link>
    </article>
  );
}

export function ReciterCircle({
  reciter,
  track,
  queue,
  rank,
}: {
  reciter: ReciterCardData;
  track: Track | null;
  queue?: Track[];
  rank?: number;
}) {
  return (
    <article className="group w-[112px] text-center sm:w-[120px]">
      <div className="relative mx-auto w-[92px] sm:w-[100px]">
        <Link href={`/reciters/${reciter.slug}`} className="reciter-avatar block" aria-label={reciter.name}>
          <span className="block h-[92px] w-[92px] sm:h-[100px] sm:w-[100px]">
            <ReciterPhoto src={reciter.photo} alt={reciter.name} className="h-full w-full" sizes="100px" />
          </span>
        </Link>
        {rank != null && (
          <span className="absolute -left-1 top-0 flex h-5 min-w-5 items-center justify-center rounded-full border border-gold/40 bg-[#0b1712] px-1 text-[9px] font-bold text-gold-bright">
            {rank}
          </span>
        )}
        <div className="absolute -bottom-1 right-0 translate-y-1 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
          <PlayButton track={track} queue={queue} variant="circle" className="h-8 w-8" ariaLabel={`Tinglash: ${reciter.name}`} />
        </div>
      </div>
      <Link href={`/reciters/${reciter.slug}`} className="mt-2.5 block">
        <h3 className="line-clamp-2 min-h-[32px] text-[11.5px] font-medium leading-snug text-ink transition-colors group-hover:text-gold-bright">
          {reciter.name}
        </h3>
      </Link>
    </article>
  );
}

export function ReciterGridCard({ reciter }: { reciter: ReciterCardData }) {
  return (
    <Link
      href={`/reciters/${reciter.slug}`}
      className="panel card-hover group flex gap-3 p-3.5 sm:p-4"
    >
      <ReciterPhoto
        src={reciter.photo}
        alt={reciter.name}
        rounded="rounded-lg"
        className="h-[72px] w-[72px] flex-none border border-line sm:h-[80px] sm:w-[80px]"
        sizes="80px"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="line-clamp-2 text-[14px] font-semibold leading-snug text-ink transition-colors group-hover:text-gold-bright">
              {reciter.name}
            </h3>
            <p className="mt-0.5 truncate font-arabic text-[13px] text-muted-2" dir="rtl">
              {reciter.arabicName}
            </p>
          </div>
          {reciter.isTopReciter && (
            <span className="flex-none rounded border border-gold/25 bg-gold/[0.07] px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-gold">
              MAŞHUR
            </span>
          )}
        </div>
        <p className="mt-1.5 flex flex-wrap items-center gap-x-1.5 text-[10.5px] leading-relaxed text-muted">
          <span>{reciter.country}</span>
          <span className="text-muted-2/50">·</span>
          <span>{reciter.totalRecitations} ta tilovat</span>
          <span className="text-muted-2/50">·</span>
          <span className="inline-flex items-center gap-1"><Headphones className="h-2.5 w-2.5" />{formatCompact(reciter.totalListens)}</span>
          <span className="text-muted-2/50">·</span>
          <span className="inline-flex items-center gap-1"><Eye className="h-2.5 w-2.5" />{formatCompact(reciter.totalViewers)}</span>
        </p>
        <div className="mt-1.5 flex flex-wrap items-center gap-1">
          {reciter.hasCompleteQuran && (
            <span className="tag tag-green py-[3px]">
              <CheckCircle2 className="h-2.5 w-2.5" /> Töliq
            </span>
          )}
          {reciter.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="tag py-[3px]">{tag}</span>
          ))}
        </div>
      </div>
    </Link>
  );
}

export function ReciterMiniRow({
  reciter,
  track,
  queue,
  detail,
}: {
  reciter: ReciterCardData;
  track?: Track | null;
  queue?: Track[];
  detail?: string;
}) {
  return (
    <div className="group flex items-center gap-3 rounded-xl border border-line/60 bg-panel/40 p-2.5 transition-colors hover:border-gold/35">
      <Link href={`/reciters/${reciter.slug}`} className="flex-none">
        <ReciterPhoto src={reciter.photo} alt={reciter.name} className="h-11 w-11 border border-line" sizes="44px" />
      </Link>
      <Link href={`/reciters/${reciter.slug}`} className="min-w-0 flex-1">
        <p className="truncate text-[12.5px] font-medium transition-colors group-hover:text-gold-bright">{reciter.name}</p>
        <p className="truncate text-[10.5px] text-muted">{detail || `${reciter.country} · ${formatNumber(reciter.totalListens)} tinglash`}</p>
      </Link>
      {track !== undefined && <PlayButton track={track ?? null} queue={queue} variant="bare" className="h-8 w-8" />}
    </div>
  );
}

export function ReciterStatChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-line/70 bg-white/[0.02] px-3 py-2">
      <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-muted-2">{label}</p>
      <p className="mt-0.5 text-sm font-semibold text-ink">{value}</p>
    </div>
  );
}

export function TopBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded border border-gold/25 bg-gold/[0.07] px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-gold">
      <Star className="h-2.5 w-2.5 fill-current" /> {children}
    </span>
  );
}
