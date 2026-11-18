import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookMarked,
  CheckCircle2,
  ChevronDown,
  Headphones,
  Play,
  Search,
  Send,
  Smartphone,
  Sparkles,
  AppWindow,
} from "lucide-react";
import { PlaylistCard } from "@/components/cards/PlaylistCard";
import { MushafCard } from "@/components/cards/MushafCard";
import { ReciterCircle, ReciterSquare } from "@/components/cards/ReciterCards";
import { DailyVerseCard } from "@/components/home/DailyVerseCard";
import { HomeRadio } from "@/components/home/HomeRadio";
import { QiraatExplorer } from "@/components/home/QiraatExplorer";
import { RamadanCountdown } from "@/components/home/RamadanCountdown";
import { PlayButton } from "@/components/player/PlayButton";
import { ShuffleMixButton } from "@/components/player/ShuffleMixButton";
import { ScrollRail } from "@/components/ui/ScrollRail";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ReciterPhoto } from "@/components/ui/ReciterPhoto";
import { ShareRow } from "@/components/ui/ShareRow";
import { StoreBadges } from "@/components/ui/StoreBadges";
import { SurahNumberBadge } from "@/components/cards/SurahCard";
import {
  buildTrack,
  curatedPlaylists,
  dailyVerses,
  findReciterForSurah,
  getDiscoveryReciters,
  getFeaturedRecitation,
  getMixTracks,
  getNewReleases,
  getPlaylist,
  getPopularSurahs,
  getReciter,
  getReciterCardsByTag,
  getReciterPreviewTrack,
  getReciters,
  getReciterCardsByStyle,
  getStats,
  getTopReciterCards,
  mixedMushafs,
  primaryRecitationIndex,
  qiraatInfo,
  radios,
  radioToTrack,
  reciters as allReciters,
} from "@/lib/content";
import { STYLE_LABELS } from "@/lib/constants";
import { formatNumber } from "@/lib/format";
import type { Track } from "@/lib/types";

export const metadata = {
  title: "Way2Quran — Muqaddas Qurʼon tilovatlari",
  description:
    "Islom olamining turli burçaklaridan qorilar tilovat qilgan Muqaddas Qurʼonni tinglang va yuklab oling. Töliq muşafarlar, keçayu kunduz Qurʼon radiosi va çiroyli muşaf öqiş bölimi.",
};

const STYLE_TAB_KEYS = ["murattal", "mujawwad", "hadr", "moaallam", "newkhatma"];

