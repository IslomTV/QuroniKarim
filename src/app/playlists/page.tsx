import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ListMusic, Play, Sparkles, Users } from "lucide-react";
import { MushafCard } from "@/components/cards/MushafCard";
import { PlaylistGridCard } from "@/components/cards/PlaylistCard";
import { PlayButton } from "@/components/player/PlayButton";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ScrollRail } from "@/components/ui/ScrollRail";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getPlaylist, getPlaylistSummaries } from "@/lib/content";
import { formatDuration, formatLongDuration, formatNumber } from "@/lib/format";
import type { Track } from "@/lib/types";

function playlistSeconds(tracks: Track[]): number {
  return tracks.reduce(
    (sum, track) => sum + track.parts.reduce((partSum, part) => partSum + (part.duration || 0), 0),
    0
  );
}

export const metadata: Metadata = {
  title: "Pleylistlar",
  description:
    "Tanlangan Qurʼon tinglaş töplamlari, hamkorlikdagi töliq muşafarlar va mavsumiy töplamlar — har bir pleylist onlayn tinglaş yoki yuklab oliş uçun tayyor.",
};

export default function PlaylistsPage() {
  const summaries = getPlaylistSummaries();
  const curated = summaries.filter((item) => item.kind === "curated");
  const mixed = summaries.filter((item) => item.kind === "mixed");

  const details = summaries.map((summary) => {
    const detail = getPlaylist(summary.slug);
    return {
      ...summary,
      track: detail?.tracks[0] ?? null,
      queue: detail?.tracks.slice(0, 8) ?? [],
      totalSeconds: playlistSeconds(detail?.tracks ?? []),
    };
  });

  const featured = details.find((item) => item.slug === "weekly-most-played") ?? details[0];
  const featuredDetail = featured ? getPlaylist(featured.slug) : undefined;
  const totalTracks = details.reduce((sum, item) => sum + item.trackCount, 0);

  return (
    <div className="container-page pt-6">
      <Breadcrumbs items={[{ label: "Pleylistlar" }]} />

      <section className="panel relative mt-4 overflow-hidden p-5 sm:p-7">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/55 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(740px_340px_at_10%_0%,rgba(201,164,74,0.11),transparent_60%)]" />
        <div className="relative grid gap-7 lg:grid-cols-[1.3fr_1fr] lg:items-center">
          <div>
            <p className="eyebrow inline-flex items-center gap-2">
              <ListMusic className="h-3 w-3" /> Töplamlar
            </p>
            <h1 className="display mt-2 max-w-[680px] text-[clamp(2rem,3.6vw,3rem)] leading-[1.04]">
              Niyat bilan tuzilgan tinglaş töplamlari
            </h1>
            <p className="mt-3 max-w-[640px] text-[13px] leading-relaxed text-muted">
              Töliq muşafarlar, haftalik sevimlilar, Ramazon keçalari va kerakli lahzalar uçun sokin töplamlar.
              Har bir töplam töliq ijro etiladi — yoki sura tanlab, öşa joydan boşlang.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              {featured && (
                <PlayButton
                  track={featured.track}
                  queue={featuredDetail?.tracks}
                  label={`Tinglash: ${featured.title}`}
                  size="lg"
                  ariaLabel={`Tinglash: ${featured.title}`}
                />
              )}
              <Link href="#curated" className="btn btn-outline">
                Töplamlarni köriş <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[
                { label: "Töplamlar", value: details.length, note: "tanlangan va aralaş" },
                { label: "Tanlangan töplamlar", value: curated.length, note: "muharrir tuzgan" },
                { label: "Muşafarlar", value: mixed.length, note: "köp ovozli" },
                { label: "Treklar", value: totalTracks, note: "barça töplamlar böyiça" },
              ].map((item) => (
                <div key={item.label} className="rounded-lg border border-line bg-black/15 px-3.5 py-3">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-muted-2">{item.label}</p>
                  <p className="display mt-1 text-[21px] leading-none text-ink">{formatNumber(item.value)}</p>
                  <p className="mt-1 text-[9.5px] text-muted-2">{item.note}</p>
                </div>
              ))}
            </div>
          </div>

          {featured && (
            <div className="relative rounded-xl border border-gold/25 bg-black/20 p-4">
              <div className="absolute inset-0 rounded-xl bg-[radial-gradient(320px_180px_at_50%_0%,rgba(201,164,74,0.12),transparent_70%)]" />
              <div className="relative flex items-start justify-between gap-3">
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-gold">{featured.eyebrow}</p>
                  <h2 className="display mt-1.5 text-[21px] leading-tight">{featured.title}</h2>
                  <p className="mt-1 text-[10.5px] text-muted-2">
                    {featured.trackCount} ta trek · {formatLongDuration(featured.totalSeconds)}
                  </p>
                </div>
                <Link
                  href={`/playlists/${featured.slug}`}
                  className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-gold text-[#15170f] transition-transform hover:scale-105"
                  aria-label={`Ochish: ${featured.title}`}
                >
                  <Play className="h-4 w-4 fill-current" />
                </Link>
              </div>
              <ol className="relative mt-3 space-y-1 border-t border-line/70 pt-2.5">
                {featuredDetail?.tracks.slice(0, 5).map((track, index) => (
                  <li key={track.id} className="flex items-center gap-2 py-1">
                    <span className="w-3 flex-none text-[9px] tabular-nums text-muted-2">{index + 1}</span>
                    <span className="min-w-0 flex-1 truncate text-[10.5px] text-ink/90">{track.title}</span>
                    <span className="flex-none text-[9px] text-muted-2">{track.reciterName.split(" ").slice(0, 2).join(" ")}</span>
                    <span className="w-8 flex-none text-right text-[9px] tabular-nums text-muted-2">
                      {formatDuration(track.parts.reduce((sum, part) => sum + part.duration, 0))}
                    </span>
                  </li>
                ))}
              </ol>
              <Link href={`/playlists/${featured.slug}`} className="relative mt-3 inline-flex items-center gap-1 text-[10.5px] font-medium text-green-bright hover:text-gold">
                Bu pleylistni oçiş <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          )}
        </div>
      </section>

      <section id="curated" className="py-12">
        <SectionHeading
          eyebrow="Tanlangan pleylistlar"
          title="Mavsum, kayfiyat va ehtiyoj uçun töplamlar"
          subtitle="Way2Quran muharrirlari tomonidan tuzilgan qisqa töplamlar va töliq xatmalar."
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {details
            .filter((item) => item.kind === "curated")
            .map((playlist) => (
              <PlaylistGridCard
                key={playlist.slug}
                href={`/playlists/${playlist.slug}`}
                title={playlist.title}
                eyebrow={playlist.eyebrow}
                description={playlist.description}
                trackCount={playlist.trackCount}
                cover={playlist.cover}
                accent={playlist.accent}
                arabicName={playlist.arabicName}
                track={playlist.track}
                queue={playlist.queue}
              />
            ))}
        </div>
      </section>

      <section className="border-y border-line/60 bg-[color:var(--bg-2)]/30">
        <div className="container-page py-12">
          <ScrollRail
            eyebrow="Hamkorlikdagi muşafarlar"
            title="Bir xatma, köp ovoz"
            subtitle="Bir neça qori tomonidan jamlangan töliq Qurʼonlar — har bir sura boşqa ovozda."
            action={
              <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/25 bg-gold/[0.07] px-3 py-1.5 text-[10.5px] font-medium text-gold">
                <Users className="h-3 w-3" /> {mixed.length} muşaf
              </span>
            }
          >
            {details
              .filter((item) => item.kind === "mixed")
              .map((mushaf) => (
                <MushafCard
                  key={mushaf.slug}
                  href={`/playlists/${mushaf.slug}`}
                  title={mushaf.title}
                  arabicName={mushaf.arabicName}
                  cover={mushaf.cover ?? "/images/logo-icon.png"}
                  trackCount={mushaf.trackCount}
                  contributorCount={mushaf.contributors?.length}
                  track={mushaf.track}
                  queue={mushaf.queue}
                />
              ))}
          </ScrollRail>
        </div>
      </section>

      <section className="py-14">
        <div className="panel relative overflow-hidden px-5 py-10 text-center sm:px-10">
          <div className="absolute inset-0 pattern-dots opacity-25" />
          <div className="absolute inset-0 bg-[radial-gradient(600px_250px_at_50%_0%,rgba(13,120,87,0.14),transparent_65%)]" />
          <div className="relative">
            <p className="eyebrow inline-flex items-center gap-2">
              <Sparkles className="h-3 w-3" /> Ummat uçun qurilgan
            </p>
            <h2 className="display mx-auto mt-3 max-w-[660px] text-[clamp(1.75rem,3vw,2.6rem)] leading-tight">
              Har lahza uçun töplam
            </h2>
            <p className="mx-auto mt-3 max-w-[540px] text-[13px] leading-relaxed text-muted">
              Tinglaş töplami ğoyasi bormi? Bizga ayting, muharrirlar uni keyingi yangilanişda körib çiqadi.
            </p>
            <Link href="/about#contact" className="btn btn-green mt-6 px-7">
              Pleylist taklif qiliş <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
