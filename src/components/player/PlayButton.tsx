"use client";

import { Loader2, Pause, Play } from "lucide-react";
import { usePlayer } from "@/components/player/PlayerProvider";
import type { Track } from "@/lib/types";

type PlayButtonProps = {
  track: Track | null;
  queue?: Track[];
  label?: string;
  className?: string;
  variant?: "gold" | "green" | "outline" | "ghost" | "circle" | "bare";
  iconOnly?: boolean;
  size?: "sm" | "md" | "lg";
  ariaLabel?: string;
  onPlayed?: () => void;
};

export function PlayButton({
  track,
  queue,
  label,
  className = "",
  variant = "gold",
  iconOnly = false,
  size = "md",
  ariaLabel,
  onPlayed,
}: PlayButtonProps) {
  const { current, isPlaying, isLoading, playTrack, toggle } = usePlayer();
  const active = Boolean(track && current?.id === track.id);

  if (!track) {
    return label ? (
      <span className={`btn btn-outline opacity-45 ${className}`} aria-disabled="true">
        <Play className="h-4 w-4" /> {label}
      </span>
    ) : null;
  }

  const handleClick = () => {
    if (active) {
      toggle();
    } else {
      playTrack(track, queue);
      onPlayed?.();
    }
  };

  const icon = isLoading && active ? (
    <Loader2 className="h-4 w-4 animate-spin" />
  ) : active && isPlaying ? (
    <Pause className="h-4 w-4 fill-current" />
  ) : (
    <Play className="h-4 w-4 fill-current" />
  );

  if (variant === "circle") {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-b from-[#d8b660] to-[#c9a44a] text-[#15170f] shadow-[0_10px_30px_-12px_rgba(0,0,0,0.8)] transition-transform hover:scale-105 ${className}`}
        aria-label={ariaLabel || `Tinglash: ${track.title}`}
        title={ariaLabel || `Tinglash: ${track.title}`}
      >
        {icon}
      </button>
    );
  }

  if (variant === "bare") {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`flex h-9 w-9 items-center justify-center rounded-full border border-line bg-panel/80 text-gold transition-colors hover:border-gold hover:bg-gold/10 ${className}`}
        aria-label={ariaLabel || `Tinglash: ${track.title}`}
        title={ariaLabel || `Tinglash: ${track.title}`}
      >
        {icon}
      </button>
    );
  }

  const variantClass =
    variant === "gold"
      ? "btn-gold"
      : variant === "green"
        ? "btn-green"
        : variant === "outline"
          ? "btn-outline"
          : "btn-ghost";
  const sizeClass = size === "sm" ? "btn-sm" : size === "lg" ? "px-7 py-4 text-[15px]" : "";

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`btn ${variantClass} ${sizeClass} ${className}`}
      aria-label={ariaLabel || (label ? `${label}: ${track.title}` : `Tinglash: ${track.title}`)}
    >
      {icon}
      {!iconOnly && <span>{label || track.title}</span>}
    </button>
  );
}
