import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, BookOpen, ListMusic, Mic2, Play, Radio, Search, Sparkles } from "lucide-react";
import { PlaylistGridCard } from "@/components/cards/PlaylistCard";
import { ReciterGridCard } from "@/components/cards/ReciterCards";
import { SurahCard } from "@/components/cards/SurahCard";
import { PlayButton } from "@/components/player/PlayButton";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ReciterPhoto } from "@/components/ui/ReciterPhoto";
import {
  buildTrack,
  getPlaylist,
  getPlaylistSummaries,
  getPopularSurahs,
  getRadioStations,
  getReciter,
  getSurahByNumber,
  getTopReciterCards,
  primaryRecitationIndex,
  qiraatInfo,
  radioToTrack,
  reciters,
  toCardData,
} from "@/lib/content";
import { formatNumber } from "@/lib/format";
import { normalizeSearch, searchReciters, searchSurahs } from "@/lib/search";
import type { Track } from "@/lib/types";

export const metadata: Metadata = {
  title: "Qidiruv",
  description:
    "Way2Quran'dan qori, sura, pleylist yoki radio stansiyasini qidiring — söng bir bosişda tinglang, öqing yoki yuklab oling.",
};

type Filter = "all" | "reciters" | "surahs" | "playlists" | "radio";

type SearchParams = { q?: string; type?: string };

function searchHref(q: string, type: Filter): string {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (type !== "all") params.set("type", type);
  const query = params.toString();
  return query ? `/search?${query}` : "/search";
}

function matches(value: string, query: string): boolean {
  return normalizeSearch(value).includes(query);
}

