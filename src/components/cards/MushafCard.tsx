import Image from "next/image";
import Link from "next/link";
import { Users } from "lucide-react";
import { PlayButton } from "@/components/player/PlayButton";
import type { Track } from "@/lib/types";

export function MushafCard({
  href,
  title,
  arabicName,
  cover,
  trackCount,
  contributorCount,
  track,
  queue,
}: {
  href: string;
  title: string;
  arabicName: string;
  cover: string;
  trackCount: number;
  contributorCount?: number;
  track: Track | null;
  queue?: Track[];
}) {
  return (
    <article className="group w-[164px] sm:w-[180px]">
      <Link href={href} className="relative block aspect-[3/4] overflow-hidden rounded-lg border border-gold/30 bg-[#0a2b20] shadow-[0_18px_35px_-24px_rgba(0,0,0,0.9)] transition-transform duration-300 group-hover:-translate-y-1">
        <Image src={cover} alt={title} fill sizes="190px" className="object-cover" />
        <span className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
        <span className="absolute right-2 top-2 rounded bg-black/55 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-gold-bright backdrop-blur">
          {trackCount} sura
        </span>
      </Link>
      <div className="mt-2.5 flex items-start gap-2">
        <Link href={href} className="min-w-0 flex-1">
          <h3 className="line-clamp-2 text-[12px] font-medium leading-snug text-ink transition-colors group-hover:text-gold-bright">
            {title}
          </h3>
          <p className="mt-1 flex items-center gap-1 text-[10px] text-muted-2">
            {contributorCount ? <><Users className="h-2.5 w-2.5" /> {contributorCount} qori</> : <span className="font-arabic text-gold/70">{arabicName}</span>}
          </p>
        </Link>
        <PlayButton track={track} queue={queue} variant="bare" className="h-8 w-8 flex-none" ariaLabel={`Tinglash: ${title}`} />
      </div>
    </article>
  );
}
