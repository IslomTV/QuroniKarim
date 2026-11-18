"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { SurahCard } from "@/components/cards/SurahCard";
import type { Surah, Track } from "@/lib/types";

export type SurahDirectoryItem = {
  surah: Surah;
  track: Track | null;
};

type SortKey = "number" | "verses" | "name";

const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\u064B-\u0652\u0670\u06D6-\u06ED]/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/[ىي]/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/[’'`-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export function SurahsDirectory({ items }: { items: SurahDirectoryItem[] }) {
  const [query, setQuery] = useState("");
  const [juz, setJuz] = useState("all");
  const [revelation, setRevelation] = useState("all");
  const [sort, setSort] = useState<SortKey>("number");

  const filtered = useMemo(() => {
    const q = normalize(query);
    const found = items.filter(({ surah }) => {
      if (juz !== "all" && String(surah.juz) !== juz) return false;
      if (revelation !== "all" && surah.revelationPlace !== revelation) return false;
      if (!q) return true;
      const haystack = normalize(
        `${surah.name} ${surah.englishName} ${surah.arabicName} ${surah.number} ${surah.slug}`
      );
      return haystack.includes(q);
    });
    return found.sort((a, b) => {
      if (sort === "verses") return b.surah.verses - a.surah.verses;
      if (sort === "name") return a.surah.name.localeCompare(b.surah.name);
      return a.surah.number - b.surah.number;
    });
  }, [items, query, juz, revelation, sort]);

  const active = query || juz !== "all" || revelation !== "all" || sort !== "number";

  return (
    <section id="directory" className="pt-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow">Töliq muşaf</p>
          <h2 className="display mt-2 text-[clamp(1.6rem,2.5vw,2.2rem)]">Barça 114 surani körib çiqing</h2>
          <p className="mt-1.5 text-[12.5px] text-muted">
            Nomi yoki raqami böyiça qidiring, yoki röyxatni juz va nozil joyi böyiça toraytiring.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[220px] flex-1 md:flex-none">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-2" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Sura, raqam yoki maʼno böyiça qidiriş…"
              aria-label="Suralarni qidiriş"
              className="input py-2.5 pl-9 pr-3 text-[12px]"
            />
          </div>
          <label className="flex items-center gap-1.5 rounded-full border border-line bg-panel/60 px-3 py-2 text-[11px] text-muted">
            <SlidersHorizontal className="h-3.5 w-3.5 text-muted-2" />
            <select
              value={juz}
              onChange={(event) => setJuz(event.target.value)}
              aria-label="Juz böyiça filtrlaş"
              className="bg-transparent text-[11px] text-ink outline-none"
            >
              <option value="all">Barça juzlar</option>
              {Array.from({ length: 30 }, (_, index) => (
                <option key={index + 1} value={String(index + 1)}>
                  {index + 1}-juz
                </option>
              ))}
            </select>
          </label>
          <select
            value={revelation}
            onChange={(event) => setRevelation(event.target.value)}
            aria-label="Nozil joyi böyiça filtrlaş"
            className="rounded-full border border-line bg-panel/60 px-3 py-2 text-[11px] text-muted outline-none"
          >
            <option value="all">Makkiy va Madaniy</option>
            <option value="makkah">Makkiy</option>
            <option value="madinah">Madaniy</option>
          </select>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as SortKey)}
            aria-label="Suralarni tartiblaş"
            className="rounded-full border border-line bg-panel/60 px-3 py-2 text-[11px] text-muted outline-none"
          >
            <option value="number">Muşaf tartibi</option>
            <option value="verses">Oyatlar soni böyiça</option>
            <option value="name">Alifbo böyiça</option>
          </select>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-y border-line/60 py-2.5">
        <p className="text-[10.5px] text-muted-2">
          <span className="font-semibold text-ink">{filtered.length}</span> / {items.length} sura körsatilmoqda
        </p>
        {active && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setJuz("all");
              setRevelation("all");
              setSort("number");
            }}
            className="text-[10.5px] font-medium text-green-bright hover:text-gold"
          >
            Filtrlarni tozalaş
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="panel mt-4 px-6 py-14 text-center">
          <p className="display text-xl">Bu qidiruvga mos sura topilmadi</p>
          <p className="mt-2 text-[12.5px] text-muted">Boşqa imlo, maʼno yoki sura raqamini sinab köring.</p>
        </div>
      ) : (
        <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map(({ surah, track }) => (
            <SurahCard key={surah.number} surah={surah} track={track} queue={track ? [track] : undefined} />
          ))}
        </div>
      )}
    </section>
  );
}
