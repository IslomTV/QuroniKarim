import type { Metadata } from "next";
import { Suspense } from "react";
import {
  SearchPageClient,
  type SearchPlaylist,
  type SearchRadioItem,
} from "@/components/search/SearchPageClient";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import {
  getPlaylist,
  getPlaylistSummaries,
  getPopularSurahs,
  getRadioStations,
  getReciter,
  getReciterCards,
  getTopReciterCards,
  primaryRecitationIndex,
  qiraatInfo,
  radioToTrack,
  reciters,
  surahs,
} from "@/lib/content";

export const metadata: Metadata = {
  title: "Qidiruv",
  description:
    "Way2Quran'dan qori, sura, pleylist yoki radio stansiyasini qidiring — söng bir bosişda tinglang, öqing yoki yuklab oling.",
};

function SearchFallback() {
  return (
    <div className="panel mt-4 p-5 sm:p-7">
      <div className="h-3 w-24 animate-pulse rounded bg-white/10" />
      <div className="mt-3 h-9 w-[320px] max-w-full animate-pulse rounded bg-white/10" />
      <div className="mt-5 h-12 w-full animate-pulse rounded-full bg-white/[0.05]" />
      <div className="mt-8 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-[92px] animate-pulse rounded-xl bg-white/[0.03]" />
        ))}
      </div>
    </div>
  );
}

export default function SearchPage() {
  // The search query lives in the URL, so the page itself is static. Search
  // data is pre-computed here at build time and hydrated by the client.
  const previewReciter = getReciter("abdul-basit-abdul-samad") ?? reciters[0];
  const previewIndex = primaryRecitationIndex(previewReciter);
  const preview = {
    ...previewReciter,
    recitations: [previewReciter.recitations[previewIndex]],
  };

  const playlists: SearchPlaylist[] = getPlaylistSummaries().map((summary) => {
    const detail = getPlaylist(summary.slug);
    return {
      slug: summary.slug,
      title: summary.title,
      arabicName: summary.arabicName,
      description: summary.description,
      eyebrow: summary.eyebrow,
      cover: summary.cover,
      accent: summary.accent,
      trackCount: summary.trackCount,
      track: detail?.tracks[0] ?? null,
      queue: detail?.tracks.slice(0, 6) ?? [],
    };
  });

  const radio: SearchRadioItem[] = getRadioStations().map((station) => ({
    station,
    track: radioToTrack(station),
  }));

  return (
    <div className="container-page pt-6">
      <Breadcrumbs items={[{ label: "Qidiruv" }]} />
      <Suspense fallback={<SearchFallback />}>
        <SearchPageClient
          cards={getReciterCards()}
          surahs={surahs}
          previewReciter={preview}
          playlists={playlists}
          radio={radio}
          topReciters={getTopReciterCards(6)}
          popularSurahs={getPopularSurahs(6)}
          qiraat={qiraatInfo}
          reciterCount={reciters.length}
        />
      </Suspense>
    </div>
  );
}
