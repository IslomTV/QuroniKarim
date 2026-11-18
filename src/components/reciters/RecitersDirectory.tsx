"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronDown, Search, SlidersHorizontal, X } from "lucide-react";
import { ReciterGridCard } from "@/components/cards/ReciterCards";
import type { ReciterCardData } from "@/lib/content";
import { normalizeSearch } from "@/lib/search";

const TAG_OPTIONS = [
  { key: "all", label: "Barçasi" },
  { key: "listening", label: "Hozir tinglamoqda" },
  { key: "popular", label: "Maşhur" },
  { key: "complete", label: "Töliq muşaf" },
  { key: "top", label: "Eng yaxşi qorilar" },
  { key: "khashia", label: "Taʼsirli tilovatlar" },
  { key: "legacy", label: "Meros qorilar" },
  { key: "haram", label: "Haramayn tilovatlari" },
  { key: "imam-haram", label: "Haram imomlari" },
  { key: "ramadan", label: "Ramazon tilovatlari" },
  { key: "rare", label: "Noyob tilovatlar" },
];

const SORTS = [
  { key: "listens", label: "Eng köp tinglangan" },
  { key: "az", label: "Alifbo böyiça" },
  { key: "recitations", label: "Tilovatlar soni" },
  { key: "newest", label: "Eng yangi" },
  { key: "complete", label: "Avval töliq muşafarlar" },
];

const STYLE_OPTIONS = [
  { key: "murattal", label: "Murattal" },
  { key: "mujawwad", label: "Mujavvad" },
  { key: "hadr", label: "Hadr" },
  { key: "moaallam", label: "Muallam" },
  { key: "newkhatma", label: "Yangi xatma" },
  { key: "translation", label: "Tarjima bilan" },
];

