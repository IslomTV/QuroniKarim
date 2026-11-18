import recitersJson from "@/data/reciters.json";
import surahsJson from "@/data/surahs.json";
import playlistsJson from "@/data/playlists.json";
import mixedJson from "@/data/mixed-mushafs.json";
import radiosJson from "@/data/radios.json";
import versesJson from "@/data/daily-verses.json";
import statsJson from "@/data/stats.json";
import { SITE, STYLE_LABELS } from "@/lib/constants";
import type {
  CuratedPlaylist,
  DailyVerse,
  MixedMushaf,
  RadioStation,
  Recitation,
  Reciter,
  Stats,
  Surah,
  Track,
} from "@/lib/types";

export const surahs = surahsJson as Surah[];
export const reciters = recitersJson as unknown as Reciter[];
export const curatedPlaylists = playlistsJson as CuratedPlaylist[];
export const mixedMushafs = mixedJson as MixedMushaf[];
export const radios = radiosJson as RadioStation[];
export const dailyVerses = versesJson as DailyVerse[];
export const stats = statsJson as Stats;

const reciterBySlug = new Map(reciters.map((r) => [r.slug, r]));
const surahBySlug = new Map(surahs.map((s) => [s.slug, s]));
const surahByNumber = new Map(surahs.map((s) => [s.number, s]));

export function getReciter(slug: string): Reciter | undefined {
  return reciterBySlug.get(slug);
}

export function getSurah(slug: string): Surah | undefined {
  return surahBySlug.get(slug);
}

export function getSurahByNumber(number: number): Surah | undefined {
  return surahByNumber.get(number);
}

export function getReciters(): Reciter[] {
  return reciters;
}

export function getSurahs(): Surah[] {
  return surahs;
}

export function getStats(): Stats {
  return stats;
}

export function getDailyVerse(day = new Date()): DailyVerse {
  const start = new Date(day.getFullYear(), 0, 0);
  const diff = Math.floor((day.getTime() - start.getTime()) / 86_400_000);
  return dailyVerses[diff % dailyVerses.length];
}

export function mediaUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) {
    const remote = "https://media.way2quran.com/";
    return path.startsWith(remote) ? SITE.mediaBase + path.slice(remote.length) : path;
  }
  return SITE.mediaBase + path;
}

export function recitationStyleLabel(rec: Recitation): string {
  if (rec.translation) {
    return `${rec.name} · Tarjimali mushaf · ${rec.translation.languageName || rec.translation.language}${
      rec.translation.voice ? ` — ${rec.translation.voice}` : ""
    }`;
  }
  const style = rec.style ? STYLE_LABELS[rec.style] || rec.style : null;
  return style ? `${rec.name} · ${style}` : rec.name;
}

export function recitationShortLabel(rec: Recitation): string {
  if (rec.translation) return rec.translation.languageName || rec.translation.language;
  return rec.style ? STYLE_LABELS[rec.style] || rec.style : rec.name;
}

