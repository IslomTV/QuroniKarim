"use client";

import { ListPlus } from "lucide-react";
import { usePlayer } from "@/components/player/PlayerProvider";
import type { Track } from "@/lib/types";

export function QueueButton({ track, className = "" }: { track: Track | null; className?: string }) {
  const { addToQueue } = usePlayer();
  if (!track) return null;
  return (
    <button
      type="button"
      onClick={() => addToQueue(track)}
      className={`icon-btn ${className}`}
      aria-label={`${track.title} trekini navbatga qoʻshish`}
      title="Navbatga qöşiş"
    >
      <ListPlus className="h-[17px] w-[17px]" />
    </button>
  );
}
