export const SITE = {
  name: "Quroni Karim",
  title: "Quroni Karim: Islom olamidan Qurʼon tilovatlari",
  description:
    "Islom olamining turli burçaklaridan qorilar tilovat qilgan Muqaddas Qurʼonni tinglang va yuklab oling. Töliq muşafarlar, keçayu kunduz Qurʼon radiosi, barça ön qiroat va çiroyli muşaf öqiş bölimi.",
  url: "https://islomtv.github.io/QuroniKarim",
  // Set NEXT_PUBLIC_MEDIA_BASE=/media/ to serve a fully local mirror.
  mediaBase: process.env.NEXT_PUBLIC_MEDIA_BASE || "https://media.way2quran.com/",
};

export const PRAYER_LOCATION = "Toshkent";

export const NAV = {
  listen: {
    label: "Tinglaş",
    items: [
      { label: "Barça qorilar", href: "/reciters", desc: "Musulmon olamidan 1315 ovoz" },
      { label: "Suralar böyiça tilovatlar", href: "/surahs", desc: "Har bir sura, har bir rivoyat" },
      { label: "Qurʼon radiosi", href: "/radio", desc: "Keçayu kunduz jonli tilovat" },
      { label: "Tanlangan pleylistlar", href: "/playlists", desc: "Muşafarlar va tinglaş töplamlari" },
    ],
  },
  read: {
    label: "Öqiş",
    items: [
      { label: "Suralar va öqiş bölimi", href: "/surahs", desc: "Arabça matn va tarjima" },
      { label: "Al-Fotihani öqiş", href: "/surahs/al-fatihah", desc: "Kitobning oçilişi" },
      { label: "Yosinni öqiş", href: "/surahs/ya-sin", desc: "Qurʼonning qalbi" },
      { label: "Qurʼon haqida", href: "/about", desc: "Tuzilişi, qiroatlar va tarix" },
    ],
  },
  memorize: {
    label: "Yodlaş",
    items: [
      { label: "Hifz rejimi", href: "/surahs", desc: "Oyatma-oyat kuzatib boring" },
      { label: "Qisqa suralar", href: "/surahs?juz=30", desc: "30-juzdan boşlang" },
      { label: "Kunlik oyat", href: "/#verse-of-the-day", desc: "Özingiz bilan olib yuruvçi oyat" },
      { label: "Azklar", href: "/azkar", desc: "Har lahzaga zikr" },
    ],
  },
};

export const LANGUAGE_NAMES: Record<string, string> = {
  en: "Ingliz tili",
  nl: "Niderland tili",
  tl: "Filippin tili",
  pt: "Portugal tili",
  fa: "Fors tili",
  ta: "Tamil tili",
  tr: "Turk tili",
  zh: "Xitoy tili",
  bn: "Bengal tili",
  ur: "Urdu tili",
  fr: "Fransuz tili",
  hi: "Hind tili",
};

export const STYLE_LABELS: Record<string, string> = {
  murattal: "Murattal",
  mujawwad: "Mujavvad",
  moaallam: "Muallam",
  newkhatma: "Yangi xatma",
  hadr: "Hadr",
  "mushaf-with-translation": "Tarjimali muşaf",
};
