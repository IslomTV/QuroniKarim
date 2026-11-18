import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Headphones, MapPin, Radio, Sparkles } from "lucide-react";
import { ReciterCircle } from "@/components/cards/ReciterCards";
import { ReciterHeroActions } from "@/components/reciters/ReciterHeroActions";
import { ReciterSurahs } from "@/components/reciters/ReciterSurahs";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ReciterPhoto } from "@/components/ui/ReciterPhoto";
import { ScrollRail } from "@/components/ui/ScrollRail";
import { ShareRow } from "@/components/ui/ShareRow";
import {
  getReciter,
  getReciterPreviewTrack,
  getRelatedReciters,
  getSurahs,
  primaryRecitationIndex,
  reciters,
} from "@/lib/content";
import { formatNumber } from "@/lib/format";

export function generateStaticParams() {
  return reciters.map((reciter) => ({ slug: reciter.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const reciter = getReciter(slug);
  if (!reciter) return { title: "Qori topilmadi" };

  const description = `Muqaddas Qurʼonni ${reciter.name} (${reciter.arabicName}) tilovatida tinglang. ${reciter.qiraatCount} qiroat böyiça ${reciter.totalRecitations} tilovat — har bir surani onlayn tinglang yoki yuklab oling.`;
  const image = reciter.photo ?? "/images/hero-opt.jpg";

  return {
    title: reciter.name,
    description,
    openGraph: {
      title: `${reciter.name} · Qurʼon tilovatlari`,
      description,
      images: [{ url: image, alt: reciter.name }],
      type: "profile",
    },
    twitter: {
      card: "summary",
      title: `${reciter.name} · Qurʼon tilovatlari`,
      description,
      images: [image],
    },
  };
}

export default async function ReciterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const reciter = getReciter(slug);
  if (!reciter) notFound();

  const surahs = getSurahs();
  const initialIndex = primaryRecitationIndex(reciter);
  const primary = reciter.recitations[initialIndex];
  const related = getRelatedReciters(reciter, 10);
  const relatedCountries = [...new Set(related.map((item) => item.countryCode))].slice(0, 4);
  const popularCountries = [...new Set([reciter.countryCode, ...relatedCountries])].slice(0, 5);

  const primarySeconds = primary
    ? Object.values(primary.audio).reduce(
        (sum, parts) => sum + parts.reduce((partSum, part) => partSum + (part[1] || 0), 0),
        0
      )
    : 0;
  const sizeMb = Math.round((primarySeconds * 16_000) / (1024 * 1024));
  const sizeLabel = sizeMb >= 1024 ? `${(sizeMb / 1024).toFixed(1)} GB` : `${sizeMb} MB`;

  const relatedCards = related.map((card) => ({
    card,
    track: getReciterPreviewTrack(card.slug, 1),
  }));

  return (
    <div className="container-page pt-6">
      <Breadcrumbs items={[{ label: "Qorilar", href: "/reciters" }, { label: reciter.name }]} />

      <section className="panel relative mt-4 overflow-hidden p-5 sm:p-7">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/55 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(760px_340px_at_10%_0%,rgba(13,120,87,0.16),transparent_62%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(600px_260px_at_92%_8%,rgba(201,164,74,0.08),transparent_65%)]" />

        <div className="relative grid gap-6 lg:grid-cols-[178px_1fr]">
          <div className="flex flex-col items-center gap-3 lg:items-start">
            <div className="relative w-[150px] flex-none sm:w-[178px]">
              <div
                className="absolute -inset-1.5 rounded-2xl bg-gradient-to-br from-gold/45 via-green/20 to-transparent blur-[3px]"
                aria-hidden="true"
              />
              <ReciterPhoto
                src={reciter.photo}
                alt={reciter.name}
                rounded="rounded-xl"
                className="relative aspect-square w-full border border-gold/35 shadow-[0_18px_45px_-22px_rgba(0,0,0,0.9)]"
                sizes="178px"
                priority
              />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-1.5 lg:justify-start">
              <span className="tag tag-gold uppercase tracking-wider">
                <MapPin className="h-2.5 w-2.5" /> {reciter.countryCode} · {reciter.country}
              </span>
              {reciter.tags.slice(0, 1).map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="eyebrow">Qori</p>
              {reciter.isTopReciter && (
                <span className="tag tag-gold py-[3px]">
                  <Sparkles className="h-2.5 w-2.5" /> Maşhur qori
                </span>
              )}
              {reciter.hasCompleteQuran && (
                <span className="tag tag-green py-[3px]">
                  <CheckCircle2 className="h-2.5 w-2.5" /> Töliq muşaf
                </span>
              )}
            </div>

            <h1 className="display mt-2 text-[clamp(2rem,4vw,3.1rem)] leading-[1.04] text-ink">
              {reciter.name}
            </h1>
            <p className="mt-1.5 text-left font-arabic text-[clamp(1.15rem,2vw,1.55rem)] leading-relaxed text-gold/80" dir="rtl">
              {reciter.arabicName}
            </p>

            <p className="mt-3 max-w-[780px] text-[13px] leading-relaxed text-muted">{reciter.bio}</p>

            <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[
                { label: "Qiroat", value: String(reciter.qiraatCount), note: "tilovatlar" },
                { label: "Ijro", value: formatNumber(reciter.totalListens), note: "umumiy" },
                { label: "Suralar", value: String(reciter.surahCount), note: "mavjud" },
                { label: "Sifat", value: "MP3", note: "yuqori bitrate" },
              ].map((item) => (
                <div key={item.label} className="rounded-lg border border-line bg-black/15 px-3.5 py-3">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-muted-2">{item.label}</p>
                  <p className="display mt-1 truncate text-[24px] leading-none text-ink">{item.value}</p>
                  <p className="mt-1 truncate text-[9.5px] text-muted-2">{item.note}</p>
                </div>
              ))}
            </div>

            <ReciterHeroActions
              reciter={reciter}
              surahs={surahs}
              recitationIndex={initialIndex}
              sizeMb={sizeMb}
              sizeLabel={sizeLabel}
            />

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line/70 pt-3.5 text-[10.5px] text-muted">
              <span className="inline-flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-bright opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-bright" />
                </span>
                {formatNumber(reciter.listenersNow)} kişi tinglamoqda
              </span>
              <span className="hidden h-3 w-px bg-line sm:block" />
              <span className="inline-flex flex-wrap items-center gap-1.5">
                <span className="inline-flex items-center gap-1 text-muted-2">
                  <Radio className="h-3 w-3" /> Maşhur
                </span>
                {popularCountries.map((code) => (
                  <span
                    key={code}
                    className="rounded border border-line bg-white/[0.03] px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-muted"
                  >
                    {code}
                  </span>
                ))}
              </span>
              <span className="ml-auto inline-flex items-center gap-1.5 text-muted-2">
                <Headphones className="h-3 w-3" />
                {formatNumber(reciter.totalViewers)} tinglovçi · {reciter.totalRecitations} tilovat
              </span>
            </div>
          </div>
        </div>
      </section>

      <ShareRow title={`${reciter.name} — Qurʼon tilovatlari`} path={`/reciters/${reciter.slug}`} className="mt-4" />

      <ReciterSurahs reciter={reciter} surahs={surahs} initialIndex={initialIndex} />

      {relatedCards.length > 0 && (
        <section className="py-12">
          <ScrollRail
            eyebrow="Tinglaşda davom eting"
            title="Bu qoridan keyin tinglanadigan qorilar"
            subtitle="Uslubi, mamlakati yoki töplami öxşaş ovozlar."
            action={
              <Link
                href="/reciters"
                className="hidden items-center gap-1 text-[11.5px] font-medium text-muted transition-colors hover:text-gold sm:inline-flex"
              >
                Barça qorilar <span aria-hidden="true">→</span>
              </Link>
            }
          >
            {relatedCards.map(({ card, track }) => (
              <ReciterCircle key={card.slug} reciter={card} track={track} />
            ))}
          </ScrollRail>
        </section>
      )}
    </div>
  );
}