export function primaryRecitationIndex(reciter: Reciter): number {
  const scored = reciter.recitations.map((rec, index) => {
    let score = 0;
    if (rec.translation) score -= 50;
    if (rec.completed) score += 6;
    if (Object.keys(rec.audio).length === 114) score += 8;
    if (rec.style === "murattal" || rec.style === null) score += 4;
    if (rec.slug === "hafs-an-asim") score += 3;
    if (rec.slug === "warsh-an-nafi") score -= 1;
    return { index, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored[0]?.index ?? 0;
}

export function buildTrack(
  reciter: Reciter,
  recitationIndex: number,
  surahNumber: number,
  options: { art?: string | null; subtitlePrefix?: string } = {}
): Track | null {
  const rec = reciter.recitations[recitationIndex];
  const surah = surahByNumber.get(surahNumber);
  if (!rec || !surah) return null;
  const raw = rec.audio[String(surahNumber)];
  if (!raw?.length) return null;
  const parts = raw.map(([path, duration]) => ({ url: mediaUrl(path), duration }));
  const subtitle = [`${reciter.name}`, recitationShortLabel(rec)].filter(Boolean).join(" · ");
  return {
    id: `${reciter.slug}:${recitationIndex}:${surahNumber}`,
    title: surah.name,
    titleArabic: surah.arabicName,
    subtitle: options.subtitlePrefix || subtitle,
    reciterName: reciter.name,
    reciterSlug: reciter.slug,
    surahSlug: surah.slug,
    surahNumber,
    art: options.art ?? reciter.photo,
    parts,
    downloadUrl: parts[0]?.url,
  };
}

export function buildSurahQueue(
  reciter: Reciter,
  recitationIndex: number,
  onlySurahs?: number[]
): Track[] {
  const rec = reciter.recitations[recitationIndex];
  if (!rec) return [];
  const numbers = onlySurahs ?? Object.keys(rec.audio).map(Number);
  return numbers
    .sort((a, b) => a - b)
    .map((n) => buildTrack(reciter, recitationIndex, n))
    .filter((t): t is Track => Boolean(t));
}

export function getDefaultTrack(): Track | null {
  const basit = reciterBySlug.get("abdul-basit-abdul-samad") || reciters[0];
  const index = primaryRecitationIndex(basit);
  return buildTrack(basit, index, 1);
}

export type ReciterCardData = {
  slug: string;
  name: string;
  arabicName: string;
  photo: string | null;
  country: string;
  countryCode: string;
  tags: string[];
  totalListens: number;
  totalViewers: number;
  totalRecitations: number;
  qiraatCount: number;
  surahCount: number;
  hasCompleteQuran: boolean;
  isTopReciter: boolean;
  listenersNow: number;
  tagKeys: string[];
  qiraaSlugs: string[];
  styles: string[];
  hasTranslation: boolean;
};

export function toCardData(reciter: Reciter): ReciterCardData {
  return {
    slug: reciter.slug,
    name: reciter.name,
    arabicName: reciter.arabicName,
    photo: reciter.photo,
    country: reciter.country,
    countryCode: reciter.countryCode,
    tags: reciter.tags,
    totalListens: reciter.totalListens,
    totalViewers: reciter.totalViewers,
    totalRecitations: reciter.totalRecitations,
    qiraatCount: reciter.qiraatCount,
    surahCount: reciter.surahCount,
    hasCompleteQuran: reciter.hasCompleteQuran,
    isTopReciter: reciter.isTopReciter,
    listenersNow: reciter.listenersNow,
    tagKeys: reciter.tagKeys,
    qiraaSlugs: [...new Set(reciter.recitations.map((rec) => rec.slug))],
    styles: [...new Set(reciter.recitations.map((rec) => rec.style).filter((style): style is string => Boolean(style)))],
    hasTranslation: reciter.recitations.some((rec) => Boolean(rec.translation)),
  };
}

export function getReciterCards(): ReciterCardData[] {
  return reciters.map(toCardData);
}

export type SurahListens = {
  surah: Surah;
  reciter: Reciter;
  recitationIndex: number;
  duration: number;
  track: Track;
};

export function getMostListenedForSurah(surahNumber: number, limit = 10): SurahListens[] {
  const out: SurahListens[] = [];
  for (const reciter of reciters.slice(0, 60)) {
    const index = primaryRecitationIndex(reciter);
    const track = buildTrack(reciter, index, surahNumber);
    if (track) {
      out.push({
        surah: surahByNumber.get(surahNumber)!,
        reciter,
        recitationIndex: index,
        duration: track.parts.reduce((a, p) => a + (p.duration || 0), 0),
        track,
      });
    }
    if (out.length >= limit) break;
  }
  return out;
}

export type SurahRecitationOption = {
  reciter: ReciterCardData;
  recitationIndex: number;
  label: string;
  qiraa: string;
  qiraaSlug: string;
  styleLabel: string | null;
  style: string | null;
  isTranslation: boolean;
  duration: number;
  track: Track;
};

export function getAllRecitationsForSurah(surahNumber: number): SurahRecitationOption[] {
  const out: SurahRecitationOption[] = [];
  for (const reciter of reciters) {
    reciter.recitations.forEach((rec, index) => {
      const track = buildTrack(reciter, index, surahNumber);
      if (!track) return;
      out.push({
        reciter: toCardData(reciter),
        recitationIndex: index,
        label: recitationStyleLabel(rec),
        qiraa: rec.name,
        qiraaSlug: rec.slug,
        styleLabel: rec.translation
          ? rec.translation.languageName || rec.translation.language
          : rec.style
            ? STYLE_LABELS[rec.style] || rec.style
            : null,
        style: rec.style,
        isTranslation: Boolean(rec.translation),
        duration: track.parts.reduce((a, p) => a + (p.duration || 0), 0),
        track,
      });
    });
  }
  return out;
}

export function getCountries(): { code: string; name: string; count: number }[] {
  const map = new Map<string, { code: string; name: string; count: number }>();
  for (const r of reciters) {
    if (!r.countryCode) continue;
    const item = map.get(r.countryCode) || { code: r.countryCode, name: r.country, count: 0 };
    item.count += 1;
    map.set(r.countryCode, item);
  }
  return [...map.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export type PlaylistSummary = {
  slug: string;
  kind: "curated" | "mixed";
  title: string;
  arabicName: string;
  description: string;
  eyebrow: string;
  cover: string | null;
  accent: string;
  trackCount: number;
  contributors?: MixedMushaf["contributors"];
};

export function getPlaylistSummaries(): PlaylistSummary[] {
  return [
    ...curatedPlaylists.map((p) => ({
      slug: p.slug,
      kind: "curated" as const,
      title: p.title,
      arabicName: "ختمة مُختارة",
      description: p.description,
      eyebrow: p.eyebrow,
      cover: null,
      accent: p.accent,
      trackCount: p.tracks.length,
    })),
    ...mixedMushafs.map((m) => ({
      slug: m.slug,
      kind: "mixed" as const,
      title: m.name,
      arabicName: m.arabicName,
      description: m.description,
      eyebrow: "Hamkorlikdagi muşaf",
      cover: m.cover,
      accent: "#0D7857",
      trackCount: m.tracks.length,
      contributors: m.contributors,
    })),
  ];
}

export type PlaylistDetail = PlaylistSummary & {
  tracks: Track[];
};

export function getPlaylist(slug: string): PlaylistDetail | undefined {
  const curated = curatedPlaylists.find((p) => p.slug === slug);
  if (curated) {
    const tracks: Track[] = [];
    for (const ref of curated.tracks) {
      const reciter = reciterBySlug.get(ref.r);
      if (!reciter) continue;
      const track = buildTrack(reciter, ref.i, ref.s);
      if (track) tracks.push(track);
    }
    return {
      slug,
      kind: "curated",
      title: curated.title,
      arabicName: "ختمة مُختارة",
      description: curated.description,
      eyebrow: curated.eyebrow,
      cover: null,
      accent: curated.accent,
      trackCount: tracks.length,
      tracks,
    };
  }
  const mixed = mixedMushafs.find((m) => m.slug === slug);
  if (mixed) {
    const tracks: Track[] = mixed.tracks.map(({ n, d }) => {
      const surah = surahByNumber.get(n)!;
      const url = mediaUrl(`${mixed.base}${String(n).padStart(3, "0")}.mp3`);
      return {
        id: `${slug}:${n}`,
        title: surah.name,
        titleArabic: surah.arabicName,
        subtitle: `${mixed.name} · Turli qorilar`,
        reciterName: "Turli qorilar",
        surahSlug: surah.slug,
        surahNumber: n,
        art: mixed.cover,
        parts: [{ url, duration: d }],
        downloadUrl: url,
      };
    });
    return {
      slug,
      kind: "mixed",
      title: mixed.name,
      arabicName: mixed.arabicName,
      description: mixed.description,
      eyebrow: "Hamkorlikdagi muşaf",
      cover: mixed.cover,
      accent: "#0D7857",
      trackCount: tracks.length,
      contributors: mixed.contributors,
      tracks,
    };
  }
  return undefined;
}

export type QiraatInfo = {
  slug: string;
  name: string;
  arabicName: string;
  description: string;
  badge?: string;
  reciterCount: number;
};

export const qiraatInfo: QiraatInfo[] = [
  {
    slug: "hafs-an-asim",
    name: "Hafs an Osim",
    arabicName: "حفص عن عاصم",
    description: "Islom olamida eng keng tarqalgan rivoyat",
    badge: "Eng maşhur",
    reciterCount: 0,
  },
  {
    slug: "warsh-an-nafi",
    name: "Varş an Nofi",
    arabicName: "ورش عن نافع",
    description: "Şimoliy Afrikada keng tarqalgan rivoyat",
    reciterCount: 0,
  },
  {
    slug: "qalun-an-nafi",
    name: "Qolun an Nofi",
    arabicName: "قالون عن نافع",
    description: "Liviya va Tunisda keng tarqalgan",
    reciterCount: 0,
  },
  {
    slug: "shubah-an-asim",
    name: "Şuʼba an Osim",
    arabicName: "شعبة عن عاصم",
    description: "Islom olamida maşhur rivoyat",
    reciterCount: 0,
  },
  {
    slug: "ad-duri-an-abu-amr",
    name: "Ad-Duriy an Abu Amr",
    arabicName: "الدوري عن أبي عمرو",
    description: "Sudanda keng tarqalgan rivoyat",
    reciterCount: 0,
  },
  {
    slug: "as-susi-an-abu-amr",
    name: "As-Susiy an Abu Amr",
    arabicName: "السوسي عن أبي عمرو",
    description: "Maşhur mutavotir qiroatlardan biri",
    reciterCount: 0,
  },
];

for (const q of qiraatInfo) {
  q.reciterCount = reciters.filter((r) => r.recitations.some((x) => x.slug === q.slug && !x.translation)).length;
}

export function findRecitersByQiraa(slug: string): Reciter[] {
  return reciters.filter((r) => r.recitations.some((x) => x.slug === slug && !x.translation));
}

export function findReciterForSurah(surahNumber: number, slugs: string[]): { reciter: Reciter; index: number } | null {
  for (const slug of slugs) {
    const reciter = reciterBySlug.get(slug);
    if (!reciter) continue;
    const index = reciter.recitations.findIndex(
      (rec) => !rec.translation && rec.audio[String(surahNumber)]?.length
    );
    if (index >= 0) return { reciter, index };
  }
  return null;
}

export function getRadioStations(): RadioStation[] {
  return radios;
}

export function getRadio(slug: string): RadioStation | undefined {
  return radios.find((r) => r.slug === slug);
}

export function radioToTrack(r: RadioStation): Track {
  return {
    id: `radio:${r.slug}`,
    title: r.name,
    titleArabic: r.arabicName,
    subtitle: `${r.category} · Jonli radio`,
    reciterName: r.name,
    art: r.image,
    parts: [{ url: r.url, duration: 0 }],
    isLive: true,
    accent: r.accent,
  };
}

export function getReciterPreviewTrack(slug: string, surahNumber = 1): Track | null {
  const reciter = reciterBySlug.get(slug);
  if (!reciter) return null;
  return buildTrack(reciter, primaryRecitationIndex(reciter), surahNumber);
}

export function getReciterCardsByTag(tagKey: string, limit?: number): ReciterCardData[] {
  const found = reciters.filter((r) => r.tagKeys.includes(tagKey));
  return (limit ? found.slice(0, limit) : found).map(toCardData);
}

export function getTopReciterCards(limit = 12, offset = 0): ReciterCardData[] {
  return reciters.slice(offset, offset + limit).map(toCardData);
}

export function getNewReleases(limit = 8): ReciterCardData[] {
  return [...reciters]
    .sort((a, b) => b.number - a.number || b.displayOrder - a.displayOrder)
    .slice(0, limit)
    .map(toCardData);
}

export function getRelatedReciters(reciter: Reciter, limit = 8): ReciterCardData[] {
  const sameTag = reciters.filter(
    (r) => r.slug !== reciter.slug && r.tagKeys.some((t) => reciter.tagKeys.includes(t))
  );
  const sameCountry = reciters.filter(
    (r) => r.slug !== reciter.slug && r.countryCode === reciter.countryCode && !sameTag.includes(r)
  );
  return [...sameTag, ...sameCountry].slice(0, limit).map(toCardData);
}

const POPULAR_SURAH_NUMBERS = [1, 2, 18, 36, 55, 56, 67, 78, 112, 113, 114];

export function getPopularSurahs(limit = 8): Surah[] {
  return POPULAR_SURAH_NUMBERS.slice(0, limit)
    .map((n) => surahByNumber.get(n))
    .filter((s): s is Surah => Boolean(s));
}

export function getReciterCardsByStyle(style: string, limit = 12): ReciterCardData[] {
  return reciters
    .filter((r) => r.recitations.some((rec) => rec.style === style || rec.translation?.language === style))
    .slice(0, limit)
    .map(toCardData);
}

export function getMixTracks(count = 8, surahNumber = 1): Track[] {
  return reciters
    .slice(0, count)
    .map((reciter) => buildTrack(reciter, primaryRecitationIndex(reciter), surahNumber))
    .filter((t): t is Track => Boolean(t));
}

export function getPlaylistPreview(slug: string, limit = 6): Track[] {
  return getPlaylist(slug)?.tracks.slice(0, limit) ?? [];
}

export function getSurahGroups(surahNumber: number): {
  qiraa: string;
  qiraaSlug: string;
  items: SurahRecitationOption[];
}[] {
  const map = new Map<string, { qiraa: string; qiraaSlug: string; items: SurahRecitationOption[] }>();
  for (const option of getAllRecitationsForSurah(surahNumber)) {
    const group = map.get(option.qiraaSlug) || {
      qiraa: option.qiraa,
      qiraaSlug: option.qiraaSlug,
      items: [],
    };
    group.items.push(option);
    map.set(option.qiraaSlug, group);
  }
  return [...map.values()];
}

export function getTotalListeners(): number {
  return reciters.reduce((sum, r) => sum + r.totalViewers, 0);
}

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function getDiscoveryReciters(limit = 14, offset = 0): ReciterCardData[] {
  return reciters
    .slice()
    .sort((a, b) => hashString(a.slug) - hashString(b.slug))
    .slice(offset, offset + limit)
    .map(toCardData);
}

export type FeaturedRecitation = {
  reciter: Reciter;
  index: number;
  surah: Surah;
  track: Track;
};

export function getFeaturedRecitation(): FeaturedRecitation | null {
  const candidates: [string, number][] = [
    ["jaber-al-qaitan", 50],
    ["abdul-basit-abdul-samad", 18],
    ["muhammad-siddiq-al-minshawi", 36],
    ["maher-almaikulai", 55],
  ];
  for (const [slug, surahNumber] of candidates) {
    const reciter = reciterBySlug.get(slug);
    if (!reciter) continue;
    const index = primaryRecitationIndex(reciter);
    const track = buildTrack(reciter, index, surahNumber);
    const surah = surahByNumber.get(surahNumber);
    if (track && surah) return { reciter, index, surah, track };
  }
  return null;
}

export { SITE } from "@/lib/constants";
