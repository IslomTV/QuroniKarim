"use client";

import Link from "next/link";
import { ArrowRight, Copy, Check, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import type { DailyVerse } from "@/lib/types";

export function DailyVerseCard({ verses }: { verses: DailyVerse[] }) {
  const [index, setIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const start = new Date(new Date().getFullYear(), 0, 0);
    const day = Math.floor((Date.now() - start.getTime()) / 86_400_000);
    setIndex(day % verses.length);
  }, [verses.length]);

  const verse = verses[index] ?? verses[0];
  if (!verse) return null;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(
        `${verse.verses.map((item) => item.english).join(" ")}\n— Qurʼon, ${verse.surah.name} surasi, ${verse.ayah}-oyat`
      );
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <article className="panel flex h-full flex-col p-5 sm:p-7">
      <div className="flex items-center justify-between gap-3">
        <p className="inline-flex items-center gap-2 font-display text-lg text-gold-bright">
          <span className="text-gold/60">﴿</span> Kunning oyati <span className="text-gold/60">﴾</span>
        </p>
        <span className="inline-flex items-center gap-1 rounded-full border border-gold/25 bg-gold/[0.06] px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-gold">
          <Sparkles className="h-2.5 w-2.5" /> Har kuni
        </span>
      </div>

      <div className="mt-6 flex-1 space-y-5">
        {verse.verses.map((item, verseIndex) => (
          <div key={verseIndex}>
            <p className="quran-text text-ink" dir="rtl">
              {item.arabic}
            </p>
            <p className="mt-2 border-l border-gold/25 pl-3 text-[12.5px] italic leading-relaxed text-muted">
              {item.english}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between gap-3 border-t border-line pt-4">
        <Link
          href={`/surahs/${verse.surah.slug}`}
          className="inline-flex items-center gap-2 text-[12px] font-medium text-green-bright transition-colors hover:text-gold"
        >
          {verse.surah.name} — {verse.ayah}-oyat
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
        <button type="button" onClick={copy} className="icon-btn h-8 w-8" aria-label="Oyatni nusxalaş">
          {copied ? <Check className="h-4 w-4 text-green-bright" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>
    </article>
  );
}
