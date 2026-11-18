import quranJson from "@/data/quran.json";

export type Verse = {
  number: number;
  arabic: string;
  english: string;
};

const quran = quranJson as unknown as Record<string, [string, string][]>;

export function getVerses(surahNumber: number): Verse[] {
  const verses = quran[String(surahNumber)] ?? [];
  return verses.map(([arabic, english], index) => ({
    number: index + 1,
    arabic,
    english,
  }));
}

export function getVerseCount(surahNumber: number): number {
  return quran[String(surahNumber)]?.length ?? 0;
}
