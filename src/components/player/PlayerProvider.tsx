"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { withBasePath } from "@/lib/base-path";
import type { Track } from "@/lib/types";

export type RepeatMode = "off" | "all" | "one";

type PlayerContextValue = {
  queue: Track[];
  index: number;
  current: Track | null;
  partIndex: number;
  isPlaying: boolean;
  isLoading: boolean;
  currentTime: number;
  duration: number;
  progress: number;
  volume: number;
  muted: boolean;
  rate: number;
  repeat: RepeatMode;
  shuffle: boolean;
  favorites: string[];
  queueOpen: boolean;
  error: string | null;
  playTrack: (track: Track, queue?: Track[]) => void;
  playCollection: (tracks: Track[], startIndex?: number) => void;
  toggle: () => void;
  play: () => void;
  pause: () => void;
  next: () => void;
  previous: () => void;
  seek: (seconds: number) => void;
  skip: (delta: number) => void;
  setVolume: (value: number) => void;
  toggleMute: () => void;
  setRate: (value: number) => void;
  cycleRate: () => void;
  setRepeat: (mode: RepeatMode) => void;
  cycleRepeat: () => void;
  toggleShuffle: () => void;
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
  addToQueue: (track: Track, playNext?: boolean) => void;
  removeFromQueue: (id: string) => void;
  clearQueue: () => void;
  setQueueOpen: (open: boolean) => void;
  stop: () => void;
};

const PlayerContext = createContext<PlayerContextValue | null>(null);

const FAVORITES_KEY = "w2q-favorites";
const SETTINGS_KEY = "w2q-player-settings";