export default function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  return (
    <div className="container-page pt-6">
      <Breadcrumbs items={[{ label: "Qidiruv" }]} />
      <Suspense fallback={<SearchFallback />}>
        <SearchContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

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

async function SearchContent({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const q = (params.q ?? "").trim();
  const normalized = normalizeSearch(q);
  const type: Filter = (["reciters", "surahs", "playlists", "radio"] as const).includes(
    params.type as never
  )
    ? (params.type as Filter)
    : "all";

  const reciterResults = normalized
    ? searchReciters(q, 40)
        .map((item) => getReciter(item.slug))
        .filter((item): item is NonNullable<typeof item> => Boolean(item))
        .map(toCardData)
    : [];

  const surahResults = normalized
    ? searchSurahs(q, 30)
        .map((item) => getSurahByNumber(item.number))
        .filter((item): item is NonNullable<typeof item> => Boolean(item))
    : [];

  const playlistResults = normalized
    ? getPlaylistSummaries()
        .filter((item) =>
          matches(`${item.title} ${item.description} ${item.arabicName} ${item.eyebrow}`, normalized)
        )
        .slice(0, 8)
        .map((summary) => {
          const detail = getPlaylist(summary.slug);
          return {
            ...summary,
            track: detail?.tracks[0] ?? null,
            queue: detail?.tracks.slice(0, 6) ?? [],
          };
        })
    : [];

  const radioResults = normalized
    ? getRadioStations().filter((station) =>
        matches(`${station.name} ${station.arabicName} ${station.category} ${station.country} ${station.description}`, normalized)
      )
    : [];

  const total = reciterResults.length + surahResults.length + playlistResults.length + radioResults.length;

  const previewReciter = getReciter("abdul-basit-abdul-samad") ?? reciters[0];
  const previewIndex = primaryRecitationIndex(previewReciter);
  const surahTrack = (number: number): Track | null => buildTrack(previewReciter, previewIndex, number);

  const counts: Record<Filter, number> = {
    all: total,
    reciters: reciterResults.length,
    surahs: surahResults.length,
    playlists: playlistResults.length,
    radio: radioResults.length,
  };

  const show = (key: Exclude<Filter, "all">) => type === "all" || type === key;

  return (
    <>
      <section className="panel relative mt-4 overflow-hidden p-5 sm:p-7">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/55 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(720px_320px_at_50%_0%,rgba(13,120,87,0.16),transparent_62%)]" />
        <div className="relative mx-auto max-w-[840px] text-center">
          <p className="eyebrow inline-flex items-center gap-2">
            <Search className="h-3 w-3" /> Kutubxonadan qidiriş
          </p>
          <h1 className="display mt-2 text-[clamp(1.9rem,3.4vw,2.8rem)] leading-[1.05]">
            Ovoz, sura yoki lahzani toping
          </h1>
          <p className="mx-auto mt-2 max-w-[560px] text-[12.5px] leading-relaxed text-muted">
            {formatNumber(reciters.length)} qori, 114 sura, pleylistlar va jonli radio böylab qidiring.
          </p>

          <form action="/search" method="get" className="relative mx-auto mt-5 max-w-[640px]">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-2" />
            <input
              key={q}
              name="q"
              defaultValue={q}
              autoFocus={!q}
              placeholder="Masalan: “Abdul Basit”, “Yosin”, “Varş”…"
              aria-label="Qorilar, suralar, pleylistlar va radioni qidiriş"
              className="input border-gold/25 bg-black/25 py-3.5 pl-11 pr-28 text-[13px]"
            />
            <button type="submit" className="btn btn-gold btn-sm absolute right-1.5 top-1/2 -translate-y-1/2">
              Qidiriş
            </button>
          </form>

          <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
            <span className="text-[9.5px] uppercase tracking-[0.16em] text-muted-2">Sinab köring</span>
            {["Abdul Basit", "Yosin", "Varş", "Ramazon", "Radio"].map((term) => (
              <Link
                key={term}
                href={`/search?q=${encodeURIComponent(term)}`}
                className="rounded-full border border-line bg-white/[0.03] px-2.5 py-1 text-[10px] text-muted transition-colors hover:border-gold/35 hover:text-gold"
              >
                {term}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {!normalized ? (
        <EmptySearch surahTrack={surahTrack} />
      ) : (
        <>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-[12px] text-muted">
              <span className="font-semibold text-ink">{formatNumber(total)}</span> natija:{" "}
              <span className="text-gold-bright">“{q}”</span>
            </p>
            <div className="flex flex-wrap gap-1.5">
              {(
                [
                  ["all", "Barçasi"],
                  ["reciters", "Qorilar"],
                  ["surahs", "Suralar"],
                  ["playlists", "Pleylistlar"],
                  ["radio", "Radio"],
                ] as [Filter, string][]
              ).map(([key, label]) => (
                <Link
                  key={key}
                  href={searchHref(q, key)}
                  className="pill text-[11px]"
                  data-active={type === key}
                >
                  {label} <span className="text-[9px] opacity-65">{counts[key]}</span>
                </Link>
              ))}
            </div>
          </div>

          {total === 0 ? (
            <div className="panel mt-4 px-6 py-14 text-center">
              <p className="display text-2xl">“{q}” böyiça heç narsa topilmadi</p>
              <p className="mx-auto mt-2 max-w-[460px] text-[12.5px] leading-relaxed text-muted">
                Imloni tekşiring, sura nomini arabça yoki inglizça sinab köring yoki töliq kutubxonani körib çiqing.
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                <Link href="/reciters" className="btn btn-outline btn-sm">Qorilarni köriş</Link>
                <Link href="/surahs" className="btn btn-outline btn-sm">Suralarni köriş</Link>
                <Link href="/radio" className="btn btn-ghost btn-sm">Radioni oçiş</Link>
              </div>
            </div>
          ) : (
            <div className="space-y-10 pb-12 pt-6">
              {show("reciters") && reciterResults.length > 0 && (
                <section>
                  <div className="mb-3 flex items-end justify-between gap-3">
                    <div>
                      <p className="eyebrow inline-flex items-center gap-2"><Mic2 className="h-3 w-3" /> Qorilar</p>
                      <h2 className="display mt-1.5 text-[clamp(1.4rem,2.2vw,1.85rem)]">Mos kelgan ovozlar</h2>
                    </div>
                    {type === "all" && reciterResults.length > 6 && (
                      <Link href={searchHref(q, "reciters")} className="inline-flex items-center gap-1 text-[11px] font-medium text-green-bright hover:text-gold">
                        Barçasi: {reciterResults.length} <ArrowRight className="h-3 w-3" />
                      </Link>
                    )}
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {reciterResults.slice(0, type === "all" ? 6 : 40).map((reciter) => (
                      <ReciterGridCard key={reciter.slug} reciter={reciter} />
                    ))}
                  </div>
                </section>
              )}

              {show("surahs") && surahResults.length > 0 && (
                <section>
                  <div className="mb-3 flex items-end justify-between gap-3">
                    <div>
                      <p className="eyebrow inline-flex items-center gap-2"><BookOpen className="h-3 w-3" /> Suralar</p>
                      <h2 className="display mt-1.5 text-[clamp(1.4rem,2.2vw,1.85rem)]">Mos kelgan suralar</h2>
                    </div>
                    {type === "all" && surahResults.length > 6 && (
                      <Link href={searchHref(q, "surahs")} className="inline-flex items-center gap-1 text-[11px] font-medium text-green-bright hover:text-gold">
                        Barçasi: {surahResults.length} <ArrowRight className="h-3 w-3" />
                      </Link>
                    )}
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {surahResults.slice(0, type === "all" ? 6 : 30).map((surah) => {
                      const track = surahTrack(surah.number);
                      return (
                        <SurahCard key={surah.number} surah={surah} track={track} queue={track ? [track] : undefined} />
                      );
                    })}
                  </div>
                </section>
              )}

              {show("playlists") && playlistResults.length > 0 && (
                <section>
                  <div className="mb-3 flex items-end justify-between gap-3">
                    <div>
                      <p className="eyebrow inline-flex items-center gap-2"><ListMusic className="h-3 w-3" /> Pleylistlar</p>
                      <h2 className="display mt-1.5 text-[clamp(1.4rem,2.2vw,1.85rem)]">Mos kelgan töplamlar</h2>
                    </div>
                    {type === "all" && playlistResults.length > 3 && (
                      <Link href={searchHref(q, "playlists")} className="inline-flex items-center gap-1 text-[11px] font-medium text-green-bright hover:text-gold">
                        Barçasi: {playlistResults.length} <ArrowRight className="h-3 w-3" />
                      </Link>
                    )}
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {playlistResults.slice(0, type === "all" ? 3 : 8).map((item) => (
                      <PlaylistGridCard
                        key={item.slug}
                        href={`/playlists/${item.slug}`}
                        title={item.title}
                        eyebrow={item.eyebrow}
                        description={item.description}
                        trackCount={item.trackCount}
                        cover={item.cover}
                        accent={item.accent}
                        arabicName={item.arabicName}
                        track={item.track}
                        queue={item.queue}
                      />
                    ))}
                  </div>
                </section>
              )}

              {show("radio") && radioResults.length > 0 && (
                <section>
                  <div className="mb-3 flex items-end justify-between gap-3">
                    <div>
                      <p className="eyebrow inline-flex items-center gap-2"><Radio className="h-3 w-3" /> Radio</p>
                      <h2 className="display mt-1.5 text-[clamp(1.4rem,2.2vw,1.85rem)]">Mos kelgan stansiyalar</h2>
                    </div>
                    {type === "all" && radioResults.length > 4 && (
                      <Link href={searchHref(q, "radio")} className="inline-flex items-center gap-1 text-[11px] font-medium text-green-bright hover:text-gold">
                        Barçasi: {radioResults.length} <ArrowRight className="h-3 w-3" />
                      </Link>
                    )}
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {radioResults.map((station) => {
                      const track = radioToTrack(station);
                      return (
                        <div key={station.slug} className="panel-soft flex items-center gap-3 p-3">
                          {station.image ? (
                            <ReciterPhoto src={station.image} alt={station.name} className="h-10 w-10 flex-none border border-line" sizes="40px" />
                          ) : (
                            <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full border border-line bg-gold/[0.06] text-gold">
                              <Radio className="h-4 w-4" />
                            </span>
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[12px] font-medium">{station.name}</p>
                            <p className="truncate text-[10px] text-muted-2">{station.category} · {station.country}</p>
                          </div>
                          <PlayButton track={track} queue={[track]} variant="bare" ariaLabel={`Tinglash: ${station.name}`} />
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}
            </div>
          )}
        </>
      )}
    </>
  );
}

function EmptySearch({ surahTrack }: { surahTrack: (number: number) => Track | null }) {
  const popular = getPopularSurahs(6);
  const top = getTopReciterCards(6);

  return (
    <div className="space-y-10 pb-12 pt-8">
      <section>
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <p className="eyebrow inline-flex items-center gap-2"><Sparkles className="h-3 w-3" /> Şu yerdan boşlang</p>
            <h2 className="display mt-1.5 text-[clamp(1.4rem,2.2vw,1.85rem)]">Eng köp tinglangan qorilar</h2>
          </div>
          <Link href="/reciters" className="inline-flex items-center gap-1 text-[11px] font-medium text-green-bright hover:text-gold">
            Barça qorilar <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {top.map((reciter) => (
            <ReciterGridCard key={reciter.slug} reciter={reciter} />
          ))}
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <p className="eyebrow inline-flex items-center gap-2"><BookOpen className="h-3 w-3" /> Öqiş va tinglaş</p>
            <h2 className="display mt-1.5 text-[clamp(1.4rem,2.2vw,1.85rem)]">Odamlar qaytadigan suralar</h2>
          </div>
          <Link href="/surahs" className="inline-flex items-center gap-1 text-[11px] font-medium text-green-bright hover:text-gold">
            Barça suralar <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {popular.map((surah) => {
            const track = surahTrack(surah.number);
            return <SurahCard key={surah.number} surah={surah} track={track} queue={track ? [track] : undefined} />;
          })}
        </div>
      </section>

      <section>
        <div className="mb-3">
          <p className="eyebrow">Rivoyat böyiça</p>
          <h2 className="display mt-1.5 text-[clamp(1.4rem,2.2vw,1.85rem)]">Qiroatni toping</h2>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {qiraatInfo.map((qiraa) => (
            <Link
              key={qiraa.slug}
              href={`/reciters?qiraa=${qiraa.slug}`}
              className="panel card-hover group flex items-center gap-3 p-3.5"
            >
              <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full border border-gold/30 bg-gold/[0.06] font-arabic text-[13px] text-gold">
                {qiraa.arabicName.slice(0, 2)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[12.5px] font-semibold text-ink transition-colors group-hover:text-gold-bright">
                  {qiraa.name}
                </span>
                <span className="block truncate text-[10px] text-muted">{qiraa.reciterCount} qori · {qiraa.description}</span>
              </span>
              <Play className="h-3.5 w-3.5 flex-none text-muted-2" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
