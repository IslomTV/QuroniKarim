import { Suspense } from "react";
import type { Metadata } from "next";
import { MushafCard } from "@/components/cards/MushafCard";
import { RecitersDirectory } from "@/components/reciters/RecitersDirectory";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ScrollRail } from "@/components/ui/ScrollRail";
import {
  getCountries,
  getPlaylist,
  getReciterCards,
  getStats,
  mixedMushafs,
  qiraatInfo,
} from "@/lib/content";
import { formatNumber } from "@/lib/format";

export const metadata: Metadata = {
  title: "Qorilar",
  description:
    "Way2Quran'dagi barça qorilarni köring — musulmon dunyosining 150 ovozi, rivoyat, uslub va mamlakat böyiça tartiblangan.",
};

function DirectoryFallback() {
  return (
    <div className="mt-6 space-y-3">
      <div className="h-12 animate-pulse rounded-xl bg-white/[0.04]" />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="h-[110px] animate-pulse rounded-xl bg-white/[0.03]" />
        ))}
      </div>
    </div>
  );
}

export default function RecitersPage() {
  const cards = getReciterCards();
  const countries = getCountries();
  const stats = getStats();
  const mushafs = mixedMushafs.map((mushaf) => {
    const detail = getPlaylist(mushaf.slug);
    return {
      ...mushaf,
      track: detail?.tracks[0] ?? null,
      queue: detail?.tracks.slice(0, 5) ?? [],
    };
  });

  return (
    <div className="container-page pt-6">
      <Breadcrumbs items={[{ label: "Qorilar" }]} />

      <section className="panel relative mt-4 overflow-hidden p-5 sm:p-7">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(700px_320px_at_8%_0%,rgba(13,120,87,0.14),transparent_60%)]" />
        <div className="relative">
          <p className="eyebrow">Kutubxona</p>
          <h1 className="display mt-2 text-[clamp(1.8rem,3.2vw,2.8rem)] leading-tight">
            Musulmon dunyosining {formatNumber(stats.reciters)} qori
          </h1>
          <p className="mt-2 max-w-[720px] text-[13px] leading-relaxed text-muted">
            Way2Quranʼdagi barça qorilar — rivoyat, uslub va mamlakat böyiça tartiblangan. Qori sahifasini oçiş uçun ismini bosing.
          </p>

          <div className="mt-5 grid grid-cols-3 gap-2">
            {[
              { label: "Qorilar", value: stats.reciters, note: "bu naşrda" },
              { label: "Tilovatlar", value: stats.recitations, note: "barça rivoyatlar böyiça" },
              { label: "Mamlakatlar", value: countries.length, note: "va köpaymoqda" },
            ].map((item) => (
              <div key={item.label} className="rounded-lg border border-line bg-black/15 px-3.5 py-3">
                <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-muted-2">{item.label}</p>
                <p className="display mt-1 text-[24px] leading-none text-ink">{formatNumber(item.value)}</p>
                <p className="mt-1 text-[9.5px] text-muted-2">{item.note}</p>
              </div>
            ))}
          </div>

          <Suspense fallback={<DirectoryFallback />}>
            <RecitersDirectory
              cards={cards}
              countries={countries}
              qiraat={qiraatInfo.map((item) => ({ slug: item.slug, name: item.name }))}
            />
          </Suspense>
        </div>
      </section>

      <section className="py-12">
        <ScrollRail
          eyebrow="Hamkorlikdagi muşafarlar"
          title="Birgalikda jamlangan töliq Qurʼonlar"
          subtitle="Bir neça qori birgalikda jamlagan töliq Qurʼon albomlari."
        >
          {mushafs.map((mushaf) => (
            <MushafCard
              key={mushaf.slug}
              href={`/playlists/${mushaf.slug}`}
              title={mushaf.name}
              arabicName={mushaf.arabicName}
              cover={mushaf.cover}
              trackCount={mushaf.tracks.length}
              contributorCount={mushaf.contributors.length}
              track={mushaf.track}
              queue={mushaf.queue}
            />
          ))}
        </ScrollRail>
      </section>
    </div>
  );
}