export function RecitersDirectory({
  cards,
  countries,
  qiraat,
}: {
  cards: ReciterCardData[];
  countries: { code: string; name: string; count: number }[];
  qiraat: { slug: string; name: string }[];
}) {
  const params = useSearchParams();
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("all");
  const [country, setCountry] = useState("all");
  const [qiraa, setQiraa] = useState("all");
  const [style, setStyle] = useState("all");
  const [sort, setSort] = useState("listens");
  const [limit, setLimit] = useState(24);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setTag(params.get("tag") ?? "all");
    setQiraa(params.get("qiraa") ?? "all");
    setStyle(params.get("style") ?? "all");
    setQuery(params.get("q") ?? "");
  }, [params]);

  useEffect(() => {
    setLimit(24);
  }, [query, tag, country, qiraa, style, sort]);

  const filtered = useMemo(() => {
    const normalized = normalizeSearch(query);
    const list = cards.filter((reciter) => {
      if (normalized) {
        const haystack = normalizeSearch(
          `${reciter.name} ${reciter.arabicName} ${reciter.country} ${reciter.tags.join(" ")}`
        );
        if (!haystack.includes(normalized)) return false;
      }
      if (country !== "all" && reciter.countryCode !== country) return false;
      if (qiraa !== "all" && !reciter.qiraaSlugs.includes(qiraa)) return false;
      if (style === "translation" && !reciter.hasTranslation) return false;
      if (style !== "all" && style !== "translation" && !reciter.styles.includes(style)) return false;
      if (tag === "listening" && reciter.listenersNow <= 0) return false;
      if (tag === "popular" && !reciter.isTopReciter) return false;
      if (tag === "complete" && !reciter.hasCompleteQuran) return false;
      if (tag === "top" && !reciter.isTopReciter) return false;
      if (!["all", "listening", "popular", "complete", "top"].includes(tag) && !reciter.tagKeys.includes(tag)) {
        return false;
      }
      return true;
    });

    return list.sort((a, b) => {
      if (sort === "az") return a.name.localeCompare(b.name);
      if (sort === "recitations") return b.totalRecitations - a.totalRecitations || b.totalListens - a.totalListens;
      if (sort === "newest") return b.totalViewers - a.totalViewers;
      if (sort === "complete") return Number(b.hasCompleteQuran) - Number(a.hasCompleteQuran) || b.totalListens - a.totalListens;
      return b.totalListens - a.totalListens;
    });
  }, [cards, query, country, qiraa, style, tag, sort]);

  const activeTagLabel = TAG_OPTIONS.find((item) => item.key === tag)?.label;
  const hasExtraFilter = country !== "all" || qiraa !== "all" || style !== "all";

  return (
    <div>
      <div className="mt-6 rounded-xl border border-line bg-black/10 p-3">
        <div className="flex flex-col gap-2 lg:flex-row">
          <label className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-2" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="input py-2.5 pl-10 text-[13px]"
              placeholder="Ism yoki mamlakat böyiça qidiriş (masalan, Husariy, Minşoviy)…"
              aria-label="Qorilarni qidiriş"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-2 hover:text-ink"
                aria-label="Qidiruvni tozalaş"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </label>
          <div className="flex gap-2">
            <select value={sort} onChange={(event) => setSort(event.target.value)} className="select flex-1 py-2.5 lg:w-[160px]" aria-label="Qorilarni tartiblaş">
              {SORTS.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}
            </select>
            <select value={country} onChange={(event) => setCountry(event.target.value)} className="select flex-1 py-2.5 lg:w-[155px]" aria-label="Mamlakat böyiça filtrlaş">
              <option value="all">Barça mamlakatlar</option>
              {countries.map((item) => (
                <option key={item.code} value={item.code}>{item.name} ({item.count})</option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setShowFilters((value) => !value)}
              className={`pill px-3 ${showFilters ? "text-gold" : ""}`}
              aria-expanded={showFilters}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" /> Filtrlar
              <ChevronDown className={`h-3 w-3 transition-transform ${showFilters ? "rotate-180" : ""}`} />
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="mt-3 grid gap-2 border-t border-line pt-3 sm:grid-cols-2">
            <select value={qiraa} onChange={(event) => setQiraa(event.target.value)} className="select py-2.5" aria-label="Qiroat böyiça filtrlaş">
              <option value="all">Barça qiroatlar</option>
              {qiraat.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
            </select>
            <select value={style} onChange={(event) => setStyle(event.target.value)} className="select py-2.5" aria-label="Uslub böyiça filtrlaş">
              <option value="all">Barça tilovat uslublari</option>
              {STYLE_OPTIONS.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}
            </select>
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {TAG_OPTIONS.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setTag(item.key)}
            className="pill py-2 text-[11.5px]"
            data-active={tag === item.key}
          >
            {item.key === "popular" && <span className="text-[10px]">✦</span>}
            {item.label}
          </button>
        ))}
      </div>

      {hasExtraFilter && (
        <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-muted">
          <span>Filtrlangan:</span>
          {qiraa !== "all" && (
            <button type="button" onClick={() => setQiraa("all")} className="tag tag-gold">
              {qiraat.find((item) => item.slug === qiraa)?.name} <X className="h-2.5 w-2.5" />
            </button>
          )}
          {style !== "all" && (
            <button type="button" onClick={() => setStyle("all")} className="tag tag-gold">
              {STYLE_OPTIONS.find((item) => item.key === style)?.label} <X className="h-2.5 w-2.5" />
            </button>
          )}
          {country !== "all" && (
            <button type="button" onClick={() => setCountry("all")} className="tag tag-gold">
              {countries.find((item) => item.code === country)?.name} <X className="h-2.5 w-2.5" />
            </button>
          )}
        </div>
      )}

      <div className="mt-5 flex items-center justify-between text-[11px] text-muted-2">
        <p>
          <span className="font-semibold text-ink">{Math.min(limit, filtered.length)}</span> /{" "}
          <span className="font-semibold text-ink">{filtered.length}</span> qori körsatilmoqda
          {tag !== "all" && activeTagLabel ? ` · ${activeTagLabel}` : ""}
        </p>
        <Link href="/reciters" className="text-green-bright hover:text-gold">Tozalaş</Link>
      </div>

      {filtered.length === 0 ? (
        <div className="panel mt-4 px-6 py-14 text-center">
          <p className="display text-xl">Bu filtrlarga mos qori topilmadi</p>
          <p className="mt-2 text-[12.5px] text-muted">Boşqa ism, mamlakat yoki qiroatni sinab köring.</p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setTag("all");
              setCountry("all");
              setQiraa("all");
              setStyle("all");
            }}
            className="btn btn-outline btn-sm mt-4"
          >
            Filtrlarni tozalaş
          </button>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.slice(0, limit).map((reciter) => (
            <ReciterGridCard key={reciter.slug} reciter={reciter} />
          ))}
        </div>
      )}

      {limit < filtered.length && (
        <div className="mt-6 flex justify-center">
          <button type="button" onClick={() => setLimit((value) => value + 24)} className="btn btn-outline">
            Köproq qori yuklaş
            <span className="text-muted-2">({filtered.length - limit} ta qoldi)</span>
          </button>
        </div>
      )}
    </div>
  );
}
