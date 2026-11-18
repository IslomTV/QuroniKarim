"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Download,
  Heart,
  ListMusic,
  Pause,
  Play,
  Repeat,
  Repeat1,
  RotateCcw,
  RotateCw,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  X,
  Trash2,
  Loader2,
  Radio,
} from "lucide-react";
import { usePlayer } from "@/components/player/PlayerProvider";
import { Equalizer } from "@/components/ui/Equalizer";
import { formatDuration } from "@/lib/format";

export function PlayerBar() {
  const {
    current,
    queue,
    index,
    partIndex,
    isPlaying,
    isLoading,
    currentTime,
    duration,
    progress,
    volume,
    muted,
    rate,
    repeat,
    shuffle,
    favorites,
    queueOpen,
    error,
    toggle,
    next,
    previous,
    seek,
    skip,
    setVolume,
    toggleMute,
    cycleRate,
    toggleShuffle,
    cycleRepeat,
    toggleFavorite,
    playCollection,
    removeFromQueue,
    clearQueue,
    setQueueOpen,
  } = usePlayer();

  const favorite = current ? favorites.includes(current.id) : false;
  const totalRemaining = queue
    .slice(index)
    .reduce((sum, track) => sum + track.parts.reduce((partSum, part) => partSum + (part.duration || 0), 0), 0);

  return (
    <>
      {queueOpen && (
        <div className="fixed inset-0 z-[55] md:inset-auto md:bottom-[100px] md:right-4 md:w-[410px]">
          <button
            type="button"
            className="absolute inset-0 bg-black/50 md:hidden"
            onClick={() => setQueueOpen(false)}
            aria-label="Navbatni yopiş"
          />
          <div className="panel absolute inset-x-0 bottom-[84px] flex max-h-[70vh] flex-col overflow-hidden rounded-b-none md:static md:bottom-auto md:max-h-[min(70vh,640px)] md:rounded-[14px] md:shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)]">
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <div>
                <p className="eyebrow text-[10px]">Tinglaş navbati</p>
                <p className="mt-1 text-sm font-semibold">
                  {queue.length} ta trek
                  <span className="ml-2 text-xs font-normal text-muted">
                    {totalRemaining > 0 ? `· ${formatDuration(totalRemaining)}` : ""}
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className="icon-btn h-8 w-8"
                  onClick={clearQueue}
                  title="Faqat joriy trekni qoldiriş"
                  aria-label="Navbatni tozalaş"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="icon-btn h-8 w-8"
                  onClick={() => setQueueOpen(false)}
                  aria-label="Navbatni yopiş"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="overflow-y-auto p-2">
              {queue.length === 0 && (
                <p className="px-3 py-8 text-center text-sm text-muted">Navbatingiz böş.</p>
              )}
              {queue.map((track, trackIndex) => {
                const active = trackIndex === index;
                return (
                  <div
                    key={`${track.id}-${trackIndex}`}
                    className={`group flex items-center gap-3 rounded-lg px-2 py-2 transition-colors ${
                      active ? "bg-gold/10" : "hover:bg-white/[0.04]"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => playCollection(queue, trackIndex)}
                      className="relative h-10 w-10 flex-none overflow-hidden rounded-md border border-line bg-panel-2"
                      aria-label={`Tinglash: ${track.title}`}
                    >
                      {track.art ? (
                        <Image src={track.art} alt="" fill sizes="40px" className="object-cover" />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center text-gold">
                          <Radio className="h-4 w-4" />
                        </span>
                      )}
                      {active && isPlaying && (
                        <span className="absolute inset-0 flex items-center justify-center bg-black/55 text-gold-bright">
                          <Equalizer bars={3} />
                        </span>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => playCollection(queue, trackIndex)}
                      className="min-w-0 flex-1 text-left"
                    >
                      <span className={`block truncate text-[13px] font-medium ${active ? "text-gold-bright" : ""}`}>
                        {track.title}
                      </span>
                      <span className="block truncate text-[11px] text-muted">{track.subtitle}</span>
                    </button>
                    <span className="text-[11px] tabular-nums text-muted-2">
                      {track.isLive
                        ? "JONLI"
                        : formatDuration(track.parts.reduce((sum, item) => sum + (item.duration || 0), 0))}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFromQueue(track.id)}
                      className="text-muted-2 opacity-0 transition-opacity hover:text-red-400 group-hover:opacity-100"
                      aria-label={`${track.title} trekini navbatdan olib tashlash`}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="fixed inset-x-0 bottom-0 z-[60]">
        {error && (
          <div className="mx-auto mb-2 w-fit max-w-[calc(100vw-24px)] rounded-full border border-red-400/30 bg-[#2a1111] px-4 py-2 text-center text-[11.5px] text-red-200 shadow-lg">
            {error}
          </div>
        )}
        <div className="glass border-x-0 border-b-0 border-t-[color:var(--border-strong)] pb-[env(safe-area-inset-bottom)]">
          <div
            className="absolute inset-x-0 top-0 h-[3px] cursor-pointer bg-white/10"
            onClick={(event) => {
              if (!current || current.isLive || duration <= 0) return;
              const rect = event.currentTarget.getBoundingClientRect();
              seek(((event.clientX - rect.left) / rect.width) * duration);
            }}
            role="presentation"
          >
            <div
              className="h-full bg-gradient-to-r from-gold to-gold-bright transition-[width] duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mx-auto flex h-[76px] w-full max-w-[1500px] items-center gap-3 px-3 sm:px-5 md:h-[88px]">
            <div className="flex min-w-0 flex-1 items-center gap-3 md:w-[32%] md:flex-none">
              <div className="relative h-11 w-11 flex-none overflow-hidden rounded-lg border border-gold/25 bg-panel-2 md:h-12 md:w-12">
                {current?.art ? (
                  <Image src={current.art} alt="" fill sizes="48px" className="object-cover" />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-gold">
                    <Radio className="h-5 w-5" />
                  </span>
                )}
              </div>
              <div className="min-w-0">
                {current ? (
                  <>
                    <div className="flex items-center gap-2">
                      <p className="truncate text-[13px] font-semibold text-ink md:text-sm">
                        {current.surahSlug ? (
                          <Link href={`/surahs/${current.surahSlug}`} className="hover:text-gold-bright">
                            {current.title}
                          </Link>
                        ) : (
                          current.title
                        )}
                      </p>
                      {current.isLive ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-500/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-red-300">
                          <span className="h-1.5 w-1.5 rounded-full bg-red-500 live-dot" /> Jonli
                        </span>
                      ) : current.parts.length > 1 ? (
                        <span className="hidden rounded-full border border-line px-1.5 py-0.5 text-[9px] text-muted-2 sm:inline">
                          {partIndex + 1}/{current.parts.length}-qism
                        </span>
                      ) : null}
                    </div>
                    <p className="truncate text-[11.5px] text-muted">
                      {current.reciterSlug ? (
                        <Link href={`/reciters/${current.reciterSlug}`} className="hover:text-gold">
                          {current.reciterName}
                        </Link>
                      ) : (
                        current.reciterName
                      )}
                      {!current.isLive && current.subtitle.includes(" · ") && (
                        <span className="hidden sm:inline"> · {current.subtitle.split(" · ").slice(1).join(" · ")}</span>
                      )}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-semibold">Tilovatni tanlang</p>
                    <p className="text-[11.5px] text-muted">Pleeringiz tayyor.</p>
                  </>
                )}
              </div>
              {current && !current.isLive && (
                <button
                  type="button"
                  className="icon-btn ml-auto hidden h-9 w-9 md:inline-flex"
                  data-active={favorite}
                  onClick={() => toggleFavorite(current.id)}
                  aria-label={favorite ? "Sevimlilardan olib taşlaş" : "Sevimlilarga qöşiş"}
                  title={favorite ? "Sevimlilardan olib taşlaş" : "Sevimlilarga qöşiş"}
                >
                  <Heart className={`h-[18px] w-[18px] ${favorite ? "fill-current" : ""}`} />
                </button>
              )}
            </div>

            <div className="flex flex-none items-center gap-1 md:hidden">
              <button
                type="button"
                onClick={toggle}
                disabled={!current}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-b from-[#d8b660] to-[#c9a44a] text-[#15170f] shadow-[0_8px_24px_-10px_rgba(201,164,74,0.8)] disabled:opacity-40"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="ml-0.5 h-5 w-5 fill-current" />}
              </button>
              <button
                type="button"
                onClick={next}
                disabled={!current}
                className="icon-btn h-10 w-10"
                aria-label="Keyingi"
              >
                <SkipForward className="h-[18px] w-[18px]" />
              </button>
              <button
                type="button"
                onClick={() => setQueueOpen(!queueOpen)}
                className="icon-btn h-10 w-10"
                data-active={queueOpen}
                aria-label="Navbatni oçiş"
              >
                <ListMusic className="h-[18px] w-[18px]" />
              </button>
            </div>

            <div className="hidden flex-1 flex-col items-center gap-1 md:flex">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={toggleShuffle}
                  className="icon-btn h-8 w-8"
                  data-active={shuffle}
                  title="Aralaştiriş"
                  aria-label="Aralaştiriş"
                >
                  <Shuffle className="h-[15px] w-[15px]" />
                </button>
                <button type="button" onClick={previous} className="icon-btn h-8 w-8" title="Oldingi" aria-label="Oldingi">
                  <SkipBack className="h-[17px] w-[17px]" />
                </button>
                <button type="button" onClick={() => skip(-10)} className="icon-btn h-8 w-8" title="10 soniya orqaga" aria-label="10 soniya orqaga">
                  <RotateCcw className="h-[16px] w-[16px]" />
                </button>
                <button
                  type="button"
                  onClick={toggle}
                  disabled={!current}
                  className="mx-1 flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-b from-[#d8b660] to-[#c9a44a] text-[#15170f] shadow-[0_8px_26px_-10px_rgba(201,164,74,0.9)] transition-transform hover:scale-[1.04] disabled:opacity-40"
                  aria-label={isPlaying ? "Pauza" : "Ijro etiş"}
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : isPlaying ? (
                    <Pause className="h-5 w-5 fill-current" />
                  ) : (
                    <Play className="ml-0.5 h-5 w-5 fill-current" />
                  )}
                </button>
                <button type="button" onClick={() => skip(10)} className="icon-btn h-8 w-8" title="10 soniya oldinga" aria-label="10 soniya oldinga">
                  <RotateCw className="h-[16px] w-[16px]" />
                </button>
                <button type="button" onClick={next} className="icon-btn h-8 w-8" title="Keyingi" aria-label="Keyingi">
                  <SkipForward className="h-[17px] w-[17px]" />
                </button>
                <button
                  type="button"
                  onClick={cycleRepeat}
                  className="icon-btn h-8 w-8"
                  data-active={repeat !== "off"}
                  title={`Takrorlash: ${repeat}`}
                  aria-label={`Takrorlash: ${repeat}`}
                >
                  {repeat === "one" ? <Repeat1 className="h-[15px] w-[15px]" /> : <Repeat className="h-[15px] w-[15px]" />}
                </button>
              </div>
              <div className="flex w-full items-center gap-2">
                <span className="w-9 text-right text-[10px] tabular-nums text-muted-2">
                  {current?.isLive ? "JONLI" : formatDuration(currentTime)}
                </span>
                <input
                  type="range"
                  min={0}
                  max={duration || 0}
                  step={1}
                  value={current?.isLive ? 0 : Math.min(currentTime, duration || 0)}
                  onChange={(event) => seek(Number(event.target.value))}
                  className="range range-volume flex-1"
                  style={{ "--progress": `${progress}%` } as React.CSSProperties}
                  aria-label="Vaqtni tanlaş"
                  disabled={!current || current.isLive}
                />
                <span className="w-9 text-[10px] tabular-nums text-muted-2">
                  {current?.isLive ? "JONLI" : formatDuration(duration)}
                </span>
              </div>
            </div>

            <div className="hidden items-center justify-end gap-0.5 md:flex md:w-[32%] md:flex-none">
              {current && !current.isLive && (
                <button
                  type="button"
                  onClick={() => skip(10)}
                  className="hidden"
                  aria-hidden="true"
                />
              )}
              <div className="group flex items-center gap-1">
                <button
                  type="button"
                  onClick={toggleMute}
                  className="icon-btn h-8 w-8"
                  title={muted ? "Ovozni yoqiş" : "Ovozsiz qiliş"}
                  aria-label={muted ? "Ovozni yoqiş" : "Ovozsiz qiliş"}
                >
                  {muted || volume === 0 ? <VolumeX className="h-[17px] w-[17px]" /> : <Volume2 className="h-[17px] w-[17px]" />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={muted ? 0 : volume}
                  onChange={(event) => setVolume(Number(event.target.value))}
                  className="range range-volume w-[74px]"
                  style={{ "--progress": `${muted ? 0 : volume * 100}%` } as React.CSSProperties}
                  aria-label="Ovoz balandligi"
                />
              </div>
              <button
                type="button"
                onClick={cycleRate}
                className="ml-1 rounded-md px-1.5 py-1 text-[11px] font-semibold tabular-nums text-muted transition-colors hover:text-ink"
                title="Ijro tezligi"
                aria-label="Ijro tezligini özgartiriş"
              >
                {rate}×
              </button>
              {current && (
                <button
                  type="button"
                  className="icon-btn h-8 w-8"
                  data-active={favorite}
                  onClick={() => toggleFavorite(current.id)}
                  title="Sevimlilar"
                  aria-label="Sevimlilar"
                >
                  <Heart className={`h-[16px] w-[16px] ${favorite ? "fill-current" : ""}`} />
                </button>
              )}
              <button
                type="button"
                onClick={() => setQueueOpen(!queueOpen)}
                className="icon-btn relative h-8 w-8"
                data-active={queueOpen}
                title="Navbat"
                aria-label="Navbat"
              >
                <ListMusic className="h-[17px] w-[17px]" />
                {queue.length > 1 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[8px] font-bold text-[#15170f]">
                    {queue.length}
                  </span>
                )}
              </button>
              {current?.downloadUrl && (
                <a
                  href={current.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="icon-btn h-8 w-8"
                  title="Yuklab oliş"
                  aria-label="Yuklab oliş"
                >
                  <Download className="h-[16px] w-[16px]" />
                </a>
              )}
              {current?.isLive && (
                <span className="ml-1 inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-red-300">
                  <Equalizer bars={3} /> Jonli efirda
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
