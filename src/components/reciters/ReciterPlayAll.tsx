"use client";

import { Download, Headphones, Play } from "lucide-react";
import { usePlayer } from "@/components/player/PlayerProvider";
import { clientBuildQueue } from "@/lib/client-tracks";
import type { Reciter, Surah } from "@/lib/types";

export function ReciterPlayAll({
  reciter,
  surahs,
  recitationIndex,
  className = "",
}: {
  reciter: Reciter;
  surahs: Surah[];
  recitationIndex: number;
  className?: string;
}) {
  const { playCollection, current, isPlaying, toggle } = usePlayer();
  const queue = clientBuildQueue(reciter, recitationIndex, surahs);
  const active = Boolean(queue[0] && current?.id === queue[0].id);

  return (
    <button
      type="button"
      onClick={() => {
        if (active) toggle();
        else playCollection(queue, 0);
      }}
      disabled={!queue.length}
      className={`btn btn-gold ${className}`}
    >
      {active && isPlaying ? <Headphones className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current" />}
      Töliq Qurʼonni tinglaş
    </button>
  );
}

export function DownloadAllButton({
  reciter,
  surahs,
  recitationIndex,
}: {
  reciter: Reciter;
  surahs: Surah[];
  recitationIndex: number;
}) {
  const queue = clientBuildQueue(reciter, recitationIndex, surahs);
  const first = queue[0];
  if (!first?.downloadUrl) return null;
  return (
    <a
      href={first.downloadUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="btn btn-outline"
      title="Yuklab olish birinchi suradan boshlanadi; har bir surani quyidagi roʻyxatdan yuklab olish mumkin"
    >
      <Download className="h-4 w-4" /> Yuklab oliş
    </a>
  );
}
