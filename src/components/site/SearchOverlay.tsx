"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { normalizeSearch, searchIndex, searchReciters, searchSurahs } from "@/lib/search";

const QUICK_SURAHS = [36, 55, 67, 18, 1, 112];

export function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    inputRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  const reciters = useMemo(() => searchReciters(query, 5), [query]);
  const surahs = useMemo(() => searchSurahs(query, 4), [query]);
  const hasQuery = normalizeSearch(query).length > 0;
  const quickSurahs = QUICK_SURAHS.map((number) => searchIndex.surahs.find((s) => s.number === number)!).filter(Boolean);
  const topReciters = searchIndex.reciters.slice(0, 5);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/70 p-3 pt-[6vh] backdrop-blur-md sm:p-6 sm:pt-[10vh]">
      <button type="button" className="absolute inset-0 cursor-default" aria-label="Qidiruvni yopiş" onClick={onClose} />
      <div className="panel fade-in relative z-10 w-full max-w-[680px] overflow-hidden rounded-2xl">
        <form onSubmit={submit} className="flex items-center gap-3 border-b border-line px-4 py-3.5 sm:px-5">
          <Search className="h-5 w-5 flex-none text-gold" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Qorilar, suralar, mamlakatlarni qidiriş…"
            className="min-w-0 flex-1 bg-transparent py-1 text-[15px] text-ink outline-none placeholder:text-muted-2"
            aria-label="Qidiriş"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="rounded-full p-1 text-muted-2 transition-colors hover:text-ink"
              aria-label="Qidiruvni tozalaş"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <kbd className="hidden rounded border border-line px-1.5 py-0.5 text-[10px] text-muted-2 sm:inline">ESC</kbd>
          )}
          <button type="button" onClick={onClose} className="icon-btn h-8 w-8 lg:hidden" aria-label="Qidiruvni yopiş">
            <X className="h-4 w-4" />
          </button>
        </form>

        <div className="max-h-[62vh] overflow-y-auto p-2 sm:p-3">
          {!hasQuery && (
            <div className="space-y-5 p-2">
              <div>
                <p className="eyebrow mb-2.5 text-[10px]">Maşhur suralar</p>
                <div className="flex flex-wrap gap-2">
                  {quickSurahs.map((surah) => (
                    <Link
                      key={surah.slug}
                      href={`/surahs/${surah.slug}`}
                      onClick={onClose}
                      className="pill"
                    >
                      <span className="text-gold">{String(surah.number).padStart(3, "0")}</span>
                      {surah.name}
                    </Link>
                  ))}
                </div>
              </div>
              <div>
                <p className="eyebrow mb-2 text-[10px]">Eng köp tinglangan qorilar</p>
                <div>
                  {topReciters.map((reciter) => (
                    <Link
                      key={reciter.slug}
                      href={`/reciters/${reciter.slug}`}
                      onClick={onClose}
                      className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-white/[0.04]"
                    >
                      <span className="relative h-9 w-9 flex-none overflow-hidden rounded-full border border-line bg-panel-2">
                        {reciter.photo ? (
                          <Image src={reciter.photo} alt="" fill sizes="36px" className="object-cover" />
                        ) : (
                          <Image src="/images/logo-icon.png" alt="" fill sizes="36px" className="object-contain p-1" />
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13px] font-medium">{reciter.name}</span>
                        <span className="block truncate text-[11px] text-muted">{reciter.country}</span>
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 text-muted-2" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          {hasQuery && reciters.length === 0 && surahs.length === 0 && (
            <div className="px-4 py-10 text-center">
              <p className="text-sm font-medium">“{query}” böyiça natija topilmadi</p>
              <p className="mt-1.5 text-[12.5px] text-muted">Qori ismi, sura yoki mamlakatni sinab köring.</p>
            </div>
          )}

          {hasQuery && reciters.length > 0 && (
            <div className="mb-2">
              <p className="eyebrow px-2 pb-1.5 pt-2 text-[10px]">Qorilar</p>
              {reciters.map((reciter) => (
                <Link
                  key={reciter.slug}
                  href={`/reciters/${reciter.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-white/[0.04]"
                >
                  <span className="relative h-10 w-10 flex-none overflow-hidden rounded-full border border-line bg-panel-2">
                    {reciter.photo ? (
                      <Image src={reciter.photo} alt="" fill sizes="40px" className="object-cover" />
                    ) : (
                      <Image src="/images/logo-icon.png" alt="" fill sizes="40px" className="object-contain p-1" />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13.5px] font-medium">{reciter.name}</span>
                    <span className="block truncate text-[11px] text-muted">
                      {reciter.country} · {reciter.tags.join(" · ")}
                    </span>
                  </span>
                  <span className="hidden text-[10px] text-muted-2 sm:inline">{reciter.arabicName}</span>
                </Link>
              ))}
            </div>
          )}

          {hasQuery && surahs.length > 0 && (
            <div>
              <p className="eyebrow px-2 pb-1.5 pt-2 text-[10px]">Suralar</p>
              {surahs.map((surah) => (
                <Link
                  key={surah.slug}
                  href={`/surahs/${surah.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-white/[0.04]"
                >
                  <span className="flex h-9 w-9 flex-none items-center justify-center rounded-lg border border-gold/25 bg-gold/[0.06] text-[11px] font-semibold text-gold">
                    {String(surah.number).padStart(3, "0")}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13.5px] font-medium">
                      {surah.name} <span className="text-muted-2">· {surah.englishName}</span>
                    </span>
                    <span className="block text-[11px] text-muted">
                      {surah.verses} oyat · {surah.revelation}
                    </span>
                  </span>
                  <span className="font-arabic text-lg text-gold/80">{surah.arabicName}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-line bg-black/10 px-4 py-2.5 text-[11px] text-muted-2">
          <span>150 qori va barça 114 sura böylab qidiriş</span>
          {hasQuery && (
            <button
              type="button"
              onClick={submit}
              className="inline-flex items-center gap-1.5 font-semibold text-gold transition-colors hover:text-gold-bright"
            >
              Barça natijalar <ArrowRight className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