function readNumber(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

export function PlayerProvider({
  children,
  initialTrack = null,
}: {
  children: ReactNode;
  initialTrack?: Track | null;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const shouldAutoplayRef = useRef(false);

  const [queue, setQueue] = useState<Track[]>(initialTrack ? [initialTrack] : []);
  const [index, setIndex] = useState(0);
  const [partIndex, setPartIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(initialTrack?.parts[0]?.duration ?? 0);
  const [volume, setVolumeState] = useState(0.85);
  const [muted, setMuted] = useState(false);
  const [rate, setRateState] = useState(1);
  const [repeat, setRepeat] = useState<RepeatMode>("off");
  const [shuffle, setShuffle] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [queueOpen, setQueueOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [storageReady, setStorageReady] = useState(false);

  const current = queue[index] ?? null;
  const safePartIndex = current ? Math.min(partIndex, Math.max(0, current.parts.length - 1)) : 0;
  const part = current?.parts[safePartIndex] ?? null;
  const isLive = Boolean(current?.isLive);
  const progress = !isLive && duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  useEffect(() => {
    try {
      const rawFavorites = window.localStorage.getItem(FAVORITES_KEY);
      if (rawFavorites) {
        const parsed = JSON.parse(rawFavorites);
        if (Array.isArray(parsed)) setFavorites(parsed.filter((item) => typeof item === "string"));
      }
      const rawSettings = window.localStorage.getItem(SETTINGS_KEY);
      if (rawSettings) {
        const parsed = JSON.parse(rawSettings) as Record<string, unknown>;
        setVolumeState(Math.min(1, Math.max(0, readNumber(parsed.volume, 0.85))));
        setMuted(Boolean(parsed.muted));
        setRateState(readNumber(parsed.rate, 1));
      }
    } catch {
      // Storage can be unavailable in private contexts — the player still works.
    }
    // Persist only after the restored values have been applied to state.
    // This avoids overwriting saved favourites with the empty initial state
    // (React StrictMode double-invokes effects in development).
    setStorageReady(true);
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    try {
      window.localStorage.setItem(
        SETTINGS_KEY,
        JSON.stringify({ volume, muted, rate })
      );
      window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch {
      // Ignore storage failures.
    }
  }, [volume, muted, rate, favorites, storageReady]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!part) {
      audio.removeAttribute("src");
      audio.load();
      setCurrentTime(0);
      setDuration(0);
      return;
    }
    if (audio.getAttribute("src") !== part.url) {
      audio.src = part.url;
      audio.load();
      setCurrentTime(0);
      setDuration(part.duration || 0);
    }
    if (shouldAutoplayRef.current) {
      shouldAutoplayRef.current = false;
      setIsLoading(true);
      void audio
        .play()
        .then(() => {
          setError(null);
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
          setIsPlaying(false);
          setError("Ijro boşlanmadi. Qayta uriniş uçun tinglaş tugmasini bosing.");
        });
    }
  }, [part?.url, part?.duration]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
    audio.muted = muted;
  }, [volume, muted]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.playbackRate = rate;
  }, [rate]);

  useEffect(() => {
    if (!current || typeof navigator === "undefined" || !("mediaSession" in navigator)) return;
    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: current.title,
        artist: current.reciterName,
        album: current.subtitle,
        artwork: current.art
          ? [{ src: withBasePath(current.art), sizes: "512x512", type: "image/webp" }]
          : [
              {
                src: withBasePath("/images/logo-icon.png"),
                sizes: "512x423",
                type: "image/png",
              },
            ],
      });
      navigator.mediaSession.setActionHandler("play", () => {
        void audioRef.current?.play();
      });
      navigator.mediaSession.setActionHandler("pause", () => audioRef.current?.pause());
      navigator.mediaSession.setActionHandler("nexttrack", () => {
        if (index + 1 < queue.length) {
          setIndex(index + 1);
          setPartIndex(0);
          shouldAutoplayRef.current = true;
        }
      });
      navigator.mediaSession.setActionHandler("previoustrack", () => {
        if (index > 0) {
          setIndex(index - 1);
          setPartIndex(0);
          shouldAutoplayRef.current = true;
        }
      });
    } catch {
      // Media Session is a progressive enhancement.
    }
  }, [current, index, queue.length]);

  const playAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !part) return;
    if (audio.ended) audio.currentTime = 0;
    setIsLoading(true);
    void audio
      .play()
      .then(() => {
        setError(null);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        setIsPlaying(false);
        setError("Ijro boşlanmadi. Qayta uriniş uçun tinglaş tugmasini bosing.");
      });
  }, [part]);

  const playTrack = useCallback(
    (track: Track, nextQueue?: Track[]) => {
      const trimmedQueue = nextQueue?.length ? nextQueue : [track];
      let targetIndex = trimmedQueue.findIndex((item) => item.id === track.id);
      const nextList = [...trimmedQueue];
      if (targetIndex < 0) {
        nextList.unshift(track);
        targetIndex = 0;
      }
      if (current?.id === track.id) {
        playAudio();
        return;
      }
      setQueue(nextList);
      setIndex(targetIndex);
      setPartIndex(0);
      setError(null);
      shouldAutoplayRef.current = true;
      setIsPlaying(true);
    },
    [current?.id, playAudio]
  );

  const playCollection = useCallback(
    (tracks: Track[], startIndex = 0) => {
      if (!tracks.length) return;
      const safeIndex = Math.min(Math.max(0, startIndex), tracks.length - 1);
      const track = tracks[safeIndex];
      if (current?.id === track.id) {
        playAudio();
        return;
      }
      setQueue(tracks);
      setIndex(safeIndex);
      setPartIndex(0);
      setError(null);
      shouldAutoplayRef.current = true;
      setIsPlaying(true);
    },
    [current?.id, playAudio]
  );

  const toggle = useCallback(() => {
    if (!current) return;
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) playAudio();
    else audio.pause();
  }, [current, playAudio]);

  const play = useCallback(() => {
    if (!current) return;
    playAudio();
  }, [current, playAudio]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const next = useCallback(() => {
    if (!queue.length) return;
    if (shuffle && queue.length > 1) {
      let nextIndex = index;
      while (nextIndex === index) nextIndex = Math.floor(Math.random() * queue.length);
      setIndex(nextIndex);
      setPartIndex(0);
      shouldAutoplayRef.current = true;
      setIsPlaying(true);
      return;
    }
    const nextIndex = index + 1 < queue.length ? index + 1 : 0;
    setIndex(nextIndex);
    setPartIndex(0);
    shouldAutoplayRef.current = true;
    setIsPlaying(true);
  }, [index, queue.length, shuffle]);

  const previous = useCallback(() => {
    if (!queue.length) return;
    const audio = audioRef.current;
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      setCurrentTime(0);
      return;
    }
    const prevIndex = index > 0 ? index - 1 : queue.length - 1;
    setIndex(prevIndex);
    setPartIndex(0);
    shouldAutoplayRef.current = true;
    setIsPlaying(true);
  }, [index, queue.length]);

  const seek = useCallback(
    (seconds: number) => {
      const audio = audioRef.current;
      if (!audio || isLive) return;
      const max = Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : duration;
      const value = Math.min(Math.max(0, seconds), max || 0);
      audio.currentTime = value;
      setCurrentTime(value);
    },
    [duration, isLive]
  );

  const skip = useCallback(
    (delta: number) => {
      const audio = audioRef.current;
      if (!audio) return;
      seek(audio.currentTime + delta);
    },
    [seek]
  );

  const handleEnded = useCallback(() => {
    if (!current) return;
    if (safePartIndex + 1 < current.parts.length) {
      setPartIndex(safePartIndex + 1);
      shouldAutoplayRef.current = true;
      return;
    }
    if (repeat === "one") {
      setPartIndex(0);
      if (audioRef.current) audioRef.current.currentTime = 0;
      shouldAutoplayRef.current = true;
      return;
    }
    if (shuffle && queue.length > 1) {
      let nextIndex = index;
      while (nextIndex === index) nextIndex = Math.floor(Math.random() * queue.length);
      setIndex(nextIndex);
      setPartIndex(0);
      shouldAutoplayRef.current = true;
      return;
    }
    if (index + 1 < queue.length) {
      setIndex(index + 1);
      setPartIndex(0);
      shouldAutoplayRef.current = true;
      return;
    }
    if (repeat === "all" && queue.length) {
      setIndex(0);
      setPartIndex(0);
      shouldAutoplayRef.current = true;
      return;
    }
    setIsPlaying(false);
  }, [current, index, queue.length, repeat, safePartIndex, shuffle]);

  const setVolume = useCallback((value: number) => {
    setVolumeState(Math.min(1, Math.max(0, value)));
    if (value > 0) setMuted(false);
  }, []);

  const toggleMute = useCallback(() => setMuted((value) => !value), []);

  const setRate = useCallback((value: number) => {
    setRateState(Math.min(2, Math.max(0.5, value)));
  }, []);

  const cycleRate = useCallback(() => {
    setRateState((value) => {
      const options = [0.75, 1, 1.25, 1.5, 1.75, 2];
      const currentIndex = options.indexOf(value);
      return options[(currentIndex + 1) % options.length];
    });
  }, []);

  const cycleRepeat = useCallback(() => {
    setRepeat((value) => (value === "off" ? "all" : value === "all" ? "one" : "off"));
  }, []);

  const isFavorite = useCallback((id: string) => favorites.includes(id), [favorites]);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((items) => (items.includes(id) ? items.filter((item) => item !== id) : [...items, id]));
  }, []);

  const addToQueue = useCallback((track: Track, playNext = false) => {
    setQueue((items) => {
      if (items.some((item) => item.id === track.id)) return items;
      if (playNext) {
        const nextItems = [...items];
        nextItems.splice(index + 1, 0, track);
        return nextItems;
      }
      return [...items, track];
    });
  }, [index]);

  const removeFromQueue = useCallback(
    (id: string) => {
      setQueue((items) => {
        const removedIndex = items.findIndex((item) => item.id === id);
        if (removedIndex < 0) return items;
        const nextItems = items.filter((item) => item.id !== id);
        if (removedIndex < index) setIndex((value) => Math.max(0, value - 1));
        else if (removedIndex === index && nextItems.length) {
          setIndex(Math.min(index, nextItems.length - 1));
          setPartIndex(0);
        }
        return nextItems;
      });
    },
    [index]
  );

  const clearQueue = useCallback(() => {
    if (!current) return;
    setQueue([current]);
    setIndex(0);
    setPartIndex(0);
  }, [current]);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentTime(0);
  }, []);

  const value = useMemo<PlayerContextValue>(
    () => ({
      queue,
      index,
      current,
      partIndex: safePartIndex,
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
      playTrack,
      playCollection,
      toggle,
      play,
      pause,
      next,
      previous,
      seek,
      skip,
      setVolume,
      toggleMute,
      setRate,
      cycleRate,
      setRepeat,
      cycleRepeat,
      toggleShuffle: () => setShuffle((value) => !value),
      isFavorite,
      toggleFavorite,
      addToQueue,
      removeFromQueue,
      clearQueue,
      setQueueOpen,
      stop,
    }),
    [
      queue,
      index,
      current,
      safePartIndex,
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
      playTrack,
      playCollection,
      toggle,
      play,
      pause,
      next,
      previous,
      seek,
      skip,
      setVolume,
      toggleMute,
      setRate,
      cycleRate,
      cycleRepeat,
      isFavorite,
      toggleFavorite,
      addToQueue,
      removeFromQueue,
      clearQueue,
      stop,
    ]
  );

  return (
    <PlayerContext.Provider value={value}>
      {children}
      <audio
        ref={audioRef}
        preload="metadata"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onWaiting={() => setIsLoading(true)}
        onPlaying={() => {
          setIsPlaying(true);
          setIsLoading(false);
        }}
        onLoadedMetadata={(event) => {
          const audio = event.currentTarget;
          if (current?.isLive) {
            setDuration(0);
            return;
          }
          setDuration(
            Number.isFinite(audio.duration) && audio.duration > 0
              ? audio.duration
              : part?.duration ?? 0
          );
        }}
        onTimeUpdate={(event) => {
          const audio = event.currentTarget;
          setCurrentTime(audio.currentTime);
          if (current?.isLive) return;
          if (Number.isFinite(audio.duration) && audio.duration > 0) {
            setDuration(audio.duration);
          }
        }}
        onEnded={handleEnded}
        onError={() => {
          setIsLoading(false);
          setIsPlaying(false);
          setError("Bu audio yuklanmadi. Boşqa tilovatni sinab köring.");
        }}
      />
    </PlayerContext.Provider>
  );
}

export function usePlayer(): PlayerContextValue {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer must be used inside a PlayerProvider");
  }
  return context;
}
