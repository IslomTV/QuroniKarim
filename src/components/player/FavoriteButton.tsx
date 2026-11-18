"use client";

import { Heart } from "lucide-react";
import { usePlayer } from "@/components/player/PlayerProvider";

export function FavoriteButton({
  id,
  className = "",
  withLabel = false,
  label = "Sevimli",
}: {
  id: string;
  className?: string;
  withLabel?: boolean;
  label?: string;
}) {
  const { isFavorite, toggleFavorite } = usePlayer();
  const active = isFavorite(id);

  return (
    <button
      type="button"
      onClick={() => toggleFavorite(id)}
      className={
        withLabel
          ? `btn btn-outline ${className}`
          : `icon-btn ${className}`
      }
      data-active={active}
      aria-pressed={active}
      aria-label={active ? "Sevimlilardan olib taşlaş" : "Sevimlilarga qöşiş"}
      title={active ? "Sevimlilardan olib taşlaş" : "Sevimlilarga qöşiş"}
    >
      <Heart className={`h-[17px] w-[17px] ${active ? "fill-current" : ""}`} />
      {withLabel && <span>{label}</span>}
    </button>
  );
}