export default function HomePage() {
  const stats = getStats();
  const topCards = getTopReciterCards(14);
  const legacy = getReciterCardsByTag("legacy", 16);
  const haramain = getReciterCardsByTag("imam-haram", 16);
  const discovery = getDiscoveryReciters(16, 18);
  const newReleases = getNewReleases(8);
  const mixQueue = getMixTracks(10, 1);
  const featuredReciter = getReciter("abdul-basit-abdul-samad") ?? getReciters()[0];
  const featuredIndex = featuredReciter ? primaryRecitationIndex(featuredReciter) : 0;
  const featuredTrack = featuredReciter ? buildTrack(featuredReciter, featuredIndex, 1) : null;
  const featuredRecitation = getFeaturedRecitation();

  const playlistCards = curatedPlaylists.slice(0, 3).map((playlist) => {
    const detail = getPlaylist(playlist.slug);
    return {
      ...playlist,
      cover: playlist.cover || null,
      track: detail?.tracks[0] ?? null,
      queue: detail?.tracks.slice(0, 6) ?? [],
    };
  });

  const mushafCards = mixedMushafs.map((mushaf) => {
    const detail = getPlaylist(mushaf.slug);
    return {
      ...mushaf,
      track: detail?.tracks[0] ?? null,
      queue: detail?.tracks.slice(0, 5) ?? [],
    };
  });

  const styles = [
    ...STYLE_TAB_KEYS.map((key) => ({
      key,
      label: STYLE_LABELS[key] ?? key,
      description:
        key === "murattal"
          ? "Vazmin, şoşilmasdan tilovat — kundalik tinglaş uçun"
          : key === "mujawwad"
            ? "Nafis, bezakli va çözilgan ohangli ijro"
            : key === "hadr"
              ? "Tez va ravon tilovat, keng tinglaş uçun"
              : key === "moaallam"
                ? "Örgatuvçi surʼat, iborama-ibora"
                : "Yangi yozilgan töliq xatmalar",
      count: getReciterCardsByStyle(key, 999).length,
    })),
    {
      key: "translation",
      label: "Tarjimali muşaf",
      description: "Arabça tilovat va ovozli tarjima birga",
      count: allReciters.filter((reciter) => reciter.recitations.some((rec) => rec.translation)).length,
    },
  ];

  const famous = topCards.slice(0, 9).map((reciter) => ({
    reciter,
    track: getReciterPreviewTrack(reciter.slug),
  }));

  const popularSurahs = getPopularSurahs(8).map((surah) => {
    const found = findReciterForSurah(surah.number, [
      "abdul-basit-abdul-samad",
      "muhammad-siddiq-al-minshawi",
      "maher-almaikulai",
      "ahmed-al-agamy",
      "saad-al-ghamdi",
    ]);
    return {
      surah,
      track: found ? buildTrack(found.reciter, found.index, surah.number) : null,
    };
  });

  const radioItems = radios.map((radio) => ({ ...radio, track: radioToTrack(radio) }));

  const trackFor = (slug: string): Track | null => getReciterPreviewTrack(slug);

  return (
    <>
      <section className="hero-dark relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/images/hero-opt.jpg"
            alt="Tongda tumanli toğlar"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_42%]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,15,12,0.72)_0%,rgba(7,15,12,0.35)_38%,rgba(7,15,12,0.8)_78%,var(--bg)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(800px_420px_at_50%_30%,rgba(13,120,87,0.18),transparent_65%)]" />
          <div className="absolute inset-0 pattern-dots opacity-[0.18]" />
        </div>

        <div className="relative mx-auto flex w-full max-w-[1080px] flex-col items-center px-4 pb-16 pt-10 text-center sm:pt-14">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/25 bg-black/25 px-3 py-1.5 text-[9.5px] font-semibold uppercase tracking-[0.22em] text-gold-bright backdrop-blur">
            <Sparkles className="h-3 w-3" /> Qurʼon ovozi — çegarasiz
          </span>

          <div className="mt-5">
            <Link href="/" aria-label="Way2Quran boş sahifasi" className="inline-flex flex-col items-center gap-3">
              <span className="relative h-[74px] w-[90px] drop-shadow-[0_10px_35px_rgba(13,120,87,0.45)] sm:h-[84px] sm:w-[102px]">
                <Image src="/images/logo-icon.png" alt="" fill sizes="110px" priority className="object-contain" />
              </span>
              <span className="font-display text-[42px] font-bold leading-none tracking-tight sm:text-[54px]">
                <span className="text-green-bright">Way</span>
                <span className="text-gold">2</span>
                <span className="text-gold-bright">Quran</span>
              </span>
              <span className="-mt-1 font-arabic text-[15px] text-gold/80" dir="rtl">الطريق إلى القرآن</span>
            </Link>
          </div>

          <div className="mt-6 rounded-[34px] border border-gold/30 bg-black/25 px-6 py-5 shadow-[0_24px_80px_-40px_rgba(0,0,0,0.9)] backdrop-blur-md sm:rounded-full sm:px-14 sm:py-6">
            <h1 className="display text-balance text-[clamp(1.65rem,3.2vw,2.7rem)] leading-[1.12] text-[#f4f1ea]">
              Islom olamidan Muqaddas Qurʼon
              <br className="hidden sm:block" /> tilovatlari
            </h1>
          </div>

          <RamadanCountdown />

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <PlayButton
              track={featuredTrack}
              queue={mixQueue}
              label="Tinglaşni boşlaş"
              size="lg"
              className="min-w-[188px]"
              ariaLabel="Qurʼon tinglaşni boşlaş"
            />
            <Link href="/reciters" className="btn btn-outline px-7 py-4 text-[15px]">
              Qorilarni köriş
            </Link>
          </div>

          <form action="/search" className="relative mt-6 w-full max-w-[560px]">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-2" />
            <input
              name="q"
              className="input border-gold/20 bg-black/35 py-3.5 pl-11 pr-24 text-[13px] backdrop-blur-md"
              placeholder="Qori yoki surani qidiring…"
              aria-label="Qori yoki surani qidiriş"
            />
            <button type="submit" className="btn btn-gold btn-sm absolute right-1.5 top-1/2 -translate-y-1/2">
              Qidiriş
            </button>
          </form>

          <a href="#picks" className="mt-7 inline-flex flex-col items-center gap-1 text-[9px] uppercase tracking-[0.2em] text-[#f4f1ea]/40 transition-colors hover:text-gold">
            <span>Pastga</span>
            <ChevronDown className="h-4 w-4 animate-bounce" />
          </a>
        </div>
      </section>

      <div className="container-page relative z-10 -mt-8">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
          {[
            { value: stats.reciters, label: "Qorilar", detail: "22 mamlakatdan" },
            { value: stats.recitations, label: "Tilovatlar", detail: "barça rivoyatlar böyiça" },
            { value: stats.audioFiles, label: "Audio fayllar", detail: "surabo-sura" },
            { value: stats.completeMushafs, label: "Töliq muşafarlar", detail: "töliq xatmalar" },
          ].map((item) => (
            <div key={item.label} className="panel relative overflow-hidden bg-panel/85 px-4 py-3.5 backdrop-blur-md">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/45 to-transparent" />
              <p className="display text-[24px] leading-none text-gold-bright sm:text-[28px]">{formatNumber(item.value)}</p>
              <p className="mt-1 text-[10.5px] font-medium text-ink/80">{item.label}</p>
              <p className="text-[9.5px] text-muted-2">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>

      <section id="picks" className="container-page py-14">
        <ScrollRail
          eyebrow="SIZNING TANLOVLARINGIZ"
          title="Eng köp tinglaydigan qorilaringiz"
          subtitle="Ummat qayta-qayta qaytadigan ovozlar — istalgan joydan boşlang."
          action={<ShuffleMixButton tracks={mixQueue} />}
        >
          {topCards.map((reciter) => (
            <ReciterSquare key={reciter.slug} reciter={reciter} track={trackFor(reciter.slug)} queue={mixQueue} />
          ))}
        </ScrollRail>
      </section>

      <section className="border-y border-line/60 bg-[color:var(--bg-2)]/35">
        <div className="container-page py-14">
          <ScrollRail
            eyebrow="OLTIN DAVR"
            title="Meros qorilar"
            subtitle="Qurʼon tilovatiga öz taʼsirini qoldirgan abadiy ovozlar."
            action={<Link href="/reciters?tag=legacy-reciters" className="inline-flex items-center gap-1 text-[12px] font-medium text-green-bright hover:text-gold">Barçasini köriş <ArrowRight className="h-3.5 w-3.5" /></Link>}
          >
            {legacy.map((reciter) => (
              <ReciterCircle key={reciter.slug} reciter={reciter} track={trackFor(reciter.slug)} queue={mixQueue} />
            ))}
          </ScrollRail>
        </div>
      </section>

      <section className="container-page py-14">
        <ScrollRail
          eyebrow="OVOZ KUTUBXONASI"
          title="Qorilar"
          subtitle="Ikki Muqaddas Masjiddan va boşqa joylardan tanlangan ovozlar."
          action={<Link href="/reciters" className="inline-flex items-center gap-1 text-[12px] font-medium text-green-bright hover:text-gold">Barçasini köriş <ArrowRight className="h-3.5 w-3.5" /></Link>}
        >
          {haramain.map((reciter) => (
            <ReciterCircle key={reciter.slug} reciter={reciter} track={trackFor(reciter.slug)} queue={mixQueue} />
          ))}
        </ScrollRail>
      </section>

      <section className="border-y border-line/60 bg-[color:var(--bg-2)]/35">
        <div className="container-page py-14">
          <ScrollRail
            eyebrow="TÖLIQ KUTUBXONA"
            title="Qorilarni kaşf eting"
            subtitle="Röyxat har bir neça daqiqada yangilanadi — har doim yangi ovoz bor."
            action={<Link href="/reciters" className="inline-flex items-center gap-1 text-[12px] font-medium text-green-bright hover:text-gold">Barça qorilar <ArrowRight className="h-3.5 w-3.5" /></Link>}
          >
            {discovery.map((reciter) => (
              <ReciterCircle key={reciter.slug} reciter={reciter} track={trackFor(reciter.slug)} queue={mixQueue} />
            ))}
          </ScrollRail>
        </div>
      </section>

      <section className="container-page py-16">
        <SectionHeading eyebrow="Bugungi eʼtibor" title="Bir ovoz va bir sura — birga ötiriş uçun" />
        <div className="grid gap-4 lg:grid-cols-2">
          {featuredReciter && (
            <article className="panel relative overflow-hidden p-5 sm:p-6">
              <div className="absolute inset-0 bg-[radial-gradient(500px_220px_at_12%_0%,rgba(13,120,87,0.15),transparent_60%)]" />
              <div className="relative flex items-start gap-4">
                <ReciterPhoto src={featuredReciter.photo} alt={featuredReciter.name} className="h-[82px] w-[82px] border border-gold/30" sizes="90px" />
                <div className="min-w-0">
                  <p className="eyebrow text-[9px]">Tanlangan qori</p>
                  <h3 className="display mt-1 text-[22px] leading-tight">{featuredReciter.name}</h3>
                  <p className="mt-1 font-arabic text-[13px] text-muted-2" dir="rtl">{featuredReciter.arabicName}</p>
                  <Link href={`/reciters/${featuredReciter.slug}`} className="mt-1 inline-block text-[11.5px] text-green-bright hover:text-gold">
                    Profilni oçiş →
                  </Link>
                </div>
              </div>
              <p className="relative mt-4 line-clamp-3 text-[12px] leading-relaxed text-muted">{featuredReciter.bio}</p>
              <div className="relative mt-4 flex flex-wrap items-center justify-between gap-3">
                <PlayButton track={featuredTrack} queue={mixQueue} label="Hozir tinglaş" size="sm" />
                <ShareRow title={featuredReciter.name} path={`/reciters/${featuredReciter.slug}`} compact />
              </div>
            </article>
          )}

          {featuredRecitation && (
            <article className="panel relative overflow-hidden p-5 sm:p-6">
              <div className="absolute inset-0 bg-[radial-gradient(500px_220px_at_88%_0%,rgba(201,164,74,0.12),transparent_60%)]" />
              <div className="relative flex items-start gap-4">
                <ReciterPhoto src={featuredRecitation.reciter.photo} alt={featuredRecitation.reciter.name} className="h-[82px] w-[82px] border border-gold/30" sizes="90px" />
                <div className="min-w-0">
                  <p className="eyebrow text-[9px]">Tanlangan tilovat</p>
                  <h3 className="display mt-1 text-[22px] leading-tight">{featuredRecitation.surah.name}</h3>
                  <p className="mt-1 text-[11.5px] text-muted">
                    — <Link href={`/reciters/${featuredRecitation.reciter.slug}`} className="text-green-bright hover:text-gold">{featuredRecitation.reciter.name}</Link> tomonidan, Hafs an Osim
                  </p>
                  <p className="mt-0.5 font-arabic text-[13px] text-muted-2" dir="rtl">{featuredRecitation.surah.arabicName}</p>
                </div>
              </div>
              <p className="relative mt-4 text-[12px] leading-relaxed text-muted">
                {featuredRecitation.surah.verses} oyat, {featuredRecitation.surah.revelation.toLowerCase()} davrda nozil bölgan. Bu suraning oçilişi kun şovqinini tinçitsin.
              </p>
              <div className="relative mt-4 flex flex-wrap items-center justify-between gap-3">
                <PlayButton track={featuredRecitation.track} queue={[featuredRecitation.track]} label="Hozir tinglaş" size="sm" />
                <ShareRow title={`${featuredRecitation.surah.name} — ${featuredRecitation.reciter.name}`} path={`/surahs/${featuredRecitation.surah.slug}`} compact />
              </div>
            </article>
          )}
        </div>
      </section>

      <section className="border-y border-line/60 bg-[color:var(--bg-2)]/35">
        <div className="container-page py-16">
          <SectionHeading
            eyebrow="Tanlangan pleylistlar"
            title="Ehtiyotkorlik bilan tuzilgan tinglaş töplamlari"
            subtitle="Töliq muşafarlar, haftalik sevimlilar va kerakli lahzalar uçun sokin töplamlar."
            action={<Link href="/playlists" className="inline-flex items-center gap-1 text-[12px] font-medium text-green-bright hover:text-gold">Barça pleylistlar <ArrowRight className="h-3.5 w-3.5" /></Link>}
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {playlistCards.map((playlist) => (
              <PlaylistCard
                key={playlist.slug}
                href={`/playlists/${playlist.slug}`}
                title={playlist.title}
                eyebrow={playlist.eyebrow}
                description={playlist.description}
                trackCount={playlist.tracks.length}
                cover={playlist.cover || null}
                accent={playlist.accent}
                track={playlist.track}
                queue={playlist.queue}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <SectionHeading
          eyebrow="TILOVAT OVOZI"
          title="Tilovatlar va qiroatlar"
          subtitle="Har bir sahih rivoyatning öz rangi bor. Sizni qalban qözğatadiganini toping."
          align="center"
        />
        <QiraatExplorer
          qiraat={qiraatInfo}
          styles={styles}
          reciters={famous}
          radios={radioItems.slice(0, 6)}
          surahs={popularSurahs}
        />
      </section>

      <section className="container-page pb-16">
        <ScrollRail
          eyebrow="Hamkorlikdagi muşafarlar"
          title="Bir xatma, köp ovoz"
          subtitle="Bir neça qori birgalikda tuzgan töliq Qurʼon albomlari."
          action={<Link href="/playlists" className="inline-flex items-center gap-1 text-[12px] font-medium text-green-bright hover:text-gold">Barçasini köriş <ArrowRight className="h-3.5 w-3.5" /></Link>}
        >
          {mushafCards.map((mushaf) => (
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

      <section className="border-y border-line/60 bg-[color:var(--bg-2)]/25">
        <div className="container-page py-16">
          <div className="grid gap-4 lg:grid-cols-[1.55fr_1fr]">
            <DailyVerseCard verses={dailyVerses} />
            <article className="panel p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <p className="inline-flex items-center gap-2 font-display text-lg text-ink">
                  <Sparkles className="h-4 w-4 text-green-bright" /> Yangi qöşilganlar
                </p>
                <span className="tag tag-green">Yangi</span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-x-2 gap-y-4">
                {newReleases.map((reciter) => (
                  <Link key={reciter.slug} href={`/reciters/${reciter.slug}`} className="group flex flex-col items-center text-center">
                    <ReciterPhoto src={reciter.photo} alt={reciter.name} className="h-[66px] w-[66px] border border-gold/25" sizes="70px" />
                    <span className="mt-2 line-clamp-2 min-h-[30px] text-[10.5px] font-medium leading-snug transition-colors group-hover:text-gold-bright">
                      {reciter.name}
                    </span>
                  </Link>
                ))}
              </div>
              <Link href="/reciters" className="mt-4 flex items-center justify-center gap-1 border-t border-line pt-4 text-[11.5px] font-medium text-green-bright hover:text-gold">
                Butun kutubxonani köriş <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </article>
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="panel relative overflow-hidden px-5 py-10 text-center sm:px-10">
          <div className="absolute inset-0 pattern-dots opacity-30" />
          <div className="absolute inset-0 bg-[radial-gradient(600px_250px_at_50%_0%,rgba(201,164,74,0.12),transparent_65%)]" />
          <div className="relative">
            <p className="eyebrow">Kutubxona Ummatga tegişli</p>
            <h2 className="display mx-auto mt-3 max-w-[700px] text-[clamp(1.8rem,3vw,2.8rem)] leading-tight">
              Tilovatni Ummat bilan ulaşing
            </h2>
            <p className="mx-auto mt-3 max-w-[560px] text-[13px] leading-relaxed text-muted">
              Way2Quranʼda hali yöq tilovatingiz bormi? Uni qöşing — har bir taklif naşr etilişidan oldin körib çiqiladi.
            </p>
            <Link href="/about#contribute" className="btn btn-green mt-6 px-7">
              Tilovat qöşiş <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-line/60 bg-[color:var(--bg-2)]/35">
        <div className="container-page py-8">
          <HomeRadio stations={radioItems} />
        </div>
      </section>

      <section className="container-page py-16">
        <SectionHeading
          eyebrow="TAYYORLANMOQDA"
          title="Biz nima qurmoqdamiz"
          subtitle="Way2Quran ösişda davom etmoqda — keyingi rejalar barça ekranlarda."
          align="center"
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Send, title: "Telegram bot", badge: "Işlaydi", text: "Qorilar va suralarni qidiring, audioni Telegramning özida oling.", href: "https://telegram.org", action: "Sinab köriş" },
            { icon: Smartphone, title: "Mobil ilova", badge: "Tez orada", text: "Oflayn yuklab oliş, qulflangan ekran boşqaruvi va diqqatni jamlovçi tinglaş rejimi.", href: "/about#app", action: "Batafsil" },
            { icon: BookMarked, title: "Hifz rejimi", badge: "Tez orada", text: "Oyatma-oyat takrorlaş, yaşirib öqiş va yodlaş uçun yumşoq tsikllar.", href: "/surahs", action: "Suralarni köriş" },
            { icon: AppWindow, title: "Oçiq API", badge: "Tez orada", text: "Ummat uçun quruvçi dasturçilar uçun oçiq metamaʼlumotlar va audio manzillar.", href: "/about#contact", action: "Qiziqiş bildiriş" },
          ].map((item) => (
            <article key={item.title} className="panel flex flex-col p-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-gold/25 bg-gold/[0.06] text-gold">
                <item.icon className="h-4 w-4" />
              </span>
              <div className="mt-4 flex items-center gap-2">
                <h3 className="text-[14px] font-semibold">{item.title}</h3>
                <span className={`rounded px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider ${item.badge === "Işlaydi" ? "bg-green-bright/15 text-green-bright" : "bg-white/5 text-muted-2"}`}>
                  {item.badge}
                </span>
              </div>
              <p className="mt-2 flex-1 text-[11.5px] leading-relaxed text-muted">{item.text}</p>
              <Link href={item.href} className="mt-4 inline-flex items-center gap-1 text-[11.5px] font-medium text-green-bright hover:text-gold">
                {item.action} <ArrowRight className="h-3 w-3" />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-line/60 bg-[linear-gradient(135deg,#061a12_0%,#0a2b20_55%,#07140f_100%)]">
        <div className="absolute inset-0 pattern-dots opacity-20" />
        <div className="container-page relative grid items-center gap-10 py-16 lg:grid-cols-2">
          <div className="flex justify-center">
            <div className="relative w-[256px] rounded-[42px] border-[6px] border-[#1c2a24] bg-[#0a1411] p-2 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)]">
              <div className="absolute left-1/2 top-2 h-5 w-24 -translate-x-1/2 rounded-full bg-[#07100c]" />
              <div className="relative overflow-hidden rounded-[32px] bg-[#f4f0e6] text-[#17231d]">
                <div className="relative h-[138px] overflow-hidden bg-[#0b3b2b] px-3 pt-7">
                  <Image src="/images/hero-opt.jpg" alt="" fill sizes="240px" className="object-cover opacity-45" />
                  <div className="absolute inset-0 bg-gradient-to-b from-[#08291f]/55 to-[#08291f]" />
                  <div className="relative flex flex-col items-center">
                    <span className="relative h-7 w-8">
                      <Image src="/images/logo-icon.png" alt="" fill sizes="32px" className="object-contain" />
                    </span>
                    <p className="mt-0.5 font-display text-[15px] font-bold">
                      <span className="text-green-bright">Way</span><span className="text-gold">2</span><span className="text-gold-bright">Quran</span>
                    </p>
                    <p className="mt-1 text-center text-[6.5px] leading-tight text-white/70">
                      Tinglaş uçun tanlangan qorilar tomonidan Muqaddas Qurʼon
                    </p>
                    <span className="mt-1.5 rounded-full bg-gold px-3 py-1 text-[6px] font-bold text-[#15170f]">Qorilarni köriş</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 divide-x divide-black/5 border-b border-black/5 bg-white px-1 py-1.5 text-center">
                  {[
                    [stats.reciters, "qorilar"],
                    [stats.recitations, "tilovatlar"],
                    [stats.audioFiles, "audio fayllar"],
                  ].map(([value, label]) => (
                    <div key={String(label)}>
                      <p className="text-[8px] font-bold text-[#5a6b5e]">{formatNumber(Number(value))}</p>
                      <p className="text-[5px] uppercase tracking-wide text-[#8b968d]">{label}</p>
                    </div>
                  ))}
                </div>
                <div className="px-2.5 py-2.5">
                  <div className="flex items-center gap-2 rounded-lg bg-white p-2 shadow-sm">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0d7857] text-white">
                      <Play className="h-2.5 w-2.5 fill-current" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[6.5px] font-semibold">Al-Fotiha · Abdul Basit</p>
                      <p className="text-[5px] text-[#8b968d]">Hafs an Osim · Murattal</p>
                    </div>
                    <Headphones className="h-2.5 w-2.5 text-[#c9a44a]" />
                  </div>
                  <p className="mb-1.5 mt-2.5 text-[6px] font-bold uppercase tracking-wider text-[#8b968d]">Eng köp tinglagan qorilaringiz</p>
                  <div className="flex justify-between">
                    {topCards.slice(0, 4).map((reciter) => (
                      <div key={reciter.slug} className="flex w-[22%] flex-col items-center">
                        <ReciterPhoto src={reciter.photo} alt="" className="h-8 w-8 border border-[#e6ddc6]" sizes="32px" />
                        <span className="mt-1 line-clamp-1 text-[4.5px] font-medium">{reciter.name.split(" ")[0]}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-4 border-t border-black/10 bg-white py-1.5 text-center text-[5px] text-[#8b968d]">
                  {["Tinglaş", "Öqiş", "Radio", "Azklar"].map((label, index) => (
                    <span key={label} className={index === 0 ? "font-semibold text-[#0d7857]" : ""}>{label}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <p className="eyebrow">Ilova — qayerda bölsangiz ham</p>
            <h2 className="display mt-3 text-[clamp(1.9rem,3vw,2.8rem)] leading-tight">Ilovani yuklab oling</h2>
            <p className="mt-3 max-w-[520px] text-[13px] leading-relaxed text-muted">
              Dunyo böylab Qurʼon tilovatlari. Bepul, Ummat uçun mehr bilan yaratilgan.
            </p>
            <ul className="mt-5 space-y-2.5">
              {[
                "Musulmon olamidan 150 qori — har hafta köpayib boradi",
                "Bir neça qiroat — Hafs, Varş, Qolun, Ad-Duriy va boşqalar",
                "Töliq muşaf öqiş bölimi, keçayu kunduz Qurʼon radiosi va hifz rejimi",
                "Oflayn yuklab oliş va qulflangan ekran boşqaruvi",
                "Ön tilda mavjud",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-[12.5px] text-ink/85">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-green-bright" />
                  {item}
                </li>
              ))}
            </ul>
            <StoreBadges className="mt-6" />
          </div>
        </div>
      </section>
    </>
  );
}
