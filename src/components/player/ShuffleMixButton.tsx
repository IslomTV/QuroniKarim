"use client";

import { Shuffle } from "lucide-react";
import { usePlayer } from "@/components/player/PlayerProvider";
import type { Track } from "@/lib/types";

export function ShuffleMixButton({
  tracks,
  label = "Aralaşmani aralaştiriş",
  className = "",
}: {
  tracks: Track[];
  label?: string;
  className?: string;
}) {
  const { playCollection, shuffle, toggleShuffle } = usePlayer();
  if (!tracks.length) return null;
  return (
    <button
      type="button"
      onClick={() => {
        const start = Math.floor(Math.random() * tracks.length);
        playCollection(tracks, start);
        if (!shuffle) toggleShuffle();
      }}
      className={`inline-flex items-center gap-1.5 text-[12px] font-medium text-green-bright transition-colors hover:text-gold ${className}`}
    >
      <Shuffle className="h-3.5 w-3.5" /> {label}
    </button>
  );
}
