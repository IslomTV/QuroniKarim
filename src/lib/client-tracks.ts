import { SITE, STYLE_LABELS } from "@/lib/constants";
import type { Recitation, Reciter, Surah, Track } from "@/lib/types";

export function clientMediaUrl(path: string): string {
  return SITE.mediaBase + path;
}

export function clientRecitationLabel(rec: Recitation): string {
  if (rec.translation) {
    return (
      rec.translation.languageName ||
      rec.translation.language ||
      STYLE_LABELS["mushaf-with-translation"] ||
      rec.name
    );
  }
  return rec.style ? STYLE_LABELS[rec.style] || rec.style : rec.name;
}

export function clientRecitationLongLabel(rec: Recitation): string {
  if (rec.translation) {
    const language = rec.translation.languageName || rec.translation.language;
    const voice = rec.translation.voice ? ` — ${rec.translation.voice}` : "";
    return `${rec.name} · Tarjima · ${language}${voice}`;
  }
  return `${rec.name} · ${clientRecitationLabel(rec)}`;
}

export function clientBuildTrack(
  reciter: Reciter,
  recitationIndex: number,
  surahNumber: number,
  surahs: Surah[]
): Track | null {
  const rec = reciter.recitations[recitationIndex];
  const surah = surahs.find((item) => item.number === surahNumber);
  if (!rec || !surah) return null;
  const raw = rec.audio[String(surahNumber)];
  if (!raw?.length) return null;
  return {
    id: `${reciter.slug}:${recitationIndex}:${surahNumber}`,
    title: surah.name,
    titleArabic: surah.arabicName,
    subtitle: `${reciter.name} · ${clientRecitationLabel(rec)}`,
    reciterName: reciter.name,
    reciterSlug: reciter.slug,
    surahSlug: surah.slug,
    surahNumber,
    art: reciter.photo,
    parts: raw.map(([path, duration]) => ({ url: clientMediaUrl(path), duration })),
    downloadUrl: raw[0] ? clientMediaUrl(raw[0][0]) : undefined,
  };
}

export function clientBuildQueue(
  reciter: Reciter,
  recitationIndex: number,
  surahs: Surah[],
  surahNumbers?: number[]
): Track[] {
  const rec = reciter.recitations[recitationIndex];
  if (!rec) return [];
  const numbers = surahNumbers ?? Object.keys(rec.audio).map(Number);
  return numbers
    .sort((a, b) => a - b)
    .map((n) => clientBuildTrack(reciter, recitationIndex, n, surahs))
    .filter((t): t is Track => Boolean(t));
}
