import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Headphones, Radio, Sparkles } from "lucide-react";
import { SurahCard } from "@/components/cards/SurahCard";
import { SurahsDirectory, type SurahDirectoryItem } from "@/components/surahs/SurahsDirectory";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ScrollRail } from "@/components/ui/ScrollRail";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  buildTrack,
  findReciterForSurah,
  getPopularSurahs,
  getReciter,
  getSurahs,
  primaryRecitationIndex,
  qiraatInfo,
  reciters,
} from "@/lib/content";
import { formatNumber } from "@/lib/format";
import type { Track } from "@/lib/types";

export const metadata: Metadata = {
  title: "Suralar",
  description:
    "Muqaddas Qurʼonning barça 114 surasini körib çiqing — arabça matnni inglizça tarjima bilan öqing yoki har bir surani mavjud barça qiroatlarda tinglang.",
};

const PREVIEW_RECITERS = [
  "abdul-basit-abdul-samad",
  "muhammad-siddiq-al-minshawi",
  "maher-almaikulai",
  "ahmed-al-agamy",
  "saad-al-ghamdi",
  "abdul-rahman-musaad",
];

export default function SurahsPage() {
  const surahs = getSurahs();
  const totalVerses = surahs.reduce((sum, surah) => sum + surah.verses, 0);
  const popular = getPopularSurahs(8);

  const previewReciter = getReciter("abdul-basit-abdul-samad") ?? reciters[0];
  const previewIndex = primaryRecitationIndex(previewReciter);

  const trackFor = (surahNumber: number): Track | null => {
    const direct = buildTrack(previewReciter, previewIndex, surahNumber);
    if (direct) return direct;
    const found = findReciterForSurah(surahNumber, PREVIEW_RECITERS);
    return found ? buildTrack(found.reciter, found.index, surahNumber) : null;
  };

  const popularItems = popular.map((surah) => {
    const track = trackFor(surah.number);
    return { surah, track, queue: track ? [track] : undefined };
  });

  const directoryItems: SurahDirectoryItem[] = surahs.map((surah) => ({
    surah,
    track: trackFor(surah.number),
  }));

  const firstSurah = surahs[0];
  const yasin = surahs.find((surah) => surah.slug === "ya-sin");

  return (
    <div className="container-page pt-6">
      <Breadcrumbs items={[{ label: "Suralar" }]} />

      <section className="panel relative mt-4 overflow-hidden p-5 sm:p-7">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/55 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(700px_320px_at_88%_0%,rgba(13,120,87,0.16),transparent_62%)]" />
        <div className="relative grid gap-7 lg:grid-cols-[1.35fr_1fr] lg:items-center">
          <div>
            <p className="eyebrow inline-flex items-center gap-2">
              <BookOpen className="h-3 w-3" /> Kitob
            </p>
            <h1 className="display mt-2 max-w-[720px] text-[clamp(2rem,3.6vw,3rem)] leading-[1.05]">
              Har sura, har ovoz, bitta Kitob
            </h1>
            <p className="mt-3 max-w-[660px] text-[13px] leading-relaxed text-muted">
              Töliq Qurʼonni Usmoniy xatda Sahih International inglizça tarjimasi bilan öqing yoki istalgan surani
              kutubxonadagi barça rivoyatlarda tinglaş uçun oçing.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {firstSurah && (
                <Link href={`/surahs/${firstSurah.slug}`} className="btn btn-gold">
                  Al-Fotiha bilan boşlang <ArrowRight className="h-4 w-4" />
                </Link>
              )}
              {yasin && (
                <Link href={`/surahs/${yasin.slug}`} className="btn btn-outline">
                  Yosinni öqiş
                </Link>
              )}
              <Link href="/radio" className="btn btn-ghost">
                <Radio className="h-4 w-4" /> Qurʼon radiosi
              </Link>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[
                { label: "Suralar", value: surahs.length, note: "mushafda" },
                { label: "Oyatlar", value: totalVerses, note: "jami oyatlar" },
                { label: "Juzlar", value: 30, note: "bölimlar" },
                { label: "Qiroatlar", value: qiraatInfo.length, note: "rivoyatlar" },
              ].map((item) => (
                <div key={item.label} className="rounded-lg border border-line bg-black/15 px-3.5 py-3">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-muted-2">{item.label}</p>
                  <p className="display mt-1 text-[22px] leading-none text-ink">{formatNumber(item.value)}</p>
                  <p className="mt-1 text-[9.5px] text-muted-2">{item.note}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative rounded-xl border border-gold/20 bg-black/20 p-5">
            <div className="absolute inset-0 rounded-xl bg-[radial-gradient(300px_160px_at_50%_0%,rgba(201,164,74,0.1),transparent_70%)]" />
            <p className="relative text-center font-arabic text-2xl leading-loose text-gold/85" dir="rtl">
              بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
            </p>
            <p className="relative mt-2 text-center text-[10.5px] italic text-muted-2">
              Mehribon va rahimli Alloh nomi bilan
            </p>
            <div className="relative mt-4 grid grid-cols-3 gap-1.5">
              {qiraatInfo.slice(0, 6).map((qiraa) => (
                <div key={qiraa.slug} className="rounded-md border border-line/70 bg-white/[0.02] px-1.5 py-2 text-center">
                  <p className="font-arabic text-[13px] text-gold/80" dir="rtl">{qiraa.arabicName}</p>
                  <p className="mt-0.5 truncate text-[8.5px] text-muted-2">{qiraa.name.split(" ")[0]}</p>
                </div>
              ))}
            </div>
            <p className="relative mt-3 text-center text-[9.5px] leading-relaxed text-muted-2">
              Olti rivoyat jamlangan, har bir sura onlayn tinglaş yoki yuklab oliş uçun mavjud.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12">
        <ScrollRail
          eyebrow="Odamlar qaytadigan suralar"
          title="Qalb tinçlanadigan joydan oçing"
          subtitle="Kutubxonada eng köp öqiladigan va tinglanadigan suralar."
          action={
            <Link
              href="#directory"
              className="hidden items-center gap-1 text-[11.5px] font-medium text-muted transition-colors hover:text-gold sm:inline-flex"
            >
              Barça 114 <span aria-hidden="true">→</span>
            </Link>
          }
        >
          {popularItems.map(({ surah, track, queue }) => (
            <div key={surah.number} className="w-[286px] flex-none">
              <SurahCard surah={surah} track={track} queue={queue} />
            </div>
          ))}
        </ScrollRail>
      </section>

      <section className="border-y border-line/60 bg-[color:var(--bg-2)]/30">
        <div className="container-page py-10">
          <SurahsDirectory items={directoryItems} />
        </div>
      </section>

      <section className="py-14">
        <SectionHeading
          eyebrow="Tinglaş va öqiş"
          title="Ikkalasi uçun yaratilgan muşaf"
          subtitle="Tarjima bilan öqing, söng sevimli qoringiz ovozida öşa surani kuzatiş uçun tinglaşni bosing."
          align="center"
        />
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            {
              icon: BookOpen,
              title: "Usmoniy xat",
              text: "Töliq arabça matn, oyatma-oyat, Sahih International inglizça tarjimasi bilan.",
              href: "#directory",
              action: "Sura tanlang",
            },
            {
              icon: Headphones,
              title: "Mavjud barça tilovatlar",
              text: "Har bir sura sahifasi uni yozgan barça qorilarni rivoyat va uslub böyiça guruhlab jamlaydi.",
              href: "/reciters",
              action: "Qorilarni köriş",
            },
            {
              icon: Sparkles,
              title: "Birga kuzatib boring",
              text: "Arabça şrift ölçamini sozlang, tarjimani yaşiring va pleer surani oxirigaça olib borsin.",
              href: "#directory",
              action: "Öqişni boşlang",
            },
          ].map((item) => (
            <article key={item.title} className="panel p-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-gold/25 bg-gold/[0.06] text-gold">
                <item.icon className="h-4 w-4" />
              </span>
              <h3 className="mt-4 text-[14px] font-semibold">{item.title}</h3>
              <p className="mt-2 text-[11.5px] leading-relaxed text-muted">{item.text}</p>
              <Link href={item.href} className="mt-4 inline-flex items-center gap-1 text-[11.5px] font-medium text-green-bright hover:text-gold">
                {item.action} <ArrowRight className="h-3 w-3" />
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
