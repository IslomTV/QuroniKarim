import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpen, CalendarDays, Headphones, Layers } from "lucide-react";
import { PlayButton } from "@/components/player/PlayButton";
import { SurahReciters } from "@/components/surahs/SurahReciters";
import { SurahReader } from "@/components/surahs/SurahReader";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ShareRow } from "@/components/ui/ShareRow";
import {
  buildTrack,
  getAllRecitationsForSurah,
  getReciter,
  getSurah,
  getSurahByNumber,
  getSurahs,
  primaryRecitationIndex,
} from "@/lib/content";
import { formatNumber } from "@/lib/format";
import { getVerses } from "@/lib/quran";
import type { Track } from "@/lib/types";

export function generateStaticParams() {
  return getSurahs().map((surah) => ({ slug: surah.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const surah = getSurah(slug);
  if (!surah) return { title: "Sura topilmadi" };

  const description = `${surah.name} surasi (${surah.arabicName}) — ${surah.verses} oyat, ${surah.revelation} davrda nozil boʻlgan. Arabcha matn inglizcha tarjima bilan, hamda onlayn tinglash yoki yuklab olish uchun barcha mavjud tilovatlar.`;
  return {
    title: `${surah.name} — Oʻqish va tinglash`,
    description,
    openGraph: {
      title: `${surah.name} · ${surah.englishName}`,
      description,
      type: "article",
    },
    twitter: {
      card: "summary",
      title: `${surah.name} · ${surah.englishName}`,
      description,
    },
  };
}

export default async function SurahPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const surah = getSurah(slug);
  if (!surah) notFound();

  const verses = getVerses(surah.number);
  const options = getAllRecitationsForSurah(surah.number);
  const previous = getSurahByNumber(surah.number - 1);
  const next = getSurahByNumber(surah.number + 1);

  const fallbackReciter = getReciter("abdul-basit-abdul-samad");
  const fallbackTrack =
    !options.length && fallbackReciter
      ? buildTrack(fallbackReciter, primaryRecitationIndex(fallbackReciter), surah.number)
      : null;
  const playable = options[0]?.track ?? fallbackTrack;

  const listenersNow = new Set(options.map((option) => option.reciter.slug)).size;

  const previewTracks: Track[] = options.slice(0, 20).map((option) => option.track);

  return (
    <div className="container-page pt-6">
      <Breadcrumbs items={[{ label: "Suralar", href: "/surahs" }, { label: surah.name }]} />

      <section className="panel relative mt-4 overflow-hidden px-4 py-6 sm:px-7 sm:py-8">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/55 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(720px_320px_at_50%_0%,rgba(13,120,87,0.16),transparent_65%)]" />
        <div className="absolute inset-0 pattern-dots opacity-[0.16]" />

        <div className="relative flex items-center justify-between gap-3 text-[11px] text-muted-2">
          {previous ? (
            <Link href={`/surahs/${previous.slug}`} className="inline-flex min-w-0 items-center gap-1.5 transition-colors hover:text-gold">
              <ArrowLeft className="h-3.5 w-3.5 flex-none" />
              <span className="truncate">{previous.name}</span>
            </Link>
          ) : (
            <span />
          )}
          <span className="hidden text-[9.5px] uppercase tracking-[0.18em] text-muted-2/70 sm:block">
            Muqaddas Qurʼon · {formatNumber(surah.number)} / 114
          </span>
          {next ? (
            <Link href={`/surahs/${next.slug}`} className="inline-flex min-w-0 items-center gap-1.5 transition-colors hover:text-gold">
              <span className="truncate">{next.name}</span>
              <ArrowRight className="h-3.5 w-3.5 flex-none" />
            </Link>
          ) : (
            <span />
          )}
        </div>

        <div className="relative mx-auto mt-5 max-w-[820px] text-center">
          <p className="eyebrow">
            {surah.number}-sura · {surah.revelation}
          </p>
          <h1 className="display mt-2 text-[clamp(2.2rem,5vw,3.7rem)] leading-[1.02] text-ink">{surah.name}</h1>
          <p className="mt-1.5 font-arabic text-[clamp(1.5rem,3vw,2.1rem)] leading-relaxed text-gold/85" dir="rtl">
            {surah.arabicName}
          </p>
          <p className="mt-2 text-[12.5px] text-muted">
            {surah.englishName} · {surah.verses} oyat · {surah.juz}-juz · {surah.pages[0]}–{surah.pages[1]}-sahifa
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <PlayButton
              track={playable}
              queue={previewTracks.length ? previewTracks : undefined}
              label="Tinglaş"
              ariaLabel={`Tinglash: ${surah.name}`}
            />
            <Link href="#reader" className="btn btn-outline">
              <BookOpen className="h-4 w-4" /> Öqiş va tinglaş
            </Link>
            <a
              href={`https://quran.com/${surah.number}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost"
            >
              Muşafni oçiş
            </a>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[10px] text-muted-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-black/15 px-2.5 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-green-bright" />
              {formatNumber(listenersNow)} qori mavjud
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-black/15 px-2.5 py-1">
              <Headphones className="h-3 w-3" /> {formatNumber(options.length)} tilovat
            </span>
            <span className="hidden items-center gap-1.5 rounded-full border border-line bg-black/15 px-2.5 py-1 sm:inline-flex">
              <Layers className="h-3 w-3" /> {surah.hizb}-hizb · {surah.quarter}-çorak
            </span>
            <span className="hidden items-center gap-1.5 rounded-full border border-line bg-black/15 px-2.5 py-1 md:inline-flex">
              <CalendarDays className="h-3 w-3" /> Nozil bölgan: {surah.revelation}
            </span>
          </div>
        </div>
      </section>

      <div className="mt-4 flex justify-center">
        <ShareRow title={`${surah.name} surasi — oʻqish va tinglash`} path={`/surahs/${surah.slug}`} />
      </div>

      {options.length > 0 && (
        <SurahReciters options={options} surahName={surah.name} surahArabic={surah.arabicName} />
      )}

      <SurahReader
        surah={surah}
        verses={verses}
        track={playable}
        queue={previewTracks.length ? previewTracks : undefined}
      />

      <nav className="grid gap-3 py-12 sm:grid-cols-2" aria-label="Sura böylab navigatsiya">
        {previous ? (
          <Link href={`/surahs/${previous.slug}`} className="panel group flex items-center gap-3 p-4 transition-colors hover:border-gold/35">
            <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full border border-line text-muted transition-colors group-hover:border-gold/40 group-hover:text-gold">
              <ArrowLeft className="h-4 w-4" />
            </span>
            <span className="min-w-0">
              <span className="block text-[9px] uppercase tracking-[0.18em] text-muted-2">Oldingi sura</span>
              <span className="mt-0.5 block truncate text-[13px] font-medium text-ink group-hover:text-gold-bright">
                {previous.name} <span className="font-arabic text-gold/70">· {previous.arabicName}</span>
              </span>
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/surahs/${next.slug}`} className="panel group flex items-center justify-end gap-3 p-4 text-right transition-colors hover:border-gold/35">
            <span className="min-w-0">
              <span className="block text-[9px] uppercase tracking-[0.18em] text-muted-2">Keyingi sura</span>
              <span className="mt-0.5 block truncate text-[13px] font-medium text-ink group-hover:text-gold-bright">
                {next.name} <span className="font-arabic text-gold/70">· {next.arabicName}</span>
              </span>
            </span>
            <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full border border-line text-muted transition-colors group-hover:border-gold/40 group-hover:text-gold">
              <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </div>
  );
}
