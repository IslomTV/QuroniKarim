import searchIndexJson from "@/data/search-index.json";
import type { SearchIndex, SearchReciter, SearchSurah } from "@/lib/types";

export const searchIndex = searchIndexJson as SearchIndex;

// The site data uses one transliteration per reciter (for example
// "Al Hosary"), while listeners commonly type another ("Husary"). Map the
// frequent variants onto the spelling used by the index.
const TRANSLITERATION_ALIASES: Record<string, string> = {
  husary: "hosary",
  hussary: "hosary",
  husari: "hosary",
  hossary: "hosary",
  minshawy: "minshawi",
  menshawi: "minshawi",
  sudays: "sudais",
  sudaes: "sudais",
  maqly: "muaiqly",
  shuraym: "shuraim",
  shurayem: "shuraim",
  bana: "banna",
  tablawe: "tablawi",
  ghamdy: "ghamdi",
};

export function normalizeSearch(value: string): string {
  return value
    .toLowerCase()
    // The site now writes Uzbek with ö/ğ/ş/ç. Fold the new letters back to the
    // digraph spellings listeners still type, before NFKD strips the marks.
    .replace(/ş/g, "sh")
    .replace(/ç/g, "ch")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\u064B-\u0652\u0670\u06D6-\u06ED]/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/[ىي]/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/[’'`ʻʼ‘-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .map((word) => TRANSLITERATION_ALIASES[word] ?? word)
    .join(" ");
}

function score(value: string, query: string): number {
  const normalized = normalizeSearch(value);
  if (!normalized) return 0;
  if (normalized === query) return 100;
  if (normalized.startsWith(query)) return 80;
  if (normalized.includes(` ${query}`)) return 60;
  if (normalized.includes(query)) return 40;
  const compact = normalized.replace(/ /g, "");
  const compactQuery = query.replace(/ /g, "");
  if (compactQuery.length >= 4 && compact.includes(compactQuery)) return 35;
  return 0;
}

export function searchReciters(query: string, limit = 8): SearchReciter[] {
  const normalized = normalizeSearch(query);
  if (!normalized) return [];
  return searchIndex.reciters
    .map((reciter) => {
      const arabic = score(reciter.arabicName, normalized);
      const country = score(reciter.country, normalized);
      const best = Math.max(
        score(reciter.name, normalized),
        arabic > 0 ? arabic + 2 : 0,
        country > 0 ? country - 10 : 0,
        ...reciter.tags.map((tag) => {
          const value = score(tag, normalized);
          return value > 0 ? value - 5 : 0;
        })
      );
      return { reciter, best };
    })
    .filter((item) => item.best > 0)
    .sort((a, b) => b.best - a.best || b.reciter.totalListens - a.reciter.totalListens)
    .slice(0, limit)
    .map((item) => item.reciter);
}

export function searchSurahs(query: string, limit = 8): SearchSurah[] {
  const normalized = normalizeSearch(query);
  if (!normalized) return [];
  return searchIndex.surahs
    .map((surah) => {
      const name = score(surah.name, normalized);
      const english = score(surah.englishName, normalized);
      const arabic = score(surah.arabicName, normalized);
      const number = score(String(surah.number), normalized);
      const best = Math.max(
        name > 0 ? name + 3 : 0,
        english > 0 ? english + 2 : 0,
        arabic,
        number > 0 ? number - 10 : 0
      );
      return { surah, best };
    })
    .filter((item) => item.best > 0)
    .sort((a, b) => b.best - a.best || a.surah.number - b.surah.number)
    .slice(0, limit)
    .map((item) => item.surah);
}
