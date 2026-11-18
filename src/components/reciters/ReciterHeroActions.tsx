"use client";

import Link from "next/link";
import { Check, Download, Headphones, ListPlus, Play, Share2 } from "lucide-react";
import { useMemo, useState } from "react";
import { FavoriteButton } from "@/components/player/FavoriteButton";
import { usePlayer } from "@/components/player/PlayerProvider";
import { clientBuildQueue } from "@/lib/client-tracks";
import type { Reciter, Surah } from "@/lib/types";

export function ReciterHeroActions({
  reciter,
  surahs,
  recitationIndex,
  sizeMb,
  sizeLabel,
}: {
  reciter: Reciter;
  surahs: Surah[];
  recitationIndex: number;
  sizeMb: number;
  sizeLabel: string;
}) {
  const { playCollection, current, isPlaying, toggle, addToQueue, setQueueOpen } = usePlayer();
  const [queued, setQueued] = useState(false);
  const [copied, setCopied] = useState(false);

  const queue = useMemo(
    () => clientBuildQueue(reciter, recitationIndex, surahs),
    [reciter, recitationIndex, surahs]
  );
  const first = queue[0];
  const active = Boolean(first && current?.id === first.id);

  const share = async () => {
    const url = `${window.location.origin}/reciters/${reciter.slug}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: reciter.name, url });
        return;
      } catch {
        // The user dismissed the sheet or sharing is unavailable — fall back to copying.
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const queueAll = () => {
    for (const track of queue) addToQueue(track);
    setQueued(true);
    setQueueOpen(true);
    window.setTimeout(() => setQueued(false), 2200);
  };

  return (
    <div className="mt-5 flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => {
          if (active) toggle();
          else playCollection(queue, 0);
        }}
        disabled={!queue.length}
        className="btn btn-gold"
      >
        {active && isPlaying ? <Headphones className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current" />}
        Töliq Qurʼonni tinglaş
      </button>

      <a
        href={first?.downloadUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-outline"
        title="Yuklab olish birinchi suradan boshlanadi; har bir surani quyidagi roʻyxatdan yuklab olish mumkin"
      >
        <Download className="h-4 w-4" /> Yuklab oliş
        {sizeMb > 0 && <span className="text-[11px] font-normal text-muted-2">~{sizeLabel}</span>}
      </a>

      <button
        type="button"
        onClick={share}
        className="icon-btn border border-line"
        aria-label="Bu qorini ulaşiş"
        title="Ulaşiş"
      >
        {copied ? <Check className="h-4 w-4 text-green-bright" /> : <Share2 className="h-4 w-4" />}
      </button>

      <FavoriteButton id={`reciter:${reciter.slug}`} className="border border-line" label="Sevimli" />

      <button
        type="button"
        onClick={queueAll}
        className="icon-btn border border-line"
        data-active={queued}
        aria-label="Töliq tilovatni navbatga qöşiş"
        title="Töliq tilovatni navbatga qöşiş"
      >
        {queued ? <Check className="h-4 w-4 text-green-bright" /> : <ListPlus className="h-[17px] w-[17px]" />}
      </button>

      <Link
        href="/reciters"
        className="ml-auto hidden items-center gap-1 text-[11.5px] font-medium text-muted transition-colors hover:text-gold sm:inline-flex"
      >
        Barça qorilar <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}
