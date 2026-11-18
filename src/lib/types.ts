export type Surah = {
  number: number;
  slug: string;
  name: string;
  arabicName: string;
  englishName: string;
  verses: number;
  revelation: "Makkiy" | "Madaniy";
  revelationPlace: "makkah" | "madinah";
  revelationOrder: number;
  bismillah: boolean;
  juz: number;
  hizb: number;
  quarter: number;
  pages: [number, number];
  mp3Name: string | null;
};

export type RecitationTranslation = {
  language: string;
  languageName?: string;
  translator?: string;
  voice?: string;
  edition?: string;
};

export type AudioPart = [path: string, duration: number];

export type Recitation = {
  name: string;
  arabicName: string;
  slug: string;
  style: string | null;
  completed: boolean;
  translation: RecitationTranslation | null;
  audio: Record<string, AudioPart[]>;
};

export type Reciter = {
  id: string;
  number: number;
  slug: string;
  name: string;
  arabicName: string;
  photo: string | null;
  countryCode: string;
  country: string;
  nationality: string;
  city: string;
  tags: string[];
  tagKeys: string[];
  bio: string;
  bioArabic: string;
  totalListens: number;
  totalViewers: number;
  totalRecitations: number;
  qiraatCount: number;
  surahCount: number;
  hasCompleteQuran: boolean;
  isTopReciter: boolean;
  listenersNow: number;
  displayOrder: number;
  recitations: Recitation[];
};

export type TrackPart = { url: string; duration: number };

export type Track = {
  id: string;
  title: string;
  titleArabic: string;
  subtitle: string;
  reciterName: string;
  reciterSlug?: string;
  surahSlug?: string;
  surahNumber?: number;
  art?: string | null;
  parts: TrackPart[];
  isLive?: boolean;
  downloadUrl?: string;
  accent?: string;
};

export type PlaylistTrackRef = { r: string; i: number; s: number };

export type CuratedPlaylist = {
  slug: string;
  title: string;
  description: string;
  eyebrow: string;
  cover: string;
  accent: string;
  tracks: PlaylistTrackRef[];
};

export type MixedMushaf = {
  slug: string;
  name: string;
  arabicName: string;
  description: string;
  cover: string;
  riwaya: string | null;
  totalListeners: number;
  contributors: { slug: string; name: string; arabicName: string; photo: string | null }[];
  base: string;
  tracks: { n: number; d: number }[];
};

export type RadioStation = {
  slug: string;
  name: string;
  arabicName: string;
  url: string;
  country: string;
  category: string;
  description: string;
  image: string | null;
  accent: string;
};

export type DailyVerse = {
  surah: { number: number; slug: string; name: string; arabicName: string; englishName: string };
  ayah: string;
  verses: { arabic: string; english: string }[];
};

export type Stats = {
  reciters: number;
  recitations: number;
  audioFiles: number;
  completeMushafs: number;
  qiraat: number;
};

export type AzkarCategory = {
  slug: string;
  name: string;
  arabicName: string;
  description: string;
};

export type AzkarItem = {
  id: string;
  category: string;
  title: string;
  arabic: string;
  transliteration: string;
  translation: string;
  count: number;
  source: string;
};

export type SearchReciter = {
  slug: string;
  name: string;
  arabicName: string;
  country: string;
  photo: string | null;
  tags: string[];
  totalListens: number;
  isTopReciter: boolean;
};

export type SearchSurah = {
  number: number;
  slug: string;
  name: string;
  arabicName: string;
  englishName: string;
  verses: number;
  revelation: "Makkiy" | "Madaniy";
};

export type SearchIndex = {
  reciters: SearchReciter[];
  surahs: SearchSurah[];
};
