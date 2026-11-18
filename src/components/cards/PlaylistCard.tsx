import Image from "next/image";
import Link from "next/link";
import { Headphones, Play } from "lucide-react";
import { PlayButton } from "@/components/player/PlayButton";
import type { Track } from "@/lib/types";

export function PlaylistArtwork({
  cover,
  accent,
  arabicName,
  className = "",
}: {
  cover: string | null;
  accent: string;
  arabicName?: string;
  className?: string;
}) {
  return (
    <span
      className={`relative block overflow-hidden rounded-lg border ${cover ? "border-line" : ""} ${className}`}
      style={
        cover
          ? undefined
          : {
              background: `radial-gradient(circle at 50% 0%, ${accent}33, transparent 62%), linear-gradient(150deg, ${accent}24, #0a1712 72%)`,
              borderColor: `${accent}55`,
            }
      }
    >
      {cover ? (
        <Image src={cover} alt="" fill sizes="140px" className="object-cover" />
      ) : (
        <>
          <span className="absolute inset-0 pattern-dots opacity-40" />
          <span className="relative flex h-full w-full flex-col items-center justify-center gap-1">
            <span className="relative h-7 w-8">
              <Image src="/images/logo-icon.png" alt="" fill sizes="32px" className="object-contain" />
            </span>
            {arabicName && <span className="font-arabic text-[10px] text-gold/85">{arabicName}</span>}
          </span>
        </>
      )}
    </span>
  );
}

export function PlaylistCard({
  href,
  title,
  eyebrow,
  description,
  trackCount,
  cover,
  accent,
  track,
  queue,
}: {
  href: string;
  title: string;
  eyebrow: string;
  description: string;
  trackCount: number;
  cover: string | null;
  accent: string;
  track: Track | null;
  queue?: Track[];
}) {
  return (
    <article className="panel card-hover flex flex-col p-4">
      <div className="flex gap-3">
        <PlaylistArtwork cover={cover} accent={accent} className="h-[64px] w-[64px] flex-none" />
        <div className="min-w-0">
          <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-gold">{eyebrow}</p>
          <Link href={href} className="mt-1 block">
            <h3 className="line-clamp-2 text-[14px] font-semibold leading-snug text-ink transition-colors hover:text-gold-bright">
              {title}
            </h3>
          </Link>
          <p className="mt-1 flex items-center gap-1 text-[10.5px] text-muted-2">
            <Headphones className="h-3 w-3" /> {trackCount} ta trek
          </p>
        </div>
      </div>
      <p className="mt-3 line-clamp-2 min-h-[34px] text-[11.5px] leading-relaxed text-muted">{description}</p>
      <PlayButton
        track={track}
        queue={queue}
        label="Tinglaş"
        className="mt-3 w-full justify-center py-2.5 text-[12.5px]"
        ariaLabel={`Tinglash: ${title}`}
      />
    </article>
  );
}

export function PlaylistGridCard({
  href,
  title,
  eyebrow,
  description,
  trackCount,
  cover,
  accent,
  arabicName,
  track,
  queue,
}: {
  href: string;
  title: string;
  eyebrow: string;
  description: string;
  trackCount: number;
  cover: string | null;
  accent: string;
  arabicName?: string;
  track: Track | null;
  queue?: Track[];
}) {
  return (
    <article className="panel card-hover group flex flex-col p-3.5">
      <Link href={href} className="relative block overflow-hidden rounded-lg">
        <PlaylistArtwork cover={cover} accent={accent} arabicName={arabicName} className="aspect-[16/9] w-full" />
        <span className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent opacity-70" />
        <span className="absolute bottom-2 left-2 rounded bg-black/55 px-2 py-1 text-[9px] font-semibold uppercase tracking-wider text-gold-bright backdrop-blur">
          {eyebrow}
        </span>
        <span className="absolute bottom-2 right-2 flex h-9 w-9 items-center justify-center rounded-full bg-gold text-[#15170f] opacity-0 transition-opacity group-hover:opacity-100">
          <Play className="h-4 w-4 fill-current" />
        </span>
      </Link>
      <Link href={href} className="mt-3 block flex-1">
        <h3 className="line-clamp-2 text-[14.5px] font-semibold leading-snug text-ink transition-colors group-hover:text-gold-bright">
          {title}
        </h3>
        <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-muted">{description}</p>
      </Link>
      <div className="mt-3 flex items-center justify-between gap-2 border-t border-line/70 pt-3">
        <span className="text-[10.5px] text-muted-2">{trackCount} ta trek</span>
        <PlayButton track={track} queue={queue} variant="bare" ariaLabel={`Tinglash: ${title}`} />
      </div>
    </article>
  );
}
