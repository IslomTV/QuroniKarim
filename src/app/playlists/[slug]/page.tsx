import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Clock, Headphones, ListMusic, Users } from "lucide-react";
import { PlaylistArtwork, PlaylistGridCard } from "@/components/cards/PlaylistCard";
import { PlayButton } from "@/components/player/PlayButton";
import { ShuffleMixButton } from "@/components/player/ShuffleMixButton";
import { PlaylistTracks } from "@/components/playlists/PlaylistTracks";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ReciterPhoto } from "@/components/ui/ReciterPhoto";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ShareRow } from "@/components/ui/ShareRow";
import { getPlaylist, getPlaylistSummaries } from "@/lib/content";
import { formatLongDuration, formatNumber } from "@/lib/format";
import type { Track } from "@/lib/types";

export function generateStaticParams() {
  return getPlaylistSummaries().map((playlist) => ({ slug: playlist.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const playlist = getPlaylist(slug);
  if (!playlist) return { title: "Pleylist topilmadi" };

  const description = `${playlist.description} ${playlist.trackCount} ta trek${
    playlist.kind === "mixed" ? `, ${playlist.contributors?.length ?? 0} qori` : ""
  }.`;
  return {
    title: playlist.title,
    description,
    openGraph: {
      title: `${playlist.title} · Pleylist`,
      description,
      type: "music.playlist",
    },
    twitter: {
      card: "summary",
      title: `${playlist.title} · Pleylist`,
      description,
    },
  };
}

function totalSeconds(tracks: Track[]): number {
  return tracks.reduce(
    (sum, track) => sum + track.parts.reduce((partSum, part) => partSum + (part.duration || 0), 0),
    0
  );
}

export default async function PlaylistPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const playlist = getPlaylist(slug);
  if (!playlist) notFound();

  const seconds = totalSeconds(playlist.tracks);
  const reciterCount = new Set(playlist.tracks.map((track) => track.reciterName)).size;
  const related = getPlaylistSummaries()
    .filter((item) => item.slug !== playlist.slug)
    .slice(0, 3)
    .map((summary) => {
      const detail = getPlaylist(summary.slug);
      return {
        ...summary,
        track: detail?.tracks[0] ?? null,
        queue: detail?.tracks.slice(0, 6) ?? [],
      };
    });

  return (
    <div className="container-page pt-6">
      <Breadcrumbs items={[{ label: "Pleylistlar", href: "/playlists" }, { label: playlist.title }]} />

      <section className="panel relative mt-4 overflow-hidden p-5 sm:p-7">
        <div
          className="absolute inset-x-0 top-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${playlist.accent}99, transparent)` }}
        />
        <div
          className="absolute inset-0 opacity-70"
          style={{
            background: `radial-gradient(680px 320px at 8% 0%, ${playlist.accent}24, transparent 62%)`,
          }}
        />

        <div className="relative grid gap-6 sm:grid-cols-[190px_1fr] lg:grid-cols-[230px_1fr]">
          <div className="w-[190px] sm:w-full">
            <PlaylistArtwork
              cover={playlist.cover}
              accent={playlist.accent}
              arabicName={playlist.arabicName}
              className="aspect-square w-full shadow-[0_22px_55px_-26px_rgba(0,0,0,0.9)]"
            />
          </div>

          <div className="min-w-0">
            <p className="eyebrow inline-flex items-center gap-2">
              <ListMusic className="h-3 w-3" /> {playlist.eyebrow}
            </p>
            <h1 className="display mt-2 max-w-[760px] text-[clamp(1.9rem,3.4vw,2.9rem)] leading-[1.04]">
              {playlist.title}
            </h1>
            <p className="mt-1.5 font-arabic text-[15px] text-gold/75" dir="rtl">{playlist.arabicName}</p>
            <p className="mt-3 max-w-[720px] text-[13px] leading-relaxed text-muted">{playlist.description}</p>

            <div className="mt-4 flex flex-wrap items-center gap-1.5 text-[10px] text-muted-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-black/15 px-2.5 py-1">
                <Headphones className="h-3 w-3" /> {formatNumber(playlist.trackCount)} ta trek
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-black/15 px-2.5 py-1">
                <Clock className="h-3 w-3" /> {formatLongDuration(seconds)}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-black/15 px-2.5 py-1">
                <Users className="h-3 w-3" /> {reciterCount} qori
              </span>
              {playlist.trackCount === 114 && (
                <span className="tag tag-green py-[3px]">Töliq Qurʼon</span>
              )}
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <PlayButton
                track={playlist.tracks[0] ?? null}
                queue={playlist.tracks}
                label="Pleylistni tinglaş"
                ariaLabel={`Tinglash: ${playlist.title}`}
              />
              <ShuffleMixButton tracks={playlist.tracks} label="Bu töplamni aralaştiriş" className="text-[11.5px]" />
            </div>
          </div>
        </div>
      </section>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <ShareRow title={`${playlist.title} — pleylist`} path={`/playlists/${playlist.slug}`} />
        <Link href="/playlists" className="inline-flex items-center gap-1 text-[11.5px] text-muted transition-colors hover:text-gold">
          Barça pleylistlar <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {playlist.kind === "mixed" && playlist.contributors && playlist.contributors.length > 0 && (
        <section className="pt-8">
          <div className="mb-3 flex items-center gap-2">
            <h2 className="display text-xl">Bu xatmadagi ovozlar</h2>
            <span className="h-px flex-1 bg-line" />
            <span className="text-[10px] text-muted-2">{playlist.contributors.length} qori</span>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
            {playlist.contributors.map((contributor) => (
              <Link
                key={contributor.slug}
                href={`/reciters/${contributor.slug}`}
                className="group flex items-center gap-2.5 rounded-lg border border-line/70 bg-panel/40 p-2.5 transition-colors hover:border-gold/35"
              >
                <ReciterPhoto
                  src={contributor.photo}
                  alt={contributor.name}
                  className="h-9 w-9 flex-none border border-line"
                  sizes="36px"
                />
                <span className="min-w-0">
                  <span className="block truncate text-[10.5px] font-medium text-ink transition-colors group-hover:text-gold-bright">
                    {contributor.name}
                  </span>
                  <span className="block truncate font-arabic text-[11px] text-muted-2" dir="rtl">
                    {contributor.arabicName}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <PlaylistTracks tracks={playlist.tracks} />

      {related.length > 0 && (
        <section className="py-14">
          <SectionHeading
            eyebrow="Tinglaşda davom eting"
            title="Keyingi oçiş uçun boşqa töplamlar"
            action={
              <Link href="/playlists" className="inline-flex items-center gap-1 text-[11.5px] font-medium text-green-bright hover:text-gold">
                Barça pleylistlar <ArrowRight className="h-3 w-3" />
              </Link>
            }
          />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
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
    </div>
  );
}
