"use client";

import { Check, Copy, Languages, Minus, Plus, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { PlayButton } from "@/components/player/PlayButton";
import type { Surah, Track } from "@/lib/types";

type Verse = { number: number; arabic: string; english: string };

const SIZE_KEY = "w2q-reader-size";
const TRANSLATION_KEY = "w2q-reader-translation";

export function SurahReader({
  surah,
  verses,
  track,
  queue,
}: {
  surah: Surah;
  verses: Verse[];
  track: Track | null;
  queue?: Track[];
}) {
  const [fontSize, setFontSize] = useState(30);
  const [showTranslation, setShowTranslation] = useState(true);
  const [copied, setCopied] = useState<number | "all" | null>(null);

  useEffect(() => {
    try {
      const storedSize = Number(window.localStorage.getItem(SIZE_KEY));
      if (Number.isFinite(storedSize) && storedSize >= 22 && storedSize <= 48) setFontSize(storedSize);
      const storedTranslation = window.localStorage.getItem(TRANSLATION_KEY);
      if (storedTranslation === "0") setShowTranslation(false);
    } catch {
      // Reader preferences are a progressive enhancement.
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(SIZE_KEY, String(fontSize));
      window.localStorage.setItem(TRANSLATION_KEY, showTranslation ? "1" : "0");
    } catch {
      // Ignore storage failures.
    }
  }, [fontSize, showTranslation]);

  const fullText = useMemo(
    () =>
      `${surah.name} (${surah.arabicName}) — ${verses.length} oyat\n\n${verses
        .map((verse) => `${verse.arabic}\n${verse.english}\n(${surah.number}:${verse.number})`)
        .join("\n\n")}`,
    [surah, verses]
  );

  const copy = async (value: string, key: number | "all") => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      window.setTimeout(() => setCopied(null), 1600);
    } catch {
      setCopied(null);
    }
  };

  return (
    <section id="reader" className="pt-12">
      <div className="mb-4">
        <p className="eyebrow">Öqing va öylang</p>
        <h2 className="display mt-2 text-[clamp(1.7rem,2.6vw,2.35rem)]">
          {surah.name} surasini öqiş
        </h2>
        <p className="mt-2 max-w-[720px] text-[12.5px] leading-relaxed text-muted">
          Usmoniy xatda, Sahih International tarjimasi bilan. Arabça şrift ölçamini sozlang, tarjimani yaşiring
          yoki istalgan oyatni nusxalab ulaşing.
        </p>
      </div>

      <div className="panel overflow-hidden">
        <div className="sticky top-[66px] z-30 flex flex-wrap items-center gap-2 border-b border-line/70 bg-[color:var(--panel)]/95 px-3 py-2.5 backdrop-blur-xl sm:px-5">
          <PlayButton
            track={track}
            queue={queue}
            label={`Tinglash: ${surah.name}`}
            size="sm"
            className="btn-gold"
            ariaLabel={`Tinglash: ${surah.name}`}
          />

          <span className="mx-1 hidden h-5 w-px bg-line sm:block" />

          <button
            type="button"
            onClick={() => setShowTranslation((value) => !value)}
            className="btn btn-ghost btn-sm px-3"
            data-active={showTranslation}
            aria-pressed={showTranslation}
            title={showTranslation ? "Tarjimani yaşiriş" : "Tarjimani körsatiş"}
          >
            <Languages className="h-4 w-4" />
            <span className="hidden sm:inline">{showTranslation ? "Tarjima yoqilgan" : "Tarjima öçirilgan"}</span>
          </button>

          <div className="flex items-center gap-0.5 rounded-full border border-line bg-panel/60 p-0.5">
            <button
              type="button"
              onClick={() => setFontSize((value) => Math.max(22, value - 2))}
              disabled={fontSize <= 22}
              className="flex h-7 w-7 items-center justify-center rounded-full text-muted transition-colors hover:text-ink disabled:opacity-30"
              aria-label="Arabça matn ölçamini kiçraytiriş"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="min-w-[34px] text-center text-[10px] tabular-nums text-muted-2">{fontSize}px</span>
            <button
              type="button"
              onClick={() => setFontSize((value) => Math.min(48, value + 2))}
              disabled={fontSize >= 48}
              className="flex h-7 w-7 items-center justify-center rounded-full text-muted transition-colors hover:text-ink disabled:opacity-30"
              aria-label="Arabça matn ölçamini kattalaştiriş"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setFontSize(30)}
            className="icon-btn hidden h-8 w-8 sm:inline-flex"
            aria-label="Matn ölçamini tiklaş"
            title="Matn ölçamini tiklaş"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={() => void copy(fullText, "all")}
            className="btn btn-ghost btn-sm ml-auto px-3"
            aria-label="Töliq surani nusxalaş"
          >
            {copied === "all" ? <Check className="h-4 w-4 text-green-bright" /> : <Copy className="h-4 w-4" />}
            <span className="hidden sm:inline">{copied === "all" ? "Nusxalandi" : "Surani nusxalaş"}</span>
          </button>
        </div>

        <div className="mx-auto max-w-[900px] px-4 py-8 sm:px-8 sm:py-10">
          {surah.bismillah && (
            <p className="mb-8 text-center font-arabic text-[clamp(1.35rem,2.4vw,1.8rem)] leading-loose text-gold/85" dir="rtl">
              بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
            </p>
          )}

          <div>
            {verses.map((verse) => (
              <article
                key={verse.number}
                className="group border-b border-line/40 py-6 first:pt-1 last:border-0 last:pb-2"
              >
                <div className="flex items-start gap-3">
                  <span className="mt-2 flex h-6 min-w-6 flex-none items-center justify-center rounded-full border border-gold/30 bg-gold/[0.06] px-1 text-[9px] font-semibold tabular-nums text-gold">
                    {verse.number}
                  </span>
                  <p
                    className="min-w-0 flex-1 text-right font-arabic text-ink"
                    dir="rtl"
                    style={{ fontSize, lineHeight: 2.1 }}
                  >
                    {verse.arabic}
                  </p>
                </div>

                {showTranslation && (
                  <p className="mt-3 border-l-2 border-gold/20 pl-3 text-[12.5px] leading-relaxed text-muted">
                    {verse.english}
                  </p>
                )}

                <div className="mt-2 flex items-center justify-between gap-2">
                  <span className="text-[9px] tabular-nums text-muted-2/70">
                    {surah.name} · {surah.number}:{verse.number}
                  </span>
                  <button
                    type="button"
                    onClick={() => void copy(`${verse.arabic}\n${verse.english}\n(${surah.name} ${surah.number}:${verse.number})`, verse.number)}
                    className="icon-btn h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
                    aria-label={`${verse.number}-oyatni nusxalash`}
                    title="Oyatni nusxalaş"
                  >
                    {copied === verse.number ? <Check className="h-3.5 w-3.5 text-green-bright" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 flex flex-col items-center justify-between gap-3 rounded-xl border border-line/70 bg-white/[0.02] px-4 py-4 sm:flex-row">
            <div>
              <p className="text-[12px] font-medium text-ink">{surah.name} bilan davom eting</p>
              <p className="mt-0.5 text-[10.5px] text-muted-2">
                {verses.length} oyat · {surah.juz}-juz · {surah.revelation}
              </p>
            </div>
            <PlayButton
              track={track}
              queue={queue}
              label="Bu surani tinglaş"
              variant="outline"
              size="sm"
              ariaLabel={`Tinglash: ${surah.name}`}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
